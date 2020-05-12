import { unTargz } from './unTargz';

/**
 * Extracts files from .tar.gz archives and writes them atomically.
 * @function unTargzAtomic
 * @memberof fsn/nextra
 * @param outputDirectory The directory to extract to
 * @param inputFile The archive file
 * @param atomic The if the writes should be atomic
 */
export async function unTargzAtomic(outputDirectory: string, inputFile: string): Promise<void> {
	return unTargz(outputDirectory, inputFile, true);
}
