const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('new file (standard usage)', async test => {
	const file = tempFile();
	const newFile = tempFileLoc();
	await nextra.createLink(file, newFile);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});

ava('pre-existing file', async test => {
	const file = tempFile();
	await nextra.createLink(file, file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava('new file with non-existent directories', async test => {
	const file = tempFile();
	const newFile = tempFileLoc(tempDirLoc());
	await nextra.createLink(file, newFile);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});

ava('new file (atomic shortcut)', async test => {
	const file = tempFile();
	const newFile = tempFileLoc();
	await nextra.createLink(file, newFile, true);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});
