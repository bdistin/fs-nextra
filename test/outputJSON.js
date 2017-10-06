const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('pre-existing', async test => {
	const file = tempFile();
	const obj = { test: 'passed' };
	await nextra.outputJSON(file, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});

ava('new', async test => {
	const newDir = tempFileLoc();
	const obj = { test: 'passed' };
	await nextra.outputJSON(newDir, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(newDir, 'utf8')), obj);
});

ava('new recursive', async test => {
	const deepDir = tempFileLoc(tempDirLoc());
	const obj = { test: 'passed' };
	await nextra.outputJSON(deepDir, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(deepDir, 'utf8')), obj);
});

ava('atomic shortcut', async test => {
	const newDir = tempFileLoc();
	const obj = { test: 'passed' };
	await nextra.outputJSON(newDir, obj, true);

	test.deepEqual(JSON.parse(await fs.readFileAsync(newDir, 'utf8')), obj);
});
