import { promises as fsp } from 'fs';

import { tempFile } from '../utils/util';
import { move } from './move';

import type { SymLinkType } from './createSymlink';

/**
 * Creates a soft file link atomically.
 * @function symlinkAtomic
 * @memberof fsn/nextra
 * @param source The source path of the file
 * @param destination The destination path of the file
 * @param type The type of symlink you are creating
 */
export async function symlinkAtomic(source: string, destination: string, type?: SymLinkType): Promise<void> {
	const tempPath = tempFile();
	await fsp.symlink(source, tempPath, type);
	await move(tempPath, destination, { overwrite: false });
}
