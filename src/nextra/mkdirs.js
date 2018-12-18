const { resolve, dirname, normalize, sep } = require('path');

const { isWindows, o777 } = require('../util');
const { stat, mkdir } = require('../fs');

/**
 * @typedef {Object} MkdirsOptions
 * @memberof fsn/nextra
 * @property {number} [mode = 0o777 & ~process.umask()] The chmod for the directories being made
 */

/**
 * Recursively makes directories, until the directory passed exists.
 * @function ensureDir
 * @memberof fsn/nextra
 * @param {string} path The path you wish to make
 * @param {MkdirsOptions} [options] Options for making the directories
 * @param {string} [made = null] The path in progress, do not set.
 * @returns {Promise<string>} The path made.
 */
/**
 * Recursively makes directories, until the directory passed exists.
 * @function mkdirp
 * @memberof fsn/nextra
 * @param {string} path The path you wish to make
 * @param {MkdirsOptions} [options] Options for making the directories
 * @param {string} [made = null] The path in progress, do not set.
 * @returns {Promise<string>} The path made.
 */
/**
 * Recursively makes directories, until the directory passed exists.
 * @function mkdirs
 * @memberof fsn/nextra
 * @param {string} path The path you wish to make
 * @param {MkdirsOptions} [options] Options for making the directories
 * @param {string} [made = null] The path in progress, do not set.
 * @returns {Promise<string>} The path made.
 */
module.exports = async function mkdirs(path, options, made = null) {
	if (!options || typeof options !== 'object') options = { mode: options };

	// Windows
	/* istanbul ignore next */
	if (isWindows && invalidWin32Path(path)) {
		const errInval = new Error(`${path} contains invalid WIN32 path characters.`);
		errInval.code = 'EINVAL';
		throw errInval;
	}

	// eslint-disable-next-line no-bitwise
	const mode = options.mode || o777 & ~process.umask();
	path = resolve(path);

	try {
		await mkdir(path, mode);
		return made || path;
	} catch (err) {
		if (err.code === 'ENOENT') {
			const madeChain = await mkdirs(dirname(path), options);
			return mkdirs(path, options, madeChain);
		}
		const myStat = await stat(path);
		if (myStat.isDirectory()) return made;
		throw err;
	}
};

// Windows
/* istanbul ignore next */
const invalidWin32Path = (myPath) => {
	const root = normalize(resolve(myPath)).split(sep);
	const rp = root.length > 0 ? root[0] : null;
	return /[<>:"|?*]/.test(myPath.replace(rp, ''));
};
