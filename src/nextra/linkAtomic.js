const { tempFile } = require('../util');
const { link } = require('../fs');

const move = require('./move');

/**
* @function linkAtomic
* @param  {type} source {description}
* @param  {type} destination {description}
* @return {type} {description}
*/
module.exports = async function linkAtomic(source, destination) {
	const tempPath = tempFile();
	await link(source, tempPath);
	return move(tempPath, destination, { overwrite: true });
};
