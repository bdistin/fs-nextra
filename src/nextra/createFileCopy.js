const { dirname, resolve } = require('path');

const { access, copyFile } = require('../fs');

const copyFileAtomic = require('./copyFileAtomic');
const mkdirs = require('./mkdirs');

/**
 * Creates an file copy, making all folders required to satisfy the given file path.
 * @function ensureFileCopy
 * @memberof fsn/nextra
 * @param {string} source The path to the file you want to copy
 * @param {string} destination The path to the file destination
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @param {boolean} [atomic = false] Whether the operation should run atomically
 * @returns {Promise<void>}
 */
/**
 * Creates an file copy, making all folders required to satisfy the given file path.
 * @function createFileCopy
 * @memberof fsn/nextra
 * @param {string} source The path to the file you want to copy
 * @param {string} destination The path to the file destination
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @param {boolean} [atomic = false] Whether the operation should run atomically
 * @returns {Promise<void>}
 */
module.exports = async function createFileCopy(source, destination, options, atomic = false) {
	if (resolve(source) === resolve(destination)) {
		await access(source);
		return;
	}

	await mkdirs(dirname(destination));

	if (atomic) await copyFileAtomic(source, destination, options);
	else await copyFile(source, destination, options);
};
