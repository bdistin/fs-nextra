const { join } = require('path');

const { readdir } = require('../fs');

const mkdirs = require('./mkdirs');
const remove = require('./remove');

/**
* @function emptyDir
* @param  {type} dir {description}
* @return {type} {description}
*/
module.exports = async function emptyDir(dir) {
	const items = await readdir(dir).catch(() => mkdirs(dir));
	return Promise.all(items.map(item => remove(join(dir, item))));
};
