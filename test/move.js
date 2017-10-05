const ava = require('ava');
const { fs, tempFileLoc, tempFile } = require('./lib');
const nextra = require('../src');

ava('standard usage', async test => {
	test.plan(2);
	const existing = tempFile();
	const move = tempFileLoc();
	await nextra.move(existing, move, { overwrite: true });

	await test.notThrows(fs.accessAsync(move));
	await test.throws(fs.accessAsync(existing));
});

ava('self', async test => {
	const existing = tempFile();
	test.deepEqual(await nextra.move(existing, existing, { overwrite: true }), await fs.accessAsync(existing));
});

ava('no overwrite', async test => {
	test.plan(2);
	const existing = tempFile();
	const move = tempFileLoc();
	await nextra.move(existing, move, { overwrite: false });

	await test.notThrows(fs.accessAsync(move));
	await test.throws(fs.accessAsync(existing));
});
