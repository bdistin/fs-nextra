const outputJSON = require('outputJSON');

/**
* @function outputJSONAtomic
* @param  {type} file    {description}
* @param  {type} data    {description}
* @param  {type} options {description}
* @return {type} {description}
*/
module.exports = function outputJSONAtomic(file, data, options) {
	return outputJSON(file, data, options, true);
};
