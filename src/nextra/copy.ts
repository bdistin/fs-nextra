import { resolve, dirname, join, basename } from 'path';
import { promises as fsp, Stats } from 'fs';

import { replaceEsc, isSrcKid } from '../utils/util';
import { mkdirs } from './mkdirs';
import { remove } from './remove';

type CopyFilter = (source: string, target: string) => boolean;

/**
 * @typedef {Object} CopyOptions
 * @memberof fsn/nextra
 * @property [filter = undefined] A filter function to determine which files to copy.
 * @property [overwrite = true] Whether to overwrite files or not.
 * @property [preserveTimestamps = true] Whether or not to preserve timestamps on the files.
 * @property [errorOnExist = false] Whether or not to error if the destination exists
 */
export interface CopyOptions {
	filter?: CopyFilter;
	overwrite?: boolean;
	preserveTimestamps?: boolean;
	errorOnExist?: boolean;
}

interface CopyData {
	currentPath: string;
	targetPath: string;
	filter: CopyFilter;
	overwrite: boolean;
	preserveTimestamps: boolean;
	errorOnExist: boolean;
}

/**
 * Copies files from one location to another, creating all directories required to satisfy the destination path.
 * @function copy
 * @memberof fsn/nextra
 * @param source The source path
 * @param destination The destination path
 * @param options Options for the copy, or a filter function
 */
export async function copy(source: string, destination: string, options: CopyOptions | CopyFilter = {}): Promise<void> {
	const copyOptions = resolveCopyOptions(source, destination, options);

	if (resolve(source) === resolve(destination)) {
		if (copyOptions.errorOnExist) throw new Error('FS-NEXTRA: Source and destination must not be the same.');
		await fsp.access(source);
	} else {
		await mkdirs(dirname(destination));
		await startCopy(source, copyOptions);
	}
}

function resolveCopyOptions(source: string, destination: string, options: CopyOptions | CopyFilter): CopyData {
	if (typeof options === 'function') options = { filter: options };

	return {
		currentPath: resolve(source),
		targetPath: resolve(destination),
		filter: typeof options.filter === 'function' ? options.filter : (): boolean => true,
		overwrite: 'overwrite' in options ? Boolean(options.overwrite) : true,
		preserveTimestamps: Boolean(options.preserveTimestamps),
		errorOnExist: Boolean(options.errorOnExist)
	};
}

async function isWritable(myPath: string): Promise<boolean> {
	try {
		await fsp.lstat(myPath);
		return false;
	} catch (err) {
		return err.code === 'ENOENT';
	}
}

async function startCopy(mySource: string, options: CopyData): Promise<void> {
	if (!options.filter(mySource, options.targetPath)) return;
	const stats = await fsp.lstat(mySource);
	const target = mySource.replace(options.currentPath, replaceEsc(options.targetPath));

	if (stats.isDirectory()) await copyDirectory(mySource, stats, target, options);
	else await copyOther(mySource, stats, target, options);
}

async function copyDirectory(mySource: string, stats: Stats, target: string, options: CopyData): Promise<void> {
	if (isSrcKid(mySource, target)) throw new Error('FS-NEXTRA: Copying a parent directory into a child will result in an infinite loop.');
	if (await isWritable(target)) {
		await fsp.mkdir(target, stats.mode);
		await fsp.chmod(target, stats.mode);
	}
	const items = await fsp.readdir(mySource);
	await Promise.all(items.map((item): Promise<void> => startCopy(join(mySource, item), options)));
}

async function copyOther(mySource: string, stats: Stats, target: string, options: CopyData): Promise<void> {
	try {
		const tstats = await fsp.stat(target);
		if (tstats && tstats.isDirectory()) target = join(target, basename(mySource));
	} catch (err) {
		// noop
	}

	if (!await isWritable(target)) {
		if (options.errorOnExist) throw new Error(`FS-NEXTRA: ${target} already exists`);
		if (!options.overwrite) return;
		await remove(target);
	}

	if (stats.isSymbolicLink()) await fsp.symlink(await fsp.readlink(mySource), target);
	else await fsp.copyFile(mySource, target);
}
