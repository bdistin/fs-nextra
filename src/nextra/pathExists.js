const { access } = require('../fs');

/**
* @function pathExists
* @param  {type} myPath {description}
* @return {type} {description}
*/
module.exports = function pathExists(myPath) {
	return access(myPath).then(() => true).catch(() => false);
};
