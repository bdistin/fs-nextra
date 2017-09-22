const { resolve, dirname } = require('path');

const { isWindows, invalidWin32Path, o777 } = require('../util');
const { stat, mkdir } = require('../fs');

/**
 * @typedef {object} mkdirsOptions
 * @memberof nextra
 * @property {number} [mode = 0o777 & ~process.umask()] The chmod for the directories being made
 */

/**
 * Recursivly makes directories, until the directory passed exists.
 * @function ensureDir
 * @memberof nextra
 * @param {string} path The path you wish to make
 * @param {mkdirsOptions} [options] Options for making the directories
 * @param {string} [made = null] The path in progress, do not set.
 * @return {Promise<string>} The path made.
 */
/**
 * Recursivly makes directories, until the directory passed exists.
 * @function mkdirp
 * @memberof fsn/nextra
 * @param {string} path The path you wish to make
 * @param {mkdirsOptions} [options] Options for making the directories
 * @param {string} [made = null] The path in progress, do not set.
 * @return {Promise<string>} The path made.
 */
/**
 * Recursivly makes directories, until the directory passed exists.
 * @function mkdirs
 * @memberof fsn/nextra
 * @param {string} path The path you wish to make
 * @param {mkdirsOptions} [options] Options for making the directories
 * @param {string} [made = null] The path in progress, do not set.
 * @return {Promise<string>} The path made.
 */
module.exports = async function mkdirs(path, options, made = null) {
	if (!options || typeof options !== 'object') options = { mode: options };
	if (isWindows && invalidWin32Path(path)) {
		const errInval = new Error(`${path} contains invalid WIN32 path characters.`);
		errInval.code = 'EINVAL';
		throw errInval;
	}
	// eslint-disable-next-line no-bitwise
	const mode = options.mode || o777 & ~process.umask();
	path = resolve(path);
	return mkdir(path, mode)
		.then(() => made || path)
		.catch((err) => {
			if (err.code !== 'ENOENT') {
				return stat(path)
					.then(myStat => {
						if (myStat.isDirectory()) return made;
						throw err;
					});
			}
			if (dirname(path) === path) throw err;
			return mkdirs(dirname(path), options)
				.then(madeChain => mkdirs(path, options, madeChain));
		});
};
