const { tempFile } = require('../util');
const { symlink } = require('../fs');

const move = require('./move');

/**
* @function symlinkAtomic
* @param  {type} target   {description}
* @param  {type} destPath {description}
* @param  {type} type     {description}
* @return {type} {description}
*/
module.exports = async function symlinkAtomic(target, destPath, type) {
	const tempPath = tempFile();
	await symlink(target, tempPath, type);
	return move(tempPath, destPath, { overwrite: true });
};
