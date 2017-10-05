const ava = require('ava');
const { fs, tempFile, tempDir } = require('./lib');
const nextra = require('../src');

ava('emptyDir (empty)', async test => {
	const dir = tempDir();
	await nextra.emptyDir(dir);

	const contents = await fs.readdirAsync(dir);
	test.true(contents.length === 0);
});

ava('emptyDir (full)', async test => {
	const dir = tempDir();
	tempFile(dir);
	await nextra.emptyDir(dir);

	const contents = await fs.readdirAsync(dir);
	test.true(contents.length === 0);
});
