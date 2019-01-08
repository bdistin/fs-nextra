const ava = require('ava');
const { fs, tempFile, tempFileLoc } = require('./lib');
const nextra = require('../dist');

ava('Existing', async test => {
	test.plan(2);

	const file = tempFile();
	const data = 'passed';
	const retVal = await nextra.writeFileAtomic(file, data);

	test.is(retVal, undefined);
	test.is(await fs.readFileAsync(file, 'utf8'), data);
});

ava('New', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const data = 'passed';
	const retVal = await nextra.writeFileAtomic(file, data);

	test.is(retVal, undefined);
	test.is(await fs.readFileAsync(file, 'utf8'), data);
});
