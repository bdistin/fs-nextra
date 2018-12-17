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

ava('overwrite dir with file', async test => {
	const existing = tempFile();
	const move = tempDir();
	await test.throwsAsync(nextra.move(existing, move, { overwrite: true }));
});

ava('overwrite existing file', async test => {
	test.plan(2);
	const existing = tempFile();
	const move = tempFile();
	await nextra.move(existing, move, { overwrite: true });

	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('no overwrite non-existent file', async test => {
	test.plan(2);
	const existing = tempFile();
	const move = tempFileLoc();
	await nextra.move(existing, move, { overwrite: false });

	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('no overwrite existing file', async test => {
	const existing = tempFile();
	const move = tempFile();
	await test.throwsAsync(nextra.move(existing, move, { overwrite: false }));
});

ava('deep mkdirp', async test => {
	test.plan(2);
	const existing = tempFile();
	const move = tempFileLoc(tempDirLoc());
	await nextra.move(existing, move, { mkdirp: true });

	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('deep no mkdirp', async test => {
	const existing = tempFile();
	const move = tempFileLoc(tempDirLoc());
	await test.throwsAsync(nextra.move(existing, move, { mkdirp: false }));
});

ava('overwrite full directory', async test => {
	test.plan(2);
	const existing = tempDir();
	tempFile(existing);
	const move = tempDir();
	tempFile(move);
	await nextra.move(existing, move, { overwrite: true });

	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('no overwrite full directory', async test => {
	test.plan(2);
	const existing = tempDir();
	tempFile(existing);
	const move = tempDir();
	tempFile(move);
	await test.throwsAsync(nextra.move(existing, move, { overwrite: false }));
});
