const ava = require('ava');
const { fs, tempFile, tempDir, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('Non-Existent', async test => {
	test.plan(2);

	const dir = tempDirLoc();
	const retVal = await nextra.emptyDir(dir);
	const contents = await fs.readdirAsync(dir);

	test.is(retVal, undefined);
	test.true(contents.length === 0);
});

ava('Empty Directory', async test => {
	test.plan(2);

	const dir = tempDir();
	const retVal = await nextra.emptyDir(dir);
	const contents = await fs.readdirAsync(dir);

	test.is(retVal, undefined);
	test.true(contents.length === 0);
});

ava('Full Directory', async test => {
	test.plan(2);

	const dir = tempDir();
	tempFile(dir);
	const retVal = await nextra.emptyDir(dir);
	const contents = await fs.readdirAsync(dir);

	test.is(retVal, undefined);
	test.true(contents.length === 0);
});
