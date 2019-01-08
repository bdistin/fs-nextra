const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../dist');

ava('New File (Standard Usage)', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const retVal = await nextra.createFileAtomic(file);
	const stats = await fs.statAsync(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Pre-Existing File', async test => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.createFileAtomic(file);
	const stats = await fs.statAsync(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('New File w/ Non-Existent Directories', async test => {
	test.plan(2);

	const file = tempDirLoc(tempFileLoc());
	const retVal = await nextra.createFileAtomic(file);
	const stats = await fs.statAsync(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
