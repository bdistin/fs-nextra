const { join } = require('path');

const { readdir } = require('../fs');

const mkdirs = require('./mkdirs');
const remove = require('./remove');

/**
 * Deletes all directories and files within the provided directory.
 * @function emptydir
 * @param  {string} dir The directory you wish to empty
 * @return {Promise<void>}
 */
/**
 * Deletes all directories and files within the provided directory.
 * @function emptyDir
 * @param  {string} dir The directory you wish to empty
 * @return {Promise<void>}
 */
module.exports = async function emptyDir(dir) {
	const items = await readdir(dir).catch(() => mkdirs(dir));
	return Promise.all(items.map(item => remove(join(dir, item))));
};
