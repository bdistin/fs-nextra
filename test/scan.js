const ava = require('ava');
const { tempFile, tempFileLoc, tempDir, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('file', async test => {
	const file = tempFile();
	const map = await nextra.scan(file);
	await test.true(map.size === 1 && map.get(file).isFile());
});

ava('non-existant file', async test => {
	await test.throwsAsync(nextra.scan(tempFileLoc()));
});

ava('empty directory', async test => {
	const dir = tempDir();
	const map = await nextra.scan(dir);
	test.true(map.size === 1 && map.get(dir).isDirectory());
});

ava('full directory', async test => {
	const dir = tempDir();
	const file = tempFile(dir);
	const map = await nextra.scan(dir, { filter: stats => stats.isFile() });
	test.true(map.size === 1 && map.has(file));
});

ava('non-existant directory', async test => {
	await test.throwsAsync(nextra.scan(tempDirLoc()));
});

ava('deep directory', async test => {
	const dir = tempDir();
	const file = tempFile(tempDir(dir));
	const map = await nextra.scan(dir, { filter: stats => stats.isFile() });
	test.true(map.size === 1 && map.has(file));
});

ava('deep directory w/ limit', async test => {
	const dir = tempDir();
	const file = tempFile(tempDir(dir));
	const map = await nextra.scan(dir, { filter: stats => stats.isFile(), depthLimit: 0 });
	test.true(map.size === 0 && !map.has(file));
});
