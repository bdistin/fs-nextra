import ava from 'ava';
import { tempFile, tempFileLoc, tempDir, tempDirLoc } from './lib';
import * as nextra from '../dist';

ava('File', async (test): Promise<void> => {
	const file = tempFile();
	const map = await nextra.scan(file);

	await test.true(map.size === 1 && map.get(file).isFile());
});


ava('Empty Directory', async (test): Promise<void> => {
	const dir = tempDir();
	const map = await nextra.scan(dir);

	test.true(map.size === 1 && map.get(dir).isDirectory());
});

ava('Full Directory', async (test): Promise<void> => {
	const dir = tempDir();
	const file = tempFile(dir);
	const map = await nextra.scan(dir, { filter: (stats): boolean => stats.isFile() });

	test.true(map.size === 1 && map.has(file));
});


ava('Deep Directory', async (test): Promise<void> => {
	const dir = tempDir();
	const file = tempFile(tempDir(dir));
	const map = await nextra.scan(dir, { filter: (stats): boolean => stats.isFile() });

	test.true(map.size === 1 && map.has(file));
});

ava('Deep Directory w/ Limit', async (test): Promise<void> => {
	const dir = tempDir();
	const file = tempFile(tempDir(dir));
	const map = await nextra.scan(dir, { filter: (stats): boolean => stats.isFile(), depthLimit: 0 });

	test.true(map.size === 0 && !map.has(file));
});

ava('Non-Existent File', async (test): Promise<void> => {
	await test.throwsAsync(nextra.scan(tempFileLoc()));
});

ava('Non-Existent Directory', async (test): Promise<void> => {
	await test.throwsAsync(nextra.scan(tempDirLoc()));
});
