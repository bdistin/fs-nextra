const ava = require('ava');
const { promises: fs } = require('fs');
const { tempFile, tempFileLoc } = require('./lib');
const nextra = require('../dist');

ava('Standard Usage', async test => {
	test.plan(2);

	const copy = tempFileLoc();
	const retVal = await nextra.copyFileAtomic(tempFile(), copy);
	const stats = await fs.stat(copy);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
