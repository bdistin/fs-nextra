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
const isWindows = process.platform === 'win32';
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
	if (isWindows && invalidWin32Path(myPath)) {
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
		.then(() => fsn.mkdirs(myPath, opts, made));
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
					await fsn.remove(dest).catch(er => { throw er; });
					options.overwrite = false;
					return fsn.move(source, dest, options);
				}

				// Windows
				if (err.code === 'EPERM') {
					await setTimeoutPromise(200);
					await fsn.remove(dest).catch(er => { throw er; });
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

fsn.remove = async (myPath, options = {}) => {
	if (typeof myPath !== 'string') throw new Error('Path should be a string');
	let busyTries = 0;

	options.maxBusyTries = options.maxBusyTries || 3;

	return rimraf_(myPath, options)
		.catch(async(er) => {
			if (isWindows && (er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') &&
			busyTries < options.maxBusyTries) {
				busyTries++;
				const time = busyTries * 100;
				await setTimeoutPromise(time);
				return rimraf_(myPath, options);
			}
			if (er.code === 'ENOENT') return null;
			throw er;
		});
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
	const files = fsn.readdir(myPath).catch(er => { throw er; });
	if (files.length === 0) return options.rmdir(myPath);
	return Promise.all(files.map(file => fsn.remove(path.join(myPath, file), options)))
		.then(() => fsn.rmdir(myPath));
};

const isWritable = (myPath) => fsn.lstat(myPath).then(() => false).catch(err => err.code === 'ENOENT');

const ncp = async (source, dest, options = {}) => {
	const basePath = process.cwd();
	const currentPath = path.resolve(basePath, source);
	const targetPath = path.resolve(basePath, dest);

	const filter = typeof options.filter === 'function' ? options.filter : undefined;
	const transform = options.transform;
	let overwrite = options.overwrite;
	// If overwrite is undefined, use clobber, otherwise default to true:
	if (overwrite === undefined) overwrite = options.clobber;
	if (overwrite === undefined) overwrite = true;
	const errorOnExist = options.errorOnExist;
	const dereference = options.dereference;
	const preserveTimestamps = options.preserveTimestamps === true;

	const startCopy = async (mySource) => {
		if (filter && !filter(mySource, dest)) return null;
		return getStats(mySource);
	};

	const getStats = async (mySource) => {
		const stat = dereference ? fsn.stat : fsn.lstat;
		const stats = await stat(mySource).catch(err => { throw err; });
		const item = {
			name: mySource,
			mode: stats.mode,
			mtime: stats.mtime,
			atime: stats.atime,
			stats: stats
		};

		if (stats.isDirectory()) {
			const target = item.name.replace(currentPath, targetPath.replace('$', '$$$$'));
			if (await isWritable(target)) return mkDir(item, target);
			return copyDir(item.name);
		} else if (stats.isFile() || stats.isCharacterDevice() || stats.isBlockDevice()) {
			const target = item.name.replace(currentPath, targetPath.replace('$', '$$$$'));
			if (await isWritable(target)) return copyFile(item, target);
			else if (overwrite) return fsn.unlink(item).then(() => { copyFile(item, target); });
			else if (errorOnExist) throw new Error(`${target} already exists`);
		} else if (stats.isSymbolicLink()) {
			const target = item.replace(currentPath, targetPath);
			const resolvedPath = await fsn.readlink(item).catch(err => { throw err; });
			return checkLink(resolvedPath, target);
		}
		throw new Error('FS-NEXT: An Unkown error has occured in getStats.');
	};

	const copyFile = (file, target) => new Promise((resolve, reject) => {
		const readStream = fsn.createReadStream(file.name);
		const writeStream = fsn.createWriteStream(target, { mode: file.mode });

		readStream.on('error', reject);
		writeStream.on('error', reject);

		if (transform) transform(readStream, writeStream, file);
		else writeStream.on('open', () => { readStream.pipe(writeStream); });

		writeStream.once('close', async() => {
			const error = await fsn.chmod(target, file.mode).catch(err => err);
			if (error) return reject(error);
			if (!preserveTimestamps) return resolve();
			const fd = await fsn.open(path, 'r+').catch(err => err);
			if (fd instanceof Error) return reject(fd);
			const futimesErr = fsn.futimes(fd, file.atime, file.mtime).catch(err => err);
			const closeErr = fs.close(fd).catch(err => err);
			if (futimesErr || closeErr) return reject(futimesErr || closeErr);
			return resolve();
		});
	});

	const mkDir = async (dir, target) => {
		await fsn.mkdir(target, dir.mode).catch(err => { throw err; });
		await fsn.chmod(target, dir.mode).catch(err => { throw err; });
		return copyDir(dir.name);
	};

	const copyDir = async (dir) => {
		const items = await fsn.readdir(dir).catch(err => { throw err; });
		return Promise.all(items.map(item => startCopy(path.join(dir, item))));
	};

	const checkLink = async (resolvedPath, target) => {
		if (dereference) resolvedPath = path.resolve(basePath, resolvedPath);
		if (await isWritable(target)) return fsn.symlink(resolvedPath, target);
		let targetDest = await fsn.readlink(target).catch(err => { throw err; });
		if (dereference) targetDest = path.resolve(basePath, targetDest);
		if (targetDest === resolvedPath) return null;
		await fsn.unlink(target).catch(err => { throw err; });
		return fsn.symlink(resolvedPath, target);
	};

	return startCopy(currentPath);
};

module.exports = fsn;
