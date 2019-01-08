const ava = require('ava');
const { tempFile, tempFileLoc, tempDir, tempDirLoc } = require('./lib');
const nextra = require('../dist');

ava('File Exists', async test => {
	test.true(await nextra.pathExists(tempFile()));
});

ava('File Non-Existent', async test => {
	test.false(await nextra.pathExists(tempFileLoc()));
});

ava('Directory Exists', async test => {
	test.true(await nextra.pathExists(tempDir()));
});

ava('Directory Non-Existent', async test => {
	test.false(await nextra.pathExists(tempDirLoc()));
});
