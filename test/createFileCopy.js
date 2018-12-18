const ava = require('ava');
const { fs, tempFile, tempDir, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('new file (standard usage)', async test => {
	const file = tempFile();
	const newfile = tempFileLoc();
	await nextra.createFileCopy(file, newfile);

	const stats = await fs.statAsync(newfile);
	test.true(stats.isFile());
});

ava('pre-existing file', async test => {
	const file = tempFile();
	await nextra.createFileCopy(file, file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava('new file with non-existent directories', async test => {
	const file = tempFile();
	const newfile = tempDirLoc(tempFileLoc());
	await nextra.createFileCopy(file, newfile);

	const stats = await fs.statAsync(newfile);
	test.true(stats.isFile());
});

ava('new file (atomic shortcut)', async test => {
	const file = tempFile();
	const newfile = tempFileLoc();
	await nextra.createFileCopy(file, newfile, true);

	const stats = await fs.statAsync(newfile);
	test.true(stats.isFile());
});

ava('directory', async test => {
	const dir = tempDir();
	const newfile = tempFileLoc();
	await test.throwsAsync(nextra.createFileCopy(dir, newfile));
});
