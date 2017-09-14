const { dirname } = require('path');

const { copyFile } = require('../fs');

const copyFileAtomic = require('./copyFileAtomic');
const mkdirs = require('./mkdirs');
const pathExists = require('./pathExists');

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
 * @function createFileCopy
 * @memberof fsn/nextra
 * @param  {string} source The path to the file you want to copy
 * @param  {string} destination The path to the file destination
 * @param  {writeOptions|string} [options] The write options or the encoding string.
 * @param  {boolean} [atomic = false] Whether the operation should run atomicly
 * @return {Promise<void>}
 */
module.exports = async function createFileCopy(source, destination, options, atomic = false) {
	const dir = dirname(destination);
	if (!await pathExists(dir)) await mkdirs(dir);
	return atomic ? copyFileAtomic(source, destination, options) : copyFile(source, destination, options);
};
