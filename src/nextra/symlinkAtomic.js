const { tempFile } = require('../util');
const { symlink } = require('../fs');

const move = require('./move');

/**
 * The type of symlink you are creating:
 * * `dir`
 * * `file`
 * @typedef {string} SymLinkType
 */

/**
 * Creates a soft file link atomicly.
 * @function symlinkAtomic
 * @param  {string} source The source path of the file
 * @param  {string} destination The destination path of the file
 * @param  {SymLinkType} type The type of symlink you are creating
 * @return {Promise<void>} {description}
 */
module.exports = async function symlinkAtomic(source, destination, type) {
	const tempPath = tempFile();
	await symlink(source, tempPath, type);
	return move(tempPath, destination, { overwrite: true });
};
