import { dirname } from 'path';
import { promises as fsp } from 'fs';

import { writeFileAtomic, WriteOptions, BaseEncodingOptions } from './writeFileAtomic';
import { mkdirs } from './mkdirs';

/**
 * Writes a file to disk, creating all directories needed to meet the filepath provided.
 * @function outputFile
 * @memberof fsn/nextra
 * @param file The path to the file you want to create
 * @param data The data to write to file
 * @param options The write options or the encoding string.
 * @param atomic {description}
 */
export async function outputFile(file: string, data: string | Buffer | Uint8Array, atomic?: boolean): Promise<void>;
export async function outputFile(file: string, data: string | Buffer | Uint8Array, options?: WriteOptions | BaseEncodingOptions, atomic?: boolean): Promise<void>;
export async function outputFile(file: string, data: string | Buffer | Uint8Array, options?: WriteOptions | BaseEncodingOptions | boolean, atomic = false): Promise<void> {
	if (typeof options === 'boolean') [atomic, options] = [options, {}];

	await mkdirs(dirname(file));

	const writeMethod = atomic ? writeFileAtomic : fsp.writeFile;
	await writeMethod(file, data, options);
}
