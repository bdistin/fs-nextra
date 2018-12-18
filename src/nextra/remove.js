const util = require('../util');

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
module.exports = async function remove(path, options = {}) {
	if (typeof path !== 'string') throw new Error('Path should be a string');
	let busyTries = 0;

	options.maxBusyTries = options.maxBusyTries || 3;

	return util.rimraf(path, options)
		.catch(async (er) => {
			// Windows
			/* istanbul ignore next */
			if (util.isWindows && (er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') && busyTries < options.maxBusyTries) {
				busyTries++;
				const time = busyTries * 100;
				await util.setTimeoutPromise(time);
				return util.rimraf(path, options);
			}

			// Hard to test via travis, such as ENOMEM (running the kernel out of memory)
			/* istanbul ignore else */
			if (er.code === 'ENOENT') return null;
			else throw er;
		});
};
