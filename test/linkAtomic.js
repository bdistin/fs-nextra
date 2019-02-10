const ava = require('ava');
const { promises: fs } = require('fs');
const { tempFile, tempFileLoc } = require('./lib');
const nextra = require('../dist');

ava('Standard Usage', async test => {
	test.plan(2);

	const newFile = tempFileLoc();
	const retVal = await nextra.linkAtomic(tempFile(), newFile);
	const stats = await fs.stat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
