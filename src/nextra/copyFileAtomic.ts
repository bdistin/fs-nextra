import { tempFile } from '../util';
import { copyFile } from '../fs';

import move from './move';

/**
 * @function copyFileAtomic
 * @memberof fsn/nextra
 * @param source The path to the file you want to copy
 * @param destination The path to the file destination
 * @param options The write options or the encoding string.
 */
export default async function copyFileAtomic(source: string, destination: string): Promise<void> {
	const tempPath = tempFile();
	await copyFile(source, tempPath);
	await move(tempPath, destination, { overwrite: true });
}
