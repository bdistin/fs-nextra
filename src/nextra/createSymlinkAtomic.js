const createSymlink = require('./createSymlink');

/**
 * Creates a soft file link, making all folders required to satisfy the given file path atomicly.
 * @function ensureSymlinkAtomic
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {SymLinkType} [type] The type of symlink you are creating
 * @returns {Promise<void>}
 */
/**
 * Creates a soft file link, making all folders required to satisfy the given file path atomicly.
 * @function createSymlinkAtomic
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {SymLinkType} [type] The type of symlink you are creating
 * @returns {Promise<void>}
 */
module.exports = function createSymlinkAtomic(source, destination, type) {
	return createSymlink(source, destination, type, true);
};
