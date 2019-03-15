import { relative } from 'path';
import { Readable } from 'stream';
import { formatHeader, HeaderFormat } from './header';
import { pad } from './util';
import { createReadStream, stat, Stats } from '../fs';

export interface TarOptions {
	recordsPerBlock?: number;
	base?: string;
}

export default class Tar extends Readable {

	private written: number = 0;
	private blockSize: number;
	private queue: Array<[string, Stats]> = [];
	private recordSize = 512;
	private processing: boolean = false;
	private base: string;

	constructor(options: TarOptions = {}) {
		super();

		this.blockSize = (options.recordsPerBlock || 20) * this.recordSize;
		this.base = options.base;
	}

	public _read() {
		// idk
	}

	public close(): this {
		this.push(Buffer.alloc(this.blockSize - (this.written % this.blockSize)));
		this.written += this.blockSize - (this.written % this.blockSize);
		this.push(null);
		return this;
	}

	private createHeader(data: HeaderFormat) {
		const headerBuf = formatHeader(data);

		let chksum = 0;
		for (let i = 0, { length } = headerBuf; i < length; i++) chksum += headerBuf[i];

		const checksum = pad(chksum, 6);
		for (let i = 0, length = 6; i < length; i++) headerBuf[i + 148] = checksum.charCodeAt(i);

		headerBuf[154] = 0;
		headerBuf[155] = 0x20;

		return headerBuf;
	}

	private async writeData(head: Buffer, input: string | Buffer | Readable, size: number) {
		let extraBytes;

		this.push(head);
		this.written += head.length;

		if (typeof input === 'string' || input instanceof Buffer) {
			this.push(input);
			this.written += input.length;

			extraBytes = this.recordSize - (size % this.recordSize || this.recordSize);
			this.push(Buffer.alloc(extraBytes));
			this.written += extraBytes;

			return;
		}

		this.processing = true;

		for await (const chunk of input) {
			this.push(chunk);
			this.written += chunk.length;
		}

		extraBytes = this.recordSize - (size % this.recordSize || this.recordSize);
		this.push(Buffer.alloc(extraBytes));
		this.written += extraBytes;

		this.processing = false;

		if (this.queue.length > 0) await this.append(...this.queue.shift());
	}

	public async append(filepath: string, stats: Stats) {
		if (this.processing || this.queue.length) return this.queue.push([ filepath, stats ]);

		return this.writeData(this.createHeader({
			filename: this.base ? relative(this.base, filepath) : filepath,
			mode: stats.mode,
			uid: stats.uid,
			gid: stats.gid,
			size: stats.size,
			mtime: Math.trunc(stats.mtime.valueOf() / 1000),
			type: '0',
			ustar: 'ustar ',
			owner: '',
			group: ''
		}), createReadStream(filepath), stats.size);
	}

}
