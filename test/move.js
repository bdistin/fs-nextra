const ava = require('ava');
const { fs, tempFileLoc, tempDirLoc, tempFile, tempDir } = require('./lib');
const nextra = require('../dist');

// #region Success

ava('Standard Usage', async test => {
	test.plan(3);

	const existing = tempFile();
	const move = tempFileLoc();
	const retVal = await nextra.move(existing, move);

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('Self', async test => {
	test.plan(2);

	const existing = tempFile();
	const retVal = await nextra.move(existing, existing, { overwrite: true });

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.accessAsync(existing));
});

ava('Overwrite Existing File', async test => {
	test.plan(3);

	const existing = tempFile();
	const move = tempFile();
	const retVal = await nextra.move(existing, move, { overwrite: true });

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('No Overwrite Non-Existent File', async test => {
	test.plan(3);

	const existing = tempFile();
	const move = tempFileLoc();
	const retVal = await nextra.move(existing, move, { overwrite: false });

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('Deep Destination', async test => {
	test.plan(3);

	const existing = tempFile();
	const move = tempFileLoc(tempDirLoc());
	const retVal = await nextra.move(existing, move);

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

ava('Overwrite Full Directory', async test => {
	test.plan(3);

	const existing = tempDir();
	tempFile(existing);
	const move = tempDir();
	tempFile(move);
	const retVal = await nextra.move(existing, move, { overwrite: true });

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.accessAsync(move));
	await test.throwsAsync(fs.accessAsync(existing));
});

// #endregion Success

// #region Throws

ava('Directory to Child Directory', async test => {
	const parent = tempDir();
	const child = tempDir(parent);
	await test.throwsAsync(nextra.move(parent, child));
});

ava('No Overwrite Existing File', async test => {
	const existing = tempFile();
	const move = tempFile();
	await test.throwsAsync(nextra.move(existing, move, { overwrite: false }));
});

ava('No Overwrite Full Directory', async test => {
	const existing = tempDir();
	tempFile(existing);
	const move = tempDir();
	tempFile(move);
	await test.throwsAsync(nextra.move(existing, move, { overwrite: false }));
});

// #endregion Throws
