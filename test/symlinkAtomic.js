const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDir, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('file', async test => {
	const file = tempFile();
	const newfile = tempFileLoc();
	await nextra.symlinkAtomic(file, newfile);

	const stats = await fs.lstatAsync(newfile);
	test.true(stats.isSymbolicLink());
});

ava('directory', async test => {
	const dir = tempDir();
	const newDir = tempDirLoc();
	await nextra.symlinkAtomic(dir, newDir);

	const stats = await fs.lstatAsync(newDir);
	test.true(stats.isSymbolicLink());
});
