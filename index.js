const fs = require('fs');
const { sep, resolve, dirname, join, normalize, isAbsolute, relative } = require('path');
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
const isWindows = process.platform === 'win32';
const setTimeoutPromise = promisify(setTimeout);

const fsn = {};

for (const [key, value] of Object.entries(fs)) {
	if (key.includes('Sync')) continue;
	if (targets.includes(key)) fsn[key] = promisify(value);
	else fsn[key] = value;
}

fsn.copy = async(src, dest, options = {}) => {
	if (typeof options === 'function') options = { filter: options };
	const basePath = process.cwd();
	const currentPath = resolve(basePath, src);
	const targetPath = resolve(basePath, dest);
	if (currentPath === targetPath) throw new Error('Source and destination must not be the same.');
	const stats = await fsn.lstat(src);
	const dir = stats.isDirectory() ? dest.split(sep).slice(0, -1).join(sep) : dirname(dest);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return ncp(src, dest, options);
};

fsn.emptyDir = fsn.emptydir = async (dir) => {
	const items = await fsn.readdir(dir).catch(() => fsn.mkdirs(dir));
	return Promise.all(items.map(item => fsn.remove(join(dir, item))));
};

fsn.ensureDir = fsn.mkdirs = fsn.mkdirp = async(myPath, opts, made = null) => {
	if (!opts || typeof opts !== 'object') opts = { mode: opts };
	if (isWindows && invalidWin32Path(myPath)) {
		const errInval = new Error(`${myPath} contains invalid WIN32 path characters.`);
		errInval.code = 'EINVAL';
		throw errInval;
	}
	// eslint-disable-next-line no-bitwise
	const mode = opts.mode || o777 & ~process.umask();
	myPath = resolve(myPath);
	return fsn.mkdir(myPath, mode)
		.then(() => made || myPath)
		.catch((err) => {
			if (err.code !== 'ENOENT') {
				return fsn.stat(myPath)
					.then(stat => {
						if (stat.isDirectory()) return made;
						throw err;
					})
					.catch(() => { throw err; });
			}
			if (dirname(myPath) === myPath) throw err;
			return fsn.mkdirs(dirname(myPath), opts)
				.then(madeChain => fsn.mkdirs(myPath, opts, madeChain));
		});
};

fsn.ensureFile = fsn.createFile = async (file) => {
	if (await fsn.pathExists(file)) return null;
	const dir = dirname(file);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return fsn.writeFile(file, '');
};

fsn.ensureLink = fsn.createLink = async (srcpath, dstpath) => {
	if (await fsn.pathExists(dstpath)) return null;
	await fsn.lstat(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureLink'); });
	const dir = dirname(dstpath);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return fsn.link(srcpath, dstpath);
};

fsn.ensureSymlink = fsn.createSymlink = async (srcpath, dstpath, type) => {
	if (await fsn.pathExists(dstpath)) return null;
	const relativePath = await symlinkPaths(srcpath, dstpath);
	srcpath = relativePath.toDst;
	const type2 = await symlinkType(relativePath.toCwd, type);
	const dir = dirname(dstpath);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return fsn.symlink(srcpath, dstpath, type2);
};

fsn.move = async (source, dest, options) => {
	const shouldMkdirp = 'mkdirp' in options ? options.mkdirp : true;
	const overwrite = options.overwrite || options.clobber || false;

	if (shouldMkdirp) await fsn.mkdirs(dirname(dest)).catch(throwErr);

	if (resolve(source) === resolve(dest)) {
		return fsn.access(source);
	} else if (overwrite) {
		return fsn.rename(source, dest)
			.catch(async(err) => {
				if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST') {
					await fsn.remove(dest).catch(throwErr);
					options.overwrite = false;
					return fsn.move(source, dest, options);
				}

				// Windows
				if (err.code === 'EPERM') {
					await setTimeoutPromise(200);
					await fsn.remove(dest).catch(throwErr);
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
	const dir = dirname(file);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return fsn.writeFile(file, data, encoding);
};

fsn.outputJSON = fsn.outputJson = async (file, data, options) => {
	const dir = dirname(file);
	if (!await fsn.pathExists(dir)) await fsn.mkdirs(dir);
	return fsn.writeJson(file, data, options);
};

fsn.pathExists = (myPath) => fsn.access(myPath).then(() => true).catch(() => false);

fsn.readJSON = fsn.readJson = async (file, options = {}) => {
	if (typeof options === 'string') options = { encoding: options };
	const content = await fsn.readFile(file, options);
	return JSON.parse(stripBom(content), options.reviver);
};

fsn.remove = async (myPath, options = {}) => {
	if (typeof myPath !== 'string') throw new Error('Path should be a string');
	let busyTries = 0;

	options.maxBusyTries = options.maxBusyTries || 3;

	return rimraf_(myPath, options)
		.catch(async(er) => {
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

fsn.writeJSON = fsn.writeJson = async (file, obj, options = {}) => {
	const spaces = options.spaces || null;
	const str = `${JSON.stringify(obj, options.replacer, spaces)}\n`;
	return fsn.writeFile(file, str, options);
};

const throwErr = err => { throw err; };

const stripBom = (content) => {
	if (Buffer.isBuffer(content)) content = content.toString('utf8');
	return content.replace(/^\uFEFF/, '');
};

const invalidWin32Path = (myPath) => {
	const root = normalize(resolve(myPath)).split(sep);
	const rp = root.length > 0 ? root[0] : null;
	return /[<>:"|?*]/.test(myPath.replace(rp, ''));
};

const symlinkType = async (srcpath, type = false) => {
	if (type) return type;
	const stats = await fsn.lstat(srcpath).catch(() => 'file');
	return stats && stats.isDirectory() ? 'dir' : 'file';
};

const symlinkPaths = async (srcpath, dstpath) => {
	if (isAbsolute(srcpath)) {
		await fsn.lstat(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureSymlink'); });
		return { toCwd: srcpath, toDst: srcpath };
	}
	const dstdir = dirname(dstpath);
	const relativeToDst = join(dstdir, srcpath);
	if (await fsn.pathExists(relativeToDst)) return { toCwd: relativeToDst, toDst: srcpath };
	await fsn.lstat(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureSymlink'); });
	return { toCwd: srcpath, toDst: relative(dstdir, srcpath) };
};

const moveAcrossDevice = async (source, dest, overwrite) => {
	const stat = await fsn.stat(source).catch(throwErr);
	if (stat.isDirectory()) return moveDirAcrossDevice(source, dest, overwrite);
	return moveFileAcrossDevice(source, dest, overwrite);
};

const moveFileAcrossDevice = (source, dest, overwrite) => new Promise((res, rej) => {
	const flags = overwrite ? 'w' : 'wx';
	const ins = fsn.createReadStream(source);
	const outs = fsn.createWriteStream(dest, { flags });

	ins.on('error', err => {
		ins.destroy();
		outs.destroy();
		outs.removeListener('close', () => { res(fsn.unlink(source)); });

		fsn.unlink(dest).catch(() => {
			if (err.code !== 'EISDIR' && err.code !== 'EPERM') rej(err);
			res(moveDirAcrossDevice(source, dest, overwrite).catch(rej));
		});
	});

	outs.on('error', err => {
		ins.destroy();
		outs.destroy();
		outs.removeListener('close', () => { res(fsn.unlink(source)); });
		rej(err);
	});

	outs.once('close', () => { res(fsn.unlink(source)); });
	ins.pipe(outs);
});

const moveDirAcrossDevice = async (source, dest, overwrite) => {
	const options = { overwrite: false };
	if (overwrite) await fsn.remove(dest).catch(throwErr);
	await ncp(source, dest, options).catch(throwErr);
	return fsn.remove(source);
};

const rimraf_ = async (myPath, options) => {
	const stat = await fsn.lstat(myPath).catch(er => {
		if (er && er.code === 'ENOENT') return null;
		if (er && er.code === 'EPERM' && isWindows) return fixWinEPERM(myPath, options, er);
		throw er;
	});

	if (stat && stat.isDirectory()) return rmdir(myPath, options, null);

	return fsn.unlink(myPath).catch(er => {
		if (er.code === 'ENOENT') return null;
		if (er.code === 'EPERM') return isWindows ? fixWinEPERM(myPath, options, er) : rmdir(myPath, options, er);
		if (er.code === 'EISDIR') return rmdir(myPath, options, er);
		throw er;
	});
};

const fixWinEPERM = async (myPath, options, err) => {
	await fsn.chmod(myPath, 666).catch(er => { throw er.code === 'ENOENT' ? null : err; });
	const stats = await fsn.stat(myPath).catch(er => { throw er.code === 'ENOENT' ? null : err; });
	if (stats.isDirectory()) return rmdir(myPath, options, err);
	else return fsn.unlink(myPath);
};

const rmdir = async (myPath, options, originalEr) => fsn.rmdir(myPath).catch(er => {
	if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) return rmkids(myPath, options);
	else if (er && er.code === 'ENOTDIR') throw originalEr;
	else throw er;
});

const rmkids = async(myPath, options) => {
	const files = fsn.readdir(myPath).catch(throwErr);
	if (files.length === 0) return options.rmdir(myPath);
	return Promise.all(files.map(file => fsn.remove(join(myPath, file), options)))
		.then(() => fsn.rmdir(myPath));
};

const isWritable = (myPath) => fsn.lstat(myPath).then(() => false).catch(err => err.code === 'ENOENT');

const ncp = async (source, dest, options = {}) => {
	options.basePath = process.cwd();
	options.currentPath = resolve(options.basePath, source);
	options.targetPath = resolve(options.basePath, dest);
	options.filter = typeof options.filter === 'function' ? options.filter : undefined;
	options.overwrite = options.overwrite ? options.clobber : true;
	options.preserveTimestamps = options.preserveTimestamps === true;
	return startCopy(options.currentPath, options);
};

const startCopy = async (mySource, options) => {
	if (options.filter && !options.filter(mySource, options.targetPath)) return null;
	const stat = options.dereference ? fsn.stat : fsn.lstat;
	const stats = await stat(mySource).catch(throwErr);
	const item = {
		name: mySource,
		mode: stats.mode,
		mtime: stats.mtime,
		atime: stats.atime,
		stats: stats
	};

	if (stats.isDirectory()) {
		const target = item.name.replace(options.currentPath, options.targetPath.replace('$', '$$$$'));
		if (await isWritable(target)) return mkDir(item, target, options);
		return copyDir(item.name);
	} else if (stats.isFile() || stats.isCharacterDevice() || stats.isBlockDevice()) {
		const target = item.name.replace(options.currentPath, options.targetPath.replace('$', '$$$$'));
		if (await isWritable(target)) return copyFile(item, target, options);
		else if (options.overwrite) return fsn.unlink(item).then(() => { copyFile(item, target, options); });
		else if (options.errorOnExist) throw new Error(`${target} already exists`);
	} else if (stats.isSymbolicLink()) {
		const target = item.replace(options.currentPath, options.targetPath);
		const resolvedPath = await fsn.readlink(item).catch(throwErr);
		return checkLink(resolvedPath, target, options);
	}
	throw new Error('FS-NEXTRA: An Unkown error has occured in startCopy.');
};

const copyFile = (file, target, options) => new Promise((res, rej) => {
	const readStream = fsn.createReadStream(file.name);
	const writeStream = fsn.createWriteStream(target, { mode: file.mode });

	readStream.on('error', rej);
	writeStream.on('error', rej);

	if (options.transform) options.transform(readStream, writeStream, file);
	else writeStream.on('open', () => { readStream.pipe(writeStream); });

	writeStream.once('close', async() => {
		const error = await fsn.chmod(target, file.mode).catch(err => err);
		if (error) return rej(error);
		if (!options.preserveTimestamps) return res();
		const fd = await fsn.open(target, 'r+').catch(err => err);
		if (fd instanceof Error) return rej(fd);
		const futimesErr = fsn.futimes(fd, file.atime, file.mtime).catch(err => err);
		const closeErr = fs.close(fd).catch(err => err);
		if (futimesErr || closeErr) return rej(futimesErr || closeErr);
		return res();
	});
});

const mkDir = async (dir, target, options) => {
	await fsn.mkdir(target, dir.mode).catch(throwErr);
	await fsn.chmod(target, dir.mode).catch(throwErr);
	return copyDir(dir.name, options);
};

const copyDir = async (dir, options) => {
	const items = await fsn.readdir(dir).catch(throwErr);
	return Promise.all(items.map(item => startCopy(join(dir, item), options)));
};

const checkLink = async (resolvedPath, target, options) => {
	if (options.dereference) resolvedPath = resolve(options.basePath, resolvedPath);
	if (await isWritable(target)) return fsn.symlink(resolvedPath, target);
	let targetDest = await fsn.readlink(target).catch(throwErr);
	if (options.dereference) targetDest = resolve(options.basePath, targetDest);
	if (targetDest === resolvedPath) return null;
	await fsn.unlink(target).catch(throwErr);
	return fsn.symlink(resolvedPath, target);
};

module.exports = fsn;
