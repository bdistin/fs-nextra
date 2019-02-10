import { dirname, join, isAbsolute, relative } from 'path';
import { symlink, lstat } from '../fs';

import pathExists from './pathExists';
import mkdirs from './mkdirs';
import symlinkAtomic from './symlinkAtomic';


/**
 * The type of symlink you are creating:
 * * `dir`
 * * `file`
 * * `junction`
 * @typedef {string} SymLinkType
 * @memberof fsn/nextra
 */
export type SymLinkType = 'dir' | 'file' | 'junction';

interface SymLinkPaths {
	toCwd: string;
	toDst: string;
}

/**
 * Creates a soft file link, making all folders required to satisfy the given file path.
 * @function ensureSymlink
 * @memberof fsn/nextra
 * @param source The source path of the file
 * @param destination The destination path of the file
 * @param type The type of symlink you are creating
 * @param atomic Whether the operation should run atomically
 */
/**
 * Creates a soft file link, making all folders required to satisfy the given file path.
 * @function createSymlink
 * @memberof fsn/nextra
 * @param source The source path of the file
 * @param destination The destination path of the file
 * @param type The type of symlink you are creating
 * @param atomic Whether the operation should run atomically
 */
export default async function createSymlink(source: string, destination: string, type?: SymLinkType | boolean, atomic: boolean = false): Promise<void> {
	if (await pathExists(destination)) return;
	if (typeof type === 'boolean') [atomic, type] = [type, undefined];

	await mkdirs(dirname(destination));
	const relativePath = await symlinkPaths(source, destination);

	const symlinkMethod = atomic ? symlinkAtomic : symlink;
	await symlinkMethod(relativePath.toDst, destination, type as SymLinkType || await symlinkType(relativePath.toCwd));
}

const symlinkPaths = async (srcpath: string, dstPath: string): Promise<SymLinkPaths> => {
	if (isAbsolute(srcpath)) {
		await lstat(srcpath);
		return { toCwd: srcpath, toDst: srcpath };
	}
	const dstDir = dirname(dstPath);
	const relativeToDst = join(dstDir, srcpath);
	if (await pathExists(relativeToDst)) return { toCwd: relativeToDst, toDst: srcpath };
	await lstat(srcpath);
	return { toCwd: srcpath, toDst: relative(dstDir, srcpath) };
};

const symlinkType = async (srcpath: string): Promise<SymLinkType> => {
	try {
		const stats = await lstat(srcpath);
		return stats.isDirectory() ? 'dir' : 'file';
	} catch (err) {
		// Windows
		/* istanbul ignore next */
		return 'file';
	}
};
