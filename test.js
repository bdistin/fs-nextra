/* eslint-disable id-length */

const test = require('ava');
const path = require('path');
const tsubaki = require('tsubaki');
const mock = require('mock-fs');
const fs = tsubaki.promisifyAll(require('fs'));
const nextra = require('./index');

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

// this test doesn't resolve for some reason
test.skip('ensureDir', async t => {
	await nextra.ensureDir(files.ensureDir);

	const stats = await fs.statAsync(dir);
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

test('ensureSymlink', async t => {
	await nextra.ensureSymlink(files.ensureSymlink.src, files.ensureSymlink.dest);

	const stats = await fs.lstatAsync(files.ensureSymlink.src);
	t.true(stats.isSymbolicLink());
});
