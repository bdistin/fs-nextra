export interface HeaderFormat {
	filename?: string;
	mode: number;
	uid: number;
	gid: number;
	size: number;
	mtime: number;
	checksum?: number;
	type?: number;
	linkName?: string;
	ustar?: string;
	owner?: string;
	group?: string;
	majorNumber?: number;
	minorNumber?: number;
	filenamePrefix?: string;
	padding?: any;
}

export class Header {

	public filename: string;
	public mode: number;
	public uid: number;
	public gid: number;
	public size: number;
	public mtime: number;
	public type: number;
	public linkName: string;
	public ustar: string;
	public owner: string;
	public group: string;
	public majorNumber: number;
	public minorNumber: number;
	public filenamePrefix: string;

	public constructor(data: HeaderFormat | Buffer) {
		const headerData = Header.resolve(data);

		/* istanbul ignore next: Requires a tar made by another program */
		this.filename = headerData.filename || '';
		this.mode = headerData.mode;
		this.uid = headerData.uid;
		this.gid = headerData.gid;
		this.size = headerData.size;
		this.mtime = headerData.mtime;
		this.type = headerData.type || 0;
		this.linkName = headerData.linkName || '';
		/* istanbul ignore next: Requires a tar made by another program */
		this.ustar = headerData.ustar || '';
		this.owner = headerData.owner || '';
		this.group = headerData.group || '';
		this.majorNumber = headerData.majorNumber || 0;
		this.minorNumber = headerData.minorNumber || 0;
		this.filenamePrefix = headerData.filenamePrefix || '';

		/* istanbul ignore next: Requires a bad tar file */
		if (headerData.checksum && headerData.checksum !== this.checksum) throw new Error(`Checksum not equal: ${headerData.checksum} != ${this.checksum}`);
	}

	public get checksum(): number {
		let checksum = 0;
		checksum += Header.checksum(this.filename);
		checksum += Header.checksum(Header.pad(this.mode, 7));
		checksum += Header.checksum(Header.pad(this.uid, 7));
		checksum += Header.checksum(Header.pad(this.gid, 7));
		checksum += Header.checksum(Header.pad(this.size, 11));
		checksum += Header.checksum(Header.pad(this.mtime, 11));
		// blank checksum
		checksum += Header.checksum('        ');
		checksum += Header.checksum(Header.pad(this.type, 0));
		/* istanbul ignore next: Requires a tar made by another program */
		if (!/ustar/.test(this.ustar)) return checksum;
		checksum += Header.checksum(this.ustar);
		checksum += Header.checksum(this.owner);
		checksum += Header.checksum(this.group);
		checksum += Header.checksum(Header.pad(this.majorNumber, 7));
		checksum += Header.checksum(Header.pad(this.minorNumber, 7));
		checksum += Header.checksum(this.filenamePrefix);

		return checksum;
	}

	public toBuffer(): Buffer {
		const header = Buffer.alloc(512);

		header.write(this.filename, 0);
		header.write(Header.pad(this.mode, 7), 100);
		header.write(Header.pad(this.uid, 7), 108);
		header.write(Header.pad(this.gid, 7), 116);
		header.write(Header.pad(this.size, 11), 124);
		header.write(Header.pad(this.mtime, 11), 136);
		header.write(Header.pad(this.checksum, 5) + String.fromCharCode(0, 0x20), 148);
		header.write(Header.pad(this.type, 0), 156);
		header.write(this.linkName, 157);
		header.write(this.ustar, 257);
		header.write(this.owner, 265);
		header.write(this.group, 297);
		header.write(Header.pad(this.majorNumber, 7), 329);
		header.write(Header.pad(this.minorNumber, 7), 337);
		header.write(this.filenamePrefix, 345);

		return header;
	}

	private static resolve(data: HeaderFormat | Buffer): HeaderFormat {
		if (!(data instanceof Buffer)) return data;

		return {
			filename: Header.readString(data.slice(0, 100)),
			mode: Header.readInt(data.slice(100, 108)),
			uid: Header.readInt(data.slice(108, 116)),
			gid: Header.readInt(data.slice(116, 124)),
			size: Header.readInt(data.slice(124, 136)),
			mtime: Header.readInt(data.slice(136, 148)),
			checksum: Header.readInt(data.slice(148, 156)),
			type: Header.readInt(data.slice(156, 157)),
			linkName: Header.readString(data.slice(157, 257)),
			ustar: Header.readString(data.slice(257, 265)),
			owner: Header.readString(data.slice(265, 297)),
			group: Header.readString(data.slice(297, 329)),
			majorNumber: Header.readInt(data.slice(329, 337)),
			minorNumber: Header.readInt(data.slice(337, 345)),
			filenamePrefix: Header.readString(data.slice(345, 500))
		};
	}

	private static checksum(value: string): number {
		let checksum = 0;
		for (let i = 0, { length } = value; i < length; i++) checksum += value.charCodeAt(i);
		return checksum;
	}

	private static readInt(buffer: Buffer): number {
		return parseInt(buffer.toString(), 8) || 0;
	}

	private static readString(buffer: Buffer): string {
		for (let i = 0, { length } = buffer; i < length; i++) if (buffer[i] === 0) return buffer.toString('utf8', 0, i);
		/* istanbul ignore next: Probably wont happen */
		return '';
	}

	private static pad(num: number, bytes: number, base = 8): string {
		return num.toString(base).padStart(bytes, '0');
	}

}
