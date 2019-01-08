const ava = require('ava');
const { fs, tempFile, tempDir, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../dist');

ava('New File (Standard Usage)', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createFileCopy(file, newFile);
	const stats = await fs.statAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Pre-Existing File', async test => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.createFileCopy(file, file);
	const stats = await fs.statAsync(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('New File w/ Non-Existent Directories', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	const retVal = await nextra.createFileCopy(file, newFile);
	const stats = await fs.statAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('New File (Atomic Shortcut)', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createFileCopy(file, newFile, true);
	const stats = await fs.statAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Directory', async test => {
	const dir = tempDir();
	const newFile = tempFileLoc();
	await test.throwsAsync(nextra.createFileCopy(dir, newFile));
});
