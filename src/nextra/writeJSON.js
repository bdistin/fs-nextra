const { writeFile } = require('../fs');

const writeFileAtomic = require('./writeFileAtomic');

/**
 * @typedef {Object} jsonOptions
 * @property {Function} [replacer] A JSON.stringify replacer function
 * @property {integer} [spaces = null] The number of spaces to format the json file with
 * @property {string} [encoding = 'utf8'] The file encoding
 * @property {integer} [mode = 0o666] The chmod
 * @property {string} [flag = 'w'] The flag
 */

/**
 * Writes a Javascript Object to file as JSON.
 * @function writeJson
 * @param  {string} file The path to the file you want to create
 * @param  {Object} object The javascript object you would like to write to file
 * @param  {jsonOptions} [options = {}] The options to pass JSON.stringify and writeFile
 * @param  {boolean} [atomic = false] Whether the operation should run atomicly
 * @return {Promise<void>}
 */
/**
 * Writes a Javascript Object to file as JSON.
 * @function writeJSON
 * @param  {string} file The path to the file you want to create
 * @param  {Object} object The javascript object you would like to write to file
 * @param  {jsonOptions} [options = {}] The options to pass JSON.stringify and writeFile
 * @param  {boolean} [atomic = false] Whether the operation should run atomicly
 * @return {Promise<void>}
 */
module.exports = async function writeJSON(file, object, options = {}, atomic = false) {
	if (typeof options === 'boolean') {
		atomic = options;
		options = {};
	}
	const str = `${JSON.stringify(object, options.replacer, options.spaces || null)}\n`;
	return atomic ? writeFileAtomic(file, str, options) : writeFile(file, str, options);
};
