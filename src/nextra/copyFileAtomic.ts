import { promises as fsp } from 'fs';

import { tempFile } from '../utils/util';
import { move } from './move';

/**
 * @function copyFileAtomic
 * @memberof fsn/nextra
 * @param source The path to the file you want to copy
 * @param destination The path to the file destination
 * @param options The write options or the encoding string.
 */
export async function copyFileAtomic(source: string, destination: string): Promise<void> {
	const tempPath = tempFile();
	await fsp.copyFile(source, tempPath);
	await move(tempPath, destination, { overwrite: true });
}
