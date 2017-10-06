const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('pre-existing', async test => {
	const file = tempFile();
	await nextra.outputFileAtomic(file, 'pass');

	test.is(await fs.readFileAsync(file, 'utf8'), 'pass');
});

ava('new', async test => {
	const file = tempFileLoc();
	await nextra.outputFileAtomic(file, 'pass');

	test.is(await fs.readFileAsync(file, 'utf8'), 'pass');
});

ava('new recursive', async test => {
	const deepDir = tempDirLoc(tempFileLoc());
	await nextra.outputFileAtomic(deepDir, 'pass');

	test.is(await fs.readFileAsync(deepDir, 'utf8'), 'pass');
});
