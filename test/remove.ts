import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc, tempDir, tempDirLoc } from './lib';
import * as nextra from '../dist';

ava('File', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.remove(file);

	test.is(retVal, undefined);
	await test.throwsAsync(fs.access(file));
});

ava('ReadOnly File', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	await fs.chmod(file, 0o444);
	const retVal = await nextra.remove(file);

	test.is(retVal, undefined);
	await test.throwsAsync(fs.access(file));
});

ava('Empty Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	const retVal = await nextra.remove(dir);

	test.is(retVal, undefined);
	await test.throwsAsync(fs.access(dir));
});

ava('Full Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	tempFile(dir);
	const retVal = await nextra.remove(dir);

	test.is(retVal, undefined);
	await test.throwsAsync(fs.access(dir));
});

ava('Non-Existent File', async (test): Promise<void> => {
	await test.notThrowsAsync(nextra.remove(tempFileLoc()));
});

ava('Non-Existent Directory', async (test): Promise<void> => {
	await test.notThrowsAsync(nextra.remove(tempDirLoc()));
});
