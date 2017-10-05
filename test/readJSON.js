const ava = require('ava');
const { fs, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava.skip('standard usage', async test => {
	const file = tempFileLoc();
	fs.writeFileAsync(file, JSON.stringify({ validate: true }));
	const readJSON = await nextra.readJSON(file);
	test.true(readJSON.validate);
});

ava.skip('string options', async test => {
	const file = tempFileLoc();
	fs.writeFileAsync(file, JSON.stringify({ validate: true }));
	const readJSON = await nextra.readJSON(file, 'utf8');
	test.true(readJSON.validate);
});
