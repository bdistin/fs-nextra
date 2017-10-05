const ava = require('ava');
const { tempFile, tempFileLoc, tempDir, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('file does', async test => {
	test.false(await nextra.pathExists(tempFile()));
});

ava('file doesn\'t', async test => {
	test.false(await nextra.pathExists(tempFileLoc()));
});

ava('directory does', async test => {
	test.false(await nextra.pathExists(tempDir()));
});

ava('directory doesn\'t', async test => {
	test.false(await nextra.pathExists(tempDirLoc()));
});
