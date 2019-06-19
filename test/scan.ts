import ava from 'ava';
import { tempFile, tempFileLoc, tempDir, tempDirLoc } from './lib';
import * as nextra from '../dist';

ava('File', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const map = await nextra.scan(file);

	test.is(map.size, 1);
	test.true(map.get(file).isFile());
});


ava('Empty Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	const map = await nextra.scan(dir);

	test.is(map.size, 1);
	test.true(map.get(dir).isDirectory());
});

ava('Full Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	const file = tempFile(dir);
	const map = await nextra.scan(dir, { filter: (stats): boolean => stats.isFile() });

	test.is(map.size, 1);
	test.true(map.has(file));
});

ava('Deep Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	const file = tempFile(tempDir(dir));
	const map = await nextra.scan(dir, { filter: (stats): boolean => stats.isFile() });

	test.is(map.size, 1);
	test.true(map.has(file));
});

ava('Multi Deep Directory', async (test): Promise<void> => {
	test.plan(3);

	const dir = tempDir();
	const file1 = tempFile(tempDir(dir));
	const file2 = tempFile(tempDir(dir));
	const map = await nextra.scan(dir, { filter: (stats): boolean => stats.isFile() });

	test.is(map.size, 2);
	test.true(map.has(file1));
	test.true(map.has(file2));
});

ava('Deep Directory w/ Limit', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	const file = tempFile(tempDir(dir));
	const map = await nextra.scan(dir, { filter: (stats): boolean => stats.isFile(), depthLimit: 0 });

	test.is(map.size, 0);
	test.false(map.has(file));
});

ava('Multi Deep Directory w/ Limit', async (test): Promise<void> => {
	test.plan(4);

	const dir = tempDir();
	const file1 = tempFile(tempDir(dir));
	const file2 = tempFile(tempDir(dir));
	const file3 = tempFile(tempDir(tempDir(dir)));
	const map = await nextra.scan(dir, { filter: (stats): boolean => stats.isFile(), depthLimit: 2 });

	test.is(map.size, 2);
	test.true(map.has(file1));
	test.true(map.has(file2));
	test.false(map.has(file3));
});

ava('Non-Existent File', async (test): Promise<void> => {
	await test.throwsAsync(nextra.scan(tempFileLoc()));
});

ava('Non-Existent Directory', async (test): Promise<void> => {
	await test.throwsAsync(nextra.scan(tempDirLoc()));
});
