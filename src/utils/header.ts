const headerFormat = [
	{
		field: 'filename',
		length: 100,
		type: 'string'
	},
	{
		field: 'mode',
		length: 8,
		type: 'number'
	},
	{
		field: 'uid',
		length: 8,
		type: 'number'
	},
	{
		field: 'gid',
		length: 8,
		type: 'number'
	},
	{
		field: 'size',
		length: 12,
		type: 'number'
	},
	{
		field: 'mtime',
		length: 12,
		type: 'number'
	},
	{
		field: 'checksum',
		length: 8,
		type: 'number'
	},
	{
		field: 'type',
		length: 1,
		type: 'number'
	},
	{
		field: 'linkName',
		length: 100,
		type: 'string'
	},
	{
		field: 'ustar',
		length: 8,
		type: 'string'
	},
	{
		field: 'owner',
		length: 32,
		type: 'string'
	},
	{
		field: 'group',
		length: 32,
		type: 'string'
	},
	{
		field: 'majorNumber',
		length: 8,
		type: 'number'
	},
	{
		field: 'minorNumber',
		length: 8,
		type: 'number'
	},
	{
		field: 'filenamePrefix',
		length: 155,
		type: 'string'
	},
	{
		field: 'padding',
		length: 12
	}
];

const pad = (num: number, bytes: number, base = 8): string => num.toString(base).padStart(bytes, '0');

const readInt = (value: string): number => parseInt(value, 8) || 0;

// eslint-disable-next-line consistent-return
const readString = (buffer: Buffer): string | undefined => {
	for (let i = 0, { length } = buffer; i < length; i++) if (buffer[i] === 0) return buffer.toString('utf8', 0, i);
};

const updateChecksum = (value: string, checksum: number): number => {
	for (let i = 0, { length } = value; i < length; i++) checksum += value.charCodeAt(i);
	return checksum;
};

export interface HeaderFormat {
	filename?: string;
	mode?: number;
	uid?: number;
	gid?: number;
	size?: number;
	mtime?: number;
	checksum?: number;
	type?: string;
	linkName?: string;
	ustar?: string;
	owner?: string;
	group?: string;
	majorNumber?: string;
	minorNumber?: string;
	filenamePrefix?: string;
	padding?: any;
}

export function encodeHeader(data: HeaderFormat): Buffer {
	const header = Buffer.alloc(512);
	let offset = 0;

	const formatted = {
		filename: data.filename,
		mode: pad(data.mode, 7),
		uid: pad(data.uid, 7),
		gid: pad(data.gid, 7),
		size: pad(data.size, 11),
		mtime: pad(data.mtime, 11),
		checksum: '        ',
		type: data.type,
		ustar: data.ustar,
		owner: data.owner,
		group: data.group
	};

	for (const { field, length } of headerFormat) {
		header.write(formatted[field] || '', offset);
		offset += length;
	}

	let chksum = 0;
	for (let i = 0, { length } = header; i < length; i++) chksum += header[i];

	const checksum = pad(chksum, 6);
	for (let i = 0, length = 6; i < length; i++) header[i + 148] = checksum.charCodeAt(i);

	header[154] = 0;
	header[155] = 0x20;

	return header;
}

export function decodeHeader(data: Buffer): HeaderFormat {
	const header: HeaderFormat = {};
	let offset = 0;
	let checksum = 0;

	for (const field of headerFormat) {
		const tBuf = data.slice(offset, offset + field.length);
		const tString = tBuf.toString();

		offset += field.length;

		/* istanbul ignore next: No plans to test, requires a tar generated outside of this lib */
		if (field.field === 'ustar' && !/ustar/.test(tString)) break;

		checksum = updateChecksum(field.field === 'checksum' ? '        ' : tString, checksum);

		if (field.type === 'string') header[field.field] = readString(tBuf);
		else if (field.type === 'number') header[field.field] = readInt(tString);
	}

	/* istanbul ignore next: No plans to test, requires a tar with a bad checksum (generated outside of this lib) */
	if (checksum !== header.checksum) throw new Error(`Checksum not equal: ${checksum} != ${header.checksum}`);
	return header;
}
