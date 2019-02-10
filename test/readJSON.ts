import ava from 'ava';
import { promises as fs } from 'fs';
import { tempFileLoc } from './lib';
import * as nextra from '../dist';

ava('Standard Usage', async test => {
	const file = tempFileLoc();
	await fs.writeFile(file, JSON.stringify({ validate: true }));
	const readJSON = await nextra.readJSON(file);

	test.true(readJSON.validate);
});

ava('String Options', async test => {
	const file = tempFileLoc();
	await fs.writeFile(file, JSON.stringify({ validate: true }));
	const readJSON = await nextra.readJSON(file, 'utf8');

	test.true(readJSON.validate);
});
