import { gzip } from './gzip';
import { move } from './move';
import { tempFile } from '../utils/util';

/**
 * Gzips a file atomically.
 * @function gzipAtomic
 * @memberof fsn/nextra
 * @param fileName The filename of the archive
 * @param inputFile The filepath of the input file
 */
export async function gzipAtomic(fileName: string, inputFile: string): Promise<void> {
	const tempPath = tempFile();
	await gzip(tempPath, inputFile);
	return move(tempPath, fileName, { overwrite: true });
}
