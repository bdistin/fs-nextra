const { resolve, dirname } = require('path');

const { setTimeoutPromise, moveAcrossDevice } = require('../util');
const { access, rename, link, unlink } = require('../fs');

const remove = require('./remove');
const mkdirs = require('./mkdirs');

/**
 * @typedef {Object} MoveOptions
 * @memberof fsn/nextra
 * @property {boolean} [mkdirp = true] Should the move create directories recursivly for the destination path
 * @property {boolean} [overwrite = false] Should the move overwrite an identical file at the destination path
 * @property {boolean} [clobber = false] Alias to overwrite for parity to fs-extra
 */

/**
 * @function move
 * @memberof fsn/nextra
 * @param {string} source The source path of the file
 * @param {string} destination The destination path of the file
 * @param {MoveOptions} [options={}] The options for the move
 * @returns {Promise<void>}
 */
module.exports = async function move(source, destination, options = {}) {
	const shouldMkdirp = 'mkdirp' in options ? options.mkdirp : true;
	const overwrite = options.overwrite || options.clobber || false;

	if (shouldMkdirp) await mkdirs(dirname(destination));

	if (resolve(source) === resolve(destination)) {
		return access(source);
	} else if (overwrite) {
		return rename(source, destination)
			.catch(async (err) => {
				if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST') {
					await remove(destination);
					options.overwrite = false;
					return move(source, destination, options);
				}

				// Windows
				if (err.code === 'EPERM') {
					await setTimeoutPromise(200);
					await remove(destination);
					options.overwrite = false;
					return move(source, destination, options);
				}

				if (err.code !== 'EXDEV') throw err;
				return moveAcrossDevice(source, destination, overwrite);
			});
	}
	return link(source, destination)
		.then(() => unlink(source))
		.catch(err => {
			if (err.code === 'EXDEV' || err.code === 'EISDIR' || err.code === 'EPERM' || err.code === 'ENOTSUP') return moveAcrossDevice(source, destination, overwrite);
			throw err;
		});
};
