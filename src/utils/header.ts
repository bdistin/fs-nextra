import { pad } from './util';

export const headerFormat = [
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

export function formatHeader(data: HeaderFormat): Buffer {
	const buffer = Buffer.alloc(512);
	let offset = 0;

	const formatted = {
		filename: data.filename,
		mode: pad(data.mode, 7),
		uid: pad(data.uid, 7),
		gid: pad(data.gid, 7),
		size: pad(data.size, 11),
		mtime: pad(data.mtime, 11),
		checksum: data.checksum,
		type: data.type,
		ustar: data.ustar,
		owner: data.owner,
		group: data.group
	};

	for (const { field, length } of headerFormat) {
		buffer.write(formatted[field] || '', offset);
		offset += length;
	}

	return buffer;
}
