const createFileCopy = require('./createFileCopy');

/**
 * Creates a file copy atomically, making all folders required to satisfy the given file path.
 * @function ensureFileCopyAtomic
 * @memberof fsn/nextra
 * @param  {string} source The path to the file you want to copy
 * @param  {string} destination The path to the file destination
 * @param  {writeOptions|string} [options] The write options or the encoding string.
 * @return {Promise<void>}
 */
/**
 * Creates a file copy atomically, making all folders required to satisfy the given file path.
 * @function createFileCopyAtomic
 * @memberof fsn/nextra
 * @param  {string} source The path to the file you want to copy
 * @param  {string} destination The path to the file destination
 * @param  {writeOptions|string} [options] The write options or the encoding string.
 * @return {Promise<void>}
 */
module.exports = async function createFileCopyAtomic(source, destination, options) {
	return createFileCopy(source, destination, options, true);
};
