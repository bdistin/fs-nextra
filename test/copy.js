const ava = require('ava');
const { join, basename } = require('path');
const { fs, tempFile, tempFileLoc, tempDir, tempDirLoc, tempSymlink } = require('./lib');
const nextra = require('../src');

ava('File to New File Location', async test => {
	const newFile = tempFileLoc();
	const file = tempFile();
	await nextra.copy(file, newFile);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});

ava('File to Existing File', async test => {
	const newFile = tempFile();
	const file = tempFile();
	await nextra.copy(file, newFile);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});

ava('File to Existing File w/ errorOnExist', async test => {
	const newFile = tempFile();
	const file = tempFile();
	await test.throws(nextra.copy(file, newFile, { overwrite: false, errorOnExist: true }));
});

ava('File to Empty Directory', async test => {
	const emptyDir = tempDir();
	const file = tempFile();
	await nextra.copy(file, emptyDir);

	const stats = await fs.statAsync(join(emptyDir, basename(file)));
	test.true(stats.isFile());
});

ava('Directory to Empty Directory', async test => {
	const fullDir = tempDir();
	const emptyDir = tempDir();
	const file = tempFile(fullDir);
	await nextra.copy(fullDir, emptyDir);

	const stats = await fs.statAsync(join(emptyDir, basename(file)));
	test.true(stats.isFile());
});

ava('Directory to new Deep Directory', async test => {
	const fullDir = tempDir();
	const emptyDir = tempDirLoc(tempDirLoc());
	const file = tempFile(fullDir);
	await nextra.copy(fullDir, emptyDir);

	const stats = await fs.statAsync(join(emptyDir, basename(file)));
	test.true(stats.isFile());
});

ava('Symlink to Empty Directory', async test => {
	const emptyDir = tempDir();
	const symlink = tempSymlink();
	await nextra.copy(symlink, emptyDir);

	const stats = await fs.lstatAsync(join(emptyDir, basename(symlink)));
	test.true(stats.isSymbolicLink());
});

ava('Duplicated Directories', async test => {
	const dir = tempDir();
	tempFile(dir);
	await test.throws(nextra.copy(dir, dir));
});

ava('filter shortcut', async test => {
	const emptyDir = tempDir();
	const file = tempFile();
	await nextra.copy(file, emptyDir, () => true);

	const stats = await fs.statAsync(join(emptyDir, basename(file)));
	test.true(stats.isFile());
});
