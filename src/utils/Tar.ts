import { relative } from 'path';
import { Readable } from 'stream';
import { formatHeader, HeaderFormat } from './header';
import { pad } from './util';
import { createReadStream, Stats } from '../fs';

export interface TarOptions {
	recordsPerBlock?: number;
	base?: string;
}

export default class Tar extends Readable {

	private written: number = 0;
	private blockSize: number;
	private recordSize = 512;
	private base: string;

	constructor(base: string, recordsPerBlock: number = 20) {
		super();

		this.blockSize = recordsPerBlock * this.recordSize;
		this.base = base;
	}

	public _read() {
		// idk
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

	public async append(filepath: string, stats: Stats) {
		const header = this.createHeader({
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
		});

		this.push(header);
		this.written += header.length;

		for await (const chunk of createReadStream(filepath)) {
			this.push(chunk);
			this.written += chunk.length;
		}

		const extraBytes = this.recordSize - (stats.size % this.recordSize || this.recordSize)
		this.push(Buffer.alloc(extraBytes));
		this.written += extraBytes;
	}

	public close(): this {
		this.push(Buffer.alloc(this.blockSize - (this.written % this.blockSize)));
		this.written += this.blockSize - (this.written % this.blockSize);
		this.push(null);
		return this;
	}

}
