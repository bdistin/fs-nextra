import { targz } from './targz';
import { move } from './move';
import { tempFile } from '../utils/util';

/**
 * Tar/Gzips a directory or array of files.
 * @function targzAtomic
 * @memberof fsn/nextra
 * @param fileName The filename of the archive
 * @param inputFiles The directory or array of filepaths to .tar.gz
 */
export async function targzAtomic(fileName: string, inputFiles: string | string[]): Promise<void> {
	const tempPath = tempFile();
	await targz(tempPath, inputFiles);
	return move(tempPath, fileName, { overwrite: true });
}
