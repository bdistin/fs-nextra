const { tmpdir } = require('os');
const { randomBytes } = require('crypto');
const { join } = require('path');
const fs = require('fs');

exports.uuid = () => {
	const id = randomBytes(32).toString('hex');
	return (Array(32).join(0) + id).slice(-32).replace(/^.{8}|.{4}(?!$)/g, '$&-');
};

exports.dir = tmpdir();

exports.tempFile = dir => {
	const path = this.tempFileLoc(dir);
	fs.writeFileSync(path, '');
	return path;
};

exports.tempDir = dir => {
	const path = this.tempDirLoc(dir);
	fs.mkdirSync(path);
	return path;
};

exports.tempSymlink = dir => {
	const path = this.tempFileLoc(dir);
	fs.symlinkSync(this.tempFile(), path);
	return path;
};

exports.tempFileLoc = (dir = this.dir) => join(dir, `${this.uuid()}.txt`);

exports.tempDirLoc = (dir = this.dir) => join(dir, this.uuid());
