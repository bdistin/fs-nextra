import { resolve, dirname } from 'path';
import { promises as fsp } from 'fs';

import { isWindows, invalidWin32Path, umask } from '../utils/util';

/**
 * @typedef {Object} MkdirsOptions
 * @memberof fsn/nextra
 * @property {number} [mode = 0o777 & ~process.umask()] The chmod for the directories being made
 */
export interface MkdirsOptions {
	mode?: number;
}

/**
 * Recursively makes directories, until the directory passed exists.
 * @function ensureDir
 * @memberof fsn/nextra
 * @param path The path you wish to make
 * @param options Options for making the directories
 */
/**
 * Recursively makes directories, until the directory passed exists.
 * @function mkdirp
 * @memberof fsn/nextra
 * @param path The path you wish to make
 * @param options Options for making the directories
 */
/**
 * Recursively makes directories, until the directory passed exists.
 * @function mkdirs
 * @memberof fsn/nextra
 * @param path The path you wish to make
 * @param options Options for making the directories
 */
export async function mkdirs(path: string, options?: MkdirsOptions | number): Promise<void> {
	const dirOptions = resolveOptions(options);

	if (isWindows && invalidWin32Path(path)) {
		const errInval = new Error(`FS-NEXTRA: ${path} contains invalid WIN32 path characters.`);
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		errInval.code = 'EINVAL';
		throw errInval;
	}

	path = resolve(path);

	try {
		await fsp.mkdir(path, dirOptions.mode);
	} catch (err) {
		if (err.code === 'ENOENT') {
			await mkdirs(dirname(path), dirOptions);
			await mkdirs(path, dirOptions);
			return;
		}
		const myStat = await fsp.stat(path);
		if (myStat.isDirectory()) return;
		throw err;
	}
}

function resolveOptions(options: MkdirsOptions | number = {}): MkdirsOptions {
	return {
		// eslint-disable-next-line no-bitwise
		mode: typeof options === 'number' ? options : options.mode || 0o0777 & ~umask
	};
}

export const mkdirp = mkdirs;
export const ensureDir = mkdirs;
