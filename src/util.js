const { sep, resolve, dirname, basename, join, normalize, isAbsolute, relative } = require('path');
const { promisify } = require('util');
const { randomBytes } = require('crypto');
const { tmpdir } = require('os');

const { rmdir, lstat, createReadStream, createWriteStream, unlink, stat, chmod, readdir, readlink, mkdir, symlink, copyFile } = require('./fs');

const remove = require('./nextra/remove');
const pathExists = require('./nextra/pathExists');

exports.o777 = 0o0777;

exports.isWindows = process.platform === 'win32';

exports.setTimeoutPromise = promisify(setTimeout);

exports.stripBom = (content) => {
	if (Buffer.isBuffer(content)) content = content.toString('utf8');
	return content.replace(/^\uFEFF/, '');
};

exports.invalidWin32Path = (myPath) => {
	const root = normalize(resolve(myPath)).split(sep);
	const rp = root.length > 0 ? root[0] : null;
	return /[<>:"|?*]/.test(myPath.replace(rp, ''));
};

exports.symlinkType = async (srcpath, type = false) => {
	if (type) return type;
	const stats = await lstat(srcpath).catch(() => 'file');
	return stats && stats.isDirectory() ? 'dir' : 'file';
};

exports.symlinkPaths = async (srcpath, dstpath) => {
	if (isAbsolute(srcpath)) {
		await lstat(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureSymlink'); });
		return { toCwd: srcpath, toDst: srcpath };
	}
	const dstdir = dirname(dstpath);
	const relativeToDst = join(dstdir, srcpath);
	if (await pathExists(relativeToDst)) return { toCwd: relativeToDst, toDst: srcpath };
	await lstat(srcpath).catch(err => { throw err.message.replace('lstat', 'ensureSymlink'); });
	return { toCwd: srcpath, toDst: relative(dstdir, srcpath) };
};

exports.moveAcrossDevice = async (source, dest, overwrite) => {
	const stats = await stat(source);
	if (stats.isDirectory()) return this.moveDirAcrossDevice(source, dest, overwrite);
	return this.moveFileAcrossDevice(source, dest, overwrite);
};

exports.moveFileAcrossDevice = (source, dest, overwrite) => new Promise((res, rej) => {
	const flags = overwrite ? 'w' : 'wx';
	const ins = createReadStream(source);
	const outs = createWriteStream(dest, { flags });

	ins.on('error', err => {
		ins.destroy();
		outs.destroy();
		outs.removeListener('close', () => { res(unlink(source)); });

		unlink(dest).catch(() => {
			if (err.code !== 'EISDIR' && err.code !== 'EPERM') rej(err);
			res(this.moveDirAcrossDevice(source, dest, overwrite).catch(rej));
		});
	});

	outs.on('error', err => {
		ins.destroy();
		outs.destroy();
		outs.removeListener('close', () => { res(unlink(source)); });
		rej(err);
	});

	outs.once('close', () => { res(unlink(source)); });
	ins.pipe(outs);
});

exports.moveDirAcrossDevice = async (source, dest, overwrite) => {
	const options = { overwrite: false };
	if (overwrite) await remove(dest);
	await this.ncp(source, dest, options);
	return remove(source);
};

exports.rimraf = async (myPath, options) => {
	const stats = await lstat(myPath).catch(er => {
		if (er && er.code === 'ENOENT') return null;
		if (er && er.code === 'EPERM' && this.isWindows) return this.fixWinEPERM(myPath, options, er);
		throw er;
	});

	if (stats && stats.isDirectory()) return this.removeDir(myPath, options, null);

	return unlink(myPath).catch(er => {
		if (er.code === 'ENOENT') return null;
		if (er.code === 'EPERM') return this.isWindows ? this.fixWinEPERM(myPath, options, er) : this.removeDir(myPath, options, er);
		if (er.code === 'EISDIR') return this.removeDir(myPath, options, er);
		throw er;
	});
};

exports.fixWinEPERM = async (myPath, options, err) => {
	await chmod(myPath, 666).catch(er => { throw er.code === 'ENOENT' ? null : err; });
	const stats = await stat(myPath).catch(er => { throw er.code === 'ENOENT' ? null : err; });
	if (stats.isDirectory()) return this.removeDir(myPath, options, err);
	else return unlink(myPath);
};

exports.removeDir = async (myPath, options, originalEr) => rmdir(myPath).catch(er => {
	if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) return this.rmkids(myPath, options);
	else if (er && er.code === 'ENOTDIR') throw originalEr;
	else throw er;
});

exports.rmkids = async (myPath, options) => {
	const files = await readdir(myPath);
	if (!files.length) return rmdir(myPath);
	return Promise.all(files.map(file => remove(join(myPath, file), options)))
		.then(() => rmdir(myPath));
};

exports.isWritable = (myPath) => lstat(myPath).then(() => false).catch(err => err.code === 'ENOENT');

exports.ncp = async (source, dest, options = {}) => {
	options.basePath = process.cwd();
	options.currentPath = resolve(options.basePath, source);
	options.targetPath = resolve(options.basePath, dest);
	options.filter = typeof options.filter === 'function' ? options.filter : undefined;
	options.overwrite = options.overwrite ? options.clobber : true;
	options.preserveTimestamps = options.preserveTimestamps === true;
	return this.startCopy(options.currentPath, options);
};

exports.startCopy = async (mySource, options) => {
	if (options.filter && !options.filter(mySource, options.targetPath)) return null;
	const myStat = options.dereference ? stat : lstat;
	const stats = await myStat(mySource);
	const item = {
		name: mySource,
		mode: stats.mode,
		mtime: stats.mtime,
		atime: stats.atime,
		stats: stats
	};

	if (stats.isDirectory()) {
		const target = item.name.replace(options.currentPath, options.targetPath.replace('$', '$$$$'));
		if (await this.isWritable(target)) return this.mkDir(item, target, options);
		return this.copyDir(item.name, options);
	} else if (stats.isFile() || stats.isCharacterDevice() || stats.isBlockDevice()) {
		const target = item.name.replace(options.currentPath, options.targetPath.replace('$', '$$$$'));
		if (await this.isWritable(target)) return copyFile(mySource, target.endsWith(basename(mySource)) ? target : join(target, basename(mySource)), options);
		else if (options.overwrite) return unlink(target).then(() => { copyFile(mySource, join(target, target.endsWith(basename(mySource)) ? target : join(target, basename(mySource))), options); });
		else if (options.errorOnExist) throw new Error(`${target} already exists`);
	} else if (stats.isSymbolicLink()) {
		const target = mySource.replace(options.currentPath, options.targetPath);
		const resolvedPath = await readlink(item);
		return this.checkLink(resolvedPath, target, options);
	}
	throw new Error('FS-NEXTRA: An Unkown error has occured in startCopy.');
};

exports.mkDir = async (dir, target, options) => {
	await mkdir(target, dir.mode);
	await chmod(target, dir.mode);
	return this.copyDir(dir.name, options);
};

exports.copyDir = async (dir, options) => {
	const items = await readdir(dir);
	return Promise.all(items.map(item => this.startCopy(join(dir, item), options)));
};

exports.checkLink = async (resolvedPath, target, options) => {
	if (options.dereference) resolvedPath = resolve(options.basePath, resolvedPath);
	if (await this.isWritable(target)) return symlink(resolvedPath, target);
	let targetDest = await readlink(target);
	if (options.dereference) targetDest = resolve(options.basePath, targetDest);
	if (targetDest === resolvedPath) return null;
	await unlink(target);
	return symlink(resolvedPath, target);
};

exports.uuid = () => {
	const id = randomBytes(32).toString('hex');
	return (Array(32).join(0) + id).slice(-32).replace(/^.{8}|.{4}(?!$)/g, '$&-');
};

exports.tempFile = ext => join(tmpdir(), this.uuid() + (ext || ''));
