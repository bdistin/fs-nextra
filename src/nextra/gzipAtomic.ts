import gzip from './gzip';

/**
 * Gzips a file atomically.
 * @function gzipAtomic
 * @memberof fsn/nextra
 * @param fileName The filename of the archive
 * @param inputFile The filepath of the input file
 */
export default async function gzipAtomic(fileName: string, inputFile: string): Promise<void> {
	return gzip(fileName, inputFile, true);
}
