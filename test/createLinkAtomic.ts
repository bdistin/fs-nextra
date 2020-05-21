import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc, tempDirLoc } from './lib';
import * as nextra from '../src';

ava('New File (Standard Usage)', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createLinkAtomic(file, newFile);
	const stats = await fs.stat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Pre-Existing File', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.createLinkAtomic(file, file);
	const stats = await fs.stat(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('New File w/ Non-Existent Directories', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc(tempDirLoc());
	const retVal = await nextra.createLinkAtomic(file, newFile);
	const stats = await fs.stat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
