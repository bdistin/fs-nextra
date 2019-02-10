import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc } from './lib';
import * as nextra from '../dist';

ava('Standard Usage', async test => {
	test.plan(2);

	const copy = tempFileLoc();
	const retVal = await nextra.copyFileAtomic(tempFile(), copy);
	const stats = await fs.stat(copy);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
