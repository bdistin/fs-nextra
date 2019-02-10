import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc, tempDirLoc } from './lib';
import * as nextra from '../dist';

ava('Pre-Existing', async test => {
	test.plan(2);

	const file = tempFile();
	const obj = { test: 'passed' };
	const retVal = await nextra.outputJSONAtomic(file, obj);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFile(file, 'utf8')), obj);
});

ava('New', async test => {
	test.plan(2);

	const newDir = tempFileLoc();
	const obj = { test: 'passed' };
	const retVal = await nextra.outputJSONAtomic(newDir, obj);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFile(newDir, 'utf8')), obj);
});

ava('New Recursive', async test => {
	test.plan(2);

	const deepDir = tempFileLoc(tempDirLoc());
	const obj = { test: 'passed' };
	const retVal = await nextra.outputJSONAtomic(deepDir, obj);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFile(deepDir, 'utf8')), obj);
});
