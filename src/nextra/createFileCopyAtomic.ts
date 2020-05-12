import { createFileCopy } from './createFileCopy';

/**
 * Creates a file copy atomically, making all folders required to satisfy the given file path.
 * @function ensureFileCopyAtomic
 * @memberof fsn/nextra
 * @param source The path to the file you want to copy
 * @param destination The path to the file destination
 */
/**
 * Creates a file copy atomically, making all folders required to satisfy the given file path.
 * @function createFileCopyAtomic
 * @memberof fsn/nextra
 * @param source The path to the file you want to copy
 * @param destination The path to the file destination
 */
export async function createFileCopyAtomic(source: string, destination: string): Promise<void> {
	return createFileCopy(source, destination, true);
}

export const ensureFileCopyAtomic = createFileCopyAtomic;
