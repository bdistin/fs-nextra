const { resolve, dirname, normalize, sep } = require('path');

const { isWindows } = require('../util');
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
 * @returns {Promise<void>}
 */
/**
 * Recursively makes directories, until the directory passed exists.
 * @function mkdirp
 * @memberof fsn/nextra
 * @param {string} path The path you wish to make
 * @param {MkdirsOptions} [options] Options for making the directories
 * @returns {Promise<void>}
 */
/**
 * Recursively makes directories, until the directory passed exists.
 * @function mkdirs
 * @memberof fsn/nextra
 * @param {string} path The path you wish to make
 * @param {MkdirsOptions} [options] Options for making the directories
 * @returns {Promise<void>}
 */
module.exports = async function mkdirs(path, options) {
	if (await check(path)) return;

	if (!options || typeof options !== 'object') options = { mode: options };

	// Windows
	/* istanbul ignore next */
	if (isWindows && invalidWin32Path(path)) {
		const errInval = new Error(`FS-NEXTRA: ${path} contains invalid WIN32 path characters.`);
		errInval.code = 'EINVAL';
		throw errInval;
	}

	// eslint-disable-next-line no-bitwise
	const mode = options.mode || 0o0777 & ~process.umask();
	path = resolve(path);

	try {
		await mkdir(path, mode);
	} catch (err) {
		if (err.code === 'ENOENT') {
			await mkdirs(dirname(path), options);
			await mkdirs(path, options);
			return;
		}
		throw err;
	}
};

const check = async (path) => {
	try {
		const myStat = await stat(path);
		return myStat.isDirectory();
	} catch (err) {
		return false;
	}
};

// Windows
/* istanbul ignore next */
const invalidWin32Path = (myPath) => {
	const root = normalize(resolve(myPath)).split(sep);
	const rp = root.length > 0 ? root[0] : null;
	return /[<>:"|?*]/.test(myPath.replace(rp, ''));
};
