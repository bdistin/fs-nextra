import { join } from 'path';

import { isWindows, setTimeoutPromise } from '../utils/util';
import { lstat, unlink, rmdir, chmod, readdir } from '../fs';

/**
 * @typedef {Object} RemoveOptions
 * @memberof fsn/nextra
 * @property {number} [maxBusyTries = 3] The number of times fs-nextra should retry removing a busy file.
 */
export interface RemoveOptions {
	maxBusyTries?: number;
}

/**
 * Recursively deletes directories and files.
 * @function remove
 * @memberof fsn/nextra
 * @param path The path to remove
 * @param options The remove options
 */
export default async function remove(path: string, options: RemoveOptions = {}): Promise<void> {
	options.maxBusyTries = typeof options.maxBusyTries === 'undefined' ? 3 : options.maxBusyTries;

	for (let buysTries = 0; buysTries < options.maxBusyTries; buysTries++) {
		try {
			await rimraf(path, options);
			break;
		} catch (err) {
			/* istanbul ignore next: Windows */
			if (isWindows && (err.code === 'EBUSY' || err.code === 'ENOTEMPTY' || err.code === 'EPERM')) {
				await setTimeoutPromise(buysTries * 100);
				continue;
			}
			/* istanbul ignore else: Hard to test via CI, such as ENOMEM (running the kernel out of memory) */
			if (err.code === 'ENOENT') return;
			else throw err;
		}
	}
}

const rimraf = async (myPath: string, options: RemoveOptions): Promise<void> => {
	try {
		const stats = await lstat(myPath);
		if (stats.isDirectory()) return removeDir(myPath, options);
	} catch (err) {
		/* istanbul ignore next: Windows */
		if (isWindows && err.code === 'EPERM') return fixWinEPERM(myPath, options);
		throw err;
	}

	try {
		return await unlink(myPath);
	} catch (er) {
		/* istanbul ignore next: Windows */
		if (er.code === 'EPERM') return isWindows ? fixWinEPERM(myPath, options) : removeDir(myPath, options, er);
		/* istanbul ignore next: Difficult to reproduce */
		if (er.code === 'EISDIR') return removeDir(myPath, options, er);
		else throw er;
	}
};

/* istanbul ignore next: Windows */
const fixWinEPERM = async (myPath: string, options: RemoveOptions): Promise<void> => {
	await chmod(myPath, 0o666);
	return rimraf(myPath, options);
};

const removeDir = async (myPath: string, options: RemoveOptions, originalEr = null): Promise<void> => {
	try {
		return await rmdir(myPath);
	} catch (err) {
		/* istanbul ignore else: Difficult to reproduce */
		if (['ENOTEMPTY', 'EEXIST', 'EPERM'].includes(err.code)) return rmkids(myPath, options);
		else if (err.code === 'ENOTDIR') throw originalEr;
		else throw err;
	}
};

const rmkids = async (myPath: string, options: RemoveOptions): Promise<void> => {
	const files = await readdir(myPath);
	await Promise.all(files.map((file): Promise<void> => remove(join(myPath, file), options)));
	return rmdir(myPath);
};
