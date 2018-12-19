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
	await test.throwsAsync(nextra.copy(file, newFile, { overwrite: false, errorOnExist: true }));
});

ava('File to Existing File w/o errorOnExist', async test => {
	const newFile = tempFile();
	const file = tempFile();
	await test.notThrowsAsync(nextra.copy(file, newFile, { overwrite: false, errorOnExist: false }));
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

ava('Directory to Child Directory', async test => {
	const parent = tempDir();
	const child = tempDir(parent);
	await test.throwsAsync(nextra.copy(parent, child));
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

ava('Symlink to Existing Symlink', async test => {
	const newFile = tempSymlink();
	const symlink = tempSymlink();
	await nextra.copy(symlink, newFile);

	const stats = await fs.lstatAsync(newFile);
	test.true(stats.isSymbolicLink());
});

ava('Duplicated Directories (error on exist)', async test => {
	const dir = tempDir();
	tempFile(dir);
	await test.throwsAsync(nextra.copy(dir, dir, { errorOnExist: true }));
});

ava('Duplicated File (no error on exist)', async test => {
	const file = tempFile();
	await nextra.copy(file, file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava('filter shortcut', async test => {
	const emptyDir = tempDir();
	const file = tempFile();
	await nextra.copy(file, emptyDir, () => true);

	const stats = await fs.statAsync(join(emptyDir, basename(file)));
	test.true(stats.isFile());
});

ava('filter everything', async test => {
	const emptyDir = tempDir();
	const file = tempFile();
	await nextra.copy(file, emptyDir, () => false);

	await test.throwsAsync(fs.statAsync(join(emptyDir, basename(file))));
});

ava('block device', async test => {
	if (process.platform === 'win32') {
		test.pass();
	} else {
		const file = tempFileLoc();
		await nextra.copy('/dev/null', file);

		const stats = await fs.statAsync(file);
		test.true(stats.isFile());
	}
});

ava('block device', async test => {
	if (process.platform === 'win32') {
		test.pass();
	} else {
		const file = tempFileLoc();
		await nextra.copy('/dev/tty', file);

		const stats = await fs.statAsync(file);
		test.true(stats.isFile());
	}
});
