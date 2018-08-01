const { dirname } = require('path');

const { copyFile } = require('../fs');

const copyFileAtomic = require('./copyFileAtomic');
const mkdirs = require('./mkdirs');
const pathExists = require('./pathExists');

/**
 * Creates an file copy, making all folders required to satisfy the given file path.
 * @function ensureFileCopy
 * @memberof fsn/nextra
 * @param {string} source The path to the file you want to copy
 * @param {string} destination The path to the file destination
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @param {boolean} [atomic = false] Whether the operation should run atomicly
 * @returns {Promise<void>}
 */
/**
 * Creates an file copy, making all folders required to satisfy the given file path.
 * @function createFileCopy
 * @memberof fsn/nextra
 * @param {string} source The path to the file you want to copy
 * @param {string} destination The path to the file destination
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @param {boolean} [atomic = false] Whether the operation should run atomicly
 * @returns {Promise<void>}
 */
module.exports = async function createFileCopy(source, destination, options, atomic = false) {
	const dir = dirname(destination);
	if (!await pathExists(dir)) await mkdirs(dir);
	return atomic ? copyFileAtomic(source, destination, options) : copyFile(source, destination, options);
};
