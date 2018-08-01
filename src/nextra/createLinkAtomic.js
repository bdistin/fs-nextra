const createLink = require('./createLink');

/**
 * Creates a hard file link, making all folders required to satisfy the given file path atomicly.
 * @function ensureLinkAtomic
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @returns {Promise<void>}
 */
/**
 * Creates a hard file link, making all folders required to satisfy the given file path atomicly.
 * @function createLinkAtomic
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @returns {Promise<void>}
 */
module.exports = function createLinkAtomic(source, destination) {
	return createLink(source, destination, true);
};
