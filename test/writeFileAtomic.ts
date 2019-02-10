import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc } from './lib';
import * as nextra from '../dist';

ava('Existing', async test => {
	test.plan(2);

	const file = tempFile();
	const data = 'passed';
	const retVal = await nextra.writeFileAtomic(file, data);

	test.is(retVal, undefined);
	test.is(await fs.readFile(file, 'utf8'), data);
});

ava('New', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const data = 'passed';
	const retVal = await nextra.writeFileAtomic(file, data);

	test.is(retVal, undefined);
	test.is(await fs.readFile(file, 'utf8'), data);
});
