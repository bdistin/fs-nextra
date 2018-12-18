const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('new file (standard usage)', async test => {
	const file = tempFile();
	const newFile = tempFileLoc();
	await nextra.createFileCopyAtomic(file, newFile);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});

ava('pre-existing file', async test => {
	const file = tempFile();
	await nextra.createFileCopyAtomic(file, file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava('new file with non-existent directories', async test => {
	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	await nextra.createFileCopyAtomic(file, newFile);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});
