import ava from 'ava';
import { join, basename } from 'path';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc, tempDir, tempDirLoc, tempSymlink } from './lib';
import * as nextra from '../dist';

// #region Success

ava('File to New File Location', async test => {
	test.plan(2);

	const newFile = tempFileLoc();
	const file = tempFile();
	const retVal = await nextra.copy(file, newFile);
	const stats = await fs.stat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('File to Existing File', async test => {
	test.plan(2);

	const newFile = tempFile();
	const file = tempFile();
	const retVal = await nextra.copy(file, newFile);
	const stats = await fs.stat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('File to Empty Directory', async test => {
	test.plan(2);

	const emptyDir = tempDir();
	const file = tempFile();
	const retVal = await nextra.copy(file, emptyDir);
	const stats = await fs.stat(join(emptyDir, basename(file)));

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Directory to Empty Directory', async test => {
	test.plan(2);

	const fullDir = tempDir();
	const emptyDir = tempDir();
	const file = tempFile(fullDir);
	const retVal = await nextra.copy(fullDir, emptyDir);
	const stats = await fs.stat(join(emptyDir, basename(file)));

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Directory to new Deep Directory', async test => {
	test.plan(2);

	const fullDir = tempDir();
	const emptyDir = tempDirLoc(tempDirLoc());
	const file = tempFile(fullDir);
	const retVal = await nextra.copy(fullDir, emptyDir);
	const stats = await fs.stat(join(emptyDir, basename(file)));

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Symlink to Empty Directory', async test => {
	test.plan(2);

	const emptyDir = tempDir();
	const symlink = tempSymlink();
	const retVal = await nextra.copy(symlink, emptyDir);
	const stats = await fs.lstat(join(emptyDir, basename(symlink)));

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Symlink to Existing Symlink', async test => {
	test.plan(2);

	const newFile = tempSymlink();
	const symlink = tempSymlink();
	const retVal = await nextra.copy(symlink, newFile);
	const stats = await fs.lstat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isSymbolicLink());
});

ava('Duplicated File (no error on exist)', async test => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.copy(file, file);
	const stats = await fs.stat(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('filter shortcut', async test => {
	test.plan(2);

	const emptyDir = tempDir();
	const file = tempFile();
	const retVal = await nextra.copy(file, emptyDir, () => true);
	const stats = await fs.stat(join(emptyDir, basename(file)));

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('File to Existing File w/o errorOnExist', async test => {
	const newFile = tempFile();
	const file = tempFile();

	await test.notThrowsAsync(nextra.copy(file, newFile, { overwrite: false, errorOnExist: false }));
});

ava('character device', async test => {
	if (process.platform === 'win32') {
		test.pass();
	} else {
		test.plan(2);

		const file = tempFileLoc();
		const retVal = await nextra.copy('/dev/null', file);
		const stats = await fs.stat(file);

		test.is(retVal, undefined);
		test.true(stats.isFile());
	}
});

// #endregion Success

// #region Throws

ava('File to Existing File w/ errorOnExist', async test => {
	const newFile = tempFile();
	const file = tempFile();

	await test.throwsAsync(nextra.copy(file, newFile, { overwrite: false, errorOnExist: true }));
});

ava('Directory to Child Directory', async test => {
	const parent = tempDir();
	const child = tempDir(parent);

	await test.throwsAsync(nextra.copy(parent, child));
});

ava('Duplicated Directories (error on exist)', async test => {
	const dir = tempDir();
	tempFile(dir);

	await test.throwsAsync(nextra.copy(dir, dir, { errorOnExist: true }));
});

ava('filter everything', async test => {
	test.plan(2);

	const emptyDir = tempDir();
	const file = tempFile();
	const retVal = await nextra.copy(file, emptyDir, () => false);

	test.is(retVal, undefined);
	await test.throwsAsync(fs.stat(join(emptyDir, basename(file))));
});

// #endregion Throws
