const ava = require('ava');
const { fs, tempFile, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava.skip('Standard Usage', async test => {
	const newFile = tempFileLoc();
	await nextra.linkAtomic(tempFile(), newFile);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});
