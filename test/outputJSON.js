const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('Pre-Existing', async test => {
	test.plan(2);

	const file = tempFile();
	const obj = { test: 'passed' };
	const retVal = await nextra.outputJSON(file, obj);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});

ava('New', async test => {
	test.plan(2);

	const newDir = tempFileLoc();
	const obj = { test: 'passed' };
	const retVal = await nextra.outputJSON(newDir, obj);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFileAsync(newDir, 'utf8')), obj);
});

ava('New Recursive', async test => {
	test.plan(2);

	const deepDir = tempFileLoc(tempDirLoc());
	const obj = { test: 'passed' };
	const retVal = await nextra.outputJSON(deepDir, obj);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFileAsync(deepDir, 'utf8')), obj);
});

ava('Atomic Shortcut', async test => {
	test.plan(2);

	const newDir = tempFileLoc();
	const obj = { test: 'passed' };
	const retVal = await nextra.outputJSON(newDir, obj, true);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFileAsync(newDir, 'utf8')), obj);
});
