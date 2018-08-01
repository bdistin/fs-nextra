const { tempFile } = require('../util');
const { copyFile } = require('../fs');

const move = require('./move');

/**
 * @function copyFileAtomic
 * @memberof fsn/nextra
 * @param {string} source The path to the file you want to copy
 * @param {string} destination The path to the file destination
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @returns {Promise<void>} {description}
 */
module.exports = async function copyFileAtomic(source, destination, options) {
	const tempPath = tempFile();
	await copyFile(source, tempPath, options);
	return move(tempPath, destination, { overwrite: true });
};
