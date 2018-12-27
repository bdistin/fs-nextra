const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDir, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('File', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.symlinkAtomic(file, newFile);
	const stats = await fs.lstatAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Directory', async test => {
	test.plan(2);

	const dir = tempDir();
	const newDir = tempDirLoc();
	const retVal = await nextra.symlinkAtomic(dir, newDir);
	const stats = await fs.lstatAsync(newDir);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});
