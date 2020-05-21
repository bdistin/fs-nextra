import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempSymlink, tempFileLoc, tempDirLoc } from './lib';
import * as nextra from '../src';

ava('New File (Standard Usage)', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlinkAtomic(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Pre-Existing Symlink', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempSymlink();
	const retVal = await nextra.createSymlinkAtomic(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('New File w/ Non-Existent Directories', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	const retVal = await nextra.createSymlinkAtomic(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});
