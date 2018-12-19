const { access } = require('../fs');

/**
 * Checks if a path exists.
 * @function pathExists
 * @memberof fsn/nextra
 * @param {string} path The path to check
 * @returns {Promise<boolean>}
 */
module.exports = async function pathExists(path) {
	try {
		await access(path);
		return true;
	} catch (err) {
		return false;
	}
};
