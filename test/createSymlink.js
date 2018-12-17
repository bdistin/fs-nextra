const ava = require('ava');
const { fs, tempFile, tempSymlink, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('new file (standard usage)', async test => {
	const file = tempFile();
	const newfile = tempFileLoc();
	await nextra.createSymlink(file, newfile);

	const stats = await fs.lstatAsync(newfile);
	test.true(stats.isSymbolicLink());
});

ava('pre-existing symlink', async test => {
	const file = tempFile();
	const newfile = tempSymlink();
	await nextra.createSymlink(file, newfile);

	const stats = await fs.lstatAsync(newfile);
	test.true(stats.isSymbolicLink());
});

ava('new file with non-existent directories', async test => {
	const file = tempFile();
	const newfile = tempDirLoc(tempFileLoc());
	await nextra.createSymlink(file, newfile);

	const stats = await fs.lstatAsync(newfile);
	test.true(stats.isSymbolicLink());
});

ava('relative source', async test => {
	const file = './test/createSymlink.js';
	const newfile = tempFileLoc();
	await nextra.createSymlink(file, newfile);

	const stats = await fs.lstatAsync(newfile);
	test.true(stats.isSymbolicLink());
});

ava('new file (atomic shortcut)', async test => {
	const file = tempFile();
	const newfile = tempFileLoc();
	await nextra.createSymlink(file, newfile, true);

	const stats = await fs.lstatAsync(newfile);
	test.true(stats.isSymbolicLink());
});
