const ava = require('ava');
const { fs, tempFile, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava('copyFileAtomic', async test => {
	const copy = tempFileLoc();
	await nextra.copyFileAtomic(tempFile(), copy);

	const stats = await fs.statAsync(copy);
	test.true(stats.isFile());
});
