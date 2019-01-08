const ava = require('ava');
const { fs, tempFile, tempSymlink, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../dist');

ava('New File (Standard Usage)', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlinkAtomic(file, newFile);
	const stats = await fs.lstatAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Pre-Existing Symlink', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempSymlink();
	const retVal = await nextra.createSymlinkAtomic(file, newFile);
	const stats = await fs.lstatAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('New File w/ Non-Existent Directories', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	const retVal = await nextra.createSymlinkAtomic(file, newFile);
	const stats = await fs.lstatAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});
