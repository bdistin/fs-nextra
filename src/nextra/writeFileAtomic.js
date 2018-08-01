const { tempFile } = require('../util');
const { writeFile } = require('../fs');

const move = require('./move');

/**
 * @typedef {Object} WriteOptions
 * @memberof fsn/nextra
 * @property {string} [encoding = 'utf8'] The file encoding
 * @property {number} [mode = 0o666] The chmod
 * @property {string} [flag = 'w'] The flag
 */

/**
 * @function writeFileAtomic
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {string|Buffer|Uint8Array} data The data to write to file
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @returns {Promise<void>}
 */
module.exports = async function writeFileAtomic(file, data, options) {
	const tempPath = tempFile();
	await writeFile(tempPath, data, options);
	return move(tempPath, file, { overwrite: true });
};
