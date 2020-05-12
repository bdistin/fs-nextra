import { dirname, resolve } from 'path';

import { promises as fsp } from 'fs';

import { copyFileAtomic } from './copyFileAtomic';
import { mkdirs } from './mkdirs';

/**
 * Creates an file copy, making all folders required to satisfy the given file path.
 * @function ensureFileCopy
 * @memberof fsn/nextra
 * @param source The path to the file you want to copy
 * @param destination The path to the file destination
 * @param atomic Whether the operation should run atomically
 */
/**
 * Creates an file copy, making all folders required to satisfy the given file path.
 * @function createFileCopy
 * @memberof fsn/nextra
 * @param source The path to the file you want to copy
 * @param destination The path to the file destination
 * @param atomic Whether the operation should run atomically
 */
export async function createFileCopy(source: string, destination: string, atomic = false): Promise<void> {
	if (resolve(source) === resolve(destination)) {
		await fsp.access(source);
	} else {
		await mkdirs(dirname(destination));

		const copyMethod = atomic ? copyFileAtomic : fsp.copyFile;
		await copyMethod(source, destination);
	}
}

export const ensureFileCopy = createFileCopy;
