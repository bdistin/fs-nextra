import { link } from 'fs/promises';

import { tempFile } from '../utils/util';
import { move } from './move';

/**
 * Creates a hard file link atomically.
 * @function linkAtomic
 * @memberof fsn/nextra
 * @param source The source path of the file
 * @param destination The destination path of the file
 */
export async function linkAtomic(source: string, destination: string): Promise<void> {
	const tempPath = tempFile();
	await link(source, tempPath);
	await move(tempPath, destination, { overwrite: true });
}
