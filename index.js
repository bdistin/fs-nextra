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

for (const [key, value] of Object.entries(fs)) {
	if (key.includes('Sync')) continue;
	if (targets.includes(key)) exports[key] = promisify(value);
	else exports[key] = value;
}

exports.copy = async(src, dest, options = {}) => {
	if (typeof options === 'function') options = { filter: options };
	const basePath = process.cwd();
	const currentPath = resolve(basePath, src);
	const targetPath = resolve(basePath, dest);
	if (currentPath === targetPath) throw new Error('Source and destination must not be the same.');
	const stats = await this.lstat(src);
	const dir = stats.isDirectory() ? dest.split(sep).slice(0, -1).join(sep) : dirname(dest);
	if (!await this.pathExists(dir)) await this.mkdirs(dir);
	return ncp(src, dest, options);
};

exports.emptyDir = exports.emptydir = async (dir) => {
	const items = await this.readdir(dir).catch(() => this.mkdirs(dir));
	return Promise.all(items.map(item => this.remove(join(dir, item))));
};

exports.ensureDir = exports.mkdirs = exports.mkdirp = async(myPath, opts, made = null) => {
	if (!opts || typeof opts !== 'object') opts = { mode: opts };
	if (isWindows && invalidWin32Path(myPath)) {
		const errInval = new Error(`${myPath} contains invalid WIN32 path characters.`);
		errInval.code = 'EINVAL';
		throw errInval;
	}
	// eslint-disable-next-line no-bitwise
	const mode = opts.mode || o777 & ~process.umask();
	myPath = resolve(myPath);
	return this.mkdir(myPath, mode)
		.then(() => made || myPath)
		.catch((err) => {
			if (err.code !== 'ENOENT') {
				return this.stat(myPath)
					.then(stat => {
						if (stat.isDirectory()) return made;
						throw err;
					})
					.catch(() => { throw err; });
			}
			if (dirname(myPath) === myPath) throw err;
			return this.mkdirs(dirname(myPath), opts)
				.then(madeChain => this.mkdirs(myPath, opts, madeChain));
		});
};

exports.ensureFile = exports.createFile = async (file) => {
	if (await this.pathExists(file)) return null;
	const dir = dirname(file);
	if (!await this.pathExists(dir)) await this.mkdirs(dir);
	return this.writeFile(file, '');
};

exports.ensureLink = exports.createLink = async (srcpath, dstpath) => {
	if (await this.pathExists(dstpath)) return null;
	await this.lstat(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureLink'); });
	const dir = dirname(dstpath);
	if (!await this.pathExists(dir)) await this.mkdirs(dir);
	return this.link(srcpath, dstpath);
};

exports.ensureSymlink = exports.createSymlink = async (srcpath, dstpath, type) => {
	if (await this.pathExists(dstpath)) return null;
	const relativePath = await symlinkPaths(srcpath, dstpath);
	srcpath = relativePath.toDst;
	const type2 = await symlinkType(relativePath.toCwd, type);
	const dir = dirname(dstpath);
	if (!await this.pathExists(dir)) await this.mkdirs(dir);
	return this.symlink(srcpath, dstpath, type2);
};

exports.move = async (source, dest, options) => {
	const shouldMkdirp = 'mkdirp' in options ? options.mkdirp : true;
	const overwrite = options.overwrite || options.clobber || false;

	if (shouldMkdirp) await this.mkdirs(dirname(dest)).catch(throwErr);

	if (resolve(source) === resolve(dest)) {
		return this.access(source);
	} else if (overwrite) {
		return this.rename(source, dest)
			.catch(async(err) => {
				if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST') {
					await this.remove(dest).catch(throwErr);
					options.overwrite = false;
					return this.move(source, dest, options);
				}

				// Windows
				if (err.code === 'EPERM') {
					await setTimeoutPromise(200);
					await this.remove(dest).catch(throwErr);
					options.overwrite = false;
					return this.move(source, dest, options);
				}

				if (err.code !== 'EXDEV') throw err;
				return moveAcrossDevice(source, dest, overwrite);
			});
	}
	return this.link(source, dest)
		.then(() => this.unlink(source))
		.catch(err => {
			if (err.code === 'EXDEV' || err.code === 'EISDIR' || err.code === 'EPERM' || err.code === 'ENOTSUP') return moveAcrossDevice(source, dest, overwrite);
			throw err;
		});
};

exports.outputFile = async (file, data, encoding) => {
	const dir = dirname(file);
	if (!await this.pathExists(dir)) await this.mkdirs(dir);
	return this.writeFile(file, data, encoding);
};

exports.outputJSON = exports.outputJson = async (file, data, options) => {
	const dir = dirname(file);
	if (!await this.pathExists(dir)) await this.mkdirs(dir);
	return this.writeJson(file, data, options);
};

exports.pathExists = (myPath) => this.access(myPath).then(() => true).catch(() => false);

exports.readJSON = exports.readJson = async (file, options = {}) => {
	if (typeof options === 'string') options = { encoding: options };
	const content = await this.readFile(file, options);
	return JSON.parse(stripBom(content), options.reviver);
};

exports.remove = async (myPath, options = {}) => {
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

exports.writeJSON = exports.writeJson = async (file, obj, options = {}) => {
	const spaces = options.spaces || null;
	const str = `${JSON.stringify(obj, options.replacer, spaces)}\n`;
	return this.writeFile(file, str, options);
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
	const stats = await this.lstat(srcpath).catch(() => 'file');
	return stats && stats.isDirectory() ? 'dir' : 'file';
};

const symlinkPaths = async (srcpath, dstpath) => {
	if (isAbsolute(srcpath)) {
		await this.lstat(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureSymlink'); });
		return { toCwd: srcpath, toDst: srcpath };
	}
	const dstdir = dirname(dstpath);
	const relativeToDst = join(dstdir, srcpath);
	if (await this.pathExists(relativeToDst)) return { toCwd: relativeToDst, toDst: srcpath };
	await this.lstat(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureSymlink'); });
	return { toCwd: srcpath, toDst: relative(dstdir, srcpath) };
};

const moveAcrossDevice = async (source, dest, overwrite) => {
	const stat = await this.stat(source).catch(throwErr);
	if (stat.isDirectory()) return moveDirAcrossDevice(source, dest, overwrite);
	return moveFileAcrossDevice(source, dest, overwrite);
};

const moveFileAcrossDevice = (source, dest, overwrite) => new Promise((res, rej) => {
	const flags = overwrite ? 'w' : 'wx';
	const ins = this.createReadStream(source);
	const outs = this.createWriteStream(dest, { flags });

	ins.on('error', err => {
		ins.destroy();
		outs.destroy();
		outs.removeListener('close', () => { res(this.unlink(source)); });

		this.unlink(dest).catch(() => {
			if (err.code !== 'EISDIR' && err.code !== 'EPERM') rej(err);
			res(moveDirAcrossDevice(source, dest, overwrite).catch(rej));
		});
	});

	outs.on('error', err => {
		ins.destroy();
		outs.destroy();
		outs.removeListener('close', () => { res(this.unlink(source)); });
		rej(err);
	});

	outs.once('close', () => { res(this.unlink(source)); });
	ins.pipe(outs);
});

const moveDirAcrossDevice = async (source, dest, overwrite) => {
	const options = { overwrite: false };
	if (overwrite) await this.remove(dest).catch(throwErr);
	await ncp(source, dest, options).catch(throwErr);
	return this.remove(source);
};

const rimraf_ = async (myPath, options) => {
	const stat = await this.lstat(myPath).catch(er => {
		if (er && er.code === 'ENOENT') return null;
		if (er && er.code === 'EPERM' && isWindows) return fixWinEPERM(myPath, options, er);
		throw er;
	});

	if (stat && stat.isDirectory()) return rmdir(myPath, options, null);

	return this.unlink(myPath).catch(er => {
		if (er.code === 'ENOENT') return null;
		if (er.code === 'EPERM') return isWindows ? fixWinEPERM(myPath, options, er) : rmdir(myPath, options, er);
		if (er.code === 'EISDIR') return rmdir(myPath, options, er);
		throw er;
	});
};

const fixWinEPERM = async (myPath, options, err) => {
	await this.chmod(myPath, 666).catch(er => { throw er.code === 'ENOENT' ? null : err; });
	const stats = await this.stat(myPath).catch(er => { throw er.code === 'ENOENT' ? null : err; });
	if (stats.isDirectory()) return rmdir(myPath, options, err);
	else return this.unlink(myPath);
};

const rmdir = async (myPath, options, originalEr) => this.rmdir(myPath).catch(er => {
	if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) return rmkids(myPath, options);
	else if (er && er.code === 'ENOTDIR') throw originalEr;
	else throw er;
});

const rmkids = async(myPath, options) => {
	const files = this.readdir(myPath).catch(throwErr);
	if (files.length === 0) return options.rmdir(myPath);
	return Promise.all(files.map(file => this.remove(join(myPath, file), options)))
		.then(() => this.rmdir(myPath));
};

const isWritable = (myPath) => this.lstat(myPath).then(() => false).catch(err => err.code === 'ENOENT');

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
	const stat = options.dereference ? this.stat : this.lstat;
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
		else if (options.overwrite) return this.unlink(mySource).then(() => { copyFile(item, target, options); });
		else if (options.errorOnExist) throw new Error(`${target} already exists`);
	} else if (stats.isSymbolicLink()) {
		const target = item.replace(options.currentPath, options.targetPath);
		const resolvedPath = await this.readlink(item).catch(throwErr);
		return checkLink(resolvedPath, target, options);
	}
	throw new Error('FS-NEXTRA: An Unkown error has occured in startCopy.');
};

const copyFile = (file, target, options) => new Promise((res, rej) => {
	const readStream = this.createReadStream(file.name);
	const writeStream = this.createWriteStream(target, { mode: file.mode });

	readStream.on('error', rej);
	writeStream.on('error', rej);

	if (options.transform) options.transform(readStream, writeStream, file);
	else writeStream.on('open', () => { readStream.pipe(writeStream); });

	writeStream.once('close', async() => {
		const error = await this.chmod(target, file.mode).catch(err => err);
		if (error) return rej(error);
		if (!options.preserveTimestamps) return res();
		const fd = await this.open(target, 'r+').catch(err => err);
		if (fd instanceof Error) return rej(fd);
		const futimesErr = this.futimes(fd, file.atime, file.mtime).catch(err => err);
		const closeErr = fs.close(fd).catch(err => err);
		if (futimesErr || closeErr) return rej(futimesErr || closeErr);
		return res();
	});
});

const mkDir = async (dir, target, options) => {
	await this.mkdir(target, dir.mode).catch(throwErr);
	await this.chmod(target, dir.mode).catch(throwErr);
	return copyDir(dir.name, options);
};

const copyDir = async (dir, options) => {
	const items = await this.readdir(dir).catch(throwErr);
	return Promise.all(items.map(item => startCopy(join(dir, item), options)));
};

const checkLink = async (resolvedPath, target, options) => {
	if (options.dereference) resolvedPath = resolve(options.basePath, resolvedPath);
	if (await isWritable(target)) return this.symlink(resolvedPath, target);
	let targetDest = await this.readlink(target).catch(throwErr);
	if (options.dereference) targetDest = resolve(options.basePath, targetDest);
	if (targetDest === resolvedPath) return null;
	await this.unlink(target).catch(throwErr);
	return this.symlink(resolvedPath, target);
};
