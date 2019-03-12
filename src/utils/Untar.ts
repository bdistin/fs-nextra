import { Stream } from 'stream';
import { headerFormat, HeaderFormat } from './header';

export default class Untar extends Stream {

	public writable: boolean = true;
	private buffer: Buffer;
	private totalRead: number = 0;
	private recordSize: number = 512;
	private fileStream: Stream;
	private leftToRead: number;

	public end(data, encoding) {
		if (data) return this.write(data, encoding);
	}

	public async write(data?: string | string[] | Buffer, encoding?: string) {
		let buf;
		let tBuf;
		let bytesBuffer;

		if (typeof data === 'string') {
			buf = Buffer.from(data, encoding);
		} else if (Array.isArray(data)) {
			buf = Buffer.from(data);
		} else {
			buf = data;
		}

		if (!buf) {
			tBuf = this.buffer;
		} else if (this.buffer) {
			tBuf = Buffer.alloc(this.buffer.length + buf.length);
			this.buffer.copy(tBuf);
			buf.copy(tBuf, this.buffer.length);
		} else {
			tBuf = buf;
		}

		this.buffer = undefined;

		if (!tBuf || tBuf.length === 0) return;

		if (this.fileStream) {
			if (tBuf.length >= this.leftToRead) {
				this.fileStream.emit('data', tBuf.slice(0, this.leftToRead));
				this.fileStream.emit('end');
				this.fileStream = undefined;

				this.buffer = tBuf.slice(this.leftToRead);
				this.totalRead += this.leftToRead;
				this.leftToRead = 0;
				return;
			}

			this.fileStream.emit('data', tBuf);
			this.leftToRead -= tBuf.length;
			this.totalRead += tBuf.length;
			return;
		}

		if (this.totalRead % this.recordSize) {
			bytesBuffer = this.recordSize - (this.totalRead % this.recordSize);

			if (tBuf.length < bytesBuffer) {
				this.totalRead += bytesBuffer;
				return;
			}

			tBuf = tBuf.slice(bytesBuffer);
			this.totalRead += bytesBuffer;
		}

		if (tBuf.length < this.recordSize) {
			this.buffer = tBuf;
			return;
		}

		const newData = await this.doHeader(tBuf);

		this.totalRead += this.recordSize;
		this.buffer = tBuf.slice(this.recordSize);

		this.fileStream = new Stream();

		if (this.buffer.length >= newData.size) {
			this.fileStream.emit('data', this.buffer.slice(0, newData.size));
			this.fileStream.emit('end');
			this.totalRead += newData.size;
			this.buffer = this.buffer.slice(newData.size);

			this.fileStream = undefined;

			return this.write();
		}

		this.leftToRead = newData.size - this.buffer.length;
		this.fileStream.emit('data', this.buffer);
		this.totalRead += this.buffer.length;
		this.buffer = undefined;
	}

	private async doHeader(buf) {
		const data: HeaderFormat = {};
		let offset = 0;
		let checksum = 0;

		for (const field of headerFormat) {
			const tBuf = buf.slice(offset, offset + field.length);
			const tString = tBuf.toString();

			offset += field.length;

			if (field.field === 'ustar' && !/ustar/.test(tString)) {
				break;
			} else if (field.field === 'checksum') {
				checksum = updateChecksum('        ', checksum);
			} else {
				checksum = updateChecksum(tString, checksum);
			}

			if (field.type === 'string') data[field.field] = readString(tBuf);
			else if (field.type === 'number') data[field.field] = readInt(tString);
		}

		if (checksum !== data.checksum) throw new Error(`Checksum not equal: ${checksum} != ${data.checksum}`);
		return data;
	}

}

const readInt = (value: string) => parseInt(value, 8) || 0;

const readString = (buffer: Buffer) => {
	for (let i = 0, length = buffer.length; i < length; i ++) if (buffer[i] === 0) return buffer.toString('utf8', 0, i);
};

const updateChecksum = (value: string, checksum: number): number => {
	for (let i = 0, length = value.length; i < length; i++) checksum += value.charCodeAt(i);
	return checksum;
};
