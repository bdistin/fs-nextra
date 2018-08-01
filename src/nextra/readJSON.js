const { stripBom } = require('../util');
const { readFile } = require('../fs');

/**
 * @typedef {Object} ReadJSONOptions
 * @memberof fsn/nextra
 * @property {string} [encoding] The file encoding to use while reading
 * @property {Function} [reviver] The reviver function to pass to JSON.parse()
 */

/**
 * Reads a file and parses it into a javascript object.
 * @function readJson
 * @memberof fsn/nextra
 * @param {string} file The file path to the json file
 * @param {ReadJSONOptions|string} [options = {}] The options for reading json or the encoding string
 * @returns {Promise<Object>}
 */
/**
 * Reads a file and parses it into a javascript object.
 * @function readJSON
 * @memberof fsn/nextra
 * @param {string} file The file path to the json file
 * @param {ReadJSONOptions|string} [options = {}] The options for reading json or the encoding string
 * @returns {Promise<Object>}
 */
module.exports = async function readJSON(file, options = { flag: 'r' }) {
	if (typeof options === 'string') options = { encoding: options, flag: 'r' };
	const content = await readFile(file, options);
	return JSON.parse(stripBom(content), options.reviver);
};
