const ava = require('ava');
const { fs, tempFile, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava('standard usage', async test => {
	const file = tempFileLoc();
	const obj = { test: 'passed' };
	await nextra.writeJSONAtomic(file, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});

ava('existing', async test => {
	const file = tempFile();
	const obj = { test: 'passed' };
	await nextra.writeJSONAtomic(file, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});
