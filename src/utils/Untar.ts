import { Writable } from 'stream';

import { Header } from './Header';

function breakSync(next: Function): void {
	setImmediate((): void => next());
}

export class Untar extends Writable {

	private header: Header | null = null;
	private file: Buffer = Buffer.alloc(0);
	private totalRead = 0;
	private recordSize = 512;
	private queue: ({ header: Header, file: Buffer })[] = [];

	public _write(data: Buffer, encoding: string, next: Function): void {
		this.file = Buffer.concat([this.file, data], this.file.length + data.length);

		if (this.file.length === 0) return breakSync(next);

		// file

		if (this.header) {
			if (this.file.length >= this.header.size) {
				if (this.listenerCount('file')) this.emit('file', this.header, this.slice(this.header.size));
				else this.queue.push({ header: this.header, file: this.slice(this.header.size) });
				this.header = null;
				return this._write(Buffer.alloc(0), encoding, next);
			}
			return breakSync(next);
		}

		// Remove extra bits between files

		if (this.totalRead % this.recordSize) {
			this.slice(Math.min(this.recordSize - (this.totalRead % this.recordSize), this.file.length));
			return this._write(Buffer.alloc(0), encoding, next);
		}

		/* istanbul ignore next: Hard to test, requires the leftover of a chunk to be less than the size of a header block */
		if (this.file.length < this.recordSize) return breakSync(next);

		this.header = new Header(this.slice(this.recordSize));

		return this._write(Buffer.alloc(0), encoding, next);
	}

	private slice(length: number): Buffer {
		const buffer = this.file.slice(0, length);
		this.file = this.file.slice(length);
		this.totalRead += length;
		return buffer;
	}

	private next(): Promise<{ header: Header, file: Buffer }> {
		if (this.queue.length) return Promise.resolve(this.queue.shift() as { header: Header, file: Buffer });
		/* istanbul ignore next: Hard to produce in CI */
		if (!this.writable) return Promise.reject(null);
		return new Promise((resolve): void => {
			this.once('file', (header: Header, file: Buffer): void => {
				resolve({ header, file });
			});
		});
	}

	public async *files(): AsyncIterableIterator<{ header: Header, file: Buffer }> {
		while (this.queue.length || this.writable) yield this.next();
	}

}
