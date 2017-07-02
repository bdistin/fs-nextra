const { dirname } = require('path');

const writeJSON = require('./writeJSON');
const mkdirs = require('./mkdirs');
const pathExists = require('./pathExists');

/**
* @function outputJSON
* @param  {type} file           {description}
* @param  {type} data           {description}
* @param  {type} options        {description}
* @param  {type} atomic = false {description}
* @return {type} {description}
*/
module.exports = async function outputJSON(file, data, options, atomic = false) {
	const dir = dirname(file);
	if (!await pathExists(dir)) await mkdirs(dir);
	return writeJSON(file, data, options, atomic);
};
