const ava = require('ava');
const { fs, tempFile, tempSymlink, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('new file (standard usage)', async test => {
	const file = tempFile();
	const newFile = tempFileLoc();
	await nextra.createSymlinkAtomic(file, newFile);

	const stats = await fs.lstatAsync(newFile);
	test.true(stats.isSymbolicLink());
});

ava('pre-existing symlink', async test => {
	const file = tempFile();
	const newFile = tempSymlink();
	await nextra.createSymlinkAtomic(file, newFile);

	const stats = await fs.lstatAsync(newFile);
	test.true(stats.isSymbolicLink());
});

ava('new file with non-existent directories', async test => {
	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	await nextra.createSymlinkAtomic(file, newFile);

	const stats = await fs.lstatAsync(newFile);
	test.true(stats.isSymbolicLink());
});
