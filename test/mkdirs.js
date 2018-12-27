const ava = require('ava');
const { fs, tempDirLoc, tempDir, tempFile } = require('./lib');
const nextra = require('../src');

ava('Pre-Existing Directory', async test => {
	test.plan(2);

	const dir = tempDir();
	const retVal = await nextra.ensureDir(dir);
	const stats = await fs.statAsync(dir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
});

ava('Standard Usage', async test => {
	test.plan(2);

	const newDir = tempDirLoc();
	const retVal = await nextra.ensureDir(newDir);
	const stats = await fs.statAsync(newDir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
});

ava('Recursive', async test => {
	test.plan(2);

	const deepDir = tempDirLoc(tempDirLoc());
	const retVal = await nextra.ensureDir(deepDir);
	const stats = await fs.statAsync(deepDir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
});

ava('Pre-Existing File', async test => {
	const dir = tempFile();
	await test.throwsAsync(nextra.ensureDir(dir));
});
