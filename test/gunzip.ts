import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFileLoc } from './lib';
import * as nextra from '../dist';

ava('File', async test => {
	test.plan(3);

	const file = tempFileLoc();
	await nextra.writeFile(file, 'test', 'utf8');
	const fileName = `${tempFileLoc()}.gz`;
	await nextra.gzip(fileName, file);
	const output = tempFileLoc();
	const retVal = await nextra.gunzip(output, fileName);
	const stats = await fs.stat(output);

	test.is(retVal, undefined);
	test.true(stats.isFile());
	test.is(await nextra.readFile(output, 'utf8'), 'test');
});

ava('File (Atomic Shortcut)', async test => {
	test.plan(3);

	const file = tempFileLoc();
	await nextra.writeFile(file, 'test', 'utf8');
	const fileName = `${tempFileLoc()}.gz`;
	await nextra.gzip(fileName, file);
	const output = tempFileLoc();
	const retVal = await nextra.gunzip(output, fileName, true);
	const stats = await fs.stat(output);

	test.is(retVal, undefined);
	test.true(stats.isFile());
	test.is(await nextra.readFile(output, 'utf8'), 'test');
});
