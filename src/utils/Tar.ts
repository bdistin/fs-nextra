import { createReadStream, Stats } from 'fs';
import { relative } from 'path';
import { Readable } from 'stream';

import { Header } from './Header';

export class Tar extends Readable {

	private base: string;
	private written = 0;
	private recordSize = 512;
	private queue: ({ header: Buffer, file: Readable, size: number })[] = [];

	public constructor(base: string) {
		super();

		this.base = base;
	}

	public async _read(): Promise<void> {
		if (!this.queue.length) {
			this.push(null);
			return;
		}

		const { header, file, size } = this.queue.shift() as { header: Buffer, file: Readable, size: number };
		const { written } = this;

		this.written += header.length;

		const fileChunks = [];

		for await (const chunk of file) {
			fileChunks.push(chunk);
			this.written += chunk.length;
		}

		/* istanbul ignore next: Hard to produce, requires a size perfectibly divisible by the recordSize */
		const extraBytes = this.recordSize - (size % this.recordSize || this.recordSize);
		this.written += extraBytes;

		this.push(Buffer.concat([header, ...fileChunks, Buffer.alloc(extraBytes)], this.written - written));
	}

	public append(filepath: string, stats: Stats): void {
		this.queue.push({
			header: new Header({
				filename: relative(this.base, filepath),
				mode: stats.mode,
				uid: stats.uid,
				gid: stats.gid,
				size: stats.size,
				mtime: Math.trunc(stats.mtime.valueOf() / 1000),
				type: 0,
				ustar: 'ustar ',
				owner: '',
				group: ''
			}).toBuffer(),
			file: createReadStream(filepath),
			size: stats.size
		});
	}

}
