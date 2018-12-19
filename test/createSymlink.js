const ava = require('ava');
const { relative } = require('path');
const { fs, tempFile, tempDir, tempSymlink, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('new file (standard usage)', async test => {
	const file = tempFile();
	const newFile = tempFileLoc();
	await nextra.createSymlink(file, newFile);

	const stats = await fs.lstatAsync(newFile);
	test.true(stats.isSymbolicLink());
});

ava('new dir (standard usage)', async test => {
	const dir = tempDir();
	const newDir = tempDirLoc();
	await nextra.createSymlink(dir, newDir);

	const stats = await fs.lstatAsync(newDir);
	test.true(stats.isSymbolicLink());
});

ava('pre-existing symlink', async test => {
	const file = tempFile();
	const newFile = tempSymlink();
	await nextra.createSymlink(file, newFile);

	const stats = await fs.lstatAsync(newFile);
	test.true(stats.isSymbolicLink());
});

ava('new file with non-existent directories', async test => {
	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	await nextra.createSymlink(file, newFile);

	const stats = await fs.lstatAsync(newFile);
	test.true(stats.isSymbolicLink());
});

ava('relative source', async test => {
	const file = './test/createSymlink.js';
	const newFile = tempFileLoc();
	await nextra.createSymlink(file, newFile);

	const stats = await fs.lstatAsync(newFile);
	test.true(stats.isSymbolicLink());
});

ava('relative source and destination', async test => {
	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	await nextra.createSymlink(relative(process.cwd(), file), relative(process.cwd(), newFile));

	const stats = await fs.lstatAsync(newFile);
	test.true(stats.isSymbolicLink());
});

ava('new file (atomic shortcut)', async test => {
	const file = tempFile();
	const newFile = tempFileLoc();
	await nextra.createSymlink(file, newFile, true);

	const stats = await fs.lstatAsync(newFile);
	test.true(stats.isSymbolicLink());
});
