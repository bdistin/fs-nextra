import { dirname, join, isAbsolute, relative, resolve } from 'path';
import { promises as fsp } from 'fs';

import { pathExists } from './pathExists';
import { mkdirs } from './mkdirs';
import { symlinkAtomic } from './symlinkAtomic';


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
export async function createSymlink(source: string, destination: string, atomic?: boolean): Promise<void>;
export async function createSymlink(source: string, destination: string, type?: SymLinkType, atomic?: boolean): Promise<void>;
export async function createSymlink(source: string, destination: string, type?: SymLinkType | boolean, atomic = false): Promise<void> {
	if (await pathExists(destination)) return;
	if (typeof type === 'boolean') [atomic, type] = [type, undefined];

	await mkdirs(dirname(destination));
	const relativePath = await symlinkPaths(source, destination);

	const symlinkMethod = atomic ? symlinkAtomic : fsp.symlink;
	await symlinkMethod(relativePath.toDst, resolve(destination), type as SymLinkType || await symlinkType(relativePath.toCwd));
}

async function symlinkPaths(srcpath: string, dstPath: string): Promise<SymLinkPaths> {
	if (isAbsolute(srcpath)) {
		await fsp.lstat(srcpath);
		return { toCwd: srcpath, toDst: srcpath };
	}
	const dstDir = dirname(dstPath);
	const relativeToDst = join(dstDir, srcpath);
	/* istanbul ignore next: Doesn't get tested on all OSs */
	if (await pathExists(relativeToDst)) return { toCwd: relativeToDst, toDst: srcpath };
	await fsp.lstat(srcpath);
	return { toCwd: srcpath, toDst: relative(dstDir, srcpath) };
}

async function symlinkType(srcpath: string): Promise<SymLinkType> {
	const stats = await fsp.lstat(srcpath);
	return stats.isDirectory() ? 'dir' : 'file';
}

export const ensureSymlink = createSymlink;
