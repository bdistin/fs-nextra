const ava = require('ava');
const { tempFile, tempFileLoc, tempDir, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('File', async test => {
	const file = tempFile();
	const map = await nextra.scan(file);

	await test.true(map.size === 1 && map.get(file).isFile());
});


ava('Empty Directory', async test => {
	const dir = tempDir();
	const map = await nextra.scan(dir);

	test.true(map.size === 1 && map.get(dir).isDirectory());
});

ava('Full Directory', async test => {
	const dir = tempDir();
	const file = tempFile(dir);
	const map = await nextra.scan(dir, { filter: stats => stats.isFile() });

	test.true(map.size === 1 && map.has(file));
});


ava('Deep Directory', async test => {
	const dir = tempDir();
	const file = tempFile(tempDir(dir));
	const map = await nextra.scan(dir, { filter: stats => stats.isFile() });

	test.true(map.size === 1 && map.has(file));
});

ava('Deep Directory w/ Limit', async test => {
	const dir = tempDir();
	const file = tempFile(tempDir(dir));
	const map = await nextra.scan(dir, { filter: stats => stats.isFile(), depthLimit: 0 });

	test.true(map.size === 0 && !map.has(file));
});

ava('Non-Existent File', async test => {
	await test.throwsAsync(nextra.scan(tempFileLoc()));
});

ava('Non-Existent Directory', async test => {
	await test.throwsAsync(nextra.scan(tempDirLoc()));
});
