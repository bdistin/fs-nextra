const ava = require('ava');
const { promises: fs } = require('fs');
const { tempFileLoc } = require('./lib');
const nextra = require('../dist');

ava('Standard Usage', async test => {
	const file = tempFileLoc();
	await fs.writeFile(file, JSON.stringify({ validate: true }));
	const readJSON = await nextra.readJSON(file);

	test.true(readJSON.validate);
});

ava('String Options', async test => {
	const file = tempFileLoc();
	await fs.writeFile(file, JSON.stringify({ validate: true }));
	const readJSON = await nextra.readJSON(file, 'utf8');

	test.true(readJSON.validate);
});
