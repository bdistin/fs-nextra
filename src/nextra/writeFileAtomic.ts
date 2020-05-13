import { promises as fsp } from 'fs';

import { tempFile } from '../utils/util';
import { move } from './move';

export type BaseEncodingOptions = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex' | null | undefined;

/**
 * @typedef {Object} WriteOptions
 * @memberof fsn/nextra
 * @property {string} [encoding = 'utf8'] The file encoding
 * @property {number} [mode = 0o666] The chmod
 * @property {string} [flag = 'w'] The flag
 */
export interface WriteOptions {
	encoding?: BaseEncodingOptions;
	mode?: number;
	flag?: string;
}

/**
 * @function writeFileAtomic
 * @memberof fsn/nextra
 * @param file The path to the file you want to create
 * @param data The data to write to file
 * @param options The write options or the encoding string.
 */
export async function writeFileAtomic(file: string, data: string | Buffer | Uint8Array, options?: WriteOptions | BaseEncodingOptions): Promise<void> {
	const tempPath = tempFile();
	await fsp.writeFile(tempPath, data, options);
	await move(tempPath, file, { overwrite: true });
}
