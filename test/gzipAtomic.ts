import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFileLoc } from './lib';
import * as nextra from '../dist';

ava('File', async test => {
	test.plan(2);

	const file = tempFileLoc();
	await nextra.writeFile(file, 'test', 'utf8');
	const fileName = `${tempFileLoc()}.tar.gz`;
	const retVal = await nextra.gzipAtomic(fileName, file);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
