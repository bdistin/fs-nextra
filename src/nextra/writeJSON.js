const { writeFile } = require('../fs');

const writeFileAtomic = require('./writeFileAtomic');

/**
* @function writeJSON
* @param  {type} file           {description}
* @param  {type} obj            {description}
* @param  {type} options = {}   {description}
* @param  {type} atomic = false {description}
* @return {type} {description}
*/
module.exports = async function writeJSON(file, obj, options = {}, atomic = false) {
	const spaces = options.spaces || null;
	const str = `${JSON.stringify(obj, options.replacer, spaces)}\n`;
	return atomic ? writeFileAtomic(file, str, options) : writeFile(file, str, options);
};
