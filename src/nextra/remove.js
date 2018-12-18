const { join } = require('path');

const { isWindows, setTimeoutPromise } = require('../util');
const { lstat, unlink, rmdir, stat, chmod, readdir } = require('../fs');

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
	if (typeof path !== 'string') throw new Error('Path should be a string');
	let busyTries = 0;

	options.maxBusyTries = options.maxBusyTries || 3;

	return rimraf(path, options)
		.catch(async (er) => {
			// Windows
			/* istanbul ignore next */
			if (isWindows && (er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') && busyTries < options.maxBusyTries) {
				busyTries++;
				const time = busyTries * 100;
				await setTimeoutPromise(time);
				return rimraf(path, options);
			}

			// Hard to test via travis, such as ENOMEM (running the kernel out of memory)
			/* istanbul ignore else */
			if (er.code === 'ENOENT') return null;
			else throw er;
		});
};

const rimraf = async (myPath, options) => {
	const stats = await lstat(myPath).catch(er => {
		// Windows
		/* istanbul ignore if */
		if (er && er.code === 'EPERM' && isWindows) return fixWinEPERM(myPath, options, er);
		throw er;
	});

	if (stats && stats.isDirectory()) return removeDir(myPath, options, null);

	return unlink(myPath).catch(er => {
		// Windows
		/* istanbul ignore next */
		if (er.code === 'EPERM') return isWindows ? fixWinEPERM(myPath, options, er) : removeDir(myPath, options, er);
		// Difficult to reproduce
		/* istanbul ignore next */
		if (er.code === 'EISDIR') return removeDir(myPath, options, er);
		throw er;
	});
};


// Windows
/* istanbul ignore next */
const fixWinEPERM = async (myPath, options, err) => {
	await chmod(myPath, 666).catch(er => { throw er.code === 'ENOENT' ? null : err; });
	const stats = await stat(myPath).catch(er => { throw er.code === 'ENOENT' ? null : err; });
	if (stats.isDirectory()) return this.removeDir(myPath, options, err);
	return unlink(myPath);
};

const removeDir = async (myPath, options, originalEr) => rmdir(myPath).catch(er => {
	if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) return rmkids(myPath, options);
	if (er && er.code === 'ENOTDIR') throw originalEr;
	throw er;
});

const rmkids = async (myPath, options) => {
	const files = await readdir(myPath);
	if (!files.length) return rmdir(myPath);
	return Promise.all(files.map(file => remove(join(myPath, file), options)))
		.then(() => rmdir(myPath));
};
