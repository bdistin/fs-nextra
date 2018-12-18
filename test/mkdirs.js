const ava = require('ava');
const { fs, tempDirLoc, tempDir, tempFile } = require('./lib');
const nextra = require('../src');

ava('pre-existing directory', async test => {
	const dir = tempDir();
	await nextra.ensureDir(dir);

	const stats = await fs.statAsync(dir);
	test.true(stats.isDirectory());
});

ava('pre-existing file', async test => {
	const dir = tempFile();
	await test.throwsAsync(nextra.ensureDir(dir));
});

ava('standard usage', async test => {
	const newDir = tempDirLoc();
	await nextra.ensureDir(newDir);

	const stats = await fs.statAsync(newDir);
	test.true(stats.isDirectory());
});

ava('recursive', async test => {
	const deepDir = tempDirLoc(tempDirLoc());
	await nextra.ensureDir(deepDir);

	const stats = await fs.statAsync(deepDir);
	test.true(stats.isDirectory());
});
