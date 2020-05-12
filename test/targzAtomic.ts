import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFileLoc, tempDir } from './lib';
import * as nextra from '../dist';

ava('File', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFileLoc();
	await fs.writeFile(file, 'test', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	const retVal = await nextra.targzAtomic(fileName, file);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Files', async (test): Promise<void> => {
	test.plan(2);

	const file1 = tempFileLoc();
	await fs.writeFile(file1, 'test1', 'utf8');
	const file2 = tempFileLoc();
	await fs.writeFile(file2, 'test2', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	const retVal = await nextra.targzAtomic(fileName, [file1, file2]);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	await fs.writeFile(tempFileLoc(dir), 'file1', 'utf8');
	await fs.writeFile(tempFileLoc(dir), 'file2', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	const retVal = await nextra.targzAtomic(fileName, dir);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
