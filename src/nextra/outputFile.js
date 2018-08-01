const { dirname } = require('path');

const { writeFile } = require('../fs');

const writeFileAtomic = require('./writeFileAtomic');
const mkdirs = require('./mkdirs');
const pathExists = require('./pathExists');

/**
 * Writes a file to disk, creating all directories needed to meet the filepath provided.
 * @function outputFile
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {string|Buffer|Uint8Array} data The data to write to file
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @param {boolean} [atomic = false] {description}
 * @returns {Promise<void>}
 */
module.exports = async function outputFile(file, data, options, atomic = false) {
	if (typeof options === 'boolean') {
		atomic = options;
		options = {};
	}
	const dir = dirname(file);
	if (!await pathExists(dir)) await mkdirs(dir);
	return atomic ? writeFileAtomic(file, data, options) : writeFile(file, data, options);
};
