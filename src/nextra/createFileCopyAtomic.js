const createFileCopy = require('./createFileCopy');

/**
 * Creates an empty file, making all folders required to satisfy the given file path.
 * @function ensureFile
 * @memberof fsn/nextra
 * @param  {string} file Path of the file you want to create
 * @param  {boolean} [atomic = false] Whether the operation should run atomicly
 * @return {Promise<void>}
 */

/**
 * Creates an empty file, making all folders required to satisfy the given file path.
 * @function createFile
 * @memberof fsn/nextra
 * @param  {string} source The path to the file you want to copy
 * @param  {string} destination The path to the file destination
 * @param  {writeOptions|string} [options] The write options or the encoding string.
 * @return {Promise<void>}
 */
module.exports = async function createFile(source, destination, options) {
	return createFileCopy(source, destination, options, true);
};
