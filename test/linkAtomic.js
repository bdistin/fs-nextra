const ava = require('ava');
const { fs, tempFile, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava('Standard Usage', async test => {
	const newFile = tempFileLoc();
	await nextra.linkAtomic(tempFile(), newFile);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});
