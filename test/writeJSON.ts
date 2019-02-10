import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc } from './lib';
import * as nextra from '../dist';

ava('Standard Usage', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const obj = { test: 'passed' };
	const retVal = await nextra.writeJSON(file, obj);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFile(file, 'utf8')), obj);
});

ava('Existing', async test => {
	test.plan(2);

	const file = tempFile();
	const obj = { test: 'passed' };
	const retVal = await nextra.writeJSON(file, obj);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFile(file, 'utf8')), obj);
});


ava('Atomic Shortcut', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const obj = { test: 'passed' };
	const retVal = await nextra.writeJSON(file, obj, true);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFile(file, 'utf8')), obj);
});
