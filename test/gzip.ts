import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFileLoc } from './lib';
import * as nextra from '../dist';

ava('File', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFileLoc();
	await fs.writeFile(file, 'test', 'utf8');
	const fileName = `${tempFileLoc()}.gz`;
	const retVal = await nextra.gzip(fileName, file);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('File (Atomic Shortcut)', async (test): Promise<void> => {
	test.plan(2);

	const file = tempFileLoc();
	await fs.writeFile(file, 'test', 'utf8');
	const fileName = `${tempFileLoc()}.gz`;
	const retVal = await nextra.gzip(fileName, file, true);
	const stats = await fs.stat(fileName);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});
