const { access } = require('../fs');

/**
 * Checks if a path exists.
 * @function pathExists
 * @memberof fsn/nextra
 * @param {string} path The path to check
 * @return {Promise<boolean>}
 */
module.exports = function pathExists(path) {
	return access(path).then(() => true).catch(() => false);
};
