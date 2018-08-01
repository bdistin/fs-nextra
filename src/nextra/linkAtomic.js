const { tempFile } = require('../util');
const { link } = require('../fs');

const move = require('./move');

/**
 * Creates a hard file link atomicaly.
 * @function linkAtomic
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @returns {Promise<void>}
 */
module.exports = async function linkAtomic(source, destination) {
	const tempPath = tempFile();
	await link(source, tempPath);
	return move(tempPath, destination, { overwrite: true });
};
