import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFileLoc, tempDirLoc, tempFile, tempDir } from './lib';
import * as nextra from '../dist';

// #region Success

ava('Standard Usage', async test => {
	test.plan(3);

	const existing = tempFile();
	const move = tempFileLoc();
	const retVal = await nextra.move(existing, move);

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.access(move));
	await test.throwsAsync(fs.access(existing));
});

ava('Self', async test => {
	test.plan(2);

	const existing = tempFile();
	const retVal = await nextra.move(existing, existing, { overwrite: true });

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.access(existing));
});

ava('Overwrite Existing File', async test => {
	test.plan(3);

	const existing = tempFile();
	const move = tempFile();
	const retVal = await nextra.move(existing, move, { overwrite: true });

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.access(move));
	await test.throwsAsync(fs.access(existing));
});

ava('No Overwrite Non-Existent File', async test => {
	test.plan(3);

	const existing = tempFile();
	const move = tempFileLoc();
	const retVal = await nextra.move(existing, move, { overwrite: false });

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.access(move));
	await test.throwsAsync(fs.access(existing));
});

ava('Deep Destination', async test => {
	test.plan(3);

	const existing = tempFile();
	const move = tempFileLoc(tempDirLoc());
	const retVal = await nextra.move(existing, move);

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.access(move));
	await test.throwsAsync(fs.access(existing));
});

ava('Overwrite Full Directory', async test => {
	test.plan(3);

	const existing = tempDir();
	tempFile(existing);
	const move = tempDir();
	tempFile(move);
	const retVal = await nextra.move(existing, move, { overwrite: true });

	test.is(retVal, undefined);
	await test.notThrowsAsync(fs.access(move));
	await test.throwsAsync(fs.access(existing));
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
