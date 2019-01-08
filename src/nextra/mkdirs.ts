import { resolve, dirname, normalize, sep } from 'path';

import { isWindows } from '../util';
import { stat, mkdir } from '../fs';

/**
 * @typedef {Object} MkdirsOptions
 * @memberof fsn/nextra
 * @property {number} [mode = 0o777 & ~process.umask()] The chmod for the directories being made
 */
interface MkdirsOptions {
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
export default async function mkdirs(path: string, options?: MkdirsOptions | number): Promise<void> {
	const dirOptions = resolveOptions(options);

	// Windows
	/* istanbul ignore next */
	if (isWindows && invalidWin32Path(path)) {
		const errInval = new Error(`FS-NEXTRA: ${path} contains invalid WIN32 path characters.`);
		// @ts-ignore
		errInval.code = 'EINVAL';
		throw errInval;
	}

	// eslint-disable-next-line no-bitwise
	const mode = dirOptions.mode || 0o0777 & ~process.umask();
	path = resolve(path);

	try {
		await mkdir(path, mode);
	} catch (err) {
		if (err.code === 'ENOENT') {
			await mkdirs(dirname(path), dirOptions);
			await mkdirs(path, dirOptions);
			return;
		}
		const myStat = await stat(path);
		if (myStat.isDirectory()) return;
		throw err;
	}
};

const resolveOptions = (options: MkdirsOptions | number = {}): MkdirsOptions => {
	return {
		mode: typeof options === 'number' ? options : options.mode || 0o0777 & ~process.umask()
	};
};

// Windows
/* istanbul ignore next */
const invalidWin32Path = (myPath: string): boolean => {
	const root = normalize(resolve(myPath)).split(sep);
	const rp = root.length > 0 ? root[0] : null;
	return /[<>:"|?*]/.test(myPath.replace(rp, ''));
};
