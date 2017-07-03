const { rimraf_, isWindows, setTimeoutPromise } = require('../util');

/**
 * @typedef {object} removeOptions
 * @property {integer} [maxBusyTries = 3] The number of times fs-nextra should retry removing a busy file.
 */

/**
 * Removes a single file or single directory with no children.
 * @function remove
 * @param  {string} path The path to remove
 * @param  {removeOptions} [options = {}] {description}
 * @return {Promise<void>}
 */
module.exports = async function remove(path, options = {}) {
	if (typeof path !== 'string') throw new Error('Path should be a string');
	let busyTries = 0;

	options.maxBusyTries = options.maxBusyTries || 3;

	return rimraf_(path, options)
		.catch(async (er) => {
			if (isWindows && (er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') && busyTries < options.maxBusyTries) {
				busyTries++;
				const time = busyTries * 100;
				await setTimeoutPromise(time);
				return rimraf_(path, options);
			}
			if (er.code === 'ENOENT') return null;
			throw er;
		});
};
