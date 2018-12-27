const ava = require('ava');
const { fs, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava('Standard Usage', async test => {
	const file = tempFileLoc();
	await fs.writeFileAsync(file, JSON.stringify({ validate: true }));
	const readJSON = await nextra.readJSON(file);

	test.true(readJSON.validate);
});

ava('String Options', async test => {
	const file = tempFileLoc();
	await fs.writeFileAsync(file, JSON.stringify({ validate: true }));
	const readJSON = await nextra.readJSON(file, 'utf8');

	test.true(readJSON.validate);
});
