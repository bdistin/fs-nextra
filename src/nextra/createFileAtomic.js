const createFile = require('./createFile');

/**
 * Creates an file copy, making all folders required to satisfy the given file path atomicly.
 * @function ensureFileAtomic
 * @memberof fsn/nextra
 * @param  {string} file Path of the file you want to create
 * @return {Promise<void>}
 */
/**
 * Creates an file copy, making all folders required to satisfy the given file path atomicly.
 * @function createFileAtomic
 * @memberof fsn/nextra
 * @param  {string} file Path of the file you want to create
 * @return {Promise<void>}
 */
module.exports = function createFileAtomic(file) {
	return createFile(file, true);
};
