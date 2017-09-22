const { stripBom } = require('../util');
const { readFile } = require('../fs');

/**
 * @typedef {object} readJSONOptions
 * @memberof fsn/nextra
 * @property {string} [encoding] The file encoding to use while reading
 * @property {Function} [reviver] The reviver function to pass to JSON.parse()
 */

/**
 * Reads a file and parses it into a javascript object.
 * @function readJson
 * @memberof fsn/nextra
 * @param  {string} file The file path to the json file
 * @param  {readJSONOptions|string} [options = {}] The options for reading json or the encoding string
 * @return {Promise<Object>}
 */
/**
 * Reads a file and parses it into a javascript object.
 * @function readJSON
 * @memberof fsn/nextra
 * @param  {string} file The file path to the json file
 * @param  {readJSONOptions|string} [options = {}] The options for reading json or the encoding string
 * @return {Promise<Object>}
 */
module.exports = async function readJSON(file, options = {}) {
	if (typeof options === 'string') options = { encoding: options };
	const content = await readFile(file, options);
	return JSON.parse(stripBom(content), options.reviver);
};
