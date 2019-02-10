import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempSymlink, tempFileLoc, tempDirLoc } from './lib';
import * as nextra from '../dist';

ava('New File (Standard Usage)', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlinkAtomic(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Pre-Existing Symlink', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempSymlink();
	const retVal = await nextra.createSymlinkAtomic(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('New File w/ Non-Existent Directories', async test => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempDirLoc(tempFileLoc());
	const retVal = await nextra.createSymlinkAtomic(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});
