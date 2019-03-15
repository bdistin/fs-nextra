import ava from 'ava';
import { promises as fs } from 'fs';
import { basename, resolve } from 'path';
import { tempFileLoc, tempDir } from './lib';
import * as nextra from '../dist';

ava('File', async test => {
	test.plan(3);

	const file = tempFileLoc();
	await nextra.writeFile(file, 'test', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	await nextra.targz(fileName, file);
	const outputDirectory = tempDir();
	const retVal = await nextra.unTargz(outputDirectory, fileName);
	const newFile = resolve(outputDirectory, basename(file));
	const stats = await fs.stat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
	test.is(await fs.readFile(newFile, 'utf8'), 'test');
});

ava('Files', async test => {
	test.plan(5);

	const file1 = tempFileLoc();
	await nextra.writeFile(file1, 'test1', 'utf8');
	const file2 = tempFileLoc();
	await nextra.writeFile(file2, 'test2', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	await nextra.targz(fileName, [file1, file2]);
	const outputDirectory = tempDir();
	const retVal = await nextra.unTargz(outputDirectory, fileName);
	const newFile1 = resolve(outputDirectory, basename(file1));
	const newFile2 = resolve(outputDirectory, basename(file2));
	const [stats1, stats2] = await Promise.all([fs.stat(newFile1), fs.stat(newFile2)]);

	test.is(retVal, undefined);
	test.true(stats1.isFile());
	test.true(stats2.isFile());
	test.is(await fs.readFile(newFile1, 'utf8'), 'test1');
	test.is(await fs.readFile(newFile2, 'utf8'), 'test1');
});

ava('Directory', async test => {
	test.plan(5);

	const dir = tempDir();
	const file1 = tempFileLoc();
	const file2 = tempFileLoc();
	await nextra.writeFile(file1, 'file1', 'utf8');
	await nextra.writeFile(file2, 'file2', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	await nextra.targz(fileName, dir);
	const outputDirectory = tempDir();
	const retVal = await nextra.unTargz(outputDirectory, fileName);
	const newFile1 = resolve(outputDirectory, basename(dir), basename(file1));
	const newFile2 = resolve(outputDirectory, basename(dir), basename(file2));
	const [stats1, stats2] = await Promise.all([fs.stat(newFile1), fs.stat(newFile2)]);

	test.is(retVal, undefined);
	test.true(stats1.isFile());
	test.true(stats2.isFile());
	test.is(await fs.readFile(newFile1, 'utf8'), 'file1');
	test.is(await fs.readFile(newFile2, 'utf8'), 'file2');
});

ava('File (Atomic Shortcut)', async test => {
	test.plan(3);

	const file = tempFileLoc();
	await nextra.writeFile(file, 'test', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	await nextra.targz(fileName, file);
	const outputDirectory = tempDir();
	const retVal = await nextra.unTargz(outputDirectory, fileName, true);
	const newFile = resolve(outputDirectory, basename(file));
	const stats = await fs.stat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
	test.is(await fs.readFile(newFile, 'utf8'), 'test');
});

ava('Files (Atomic Shortcut)', async test => {
	test.plan(5);

	const file1 = tempFileLoc();
	await nextra.writeFile(file1, 'test1', 'utf8');
	const file2 = tempFileLoc();
	await nextra.writeFile(file2, 'test2', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	await nextra.targz(fileName, [file1, file2]);
	const outputDirectory = tempDir();
	const retVal = await nextra.unTargz(outputDirectory, fileName, true);
	const newFile1 = resolve(outputDirectory, basename(file1));
	const newFile2 = resolve(outputDirectory, basename(file2));
	const [stats1, stats2] = await Promise.all([fs.stat(newFile1), fs.stat(newFile2)]);

	test.is(retVal, undefined);
	test.true(stats1.isFile());
	test.true(stats2.isFile());
	test.is(await fs.readFile(newFile1, 'utf8'), 'test1');
	test.is(await fs.readFile(newFile2, 'utf8'), 'test1');
});

ava('Directory (Atomic Shortcut)', async test => {
	test.plan(5);

	const dir = tempDir();
	const file1 = tempFileLoc();
	const file2 = tempFileLoc();
	await nextra.writeFile(file1, 'file1', 'utf8');
	await nextra.writeFile(file2, 'file2', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	await nextra.targz(fileName, dir);
	const outputDirectory = tempDir();
	const retVal = await nextra.unTargz(outputDirectory, fileName, true);
	const newFile1 = resolve(outputDirectory, basename(dir), basename(file1));
	const newFile2 = resolve(outputDirectory, basename(dir), basename(file2));
	const [stats1, stats2] = await Promise.all([fs.stat(newFile1), fs.stat(newFile2)]);

	test.is(retVal, undefined);
	test.true(stats1.isFile());
	test.true(stats2.isFile());
	test.is(await fs.readFile(newFile1, 'utf8'), 'file1');
	test.is(await fs.readFile(newFile2, 'utf8'), 'file2');
});
