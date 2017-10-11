const { resolve, join } = require('path');
const { lstat, readdir } = require('../fs');

module.exports = async function scan(root, options) {
	return getStat(resolve(root), new Map(), -1, options);
};

const getStat = async (dir, results, level, options) => {
	const stats = await lstat(dir);
	if (!options.filter || options.filter(stats)) results.set(dir, stats);
	if (stats.isDirectory() && (typeof options.limit === 'undefined' || level < options.limit)) await Promise.all((await readdir(dir)).map(part => getStat(join(dir, part), results, ++level, limit)));
	return results;
};
