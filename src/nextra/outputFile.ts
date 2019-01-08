import { dirname } from 'path';

import { writeFile } from '../fs';

import { default as writeFileAtomic, WriteOptions } from './writeFileAtomic';
import mkdirs from './mkdirs';

/**
 * Writes a file to disk, creating all directories needed to meet the filepath provided.
 * @function outputFile
 * @memberof fsn/nextra
 * @param file The path to the file you want to create
 * @param data The data to write to file
 * @param options The write options or the encoding string.
 * @param atomic {description}
 */
export default async function outputFile(file: string, data: string | Buffer | Uint8Array, options?: WriteOptions | string, atomic: boolean = false): Promise<void> {
	if (typeof options === 'boolean') [atomic, options] = [options, {}];

	await mkdirs(dirname(file));

	const writeMethod = atomic ? writeFileAtomic : writeFile;
	await writeMethod(file, data, options);
}
