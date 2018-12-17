const ava = require('ava');
const { fs, tempFileLoc, tempDirLoc, tempFile, tempDir } = require('./lib');
const nextra = require('../src');

ava('standard usage', async test => {
	test.plan(2);
	const existing = tempFile();
	const move = tempFileLoc();
	await nextra.move(existing, move);

	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('self', async test => {
	const existing = tempFile();
	test.deepEqual(await nextra.move(existing, existing, { overwrite: true }), await fs.accessAsync(existing));
});

ava('overwrite exiting dir', async test => {
	test.plan(2);
	const existing = tempFile();
	const move = tempDir();
	await nextra.move(existing, move, { overwrite: true });

	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('no overwrite', async test => {
	test.plan(2);
	const existing = tempFile();
	const move = tempFileLoc();
	await nextra.move(existing, move, { overwrite: false });

	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('deep', async test => {
	test.plan(2);
	const existing = tempFile();
	const move = tempFileLoc(tempDirLoc());
	await nextra.move(existing, move, { mkdirp: true });

	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});
