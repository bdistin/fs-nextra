const outputFile = require('./outputFile');

/**
* @function outputFileAtomic
* @param  {type} file     {description}
* @param  {type} data     {description}
* @param  {type} encoding {description}
* @return {type} {description}
*/
module.exports = function outputFileAtomic(file, data, encoding) {
	return outputFile(file, data, encoding, true);
};
