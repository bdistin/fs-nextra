const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDir, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('file', async test => {
	const file = tempFile();
	await nextra.remove(file);
	await test.throwsAsync(fs.accessAsync(file));
});

ava('non-existant file', async test => {
	test.true(await nextra.remove(tempFileLoc()) === null);
});

ava('empty directory', async test => {
	const dir = tempDir();
	await nextra.remove(dir);
	await test.throwsAsync(fs.accessAsync(dir));
});

ava('full directory', async test => {
	const dir = tempDir();
	tempFile(dir);
	await nextra.remove(dir);
	await test.throwsAsync(fs.accessAsync(dir));
});

ava('non-existant directory', async test => {
	test.true(await nextra.remove(tempDirLoc()) === null);
});

ava('bad input', async test => {
	await test.throwsAsync(nextra.remove({}));
});
