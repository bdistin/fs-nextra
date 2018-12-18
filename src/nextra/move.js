const { resolve, dirname } = require('path');

const { isSrcKid } = require('../util');
const { access, rename, stat } = require('../fs');

const remove = require('./remove');
const mkdirs = require('./mkdirs');
const pathExists = require('./pathExists');
const copy = require('./copy');

/**
 * @typedef {Object} MoveOptions
 * @memberof fsn/nextra
 * @property {boolean} [overwrite = false] Should the move overwrite an identical file at the destination path
 */

/**
 * @function move
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {MoveOptions} [options={}] The options for the move
 * @returns {Promise<void>}
 */
module.exports = async function move(source, destination, options = {}) {
	const overwrite = options.overwrite || false;
	if (resolve(source) === resolve(destination)) return access(source);

	const myStat = await stat(source);
	if (myStat.isDirectory() && isSrcKid(source, destination)) {
		throw new Error('FS-NEXTRA: Moving a parent directory into a child will result in an infinite loop.');
	}

	await mkdirs(dirname(destination));

	if (overwrite) {
		await remove(destination);
	} else if (await pathExists(destination)) {
		throw new Error('FS-NEXTRA: Destination already exists.');
	}

	try {
		return await rename(source, destination);
	} catch (err) {
		if (err.code === 'EXDEV') {
			const opts = {
				overwrite,
				errorOnExist: true
			};

			await copy(source, destination, opts);
			return remove(source);
		}
		throw err;
	}
};
