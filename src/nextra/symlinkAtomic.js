const { tempFile } = require('../util');
const { symlink } = require('../fs');

const move = require('./move');

/**
 * The type of symlink you are creating:
 * * `dir`
 * * `file`
 * * `junction`
 * @typedef {string} SymLinkType
 * @memberof fsn/nextra
 */

/**
 * Creates a soft file link atomicly.
 * @function symlinkAtomic
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {SymLinkType} [type = 'file'] The type of symlink you are creating
 * @returns {Promise<void>} {description}
 */
module.exports = async function symlinkAtomic(source, destination, type) {
	const tempPath = tempFile();
	await symlink(source, tempPath, type);
	return move(tempPath, destination, { overwrite: false });
};
