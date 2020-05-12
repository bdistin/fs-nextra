import { createFile } from './createFile';

/**
 * Creates an file copy, making all folders required to satisfy the given file path atomically.
 * @function ensureFileAtomic
 * @memberof fsn/nextra
 * @param file Path of the file you want to create
 */
/**
 * Creates an file copy, making all folders required to satisfy the given file path atomically.
 * @function createFileAtomic
 * @memberof fsn/nextra
 * @param file Path of the file you want to create
 */
export function createFileAtomic(file: string): Promise<void> {
	return createFile(file, true);
}

export const ensureFileAtomic = createFileAtomic;
