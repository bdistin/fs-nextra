import { promises as fsp } from 'fs';

export type BufferEncoding = 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'latin1' | 'binary' | 'hex';

/**
 * @typedef {Object} ReadJSONOptions
 * @memberof fsn/nextra
 * @property {string} [encoding] The file encoding to use while reading
 * @property {Function} [reviver] The reviver function to pass to JSON.parse()
 */
export interface ReadJSONOptions {
	encoding?: BufferEncoding;
	reviver?: (key: any, value: any) => any;
	flag?: string | number;
}

/**
 * Reads a file and parses it into a javascript object.
 * @function readJson
 * @memberof fsn/nextra
 * @param {string} file The file path to the json file
 * @param {ReadJSONOptions|string} [options = {}] The options for reading json or the encoding string
 * @returns {Promise<Object>}
 */
/**
 * Reads a file and parses it into a javascript object.
 * @function readJSON
 * @memberof fsn/nextra
 * @param {string} file The file path to the json file
 * @param {ReadJSONOptions|string} [options = {}] The options for reading json or the encoding string
 * @returns {Promise<Object>}
 */
export async function readJSON(file: string, options: ReadJSONOptions | BufferEncoding = { flag: 'r' }): Promise<any> {
	if (typeof options === 'string') options = { encoding: options, flag: 'r' };
	const content = await fsp.readFile(file, options);
	return JSON.parse(stripBom(content), options.reviver);
}

function stripBom(content: string | Buffer): string {
	if (Buffer.isBuffer(content)) content = content.toString('utf8');
	return content.replace(/^\uFEFF/, '');
}

export const readJson = readJSON;
