const { resolve, join } = require('path');
const { lstat, readdir } = require('../fs');

module.exports = async function scan(root, limit) {
	return getStat(resolve(root), new Map(), -1, limit);
};

const getStat = async (dir, results, level, limit) => {
	const stats = await lstat(dir);
	results.set(dir, stats);
	if (stats.isDirectory() && (typeof limit === 'undefined' || level < limit)) await Promise.all((await readdir(dir)).map(part => getStat(join(dir, part), results, ++level, limit)));
	return results;
};
