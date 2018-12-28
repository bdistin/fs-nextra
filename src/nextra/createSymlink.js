const { dirname, join, isAbsolute, relative } = require('path');
const { symlink, lstat } = require('../fs');

const pathExists = require('./pathExists');
const mkdirs = require('./mkdirs');
const symlinkAtomic = require('./symlinkAtomic');

/**
 * Creates a soft file link, making all folders required to satisfy the given file path.
 * @function ensureSymlink
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {SymLinkType} [type] The type of symlink you are creating
 * @param {boolean} [atomic = false] Whether the operation should run atomically
 * @returns {Promise<void>}
 */
/**
 * Creates a soft file link, making all folders required to satisfy the given file path.
 * @function createSymlink
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {SymLinkType} [type] The type of symlink you are creating
 * @param {boolean} [atomic = false] Whether the operation should run atomically
 * @returns {Promise<void>}
 */
module.exports = async function createSymlink(source, destination, type, atomic = false) {
	if (await pathExists(destination)) return;
	if (typeof type === 'boolean') [atomic, type] = [type, undefined];

	await mkdirs(dirname(destination));
	const relativePath = await symlinkPaths(source, destination);

	const symlinkMethod = atomic ? symlinkAtomic : symlink;
	await symlinkMethod(relativePath.toDst, destination, type || await symlinkType(relativePath.toCwd));
};

const symlinkPaths = async (srcpath, dstpath) => {
	if (isAbsolute(srcpath)) {
		await lstat(srcpath);
		return { toCwd: srcpath, toDst: srcpath };
	}
	const dstdir = dirname(dstpath);
	const relativeToDst = join(dstdir, srcpath);
	if (await pathExists(relativeToDst)) return { toCwd: relativeToDst, toDst: srcpath };
	await lstat(srcpath);
	return { toCwd: srcpath, toDst: relative(dstdir, srcpath) };
};

const symlinkType = async (srcpath) => {
	try {
		const stats = await lstat(srcpath);
		return stats.isDirectory() ? 'dir' : 'file';
	} catch (err) {
		// Windows
		/* istanbul ignore next */
		return 'file';
	}
};
