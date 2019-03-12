import { normalize, basename } from 'path';
import { Stream, Writable, Readable } from 'stream';
import { formatHeader, HeaderFormat } from './header';
import { pad, readAll } from './util';

export interface TarOptions {
	recordsPerBlock?: number;
	consolidate?: boolean;
	normalize?: boolean;
	output?: Writable;
}

export interface AppendOptions {
	mode?: number;
	mtime?: number;
	uid?: number;
	gid?: number;
	size?: number;
	allowPipe?: boolean;
}

export default class Tar extends Stream {

	private written: number = 0;
	private consolidate: boolean;
	private normalize: boolean;
	private blockSize: number;
	private queue: Array<any> = [];
	private recordSize = 512;
	private processing: boolean = false;

	constructor(options: TarOptions = {}) {
		super();

		this.blockSize = (options.recordsPerBlock || 20) * this.recordSize;

		this.consolidate = 'consolidate' in options ? options.consolidate : false;
		this.normalize = 'normalize' in options ? options.normalize : true;

		this.on('end', () => {
			this.emit('data',  Buffer.alloc(this.blockSize - (this.written % this.blockSize)));
			this.written += this.blockSize - (this.written % this.blockSize);
		});

		if (options.output) this.pipe(options.output);
	}

	close() {
		this.emit('end');
	}

	createHeader(data: HeaderFormat) {
		if (this.normalize && !this.consolidate) data.filename = normalize(data.filename);

		const headerBuf = formatHeader(data);

		let chksum = 0;
		for (let i = 0, { length } = headerBuf; i < length; i++) chksum += headerBuf[i];

		const checksum = pad(chksum, 6);
		for (let i = 0, length = 6; i < length; i++) headerBuf[i + 148] = checksum.charCodeAt(i);

		headerBuf[154] = 0;
		headerBuf[155] = 0x20;

		return headerBuf;
	}

	async writeData(head: Buffer, input: string | Buffer | Readable, size: number) {
		let extraBytes;

		this.emit('data', head);
		this.written += head.length;

		if (typeof input === 'string' || input instanceof Buffer) {
			this.emit('data', input);
			this.written += input.length;

			extraBytes = this.recordSize - (size % this.recordSize || this.recordSize);
			this.emit('data', Buffer.alloc(extraBytes));
			this.written += extraBytes;

			return;
		}

		this.processing = true;

		for await (const chunk of input) {
			this.emit('data', chunk);
			this.written += chunk.length;
		}

		extraBytes = this.recordSize - (size % this.recordSize || this.recordSize);
		this.emit('data', Buffer.alloc(extraBytes));
		this.written += extraBytes;

		this.processing = false;

		if (this.queue.length > 0) {
			const job = this.queue.shift();

			if (typeof job.input === 'object' && typeof job.input.resume === 'function') {
				job.input.resume();
			}

			await this.append(job.filepath, job.input, job.opts);
		}
	}

	async append(filepath: string, input: string | Readable | Buffer, options: AppendOptions = {}) {
		if (this.processing || this.queue.length) {
			if (typeof input === 'object' && input instanceof Stream) input.pause();

			this.queue.push({
				filepath,
				input,
				options
			});
		}

		const mode = typeof options.mode === 'number' ? options.mode : 0o777 & 0xfff;
		const mtime = typeof options.mtime === 'number' ? options.mtime : Math.trunc(new Date().valueOf() / 1000);
		const uid = typeof options.uid === 'number' ? options.uid : 0;
		const gid = typeof options.gid === 'number' ? options.gid : 0;
		let size = typeof options.size === 'number' ?
			options.size :
			input instanceof Buffer || typeof input === 'string' ? input.length : undefined;

		const data: HeaderFormat = {
			filename: this.consolidate ? basename(filepath) : filepath,
			mode,
			uid,
			gid,
			size,
			mtime,
			checksum: 256,
			type: '0',
			ustar: 'ustar ',
			owner: '',
			group: ''
		};

		if (input instanceof Stream && (typeof size !== 'number' || size < 0)) {
			if (!options.allowPipe) throw new Error('Streams must supply the total size of the stream if allowPipe is not set.');

			this.processing = true;
			const buf = await readAll(input);
			this.processing = false;

			size = buf.length;
			data.size = size;
			return this.writeData(this.createHeader(data), buf, size);
		}

		return this.writeData(this.createHeader(data), input, size);
	}

}
