const writeJSON = require('./writeJSON');

/**
 * Writes a Javascript Object to file as JSON atomicly.
 * @function writeJsonAtomic
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {Object} object The javascript object you would like to write to file
 * @param {JsonOptions} [options = {}] The options to pass JSON.stringify and writeFile
 * @returns {Promise<void>}
 */
/**
 * Writes a Javascript Object to file as JSON atomicly.
 * @function writeJSONAtomic
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {Object} object The javascript object you would like to write to file
 * @param {JsonOptions} [options = {}] The options to pass JSON.stringify and writeFile
 * @returns {Promise<void>}
 */
module.exports = async function writeJSONAtomic(file, object, options = {}) {
	return writeJSON(file, object, options, true);
};
