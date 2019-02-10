const ava = require('ava');
const { promises: fs } = require('fs');
const { tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../dist');

ava('New File (Standard Usage)', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createLinkAtomic(file, newFile);
	const stats = await fs.stat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Pre-Existing File', async test => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.createLinkAtomic(file, file);
	const stats = await fs.stat(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('New File w/ Non-Existent Directories', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc(tempDirLoc());
	const retVal = await nextra.createLinkAtomic(file, newFile);
	const stats = await fs.stat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
