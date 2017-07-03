const { tempFile } = require('../util');
const { writeFile } = require('../fs');

const move = require('./move');

/**
 * @typedef writeOptions
 * @property {string} [encoding = 'utf8'] The file encoding
 * @property {integer} [mode = 0o666] The chmod
 * @property {string} [flag = 'w'] The flag
 */

/**
 * @function writeFileAtomic
 * @param  {string} file The path to the file you want to create
 * @param  {string|Buffer|Uint8Array} data The data to write to file
 * @param  {writeOptions|string} [options] The write options or the encoding string.
 * @return {type} {description}
 */
module.exports = async function writeFileAtomic(file, data, options) {
	const tempPath = tempFile();
	await writeFile(tempPath, data, options);
	return move(tempPath, file, { overwrite: true });
};
