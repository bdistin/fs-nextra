const writeJSON = require('./writeJSON');

/**
* @function writeJSONAtomic
* @param  {type} file         {description}
* @param  {type} obj          {description}
* @param  {type} options = {} {description}
* @return {type} {description}
*/
module.exports = async function writeJSONAtomic(file, obj, options = {}) {
	return writeJSON(file, obj, options, true);
};
