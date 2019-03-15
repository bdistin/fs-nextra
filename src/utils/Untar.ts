import { Writable } from 'stream';
import { decodeHeader, HeaderFormat } from './header';

export default class Untar extends Writable {

	private header: HeaderFormat = null;
	private file: Buffer = Buffer.alloc(0);
	private leftToRead: number;
	private totalRead: number = 0;
	private recordSize: number = 512;
	private finished: boolean = false;

	public _write(data: string | Buffer | any[], encoding: string, next: Function) {
		data = this.resolveBuffer(data, encoding);
		this.file = Buffer.concat([this.file, data], this.file.length + data.length);

		if (this.file.length === 0) return next();

		if (this.leftToRead) {
			if (this.file.length >= this.leftToRead) {
				this.emit('file', this.header, this.file.slice(0, this.header.size));
				this.file = this.file.slice(this.header.size);
				this.totalRead += this.leftToRead;
				this.leftToRead = 0;
				return next();
			}

			this.leftToRead -= data.length;
			this.totalRead += data.length;
			return next();
		}

		// Remove extra bits between files

		if (this.totalRead % this.recordSize) {
			const bytesBuffer = this.recordSize - (this.totalRead % this.recordSize);

			if (this.file.length < bytesBuffer) return next();

			this.file = this.file.slice(bytesBuffer);
			this.totalRead += bytesBuffer;
		}

		if (this.file.length < this.recordSize) return next();

		// New File

		this.header = decodeHeader(this.file);

		this.totalRead += this.recordSize;
		this.file = this.file.slice(this.recordSize);

		if (this.file.length >= this.header.size) {
			this.emit('file', this.header, this.file.slice(0, this.header.size));
			this.totalRead += this.header.size;
			this.file = this.file.slice(this.header.size);
			this.header = null;
			return next();
		}

		this.leftToRead = this.header.size - this.file.length;
		this.totalRead += this.file.length;

		return next();
	}

	public _final(next: Function) {
		this.finished = true;
		return next();
	}

	private resolveBuffer(data: string | Buffer | any[], encoding?: string): Buffer {
		return typeof data === 'string' ?
			Buffer.from(data, encoding) :
			Array.isArray(data) ? Buffer.from(data) : data;
	}

	private next(): Promise<{ header: HeaderFormat, file: Buffer }> {
		return new Promise((resolve) => {
			const onFile = (header: HeaderFormat, file: Buffer) => {
				cleanup();
				resolve({ header, file });
			};

			const onfinish = () => {
				cleanup();
				resolve(null);
			};

			const cleanup = () => {
				this.removeListener('file', onFile);
				this.removeListener('finish', onfinish);
			};

			this.on('file', onFile);
			this.on('finish', onfinish);
		});
	}

	public async *files(): AsyncIterableIterator<{ header: HeaderFormat, file: Buffer }> {
		let file: { header: HeaderFormat, file: Buffer };

		while (!this.finished && (file = await this.next())) yield file;
	}

}
