import { tempFile } from '../util';
import { link } from '../fs';

import move from './move';

/**
 * Creates a hard file link atomically.
 * @function linkAtomic
 * @memberof fsn/nextra
 * @param source The source path of the file
 * @param destination The destination path of the file
 */
export default async function linkAtomic(source: string, destination: string): Promise<void> {
	const tempPath = tempFile();
	await link(source, tempPath);
	await move(tempPath, destination, { overwrite: true });
}
