import { Writable } from 'stream';
import { decodeHeader, HeaderFormat } from './header';

export default class Untar extends Writable {

	private header: HeaderFormat = null;
	private file: Buffer = Buffer.alloc(0);
	private leftToRead: number;
	private recordSize: number = 512;

	public constructor(...args) {
		super(...args);
		this.cork();
	}

	public _write(data: string | Buffer | any[], encoding?: string) {
		data = this.resolveBuffer(data, encoding);
		this.file = Buffer.concat([this.file, data], this.file.length + data.length);

		if (this.file.length === 0) return;

		if (this.leftToRead) {
			if (this.file.length >= this.leftToRead) {
				this.emit('file', this.header, this.file.slice(0, this.header.size));
				this.file = this.file.slice(this.header.size);
				this.leftToRead = 0;
				return;
			}

			this.leftToRead -= data.length;
			return;
		}

		if (this.file.length < this.recordSize) return;

		// New File

		this.header = decodeHeader(this.file);

		this.file = this.file.slice(this.recordSize);

		if (this.file.length >= this.header.size) {
			this.emit('file', this.header, this.file);
			this.file = this.file.slice(this.header.size);
			this.header = null;
			return;
		}

		this.leftToRead = this.header.size - this.file.length;
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
		this.uncork();
		let file: { header: HeaderFormat, file: Buffer };

		while (file = await this.next()) yield file;
	}

}
