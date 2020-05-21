import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc, tempDir, tempDirLoc } from './lib';
import * as nextra from '../src';

ava('File', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.symlinkAtomic(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	const newDir = tempDirLoc();
	const retVal = await nextra.symlinkAtomic(dir, newDir);
	const stats = await fs.lstat(newDir);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});
