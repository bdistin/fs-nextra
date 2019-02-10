const ava = require('ava');
const { promises: fs } = require('fs');
const { tempDirLoc, tempDir, tempFile } = require('./lib');
const nextra = require('../dist');

ava('Pre-Existing Directory', async test => {
	test.plan(2);

	const dir = tempDir();
	const retVal = await nextra.ensureDir(dir);
	const stats = await fs.stat(dir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
});

ava('Standard Usage', async test => {
	test.plan(2);

	const newDir = tempDirLoc();
	const retVal = await nextra.ensureDir(newDir);
	const stats = await fs.stat(newDir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
});

ava('Standard Usage with full permissions', async test => {
	test.plan(3);

	const newDir = tempDirLoc();
	const retVal = await nextra.ensureDir(newDir, 0o0777);
	const stats = await fs.stat(newDir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
	test.is(stats.mode, 0o0777);
});

ava('Recursive', async test => {
	test.plan(2);

	const deepDir = tempDirLoc(tempDirLoc());
	const retVal = await nextra.ensureDir(deepDir);
	const stats = await fs.stat(deepDir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
});

ava('Pre-Existing File', async test => {
	const dir = tempFile();
	await test.throwsAsync(nextra.ensureDir(dir));
});
