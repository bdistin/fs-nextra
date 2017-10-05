const ava = require('ava');
const { join, basename } = require('path');
const { fs, tempFile, tempDir, tempSymlink, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava('copy (file)', async test => {
	const emptyDir = tempDir();
	const file = tempFileLoc();
	await nextra.copy(tempFile(), emptyDir);

	const stats = await fs.statAsync(join(emptyDir, basename(file)));
	test.true(stats.isFile());
});

ava('copy (dir)', async test => {
	const fullDir = tempDir();
	const emptyDir = tempDir();
	const file = tempFile(fullDir);
	await nextra.copy(fullDir, emptyDir);

	const stats = await fs.statAsync(join(emptyDir, basename(file)));
	test.true(stats.isFile());
});

ava('copy (symlink)', async test => {
	const emptyDir = tempDir();
	const symlink = tempSymlink();
	await nextra.copy(symlink, emptyDir);

	const stats = await fs.lstatAsync(join(emptyDir, basename(symlink)));
	test.true(stats.isSymbolicLink());
});
