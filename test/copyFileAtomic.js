const ava = require('ava');
const { fs, tempFile, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava('Standard Usage', async test => {
	test.plan(2);

	const copy = tempFileLoc();
	const retVal = await nextra.copyFileAtomic(tempFile(), copy);
	const stats = await fs.statAsync(copy);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
