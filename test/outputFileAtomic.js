const ava = require('ava');
const { promises: fs } = require('fs');
const { tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../dist');

ava('Pre-Existing', async test => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.outputFileAtomic(file, 'pass');

	test.is(retVal, undefined);
	test.is(await fs.readFile(file, 'utf8'), 'pass');
});

ava('New', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const retVal = await nextra.outputFileAtomic(file, 'pass');

	test.is(retVal, undefined);
	test.is(await fs.readFile(file, 'utf8'), 'pass');
});

ava('New Recursive', async test => {
	test.plan(2);

	const deepDir = tempDirLoc(tempFileLoc());
	const retVal = await nextra.outputFileAtomic(deepDir, 'pass');

	test.is(retVal, undefined);
	test.is(await fs.readFile(deepDir, 'utf8'), 'pass');
});
