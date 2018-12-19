const { join } = require('path');

const { readdir } = require('../fs');

const mkdirs = require('./mkdirs');
const remove = require('./remove');

/**
 * Deletes all directories and files within the provided directory.
 * @function emptydir
 * @memberof fsn/nextra
 * @param {string} dir The directory you wish to empty
 * @returns {Promise<void>}
 */
/**
 * Deletes all directories and files within the provided directory.
 * @function emptyDir
 * @memberof fsn/nextra
 * @param {string} dir The directory you wish to empty
 */
module.exports = async function emptyDir(dir) {
	try {
		const items = await readdir(dir);
		await Promise.all(items.map(item => remove(join(dir, item))));
	} catch (err) {
		await mkdirs(dir);
	}
};
