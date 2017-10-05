const ava = require('ava');
const { fs, tempFile, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava('existing', async test => {
	const file = tempFile();
	const data = 'passed';
	await nextra.writeFileAtomic(file, data);

	test.is(await fs.readFileAsync(file, 'utf8'), data);
});

ava('new', async test => {
	const file = tempFileLoc();
	const data = 'passed';
	await nextra.writeFileAtomic(file, data);

	test.is(await fs.readFileAsync(file, 'utf8'), data);
});
