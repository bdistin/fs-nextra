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
const setTimeoutPromise = promisify(setTimeout);

const fsn = {};

for (const [key, value] of Object.entries(fs)) {
	if (key.includes('Sync')) continue;
	if (targets.includes(key)) fsn[key] = promisify(value);
	else fsn[key] = value;
}

fsn.copy = async(src, dest, options = {}) => {
	if (typeof options === 'function' || options instanceof RegExp) options = { filter: options };
	const basePath = process.cwd();
	const currentPath = path.resolve(basePath, src);
	const targetPath = path.resolve(basePath, dest);
	if (currentPath === targetPath) throw new Error('Source and destination must not be the same.');
	const stats = await fsn.lstat(src);
	const dir = stats.isDirectory() ? dest.split(path.sep).slice(0, -1).join(path.sep) : path.dirname(dest);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return ncp(src, dest, options);
};

fsn.emptyDir = async (dir) => {
	const items = await fsn.readdir(dir).catch(() => fsn.mkdirs(dir));
	return Promise.all(items.map(item => fsn.remove(path.join(dir, item))));
};

fsn.ensureDir = fsn.mkdirs = async(myPath, opts, made = null) => {
	if (!opts || typeof opts !== 'object') opts = { mode: opts };
	if (process.platform === 'win32' && invalidWin32Path(myPath)) {
		const errInval = new Error(`${myPath} contains invalid WIN32 path characters.`);
		errInval.code = 'EINVAL';
		throw errInval;
	}
	// eslint-disable-next-line no-bitwise
	const mode = opts.mode || o777 & ~process.umask();
	myPath = path.resolve(myPath);
	return fsn.mkdir(myPath, mode)
		.then(() => made || myPath)
		.catch((err) => {
			if (err.code !== 'ENOENT') return fsn.stat(myPath).then(() => made);
			if (path.dirname(myPath) === myPath) throw err;
			return fsn.mkdirs(path.dirname(myPath), opts);
		})
		.then(() => fsn.mkdirs(myPath, opts, made))
		.catch((err) => { throw err; });
};

fsn.ensureFile = fsn.createFile = async (file) => {
	if (await fsn.pathExists(file)) return null;
	const dir = path.dirname(file);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return fsn.writeFile(file, '');
};

fsn.ensureLink = fsn.createLink = async (srcpath, dstpath) => {
	if (await fsn.pathExists(dstpath)) return null;
	await fsn.lstat(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureLink'); });
	const dir = path.dirname(dstpath);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return fsn.link(srcpath, dstpath);
};

fsn.ensureSymlink = fsn.createSymlink = async (srcpath, dstpath, type) => {
	if (await fsn.pathExists(dstpath)) return null;
	const relative = await symlinkPaths(srcpath, dstpath);
	srcpath = relative.toDst;
	const type2 = await symlinkType(relative.toCwd, type);
	const dir = path.dirname(dstpath);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return fsn.symlink(srcpath, dstpath, type2);
};

fsn.move = async (source, dest, options) => {
	const shouldMkdirp = 'mkdirp' in options ? options.mkdirp : true;
	const overwrite = options.overwrite || options.clobber || false;

	if (shouldMkdirp) await fsn.mkdirs(path.dirname(dest)).catch(err => { throw err; });

	if (path.resolve(source) === path.resolve(dest)) {
		return fsn.access(source);
	} else if (overwrite) {
		return fsn.rename(source, dest)
			.catch(async(err) => {
				if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST') {
					await fsn.remove(dest).catch((er) => { throw er; });
					options.overwrite = false;
					return fsn.move(source, dest, options);
				}

				// Windows
				if (err.code === 'EPERM') {
					await setTimeoutPromise(200);
					await fsn.remove(dest).catch((er) => { throw er; });
					options.overwrite = false;
					return fsn.move(source, dest, options);
				}

				if (err.code !== 'EXDEV') throw err;
				return moveAcrossDevice(source, dest, overwrite);
			});
	}
	return fsn.link(source, dest)
		.then(() => fsn.unlink(source))
		.catch(err => {
			if (err.code === 'EXDEV' || err.code === 'EISDIR' || err.code === 'EPERM' || err.code === 'ENOTSUP') return moveAcrossDevice(source, dest, overwrite);
			throw err;
		});
};

fsn.outputFile = async (file, data, encoding) => {
	const dir = path.dirname(file);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return fsn.writeFile(file, data, encoding);
};

fsn.outputJSON = async (file, data, options) => {
	const dir = path.dirname(file);
	if (!await fsn.pathExists(path)) await fsn.mkdirs(dir);
	return fsn.writeJson(file, data, options);
};

fsn.pathExists = async (myPath) => fsn.access(myPath).then(() => true).catch(() => false);

fsn.readJSON = async (file, options = {}) => {
	if (typeof options === 'string') options = { encoding: options };
	const content = await fsn.readFile(file, options);
	return JSON.parse(stripBom(content), options.reviver);
};

fsn.remove = async (myPath, options) => {
	// more later
};

fsn.writeJSON = async (file, obj, options = {}) => {
	const spaces = options.spaces || null;
	const str = `${JSON.stringify(obj, options.replacer, spaces)}\n`;
	return fsn.writeFile(file, str, options);
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
	const stats = await fsn.lstat(srcpath).catch(() => 'file');
	return stats && stats.isDirectory() ? 'dir' : 'file';
};

const symlinkPaths = async (srcpath, dstpath) => {
	if (path.isAbsolute(srcpath)) {
		await fsn.lstat(srcpath).throw(err => { throw err.message.replace('lstat', 'ensureSymlink'); });
		return { toCwd: srcpath, toDst: srcpath };
	}
	const dstdir = path.dirname(dstpath);
	const relativeToDst = path.join(dstdir, srcpath);
	if (await fsn.pathExists(relativeToDst)) return { toCwd: relativeToDst, toDst: srcpath };
	await fsn.lstat(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureSymlink'); });
	return { toCwd: srcpath, toDst: path.relative(dstdir, srcpath) };
};

const moveAcrossDevice = async (source, dest, overwrite) => {
	const stat = await fsn.stat(source).catch(err => { throw err; });
	if (stat.isDirectory()) return moveDirAcrossDevice(source, dest, overwrite);
	return moveFileAcrossDevice(source, dest, overwrite);
};

const moveFileAcrossDevice = (source, dest, overwrite) => new Promise((resolve, reject) => {
	const flags = overwrite ? 'w' : 'wx';
	const ins = fsn.createReadStream(source);
	const outs = fsn.createWriteStream(dest, { flags });

	ins.on('error', err => {
		ins.destroy();
		outs.destroy();
		outs.removeListener('close', () => { resolve(fsn.unlink(source)); });

		fsn.unlink(dest).catch(() => {
			if (err.code !== 'EISDIR' && err.code !== 'EPERM') reject(err);
			resolve(moveDirAcrossDevice(source, dest, overwrite).catch(reject));
		});
	});

	outs.on('error', err => {
		ins.destroy();
		outs.destroy();
		outs.removeListener('close', () => { resolve(fsn.unlink(source)); });
		reject(err);
	});

	outs.once('close', () => { resolve(fsn.unlink(source)); });
	ins.pipe(outs);
});

const moveDirAcrossDevice = async (source, dest, overwrite) => {
	const options = { overwrite: false };
	if (overwrite) await fsn.remove(dest).catch(err => { throw err; });
	await ncp(source, dest, options).catch(err => { throw err; });
	return fsn.remove(source);
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
