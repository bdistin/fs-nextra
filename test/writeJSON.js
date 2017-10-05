const ava = require('ava');
const { fs, tempFile, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava('standard usage', async test => {
	const file = tempFileLoc();
	const obj = { test: 'passed' };
	await nextra.writeJSON(file, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});

ava('existing', async test => {
	const file = tempFile();
	const obj = { test: 'passed' };
	await nextra.writeJSON(file, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});


ava('atomic shortcut', async test => {
	const file = tempFileLoc();
	const obj = { test: 'passed' };
	await nextra.writeJSON(file, obj, true);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});
