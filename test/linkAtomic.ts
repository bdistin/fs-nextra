import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFile, tempFileLoc } from './lib';
import * as nextra from '../dist';

ava('Standard Usage', async test => {
	test.plan(2);

	const newFile = tempFileLoc();
	const retVal = await nextra.linkAtomic(tempFile(), newFile);
	const stats = await fs.stat(newFile);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
