const { resolve, join } = require('path');
const { lstat, readdir } = require('../fs');

/**
 * @typedef {Object} ScanOptions
 * @memberof fsn/nextra
 * @property {Function} [filter] A filter function receiving (stats, path) to determine if the returned map should include a given entry
 * @property {number} [depthLimit] How many directories deep the scan should go (0 is just the children of the passed root directory, no subdirectory files)
 */

/**
 * Recursively scans a directory, returning a map of stats keyed on the full path to the item.
 * @function scan
 * @memberof fsn/nextra
 * @param {string} root The path to scan
 * @param {ScanOptions} [options = {}] The options for the scan
 * @returns {Promise<Map<string, Stats>>}
 */
module.exports = function scan(root, options = {}) {
	return scanDeep(resolve(root), new Map(), -1, options);
};

const scanDeep = async (dir, results, level, options) => {
	const stats = await lstat(dir);
	if (!options.filter || options.filter(stats, dir)) results.set(dir, stats);
	if (stats.isDirectory() && (typeof options.depthLimit === 'undefined' || level < options.depthLimit)) {
		await Promise.all((await readdir(dir)).map(part => scanDeep(join(dir, part), results, ++level, options)));
	}
	return results;
};
