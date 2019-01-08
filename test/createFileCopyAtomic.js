const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../dist');

ava('New File (Standard Usage)', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createFileCopyAtomic(file, newFile);
	const stats = await fs.statAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Pre-Existing File', async test => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.createFileCopyAtomic(file, file);
	const stats = await fs.statAsync(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('New File w/ Non-Existent Directories', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	const retVal = await nextra.createFileCopyAtomic(file, newFile);
	const stats = await fs.statAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
