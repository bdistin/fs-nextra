const outputFile = require('./outputFile');

/**
 * Writes a file to disk, creating all directories needed to meet the filepath provided atomicly.
 * @function outputFileAtomic
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {string|Buffer|Uint8Array} data The data to write to file
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @returns {Promise<void>}
 */
module.exports = function outputFileAtomic(file, data, options) {
	return outputFile(file, data, options, true);
};
