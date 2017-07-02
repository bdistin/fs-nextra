const { dirname } = require('path');

const { writeFile } = require('../fs');

const writeFileAtomic = require('./writeFileAtomic');
const mkdirs = require('./mkdirs');
const pathExists = require('./pathExists');

/**
* @function outputFile
* @param  {type} file           {description}
* @param  {type} data           {description}
* @param  {type} encoding       {description}
* @param  {type} atomic = false {description}
* @return {type} {description}
*/
module.exports = async function outputFile(file, data, encoding, atomic = false) {
	const dir = dirname(file);
	if (!await pathExists(dir)) await mkdirs(dir);
	return atomic ? writeFileAtomic(file, data, encoding) : writeFile(file, data, encoding);
};
