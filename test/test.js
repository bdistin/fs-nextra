/* eslint-disable id-length */

const test = require('ava');
const path = require('path');
const tsubaki = require('tsubaki');
const mock = require('mock-fs');
const fs = tsubaki.promisifyAll(require('fs'));
const nextra = require('../index');

const dir = path.resolve(__dirname, 'test');
const files = {
	copy: path.resolve(dir, 'copy.txt'),
	ensureDir: path.resolve(dir, 'ensureDir'),
	ensureFile: path.resolve(dir, 'ensureFile'),
	ensureSymlink: {
		src: path.resolve(dir, 'ensureSymlinkSrc'),
		dest: path.resolve(dir, 'ensureSymlinkDest')
	}
};

test.before(t => {
	mock({
		[files.copy]: '',
		[files.ensureDir]: {},
		[files.ensureFile]: '',
		[files.ensureSymlink.src]: mock.symlink({ path: files.ensureSymlink.dest })
	});
	t.pass();
});

test.after.always(t => {
	mock.restore();
	t.pass();
});

test('copy', async t => {
	const copy = path.resolve(dir, 'copied');
	await nextra.copy(files.copy, copy);

	const stats = await fs.statAsync(copy);
	t.true(stats.isFile());
});

test.skip('ensureDir (pre-existing)', async t => {
	await nextra.ensureDir(files.ensureDir);

	const stats = await fs.statAsync(files.ensureDir);
	t.true(stats.isDirectory());
});

test.skip('ensureDir (new)', async t => {
	const newDir = path.resolve(dir, 'ensureDirNew');
	await nextra.ensureDir(newDir);

	const stats = await fs.statAsync(newDir);
	t.true(stats.isDirectory());
});

test.skip('ensureDir (new recursive)', async t => {
	const deepDir = path.resolve(dir, 'ensureDirNew2', 'ensureDirNew3');
	await nextra.ensureDir(deepDir);

	const stats = await fs.statAsync(deepDir);
	t.true(stats.isDirectory());
});

test('ensureFile (pre-existing)', async t => {
	await nextra.ensureFile(files.ensureFile);

	const stats = await fs.statAsync(files.ensureFile);
	t.true(stats.isFile());
});

test('ensureFile (new)', async t => {
	const file = path.resolve(dir, 'ensureFileNew');
	await nextra.ensureFile(file);

	const stats = await fs.statAsync(file);
	t.true(stats.isFile());
});

test.skip('ensureSymlink', async t => {
	await nextra.ensureSymlink(files.ensureSymlink.src, files.ensureSymlink.dest);

	const stats = await fs.lstatAsync(files.ensureSymlink.src);
	t.true(stats.isSymbolicLink());
});
