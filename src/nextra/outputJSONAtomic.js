const outputJSON = require('./outputJSON');

/**
 * Writes a json file to disk, creating all directories needed to meet the filepath provided atomicly.
 * @function outputJsonAtomic
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {Object|Array} data The data to write to file
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @returns {Promise<void>}
 */
/**
 * Writes a json file to disk, creating all directories needed to meet the filepath provided atomicly.
 * @function outputJSONAtomic
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {Object|Array} data The data to write to file
 * @param {WriteOptions|string} [options] The write options or the encoding string.
 * @returns {Promise<void>}
 */
module.exports = function outputJSONAtomic(file, data, options) {
	return outputJSON(file, data, options, true);
};
