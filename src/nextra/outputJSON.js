const { dirname } = require('path');

const writeJSON = require('./writeJSON');
const mkdirs = require('./mkdirs');
const pathExists = require('./pathExists');


/**
 * Writes a json file to disk, creating all directories needed to meet the filepath provided.
 * @function outputJson
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {Object|Array} data The data to write to file
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @param {boolean} [atomic = false] {description}
 * @returns {Promise<void>}
 */
/**
 * Writes a json file to disk, creating all directories needed to meet the filepath provided.
 * @function outputJSON
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {Object|Array} data The data to write to file
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @param {boolean} [atomic = false] {description}
 * @returns {Promise<void>}
 */
module.exports = async function outputJSON(file, data, options, atomic = false) {
	if (typeof options === 'boolean') {
		atomic = options;
		options = {};
	}
	const dir = dirname(file);
	if (!await pathExists(dir)) await mkdirs(dir);
	return writeJSON(file, data, options, atomic);
};
