const ava = require('ava');
const { resolve } = require('path');
const mock = require('mock-fs');
const fs = require('./lib');
const nextra = require('../src/index');

const dir = resolve(__dirname, 'test');
const files = {
	copy: resolve(dir, 'copy.txt'),
	move: resolve(dir, 'move', 'move.txt'),
	ensureDir: resolve(dir, 'ensureDir'),
	createFile: resolve(dir, 'createFile'),
	outputFile: resolve(dir, 'outputFile'),
	outputFileAtomic: resolve(dir, 'outputFileAtomic'),
	remove: resolve(dir, 'remove.txt'),
	SymlinkAtomic: resolve(dir, 'SymlinkAtomic.txt'),
	createSymlink: {
		src: resolve(dir, 'createSymlinkSrc'),
		dest: resolve(dir, 'createSymlinkDest')
	},
	createSymlinkAtomic: {
		src: resolve(dir, 'createSymlinkSrc.txt'),
		dest: resolve(dir, 'createSymlinkDest.txt')
	},
	createlink: {
		src: resolve(dir, 'createlinkSrc.txt'),
		dest: resolve(dir, 'createlinkDest.txt')
	},
	emptyDir: {
		empty: resolve(dir, 'empty'),
		full: resolve(dir, 'full')
	},
	readJSON: resolve(dir, 'readJSON.json'),
	pathExists: {
		dir: resolve(dir, 'path'),
		file: resolve(dir, 'path.txt')
	}
};

ava.before(test => {
	mock({
		[files.copy]: '',
		[files.move]: '',
		[files.ensureDir]: {},
		[files.createFile]: '',
		[files.outputFile]: '',
		[files.outputFileAtomic]: '',
		[files.remove]: '',
		[files.SymlinkAtomic]: '',
		[files.createSymlinkAtomic]: 'symLinked',
		[files.createSymlink.dest]: mock.symlink({ path: files.createSymlinkAtomic.src }),
		[files.createSymlink.src]: mock.symlink({ path: files.createSymlink.dest }),
		[files.createlink.src]: 'linked',
		[files.createlink.dest]: 'linked',
		[files.emptyDir.empty]: {},
		[files.emptyDir.full]: { 'file.txt': '' },
		[files.readJSON]: '{ "validate": true }',
		[files.pathExists.dir]: {},
		[files.pathExists.file]: ''
	});
	test.pass();
});

ava.after.always(test => {
	mock.restore();
	test.pass();
});

// Copy

ava.skip('copy (file)', async test => {
	const copy = resolve(dir, 'copy.txt');
	await nextra.copy(files.copy, copy);

	const stats = await fs.statAsync(copy);
	test.true(stats.isFile());
});

ava.skip('copy (dir)', async test => {
	await nextra.copy(files.emptyDir.full, files.emptyDir.empty);

	const stats = await fs.statAsync(resolve(files.emptyDir.empty, 'file.txt'));
	test.true(stats.isFile());
});

ava.skip('copy (symlink)', async test => {
	const copy = resolve(dir, 'copied');
	await nextra.copy(files.createSymlink.src, copy);

	const stats = await fs.lstatAsync(copy);
	test.true(stats.isSymbolicLink());
});

// CopyFileAtomic

ava.skip('copyFileAtomic', async test => {
	const copy = resolve(dir, 'copied');
	await nextra.copyFileAtomic(files.copy, copy);

	const stats = await fs.statAsync(copy);
	test.true(stats.isFile());
});

// createFile

ava.skip('createFile (pre-existing)', async test => {
	await nextra.createFile(files.createFile);

	const stats = await fs.statAsync(files.createFile);
	test.true(stats.isFile());
});

ava.skip('createFile (new)', async test => {
	const file = resolve(dir, 'createFileNew');
	await nextra.createFile(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava.skip('createFile (new recursive)', async test => {
	const file = resolve(dir, 'createFileNew2', 'createFileNew3');
	await nextra.createFile(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

// createFileAtomic

ava.skip('createFileAtomic (pre-existing)', async test => {
	await nextra.createFileAtomic(files.createFile);

	const stats = await fs.statAsync(files.createFile);
	test.true(stats.isFile());
});

ava.skip('createFileAtomic (new)', async test => {
	const file = resolve(dir, 'createFileNew');
	await nextra.createFileAtomic(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava.skip('createFileAtomic (new recursive)', async test => {
	const file = resolve(dir, 'createFileNew2', 'createFileNew3');
	await nextra.createFileAtomic(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

// createFileCopy

ava.skip('createFileCopy (new)', async test => {
	const file = resolve(dir, 'createFileNew.txt');
	await nextra.createFile(files.copy, file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava.skip('createFileCopy (new recursive)', async test => {
	const file = resolve(dir, 'createFileNew2', 'createFileNew3.txt');
	await nextra.createFile(files.copy, file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});


ava.skip('createFileCopy (atomic shortcut)', async test => {
	const file = resolve(dir, 'createFileNew.txt');
	await nextra.createFile(files.copy, file, true);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

// createFileCopyAtomic

ava.skip('createFileCopyAtomic (new)', async test => {
	const file = resolve(dir, 'createFileNew.txt');
	await nextra.createFileCopyAtomic(files.copy, file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava.skip('createFileCopyAtomic (new recursive)', async test => {
	const file = resolve(dir, 'createFileNew2', 'createFileNew3.txt');
	await nextra.createFileCopyAtomic(files.copy, file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

// createLink

ava.skip('createLink (pre-existing)', async test => {
	await nextra.createLink(files.createlink.src, files.createlink.dest);

	const stats = await fs.statAsync(files.createlink.dest);
	test.true(stats.isFile());
});

ava.skip('createLink (new)', async test => {
	const newDir = resolve(dir, 'createLinkNew.txt');
	await nextra.createLink(files.createlink.src, newDir);

	const stats = await fs.statAsync(newDir);
	test.true(stats.isFile());
});

ava.skip('createLink (new recursive)', async test => {
	const deepDir = resolve(dir, 'createLinkNew2', 'createLinkNew3.txt');
	await nextra.createLink(files.createlink.src, deepDir);

	const stats = await fs.statAsync(deepDir);
	test.true(stats.isFile());
});

// createLinkAtomic

ava.skip('createLinkAtomic (pre-existing)', async test => {
	await nextra.createLinkAtomic(files.createlink.src, files.createlink.dest);

	const stats = await fs.statAsync(files.createlink.dest);
	test.true(stats.isFile());
});

ava.skip('createLinkAtomic (new)', async test => {
	const newDir = resolve(dir, 'createLinkNew.txt');
	await nextra.createLinkAtomic(files.createlink.src, newDir);

	const stats = await fs.statAsync(newDir);
	test.true(stats.isFile());
});

ava.skip('createLinkAtomic (new recursive)', async test => {
	const deepDir = resolve(dir, 'createLinkNew2', 'createLinkNew3.txt');
	await nextra.createLinkAtomic(files.createlink.src, deepDir);

	const stats = await fs.statAsync(deepDir);
	test.true(stats.isFile());
});

// createSymlink

ava.skip('createSymlink (pre-existing)', async test => {
	await nextra.createSymlink(files.createSymlink.src, files.createSymlink.dest);

	const stats = await fs.lstatAsync(files.createSymlink.dest);
	test.true(stats.isSymbolicLink());
});

ava.skip('createSymlink (new)', async test => {
	const newDir = resolve(dir, 'createSymlinkNew');
	await nextra.createSymlink(files.createSymlink.src, newDir);

	const stats = await fs.lstatAsync(newDir);
	test.true(stats.isSymbolicLink());
});

ava.skip('createSymlink (new recursive)', async test => {
	const deepDir = resolve(dir, 'createSymlinkNew2', 'createSymlinkNew3');
	await nextra.createSymlink(files.createSymlink.src, deepDir);

	const stats = await fs.lstatAsync(deepDir);
	test.true(stats.isSymbolicLink());
});

ava.skip('createSymlink (atomic shortcut)', async test => {
	const newDir = resolve(dir, 'createSymlinkNew');
	await nextra.createSymlink(files.createSymlink.src, newDir);

	const stats = await fs.lstatAsync(newDir);
	test.true(stats.isSymbolicLink());
});

// createSymlinkAtomic

ava.skip('createSymlinkAtomic (pre-existing)', async test => {
	await nextra.createSymlinkinkAtomic(files.createSymlinkAtomic.src, files.createSymlinkAtomic.dest);

	const stats = await fs.lstatAsync(files.createSymlinkAtomic.dest);
	test.true(stats.isSymbolicLink());
});

ava.skip('createSymlinkAtomic (new)', async test => {
	const newDir = resolve(dir, 'createSymlinkAtomicNew.txt');
	await nextra.createSymlinkinkAtomic(files.createSymlinkAtomic.src, newDir);

	const stats = await fs.lstatAsync(newDir);
	test.true(stats.isSymbolicLink());
});

ava.skip('createSymlinkAtomic (new recursive)', async test => {
	const deepDir = resolve(dir, 'createSymlinkAtomicNew2', 'createSymlinkAtomicNew3.txt');
	await nextra.createSymlinkinkAtomic(files.createSymlinkAtomic.src, deepDir);

	const stats = await fs.lstatAsync(deepDir);
	test.true(stats.isSymbolicLink());
});

// emptyDir

ava.skip('emptyDir (empty)', async test => {
	await nextra.emptyDir(files.emptyDir.empty);

	const contents = await fs.readdirAsync(files.emptyDir.empty);
	test.true(contents.length === 0);
});

ava.skip('emptyDir (full)', async test => {
	await nextra.emptyDir(files.emptyDir.full);

	const contents = await fs.readdirAsync(files.emptyDir.full);
	test.true(contents.length === 0);
});

// ensureDir

ava.skip('ensureDir (pre-existing)', async test => {
	await nextra.ensureDir(files.ensureDir);

	const stats = await fs.statAsync(files.ensureDir);
	test.true(stats.isDirectory());
});

ava.skip('ensureDir (new)', async test => {
	const newDir = resolve(dir, 'ensureDirNew');
	await nextra.ensureDir(newDir);

	const stats = await fs.statAsync(newDir);
	test.true(stats.isDirectory());
});

ava.skip('ensureDir (new recursive)', async test => {
	const deepDir = resolve(dir, 'ensureDirNew2', 'ensureDirNew3');
	await nextra.ensureDir(deepDir);

	const stats = await fs.statAsync(deepDir);
	test.true(stats.isDirectory());
});

// linkAtomic

ava.skip('linkAtomic', async test => {
	const newFile = resolve(dir, 'linkAtomicNew.txt');
	await nextra.linkAtomic(files.createlink.src, newFile);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});

// move

ava.skip('move', async test => {
	test.plan(2);

	const move = resolve(dir, 'move.txt');
	await nextra.move(files.move, move, { overwrite: true });

	test.throws(fs.accessAsync(files.move));
	test.notThrows(fs.accessAsync(move));
});

ava.skip('move (self)', async test => {
	test.deepEqual(await nextra.move(files.move, files.move, { overwrite: true }), await fs.accessAsync(files.move));
});

ava.skip('move (no overwrite)', async test => {
	test.plan(2);

	const move = resolve(dir, 'move.txt');
	await nextra.move(files.move, move, { overwrite: false });

	test.throws(fs.accessAsync(files.move));
	test.notThrows(fs.accessAsync(move));
});

// outputFile

ava.skip('outputFile (pre-existing)', async test => {
	await nextra.outputFile(files.outputFile, 'pass');

	test.is(await fs.readFileAsync(files.outputFile, 'utf8'), 'pass');
});

ava.skip('outputFile (new)', async test => {
	const newDir = resolve(dir, 'outputFileNew.txt');
	await nextra.outputFile(newDir, 'pass');

	test.is(await fs.readFileAsync(newDir, 'utf8'), 'pass');
});

ava.skip('outputFile (new recursive)', async test => {
	const deepDir = resolve(dir, 'outputFileNew2', 'outputFileNew3.txt');
	await nextra.outputFile(deepDir, 'pass');

	test.is(await fs.readFileAsync(deepDir, 'utf8'), 'pass');
});

ava.skip('outputFile (atomic shortcut)', async test => {
	await nextra.outputFile(files.outputFile, 'pass', true);

	test.is(await fs.readFileAsync(files.outputFile, 'utf8'), 'pass');
});

// outputFileAtomic

ava.skip('outputFileAtomic (pre-existing)', async test => {
	await nextra.outputFileAtomic(files.outputFileAtomic, 'pass');

	test.is(await fs.readFileAsync(files.outputFileAtomic, 'utf8'), 'pass');
});

ava.skip('outputFileAtomic (new)', async test => {
	const newDir = resolve(dir, 'outputFileAtomicNew.txt');
	await nextra.outputFileAtomic(newDir, 'pass');

	test.is(await fs.readFileAsync(newDir, 'utf8'), 'pass');
});

ava.skip('outputFileAtomic (new recursive)', async test => {
	const deepDir = resolve(dir, 'outputFileAtomicNew2', 'outputFileAtomicNew3.txt');
	await nextra.outputFileAtomic(deepDir, 'pass');

	test.is(await fs.readFileAsync(deepDir, 'utf8'), 'pass');
});

// outputJSON

ava.skip('outputJSON (pre-existing)', async test => {
	const obj = { test: 'passed' };
	await nextra.outputJSON(files.createFile, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(files.createFile, 'utf8')), obj);
});

ava.skip('outputJSON (new)', async test => {
	const newDir = resolve(dir, 'outputJSONNew');
	const obj = { test: 'passed' };
	await nextra.outputJSON(newDir, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(newDir, 'utf8')), obj);
});

ava.skip('outputJSON (new recursive)', async test => {
	const deepDir = resolve(dir, 'outputJSONNew2', 'outputJSONNew3');
	const obj = { test: 'passed' };
	await nextra.outputJSON(deepDir, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(deepDir, 'utf8')), obj);
});

ava.skip('outputJSON (atomic shortcut)', async test => {
	const obj = { test: 'passed' };
	await nextra.outputJSON(files.createFile, obj, true);

	test.deepEqual(JSON.parse(await fs.readFileAsync(files.createFile, 'utf8')), obj);
});

// outputJSONAtomic

ava.skip('outputJSONAtomic (pre-existing)', async test => {
	const obj = { test: 'passed' };
	await nextra.outputJSONAtomic(files.createFile, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(files.createFile, 'utf8')), obj);
});

ava.skip('outputJSONAtomic (new)', async test => {
	const newDir = resolve(dir, 'outputJSONNew');
	const obj = { test: 'passed' };
	await nextra.outputJSONAtomic(newDir, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(newDir, 'utf8')), obj);
});

ava.skip('outputJSONAtomic (new recursive)', async test => {
	const deepDir = resolve(dir, 'outputJSONNew2', 'outputJSONNew3');
	const obj = { test: 'passed' };
	await nextra.outputJSONAtomic(deepDir, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(deepDir, 'utf8')), obj);
});

// pathExists

ava.skip('pathExists (dir true)', async test => {
	test.true(await nextra.pathExists(files.pathExists.dir));
});

ava.skip('pathExists (file true)', async test => {
	test.true(await nextra.pathExists(files.pathExists.file));
});

ava.skip('pathExists (dir false)', async test => {
	const noExist = resolve(dir, 'pathDoesntExist');
	test.false(await nextra.pathExists(noExist));
});

ava.skip('pathExists (file false)', async test => {
	const noExist = resolve(dir, 'pathDoesntExist.txt');
	test.false(await nextra.pathExists(noExist));
});

// readJSON

ava.skip('readJSON (standard)', async test => {
	const readJSON = await nextra.readJSON(files.readJSON);
	test.true(readJSON.validate);
});

ava.skip('readJSON (string options)', async test => {
	const readJSON = await nextra.readJSON(files.readJSON, 'utf8');
	test.true(readJSON.validate);
});

// remove

ava.skip('remove', async test => {
	await nextra.remove(files.remove);
	let pass = false;
	try {
		await fs.accessAsync(files.remove);
	} catch (err) {
		pass = true;
	}
	test.true(pass);
});


ava.skip('remove (non-existant)', async test => {
	test.true(await nextra.remove(resolve(dir, 'noexist')) === null);
});

// symlinkAtomic

ava.skip('symlinkAtomic', async test => {
	const file = resolve(dir, 'SymlinkAtomicTest.txt');
	await nextra.symlinkAtomic(files.SymlinkAtomic, file);

	const stats = await fs.lstatAsync(file);
	test.true(stats.isSymbolicLink());
});

// writeFileAtomic

ava.skip('writeFileAtomic', async test => {
	const file = resolve(dir, 'file.txt');
	const data = 'passed';
	await nextra.writeFileAtomic(file, data);

	test.is(await fs.readFileAsync(file, 'utf8'), data);
});

// writeJSON

ava.skip('writeJSON', async test => {
	const file = resolve(dir, 'file.json');
	const obj = { test: 'passed' };
	await nextra.writeJSON(file, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});

ava.skip('writeJSON (atomic shortcut)', async test => {
	const file = resolve(dir, 'file.json');
	const obj = { test: 'passed' };
	await nextra.writeJSON(file, obj, true);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});

// writeJSONAtomic

ava.skip('writeJSONAtomic', async test => {
	const file = resolve(dir, 'file.json');
	const obj = { test: 'passed' };
	await nextra.writeJSONAtomic(file, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});
