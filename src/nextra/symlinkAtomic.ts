import { tempFile } from '../utils/util';
import { symlink } from '../fs';
import { SymLinkType } from './createSymlink';

import move from './move';

/**
 * Creates a soft file link atomically.
 * @function symlinkAtomic
 * @memberof fsn/nextra
 * @param source The source path of the file
 * @param destination The destination path of the file
 * @param type The type of symlink you are creating
 */
export default async function symlinkAtomic(source: string, destination: string, type?: SymLinkType): Promise<void> {
	const tempPath = tempFile();
	await symlink(source, tempPath, type);
	await move(tempPath, destination, { overwrite: false });
}
