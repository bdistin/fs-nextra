const ava = require('ava');
const { promises: fs } = require('fs');
const { tempFile, tempFileLoc, tempDir, tempDirLoc } = require('./lib');
const nextra = require('../dist');

ava('File', async test => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.remove(file);

	test.is(retVal, undefined);
	await test.throwsAsync(fs.access(file));
});

ava('Empty Directory', async test => {
	test.plan(2);

	const dir = tempDir();
	const retVal = await nextra.remove(dir);

	test.is(retVal, undefined);
	await test.throwsAsync(fs.access(dir));
});

ava('Full Directory', async test => {
	test.plan(2);

	const dir = tempDir();
	tempFile(dir);
	const retVal = await nextra.remove(dir);

	test.is(retVal, undefined);
	await test.throwsAsync(fs.access(dir));
});

ava('Non-Existent File', async test => {
	await test.notThrowsAsync(nextra.remove(tempFileLoc()));
});

ava('Non-Existent Directory', async test => {
	await test.notThrowsAsync(nextra.remove(tempDirLoc()));
});

ava('Bad Input', async test => {
	await test.throwsAsync(nextra.remove({}));
});
