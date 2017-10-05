const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('new file (standard usage)', async test => {
	const file = tempFileLoc();
	await nextra.createFileAtomic(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava('pre-existing file', async test => {
	const file = tempFile();
	await nextra.createFileAtomic(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava('new file with non-existant directories', async test => {
	const file = tempDirLoc(tempFileLoc());
	await nextra.createFileAtomic(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});
