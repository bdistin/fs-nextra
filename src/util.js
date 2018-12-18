const { sep, resolve, dirname, basename, join } = require('path');
const { promisify } = require('util');
const { randomBytes } = require('crypto');
const { tmpdir } = require('os');

exports.o777 = 0o0777;

exports.isWindows = process.platform === 'win32';

exports.setTimeoutPromise = promisify(setTimeout);

exports.replaceEsc = (str) => str.replace(/\$/g, '$$');

exports.isSrcKid = (src, dest) => {
	src = resolve(src);
	dest = resolve(dest);
	try {
		return src !== dest &&
			dest.indexOf(src) > -1 &&
			dest.split(dirname(src) + sep)[1].split(sep)[0] === basename(src);
	} catch (err) {
		return false;
	}
};

exports.uuid = () => {
	const id = randomBytes(32).toString('hex');
	return (Array(32).join('0') + id).slice(-32).replace(/^.{8}|.{4}(?!$)/g, '$&-');
};

exports.tempFile = ext => join(tmpdir(), this.uuid() + (ext || ''));
