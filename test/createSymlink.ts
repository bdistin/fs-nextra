import ava from 'ava';
import { relative } from 'path';
import { promises as fs } from 'fs';
import { tempFile, tempDir, tempSymlink, tempFileLoc, tempDirLoc } from './lib';
import * as nextra from '../dist';

ava('New File (Standard Usage)', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlink(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('New Directory (Standard Usage)', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	const newDir = tempDirLoc();
	const retVal = await nextra.createSymlink(dir, newDir);
	const stats = await fs.lstat(newDir);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Pre-Existing Symlink', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempSymlink();
	const retVal = await nextra.createSymlink(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('New File w/ Non-Existent Directories', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc(tempDirLoc());
	const retVal = await nextra.createSymlink(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Relative Source', async (test): Promise<void> => {
	test.plan(2);

	const file = './test/createSymlink.ts';
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlink(file, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Relative Destination', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlink(file, relative(process.cwd(), newFile));
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Relative Source and Destination', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlink(relative(process.cwd(), file), relative(process.cwd(), newFile));
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Relative Source and Deep Destination', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc(tempDirLoc());
	const retVal = await nextra.createSymlink(relative(process.cwd(), file), relative(process.cwd(), newFile));
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('New File (Atomic Shortcut)', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const newFile = tempFileLoc();
	const retVal = await nextra.createSymlink(file, newFile, true);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});
