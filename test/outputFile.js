const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('pre-existing', async test => {
	const file = tempFile();
	await nextra.outputFile(file, 'pass');

	test.is(await fs.readFileAsync(file, 'utf8'), 'pass');
});

ava('new', async test => {
	const file = tempFileLoc();
	await nextra.outputFile(file, 'pass');

	test.is(await fs.readFileAsync(file, 'utf8'), 'pass');
});

ava('new recursive', async test => {
	const deepDir = tempDirLoc(tempFileLoc());
	await nextra.outputFile(deepDir, 'pass');

	test.is(await fs.readFileAsync(deepDir, 'utf8'), 'pass');
});

ava('atomic shortcut', async test => {
	const file = tempFileLoc();
	await nextra.outputFile(file, 'pass', true);

	test.is(await fs.readFileAsync(file, 'utf8'), 'pass');
});
