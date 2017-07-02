const { tempFile } = require('../util');
const { writeFile } = require('../fs');

const move = require('./move');

/**
* @function writeFileAtomic
* @param  {type} destPath     {description}
* @param  {type} ...writeArgs {description}
* @return {type} {description}
*/
module.exports = async function writeFileAtomic(destPath, ...writeArgs) {
	const tempPath = tempFile();
	await writeFile(tempPath, ...writeArgs);
	return move(tempPath, destPath, { overwrite: true });
};
