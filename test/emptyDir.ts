import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempDir, tempDirLoc } from './lib';
import * as nextra from '../src';

ava('Non-Existent', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDirLoc();
	const retVal = await nextra.emptyDir(dir);
	const contents = await fs.readdir(dir);

	test.is(retVal, undefined);
	test.true(contents.length === 0);
});

ava('Empty Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	const retVal = await nextra.emptyDir(dir);
	const contents = await fs.readdir(dir);

	test.is(retVal, undefined);
	test.true(contents.length === 0);
});

ava('Full Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	tempFile(dir);
	const retVal = await nextra.emptyDir(dir);
	const contents = await fs.readdir(dir);

	test.is(retVal, undefined);
	test.true(contents.length === 0);
});
