const { tempFile } = require('../util');
const { copyFile } = require('../fs');

const move = require('./move');

/**
 * @typedef writeOptions
 * @memberof fsn/nextra
 * @property {string} [encoding = 'utf8'] The file encoding
 * @property {integer} [mode = 0o666] The chmod
 * @property {string} [flag = 'w'] The flag
 */

/**
 * @function copyFileAtomic
 * @memberof fsn/nextra
 * @param  {string} source The path to the file you want to copy
 * @param  {string} destination The path to the file destination
 * @param  {writeOptions|string} [options] The write options or the encoding string.
 * @return {type} {description}
 */
module.exports = async function copyFileAtomic(source, destination, options) {
	const tempPath = tempFile();
	await copyFile(source, tempPath, options);
	return move(tempPath, destination, { overwrite: true });
};
