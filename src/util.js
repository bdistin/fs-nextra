const { sep, resolve, join } = require('path');
const { promisify } = require('util');
const { randomBytes } = require('crypto');
const { tmpdir } = require('os');

exports.o777 = 0o0777;

exports.isWindows = process.platform === 'win32';

exports.setTimeoutPromise = promisify(setTimeout);

exports.replaceEsc = (str) => str.replace(/\$/g, '$$');

exports.isSrcKid = (source, destination) => {
	const sourceArray = resolve(source).split(sep);
	const destinationArray = resolve(destination).split(sep);
	return sourceArray.every((current, i) => destinationArray[i] === current);
};

exports.uuid = () => {
	const id = randomBytes(32).toString('hex');
	return (Array(32).join('0') + id).slice(-32).replace(/^.{8}|.{4}(?!$)/g, '$&-');
};

exports.tempFile = ext => join(tmpdir(), this.uuid() + (ext || ''));
