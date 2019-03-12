import targz from './targz';

/**
 * Tar/Gzips a directory or array of files.
 * @function targzAtomic
 * @memberof fsn/nextra
 * @param fileName The filename of the archive
 * @param inputFiles The directory or array of filepaths to .tar.gz
 */
export default async function targzAtomic(fileName: string, inputFiles: string | string[]): Promise<void> {
	return targz(fileName, inputFiles, true);
}
