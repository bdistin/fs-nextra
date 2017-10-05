const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('new file (standard usage)', async test => {
	const file = tempFile();
	const newfile = tempFileLoc();
	await nextra.createLink(file, newfile);

	const stats = await fs.statAsync(newfile);
	test.true(stats.isFile());
});

ava('pre-existing file', async test => {
	const file = tempFile();
	await nextra.createLink(file, file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava('new file with non-existant directories', async test => {
	const file = tempFile();
	const newfile = tempDirLoc(tempFileLoc());
	await nextra.createLink(file, newfile);

	const stats = await fs.statAsync(newfile);
	test.true(stats.isFile());
});

ava('new file (atomic shortcut)', async test => {
	const file = tempFile();
	const newfile = tempFileLoc();
	await nextra.createLink(file, newfile, true);

	const stats = await fs.statAsync(newfile);
	test.true(stats.isFile());
});
