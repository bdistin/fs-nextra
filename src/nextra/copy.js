const { sep, resolve, dirname } = require('path');

const { ncp } = require('../util');
const { lstat } = require('../fs');

const mkdirs = require('./mkdirs');
const pathExists = require('./pathExists');

/**
 * @typedef {Object} CopyOptions
 * @memberof fsn/nextra
 * @property {Function} [filter = undefined] A filter function to determine which files to copy.
 * @property {boolean} [overwrite = true] Whether to overwrite files or not.
 * @property {boolean} [clobber = true] An alias for overwrite to provide parity to fs-extra.
 * @property {boolean} [preserveTimestamps = true] Whether or not to preserve timestamps on the files.
 */

/**
 * Copies files from one location to another, creating all directories required to satisfy the destination path.
 * source and destination paths.
 * @function copy
 * @memberof fsn/nextra
 * @param {string} source The source path
 * @param {string} destination The destination path
 * @param {CopyOptions|Function} [options = {}] Options for the copy, or a filter function
 * @returns {Promise<void>}
 */
module.exports = async function copy(source, destination, options = {}) {
	if (typeof options === 'function') options = { filter: options };
	const basePath = process.cwd();
	const currentPath = resolve(basePath, source);
	const targetPath = resolve(basePath, destination);
	if (currentPath === targetPath) throw new Error('Source and destination must not be the same.');
	const stats = await lstat(source);
	const dir = stats.isDirectory() ? destination.split(sep).slice(0, -1).join(sep) : dirname(destination);
	if (!await pathExists(dir)) await mkdirs(dir);
	return ncp(source, destination, options);
};
