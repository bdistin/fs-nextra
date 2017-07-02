const { resolve, dirname } = require('path');

const { throwErr, setTimeoutPromise, moveAcrossDevice } = require('../util');
const { access, rename, link, unlink } = require('../fs');

const remove = require('./remove');
const mkdirs = require('./mkdirs');

/**
* @function move
* @param  {type} source  {description}
* @param  {type} destination    {description}
* @param  {type} options {description}
* @return {type} {description}
*/
module.exports = async function move(source, destination, options) {
	const shouldMkdirp = 'mkdirp' in options ? options.mkdirp : true;
	const overwrite = options.overwrite || options.clobber || false;

	if (shouldMkdirp) await mkdirs(dirname(destination)).catch(throwErr);

	if (resolve(source) === resolve(destination)) {
		return access(source);
	} else if (overwrite) {
		return rename(source, destination)
			.catch(async (err) => {
				if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST') {
					await remove(destination).catch(throwErr);
					options.overwrite = false;
					return move(source, destination, options);
				}

				// Windows
				if (err.code === 'EPERM') {
					await setTimeoutPromise(200);
					await remove(destination).catch(throwErr);
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
