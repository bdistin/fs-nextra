import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFileLoc, tempDir } from './lib';
import * as nextra from '../dist';

ava('File', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFileLoc();
	await nextra.writeFile(file, 'test', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	const retVal = await nextra.targz(fileName, file);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Files', async (test): Promise<void> => {
	test.plan(2);

	const file1 = tempFileLoc();
	await nextra.writeFile(file1, 'test1', 'utf8');
	const file2 = tempFileLoc();
	await nextra.writeFile(file2, 'test2', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	const retVal = await nextra.targz(fileName, [file1, file2]);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	await nextra.writeFile(tempFileLoc(dir), 'file1', 'utf8');
	await nextra.writeFile(tempFileLoc(dir), 'file2', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	const retVal = await nextra.targz(fileName, dir);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('File (Atomic Shortcut)', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFileLoc();
	await nextra.writeFile(file, 'test', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	const retVal = await nextra.targz(fileName, file, true);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Files (Atomic Shortcut)', async (test): Promise<void> => {
	test.plan(2);

	const file1 = tempFileLoc();
	await nextra.writeFile(file1, 'test1', 'utf8');
	const file2 = tempFileLoc();
	await nextra.writeFile(file2, 'test2', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	const retVal = await nextra.targz(fileName, [file1, file2], true);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Directory (Atomic Shortcut)', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	await nextra.writeFile(tempFileLoc(dir), 'file1', 'utf8');
	await nextra.writeFile(tempFileLoc(dir), 'file2', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	const retVal = await nextra.targz(fileName, dir, true);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
