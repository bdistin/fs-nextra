import { createSymlink, SymLinkType } from './createSymlink';

/**
 * Creates a soft file link, making all folders required to satisfy the given file path atomically.
 * @function ensureSymlinkAtomic
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {SymLinkType} type The type of symlink you are creating
 * @returns {Promise<void>}
 */
/**
 * Creates a soft file link, making all folders required to satisfy the given file path atomically.
 * @function createSymlinkAtomic
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {SymLinkType} type The type of symlink you are creating
 * @returns {Promise<void>}
 */
export function createSymlinkAtomic(source: string, destination: string, type?: SymLinkType): Promise<void> {
	return createSymlink(source, destination, type, true);
}

export const ensureSymlinkAtomic = createSymlinkAtomic;
