const createFile = require('./createFile');

/**
 * Creates an empty file, making all folders required to satisfy the given file path atomicly.
 * @function ensureFileAtomic
 * @param  {string} file Path of the file you want to create
 * @return {Promise<void>}
 */
/**
 * Creates an empty file, making all folders required to satisfy the given file path atomicly.
 * @function createFileAtomic
 * @param  {string} file Path of the file you want to create
 * @return {Promise<void>}
 */
module.exports = function createFileAtomic(file) {
	return createFile(file, true);
};
