const { resolve } = require('path');
const { scanDeep } = require('../util');

/**
 * @typedef {Object} ScanOptions
 * @memberof fsn/nextra
 * @property {Function} [filter] A filter function recieving (stats, path) to determin if the returned map should include a given entry
 * @property {number} [depthLimit] How many directories deep the scan should go (0 is just the children of the passed root directory, no subdirectory files)
 */

/**
 * Recursivly scans a directory, returning a map of stats keyed on the full path to the item.
 * @function scan
 * @memberof fsn/nextra
 * @param {string} root The path to scan
 * @param {ScanOptions} [options = {}] The options for the scan
 * @returns {Promise<Map<string, Stats>>}
 */
module.exports = function scan(root, options = {}) {
	return scanDeep(resolve(root), new Map(), -1, options);
};
