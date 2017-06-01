const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const targets = [
	'access', 'appendFile',
	'chmod', 'chown', 'close',
	'fchmod', 'fchown', 'fdatasync', 'fstat', 'fsync', 'ftruncate', 'futimes',
	'lchmod', 'lchown', 'link', 'lstat',
	'mkdir', 'mkdtemp',
	'open',
	'read', 'readdir', 'readFile', 'readlink', 'realpath', 'rename', 'rmdir',
	'stat', 'symlink',
	'truncate',
	'unlink', 'utimes',
	'write', 'writeFile'
];
const o777 = parseInt('0777', 8);

for (const target of targets) fs[`${target}Async`] = promisify(fs[target]);

fs.copy = async(src, dest, options = {}) => {
	if (typeof options === 'function' || options instanceof RegExp) options = { filter: options };
	const basePath = process.cwd();
	const currentPath = path.resolve(basePath, src);
	const targetPath = path.resolve(basePath, dest);
	if (currentPath === targetPath) throw new Error('Source and destination must not be the same.');
	const stats = await fs.lstat(src);
	const dir = stats.isDirectory() ? dest.split(path.sep).slice(0, -1).join(path.sep) : path.dirname(dest);
	if (!await fs.pathExists(dir)) await fs.mkdirs(dir);
	return ncp(src, dest, options);
};

fs.emptyDir = async (dir) => {
	const items = await fs.readdirAsync(dir).catch(() => fs.mkdirs(dir));
	return Promise.all(items.map(item => fs.remove(path.join(dir, item))));
};

fs.ensureDir = fs.mkdirs = async(myPath, opts, made = null) => {
	if (!opts || typeof opts !== 'object') opts = { mode: opts };
	if (process.platform === 'win32' && invalidWin32Path(myPath)) {
		const errInval = new Error(`${myPath} contains invalid WIN32 path characters.`);
		errInval.code = 'EINVAL';
		throw errInval;
	}
	// eslint-disable-next-line no-bitwise
	const mode = opts.mode || o777 & ~process.umask();
	myPath = path.resolve(myPath);
	return fs.mkdirAsync(myPath, mode)
		.then(() => made || myPath)
		.catch((err) => {
			if (err.code !== 'ENOENT') return fs.statAsync(myPath).then(() => made);
			if (path.dirname(myPath) === myPath) throw err;
			return fs.mkdirs(path.dirname(myPath), opts);
		})
		.then(() => fs.mkdirs(myPath, opts, made))
		.catch((err) => { throw err; });
};

fs.ensureFile = fs.createFile = async (file) => {
	if (await fs.pathExists(file)) return null;
	const dir = path.dirname(file);
	if (!await fs.pathExists(dir)) await fs.mkdirs(dir);
	return fs.writeFileAsync(file, '');
};

fs.ensureLink = fs.createLink = async (srcpath, dstpath) => {
	if (await fs.pathExists(dstpath)) return null;
	await fs.lstatAsync(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureLink'); });
	const dir = path.dirname(dstpath);
	if (!await fs.pathExists(dir)) await fs.mkdirs(dir);
	return fs.linkAsync(srcpath, dstpath);
};

fs.ensureSymlink = fs.createSymlink = async (srcpath, dstpath, type) => {
	if (await fs.pathExists(dstpath)) return null;
	const relative = await symlinkPaths(srcpath, dstpath);
	srcpath = relative.toDst;
	const type2 = await symlinkType(relative.toCwd, type);
	const dir = path.dirname(dstpath);
	if (!await fs.pathExists(dir)) await fs.mkdirs(dir);
	return fs.symlinkAsync(srcpath, dstpath, type2);
};

fs.move = async (source, dest, options) => {
	// more later
};

fs.outputFile = async (file, data, encoding) => {
	const dir = path.dirname(file);
	if (!await fs.pathExists(dir)) await fs.mkdirs(dir);
	return fs.writeFileAsync(file, data, encoding);
};

fs.outputJSON = async (file, data, options) => {
	const dir = path.dirname(file);
	if (!await fs.pathExists(path)) await fs.mkdirsAsync(dir);
	return fs.writeJsonAsync(file, data, options);
};

fs.pathExists = async (myPath) => fs.accessAsync(myPath).then(() => true).catch(() => false);

fs.readJSON = async (file, options = {}) => {
	if (typeof options === 'string') options = { encoding: options };
	const content = await fs.readFileAsync(file, options);
	return JSON.parse(stripBom(content), options.reviver);
};

fs.remove = async (myPath, options) => {
	// more later
};

fs.writeJSON = async (file, obj, options = {}) => {
	const spaces = options.spaces || null;
	const str = `${JSON.stringify(obj, options.replacer, spaces)}\n`;
	return fs.writeFileAsync(file, str, options);
};

const stripBom = (content) => {
	if (Buffer.isBuffer(content)) content = content.toString('utf8');
	return content.replace(/^\uFEFF/, '');
};

const invalidWin32Path = (myPath) => {
	const root = path.normalize(path.resolve(myPath)).split(path.sep);
	const rp = root.length > 0 ? root[0] : null;
	return /[<>:"|?*]/.test(myPath.replace(rp, ''));
};

const symlinkType = async (srcpath, type = false) => {
	if (type) return type;
	const stats = await fs.lstatAsync(srcpath).catch(() => 'file');
	return stats && stats.isDirectory() ? 'dir' : 'file';
};

const symlinkPaths = async (srcpath, dstpath) => {
	if (path.isAbsolute(srcpath)) {
		await fs.lstatAsync(srcpath).throw(err => { throw err.message.replace('lstat', 'ensureSymlink'); });
		return { toCwd: srcpath, toDst: srcpath };
	}
	const dstdir = path.dirname(dstpath);
	const relativeToDst = path.join(dstdir, srcpath);
	if (await fs.pathExists(relativeToDst)) return { toCwd: relativeToDst, toDst: srcpath };
	await fs.lstatAsync(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureSymlink'); });
	return { toCwd: srcpath, toDst: path.relative(dstdir, srcpath) };
};

const ncp = async (src, dest, options = {}) => {
	// come back to this later
	/* const basePath = process.cwd();
	const currentPath = path.resolve(basePath, src);
	const targetPath = path.resolve(basePath, dest);
	var filter = options.filter;
	var transform = options.transform;
	var overwrite = options.overwrite;
	if (overwrite === undefined) overwrite = options.clobber;
	if (overwrite === undefined) overwrite = true;
	var errorOnExist = options.errorOnExist;
	var dereference = options.dereference;
	var preserveTimestamps = options.preserveTimestamps === true;

	var started = 0;
	var finished = 0;
	var running = 0;*/
};

module.exports = fs;
