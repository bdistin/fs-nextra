import outputFile from './outputFile';
import { WriteOptions } from './writeFileAtomic';

/**
 * Writes a file to disk, creating all directories needed to meet the filepath provided atomically.
 * @function outputFileAtomic
 * @memberof fsn/nextra
 * @param file The path to the file you want to create
 * @param data The data to write to file
 * @param options The write options or the encoding string.
 * @returns {Promise<void>}
 */
export default function outputFileAtomic(file: string, data: string | Buffer | Uint8Array, options?: WriteOptions | string) {
	return outputFile(file, data, options, true);
}
