const { resolve, dirname } = require('path');

const { isWindows, invalidWin32Path, o777 } = require('../util');
const { stat, mkdir } = require('../fs');

/**
* @function mkdirs
* @param  {type} myPath      {description}
* @param  {type} opts        {description}
* @param  {type} made = null {description}
* @return {type} {description}
*/
module.exports = async function mkdirs(myPath, opts, made = null) {
	if (!opts || typeof opts !== 'object') opts = { mode: opts };
	if (isWindows && invalidWin32Path(myPath)) {
		const errInval = new Error(`${myPath} contains invalid WIN32 path characters.`);
		errInval.code = 'EINVAL';
		throw errInval;
	}
	// eslint-disable-next-line no-bitwise
	const mode = opts.mode || o777 & ~process.umask();
	myPath = resolve(myPath);
	return mkdir(myPath, mode)
		.then(() => made || myPath)
		.catch((err) => {
			if (err.code !== 'ENOENT') {
				return stat(myPath)
					.then(myStat => {
						if (myStat.isDirectory()) return made;
						throw err;
					})
					.catch(() => { throw err; });
			}
			if (dirname(myPath) === myPath) throw err;
			return this(dirname(myPath), opts)
				.then(madeChain => this(myPath, opts, madeChain));
		});
};
