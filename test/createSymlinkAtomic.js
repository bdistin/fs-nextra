const ava = require('ava');
const { fs, tempFile, tempSymlink, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('new file (standard usage)', async test => {
	const file = tempFile();
	const newfile = tempFileLoc();
	await nextra.createSymlinkAtomic(file, newfile);

	const stats = await fs.lstatAsync(newfile);
	test.true(stats.isSymbolicLink());
});

ava('pre-existing symlink', async test => {
	const file = tempFile();
	const newfile = tempSymlink();
	await nextra.createSymlinkAtomic(file, newfile);

	const stats = await fs.lstatAsync(newfile);
	test.true(stats.isSymbolicLink());
});

ava('new file with non-existant directories', async test => {
	const file = tempFile();
	const newfile = tempDirLoc(tempFileLoc());
	await nextra.createSymlinkAtomic(file, newfile);

	const stats = await fs.lstatAsync(newfile);
	test.true(stats.isSymbolicLink());
});
