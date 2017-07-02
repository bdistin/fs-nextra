const { rimraf_, isWindows, setTimeoutPromise } = require('../util');

/**
* @function remove
* @param  {type} myPath       {description}
* @param  {type} options = {} {description}
* @return {type} {description}
*/
module.exports = async function remove(myPath, options = {}) {
	if (typeof myPath !== 'string') throw new Error('Path should be a string');
	let busyTries = 0;

	options.maxBusyTries = options.maxBusyTries || 3;

	return rimraf_(myPath, options)
		.catch(async (er) => {
			if (isWindows && (er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') && busyTries < options.maxBusyTries) {
				busyTries++;
				const time = busyTries * 100;
				await setTimeoutPromise(time);
				return rimraf_(myPath, options);
			}
			if (er.code === 'ENOENT') return null;
			throw er;
		});
};
