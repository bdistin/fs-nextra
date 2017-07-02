const { dirname } = require('path');

const { symlinkPaths, symlinkType } = require('../util');
const { symlink } = require('../fs');

const pathExists = require('./pathExists');
const mkdirs = require('./mkdirs');
const symlinkAtomic = require('./symlinkAtomic');

/**
 * The type of symlink you are creating:
 * * `dir`
 * * `file`
 * @typedef {string} SymLinkType
 */

/**
 * Creates a sof file link, making all folders required to satisfy the given file path.
 * @function ensureSymlink
 * @param  {string} source The source path of the file
 * @param  {string} destination The destination path of the file
 * @param  {SymLinkType} [type] The type of symlink you are creating
 * @param  {boolean} [atomic = false] Whether the operation should run atomicly
 * @return {Promise<void>}
 */
/**
 * Creates a sof file link, making all folders required to satisfy the given file path.
 * @function createSymlink
 * @param  {string} source The source path of the file
 * @param  {string} destination The destination path of the file
 * @param  {SymLinkType} [type] The type of symlink you are creating
 * @param  {boolean} [atomic = false] Whether the operation should run atomicly
 * @return {Promise<void>}
 */
module.exports = async function createSymlink(source, destination, type, atomic = false) {
	if (await pathExists(destination)) return null;
	const relativePath = await symlinkPaths(source, destination);
	source = relativePath.todestination;
	if (typeof type === 'boolean') {
		atomic = type;
		type = undefined;
	}
	const type2 = await symlinkType(relativePath.toCwd, type);
	const dir = dirname(destination);
	if (!await pathExists(dir)) await mkdirs(dir);
	return atomic ? symlinkAtomic(source, destination, type2) : symlink(source, destination, type2);
};
