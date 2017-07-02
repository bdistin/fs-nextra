const createSymlink = require('./createSymlink');

/**
 * Creates a soft file link, making all folders required to satisfy the given file path atomicly.
 * @function ensureLinkAtomic
 * @param  {string} source The source path of the file
 * @param  {string} destination The destination path of the file
 * @param  {SymLinkType} [type] The type of symlink you are creating
 * @return {Promise<void>}
 */
/**
 * Creates a soft file link, making all folders required to satisfy the given file path atomicly.
 * @function createLinkAtomic
 * @param  {string} source The source path of the file
 * @param  {string} destination The destination path of the file
 * @param  {SymLinkType} [type] The type of symlink you are creating
 * @return {Promise<void>}
 */
module.exports = function createSymlinkAtomic(source, destination, type) {
	return createSymlink(source, destination, type, true);
};
