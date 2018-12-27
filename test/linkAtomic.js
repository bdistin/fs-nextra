const ava = require('ava');
const { fs, tempFile, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava('Standard Usage', async test => {
	test.plan(2);

	const newFile = tempFileLoc();
	const retVal = await nextra.linkAtomic(tempFile(), newFile);
	const stats = await fs.statAsync(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
