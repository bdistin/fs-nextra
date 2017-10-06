const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('pre-existing', async test => {
	const file = tempFile();
	const obj = { test: 'passed' };
	await nextra.outputJSONAtomic(file, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});

ava('new', async test => {
	const newDir = tempFileLoc();
	const obj = { test: 'passed' };
	await nextra.outputJSONAtomic(newDir, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(newDir, 'utf8')), obj);
});

ava('new recursive', async test => {
	const deepDir = tempFileLoc(tempDirLoc());
	const obj = { test: 'passed' };
	await nextra.outputJSONAtomic(deepDir, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(deepDir, 'utf8')), obj);
});
