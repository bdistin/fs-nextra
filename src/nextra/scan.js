const { resolve, join } = require('path');
const { lstat, readdir } = require('../fs');

module.exports = async function scan(root) {
	return getStat(resolve(root), new Map());
};

const getStat = async (dir, results) => {
	const stats = await lstat(dir);
	results.set(dir, stats);
	if (stats.isDirectory()) await Promise.all((await readdir(dir)).map(part => getStat(join(dir, part), results)));
	return results;
};
