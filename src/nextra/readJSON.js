const { stripBom } = require('../util');
const { readFile } = require('../fs');

/**
* @function readJSON
* @param  {type} file         {description}
* @param  {type} options = {} {description}
* @return {type} {description}
*/
module.exports = async function readJSON(file, options = {}) {
	if (typeof options === 'string') options = { encoding: options };
	const content = await readFile(file, options);
	return JSON.parse(stripBom(content), options.reviver);
};
