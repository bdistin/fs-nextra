import { createLink } from './createLink';

/**
 * Creates a hard file link, making all folders required to satisfy the given file path atomically.
 * @function ensureLinkAtomic
 * @memberof fsn/nextra
 * @param source The source path of the file
 * @param destination The destination path of the file
 */
/**
 * Creates a hard file link, making all folders required to satisfy the given file path atomically.
 * @function createLinkAtomic
 * @memberof fsn/nextra
 * @param source The source path of the file
 * @param destination The destination path of the file
 */
export function createLinkAtomic(source: string, destination: string): Promise<void> {
	return createLink(source, destination, true);
}

export const ensureLinkAtomic = createLinkAtomic;
