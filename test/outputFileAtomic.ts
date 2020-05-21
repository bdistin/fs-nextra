import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc, tempDirLoc } from './lib';
import * as nextra from '../src';

ava('Pre-Existing', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.outputFileAtomic(file, 'pass');

	test.is(retVal, undefined);
	test.is(await fs.readFile(file, 'utf8'), 'pass');
});

ava('New', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFileLoc();
	const retVal = await nextra.outputFileAtomic(file, 'pass');

	test.is(retVal, undefined);
	test.is(await fs.readFile(file, 'utf8'), 'pass');
});

ava('New Recursive', async (test): Promise<void> => {
	test.plan(2);

	const deepDir = tempDirLoc(tempFileLoc());
	const retVal = await nextra.outputFileAtomic(deepDir, 'pass');

	test.is(retVal, undefined);
	test.is(await fs.readFile(deepDir, 'utf8'), 'pass');
});
