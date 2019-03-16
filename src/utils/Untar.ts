import { Writable } from 'stream';
import { decodeHeader, HeaderFormat } from './header';

export default class Untar extends Writable {

	private header: HeaderFormat = null;
	private file: Buffer = Buffer.alloc(0);
	private totalRead: number = 0;
	private recordSize: number = 512;
	private queue: Array<{ header: HeaderFormat, file: Buffer }> = [];

	public _write(data: string | Buffer | any[], encoding: string, next: Function) {
		data = this.resolveBuffer(data, encoding);
		this.file = Buffer.concat([this.file, data], this.file.length + data.length);

		if (this.file.length === 0) return next();

		// file

		if (this.header) {
			if (this.file.length >= this.header.size) {
				this.send();
				return this._write(Buffer.alloc(0), encoding, next);
			}
			return next();
		}

		// Remove extra bits between files

		if (this.totalRead % this.recordSize) {
			this.slice(Math.min(this.recordSize - (this.totalRead % this.recordSize), this.file.length));
			return this._write(Buffer.alloc(0), encoding, next);
		}

		if (this.file.length < this.recordSize) return next();

		// New Header

		this.header = decodeHeader(this.slice(this.recordSize));

		return this._write(Buffer.alloc(0), encoding, next);
	}

	private slice(length: number): Buffer {
		const buffer = this.file.slice(0, length);
		this.file = this.file.slice(length);
		this.totalRead += length;
		return buffer;
	}

	private send() {
		if (this.listenerCount('file')) this.emit('file', this.header, this.slice(this.header.size));
		else this.queue.push({ header: this.header, file: this.slice(this.header.size) });
		this.header = null;
	}

	private resolveBuffer(data: string | Buffer | any[], encoding?: string): Buffer {
		return typeof data === 'string' ?
			Buffer.from(data, encoding) :
			Array.isArray(data) ? Buffer.from(data) : data;
	}

	private next(): Promise<{ header: HeaderFormat, file: Buffer }> {
		if (this.queue.length) return Promise.resolve(this.queue.shift());
		if (!this.writable) return Promise.resolve(null);
		return new Promise((resolve) => {
			this.once('file', (header: HeaderFormat, file: Buffer) => {
				resolve({ header, file });
			});
		});
	}

	public async *files(): AsyncIterableIterator<{ header: HeaderFormat, file: Buffer }> {
		let file: { header: HeaderFormat, file: Buffer };

		while (file = await this.next()) yield file;
	}

}
