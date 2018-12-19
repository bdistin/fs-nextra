const { resolve, dirname, join, basename } = require('path');

const { replaceEsc, isSrcKid } = require('../util');
const { access, readlink, mkdir, symlink, copyFile, lstat, stat, chmod, readdir } = require('../fs');

const mkdirs = require('./mkdirs');
const remove = require('./remove');

/**
 * @typedef {Object} CopyOptions
 * @memberof fsn/nextra
 * @property {Function} [filter = undefined] A filter function to determine which files to copy.
 * @property {boolean} [overwrite = true] Whether to overwrite files or not.
 * @property {boolean} [preserveTimestamps = true] Whether or not to preserve timestamps on the files.
 * @property {boolean} [errorOnExist = false] Whether or not to error if the destination exists
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
	options = resolveCopyOptions(source, destination, options);

	if (resolve(source) === resolve(destination)) {
		if (options.errorOnExist) throw new Error('Source and destination must not be the same.');
		return access(source);
	}

	await mkdirs(dirname(destination));
	return startCopy(source, options);
};

const resolveCopyOptions = (source, destination, options) => {
	if (typeof options === 'function') options = { filter: options };
	options.currentPath = resolve(source);
	options.targetPath = resolve(destination);
	options.filter = typeof options.filter === 'function' ? options.filter : () => true;
	options.overwrite = 'overwrite' in options ? Boolean(options.overwrite) : true;
	options.preserveTimestamps = Boolean(options.preserveTimestamps);
	options.errorOnExist = Boolean(options.errorOnExist);
	return options;
};

const isWritable = async (myPath) => {
	try {
		await lstat(myPath);
		return false;
	} catch (err) {
		return err.code === 'ENOENT';
	}
};

const startCopy = async (mySource, options) => {
	if (!options.filter(mySource, options.targetPath)) return;
	const stats = await lstat(mySource);
	let target = mySource.replace(options.currentPath, replaceEsc(options.targetPath));

	if (stats.isDirectory()) {
		if (isSrcKid(mySource, target)) throw new Error('FS-NEXTRA: Copying a parent directory into a child will result in an infinite loop.');
		if (await isWritable(target)) {
			await mkdir(target, stats.mode);
			await chmod(target, stats.mode);
		}
		const items = await readdir(mySource);
		await Promise.all(items.map(item => startCopy(join(mySource, item), options)));
	} else if (stats.isFile() || stats.isCharacterDevice() || stats.isBlockDevice() || stats.isSymbolicLink()) {
		try {
			const tstats = await stat(target);
			if (tstats && tstats.isDirectory()) target = join(target, basename(mySource));
		} catch (err) {
			// noop
		}

		if (!await isWritable(target)) {
			if (options.errorOnExist) throw new Error(`FS-NEXTRA: ${target} already exists`);
			if (!options.overwrite) return;
			await remove(target);
		}

		if (stats.isSymbolicLink()) await symlink(await readlink(mySource), target);
		else await copyFile(mySource, target, options);
	}
};
