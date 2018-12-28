const { writeFile } = require('../fs');

const writeFileAtomic = require('./writeFileAtomic');

/**
 * @typedef {Object} JsonOptions
 * @memberof fsn/nextra
 * @property {Function} [replacer] A JSON.stringify replacer function
 * @property {number} [spaces = null] The number of spaces to format the json file with
 * @property {string} [encoding = 'utf8'] The file encoding
 * @property {number} [mode = 0o666] The chmod
 * @property {string} [flag = 'w'] The flag
 */

/**
 * Writes a Javascript Object to file as JSON.
 * @function writeJson
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {Object} object The javascript object you would like to write to file
 * @param {JsonOptions} [options = {}] The options to pass JSON.stringify and writeFile
 * @param {boolean} [atomic = false] Whether the operation should run atomically
 * @returns {Promise<void>}
 */
/**
 * Writes a Javascript Object to file as JSON.
 * @function writeJSON
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {Object} object The javascript object you would like to write to file
 * @param {JsonOptions} [options = {}] The options to pass JSON.stringify and writeFile
 * @param {boolean} [atomic = false] Whether the operation should run atomically
 * @returns {Promise<void>}
 */
module.exports = async function writeJSON(file, object, options = {}, atomic = false) {
	if (typeof options === 'boolean') [atomic, options] = [options, {}];

	const writeMethod = atomic ? writeFileAtomic : writeFile;
	await writeMethod(file, `${JSON.stringify(object, options.replacer, options.spaces || null)}\n`, options);
};
