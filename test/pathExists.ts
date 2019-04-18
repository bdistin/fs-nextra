import ava from 'ava';
import { tempFile, tempFileLoc, tempDir, tempDirLoc } from './lib';
import * as nextra from '../dist';

ava('File Exists', async (test): Promise<void> => {
	test.true(await nextra.pathExists(tempFile()));
});

ava('File Non-Existent', async (test): Promise<void> => {
	test.false(await nextra.pathExists(tempFileLoc()));
});

ava('Directory Exists', async (test): Promise<void> => {
	test.true(await nextra.pathExists(tempDir()));
});

ava('Directory Non-Existent', async (test): Promise<void> => {
	test.false(await nextra.pathExists(tempDirLoc()));
});
