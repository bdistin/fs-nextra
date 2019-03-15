import gunzip from './gunzip';

/**
 * Un-Gzips a file atomically.
 * @function gunzipAtomic
 * @memberof fsn/nextra
 * @param fileName The filename of the output file
 * @param inputFile The filepath of the archive
 */
export default async function gzipAtomic(fileName: string, inputFile: string): Promise<void> {
	return gunzip(fileName, inputFile, true);
}
