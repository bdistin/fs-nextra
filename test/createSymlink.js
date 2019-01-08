const ava = require('ava');
const { relative } = require('path');
const { fs, tempFile, tempDir, tempSymlink, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../dist');

ava('New File (Standard Usage)', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlink(file, newFile);
	const stats = await fs.lstatAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('New Directory (Standard Usage)', async test => {
	test.plan(2);

	const dir = tempDir();
	const newDir = tempDirLoc();
	const retVal = await nextra.createSymlink(dir, newDir);
	const stats = await fs.lstatAsync(newDir);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Pre-Existing Symlink', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempSymlink();
	const retVal = await nextra.createSymlink(file, newFile);
	const stats = await fs.lstatAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('New File w/ Non-Existent Directories', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	const retVal = await nextra.createSymlink(file, newFile);
	const stats = await fs.lstatAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Relative Source', async test => {
	test.plan(2);

	const file = './test/createSymlink.js';
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlink(file, newFile);
	const stats = await fs.lstatAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Relative Source and Destination', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	const retVal = await nextra.createSymlink(relative(process.cwd(), file), relative(process.cwd(), newFile));
	const stats = await fs.lstatAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('New File (Atomic Shortcut)', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlink(file, newFile, true);
	const stats = await fs.lstatAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});
