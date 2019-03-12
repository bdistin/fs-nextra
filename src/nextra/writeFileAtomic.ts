import { tempFile } from '../utils/util';
import { writeFile } from '../fs';

import move from './move';

/**
 * @typedef {Object} WriteOptions
 * @memberof fsn/nextra
 * @property {string} [encoding = 'utf8'] The file encoding
 * @property {number} [mode = 0o666] The chmod
 * @property {string} [flag = 'w'] The flag
 */
export interface WriteOptions {
	encoding?: string;
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
export default async function writeFileAtomic(file: string, data: string | Buffer | Uint8Array, options?: WriteOptions | string): Promise<void> {
	const tempPath = tempFile();
	await writeFile(tempPath, data, options);
	await move(tempPath, file, { overwrite: true });
}
