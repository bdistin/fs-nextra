import { dirname } from 'path';
import { promises as fsp } from 'fs';

import { writeFileAtomic } from './writeFileAtomic';
import { mkdirs } from './mkdirs';
import { pathExists } from './pathExists';

/**
 * Creates an empty file, making all folders required to satisfy the given file path.
 * @function ensureFile
 * @memberof fsn/nextra
 * @param file Path of the file you want to create
 * @param atomic Whether the operation should run atomically
 */
/**
 * Creates an empty file, making all folders required to satisfy the given file path.
 * @function createFile
 * @memberof fsn/nextra
 * @param file Path of the file you want to create
 * @param atomic Whether the operation should run atomically
 */
export async function createFile(file: string, atomic = false): Promise<void> {
	if (await pathExists(file)) return;

	await mkdirs(dirname(file));

	const writeMethod = atomic ? writeFileAtomic : fsp.writeFile;
	await writeMethod(file, '');
}

export const ensureFile = createFile;
