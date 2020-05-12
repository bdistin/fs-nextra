import { gunzip } from './gunzip';
import { move } from './move';
import { tempFile } from '../utils/util';

/**
 * Un-Gzips a file atomically.
 * @function gunzipAtomic
 * @memberof fsn/nextra
 * @param fileName The filename of the output file
 * @param inputFile The filepath of the archive
 */
export async function gunzipAtomic(fileName: string, inputFile: string): Promise<void> {
	const tempPath = tempFile();
	await gunzip(tempPath, inputFile);
	return move(tempPath, fileName, { overwrite: true });
}
