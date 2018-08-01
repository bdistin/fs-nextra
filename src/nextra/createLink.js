const { dirname } = require('path');

const { lstat, link } = require('../fs');

const linkAtomic = require('./linkAtomic');
const mkdirs = require('./mkdirs');
const pathExists = require('./pathExists');

/**
 * Creates a hard file link, making all folders required to satisfy the given file path.
 * @function ensureLink
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {boolean} [atomic = false] Whether the operation should run atomicly
 * @returns {Promise<void>}
 */
/**
 * Creates a hard file link, making all folders required to satisfy the given file path.
 * @function createLink
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {boolean} [atomic = false] Whether the operation should run atomicly
 * @returns {Promise<void>}
 */
module.exports = async function createLink(source, destination, atomic = false) {
	if (await pathExists(destination)) return null;
	await lstat(source).catch(err => { throw err.message.replace('lstat', 'ensureLink'); });
	const dir = dirname(destination);
	if (!await pathExists(dir)) await mkdirs(dir);
	return atomic ? linkAtomic(source, destination) : link(source, destination);
};
