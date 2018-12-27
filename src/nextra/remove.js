const { join } = require('path');

const { isWindows, setTimeoutPromise } = require('../util');
const { lstat, unlink, rmdir, chmod, readdir } = require('../fs');

/**
 * @typedef {Object} RemoveOptions
 * @memberof fsn/nextra
 * @property {number} [maxBusyTries = 3] The number of times fs-nextra should retry removing a busy file.
 */

/**
 * Removes a single file or single directory with no children.
 * @function remove
 * @memberof fsn/nextra
 * @param {string} path The path to remove
 * @param {RemoveOptions} [options = {}] {description}
 * @returns {Promise<void>}
 */
const remove = module.exports = async function remove(path, options = {}) {
	if (typeof path !== 'string') throw new Error('FS-NEXTRA: Path should be a string');
	options.maxBusyTries = typeof options.maxBusyTries === 'undefined' ? 3 : options.maxBusyTries;

	for (let buysTries = 0; buysTries < options.maxBusyTries; buysTries++) {
		try {
			await rimraf(path, options);
			break;
		} catch (err) {
			// Windows
			/* istanbul ignore next */
			if (isWindows && (err.code === 'EBUSY' || err.code === 'ENOTEMPTY' || err.code === 'EPERM')) {
				await setTimeoutPromise(buysTries * 100);
				continue;
			}
			// Hard to test via travis, such as ENOMEM (running the kernel out of memory)
			/* istanbul ignore else */
			if (err.code === 'ENOENT') return;
			else throw err;
		}
	}
};

const rimraf = async (myPath, options) => {
	try {
		const stats = await lstat(myPath);
		if (stats.isDirectory()) return removeDir(myPath, options);
	} catch (err) {
		// Windows
		/* istanbul ignore next */
		if (isWindows && err.code === 'EPERM') return fixWinEPERM(myPath, options);
		throw err;
	}

	try {
		return await unlink(myPath);
	} catch (er) {
		// Windows
		/* istanbul ignore next */
		if (er.code === 'EPERM') return isWindows ? fixWinEPERM(myPath, options) : removeDir(myPath, options, er);
		// Difficult to reproduce
		/* istanbul ignore next */
		if (er.code === 'EISDIR') return removeDir(myPath, options, er);
		else throw er;
	}
};

// Windows
/* istanbul ignore next */
const fixWinEPERM = async (myPath, options) => {
	await chmod(myPath, 0o666);
	return rimraf(myPath, options);
};

const removeDir = async (myPath, options, originalEr = null) => {
	try {
		return await rmdir(myPath);
	} catch (err) {
		// Difficult to reproduce
		/* istanbul ignore else */
		if (['ENOTEMPTY', 'EEXIST', 'EPERM'].includes(err.code)) return rmkids(myPath, options);
		else if (err.code === 'ENOTDIR') throw originalEr;
		else throw err;
	}
};

const rmkids = async (myPath, options) => {
	const files = await readdir(myPath);
	await Promise.all(files.map(file => remove(join(myPath, file), options)));
	return rmdir(myPath);
};
