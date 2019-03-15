import { relative } from 'path';
import { Readable } from 'stream';
import { formatHeader, HeaderFormat } from './header';
import { pad } from './util';
import { createReadStream, Stats } from '../fs';

export default class Tar extends Readable {

	private written: number = 0;
	private blockSize: number;
	private recordSize = 512;
	private base: string;
	private queue: Array<{ header: Buffer, file: Readable, size: number }> = [];
	private reading: boolean = false;

	constructor(base: string, recordsPerBlock: number = 20) {
		super();

		this.blockSize = recordsPerBlock * this.recordSize;
		this.base = base;
	}

	public async _read(): Promise<void> {
		if (this.reading) return;
		this.reading = true;

		if (!this.queue.length) {
			this.push(Buffer.alloc(this.blockSize - (this.written % this.blockSize)));
			this.written += this.blockSize - (this.written % this.blockSize);
			this.push(null);
			return;
		}

		const { header, file, size } = this.queue.shift();

		this.push(header);
		this.written += header.length;

		for await (const chunk of file) {
			this.push(chunk);
			this.written += chunk.length;
		}

		// Hard to produce, requires a size perfectibly divisible by the recordSize
		/* istanbul ignore next */
		const extraBytes = this.recordSize - (size % this.recordSize || this.recordSize);
		this.push(Buffer.alloc(extraBytes));
		this.written += extraBytes;
		this.reading = false;
	}

	public append(filepath: string, stats: Stats): void {
		this.queue.push({
			header: this.createHeader({
				filename: relative(this.base, filepath),
				mode: stats.mode,
				uid: stats.uid,
				gid: stats.gid,
				size: stats.size,
				mtime: Math.trunc(stats.mtime.valueOf() / 1000),
				type: '0',
				ustar: 'ustar ',
				owner: '',
				group: ''
			}),
			file: createReadStream(filepath),
			size: stats.size
		});
	}

	private createHeader(data: HeaderFormat): Buffer {
		const headerBuf = formatHeader(data);

		let chksum = 0;
		for (let i = 0, { length } = headerBuf; i < length; i++) chksum += headerBuf[i];

		const checksum = pad(chksum, 6);
		for (let i = 0, length = 6; i < length; i++) headerBuf[i + 148] = checksum.charCodeAt(i);

		headerBuf[154] = 0;
		headerBuf[155] = 0x20;

		return headerBuf;
	}

}
