import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc, tempDirLoc } from './lib';
import * as nextra from '../dist';

ava('New File (Standard Usage)', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const retVal = await nextra.createFileAtomic(file);
	const stats = await fs.stat(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Pre-Existing File', async test => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.createFileAtomic(file);
	const stats = await fs.stat(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('New File w/ Non-Existent Directories', async test => {
	test.plan(2);

	const file = tempDirLoc(tempFileLoc());
	const retVal = await nextra.createFileAtomic(file);
	const stats = await fs.stat(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
