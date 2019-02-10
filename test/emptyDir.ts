import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempDir, tempDirLoc } from './lib';
import * as nextra from '../dist';

ava('Non-Existent', async test => {
	test.plan(2);

	const dir = tempDirLoc();
	const retVal = await nextra.emptyDir(dir);
	const contents = await fs.readdir(dir);

	test.is(retVal, undefined);
	test.true(contents.length === 0);
});

ava('Empty Directory', async test => {
	test.plan(2);

	const dir = tempDir();
	const retVal = await nextra.emptyDir(dir);
	const contents = await fs.readdir(dir);

	test.is(retVal, undefined);
	test.true(contents.length === 0);
});

ava('Full Directory', async test => {
	test.plan(2);

	const dir = tempDir();
	tempFile(dir);
	const retVal = await nextra.emptyDir(dir);
	const contents = await fs.readdir(dir);

	test.is(retVal, undefined);
	test.true(contents.length === 0);
});
