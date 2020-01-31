import ava from 'ava';
import { promises as fs } from 'fs';
import { tempDirLoc, tempDir, tempFile, isWindows } from './lib';
import * as nextra from '../dist';

ava('Pre-Existing Directory', async (test): Promise<void> => {
	test.plan(2);

	const dir = tempDir();
	const retVal = await nextra.ensureDir(dir);
	const stats = await fs.stat(dir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
});

ava('Standard Usage', async (test): Promise<void> => {
	test.plan(2);

	const newDir = tempDirLoc();
	const retVal = await nextra.ensureDir(newDir);
	const stats = await fs.stat(newDir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
});

ava('Standard Usage with full permissions', async (test): Promise<void> => {
	test.plan(3);

	const newDir = tempDirLoc();
	const retVal = await nextra.ensureDir(newDir, 0o0666);
	const stats = await fs.stat(newDir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
	// eslint-disable-next-line no-bitwise
	test.is(stats.mode & 0o0777, 0o0666 & ~process.umask());
});

ava('Recursive', async (test): Promise<void> => {
	test.plan(2);

	const deepDir = tempDirLoc(tempDirLoc());
	const retVal = await nextra.ensureDir(deepDir);
	const stats = await fs.stat(deepDir);

	test.is(retVal, undefined);
	test.true(stats.isDirectory());
});

ava('Pre-Existing File', async (test): Promise<void> => {
	const dir = tempFile();
	await test.throwsAsync(nextra.ensureDir(dir));
});

ava('Bad filename Windows', async (test): Promise<void> => {
	if (!isWindows) {
		test.pass();
		return;
	}
	const dir = `${tempDirLoc()}?`;
	await test.throwsAsync(nextra.ensureDir(dir));
});

ava('RootPath Windows', async (test): Promise<void> => {
	if (!isWindows) {
		test.pass();
		return;
	}
	await test.notThrowsAsync(nextra.ensureDir('/'));
});
