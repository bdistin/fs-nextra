import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { join } from 'path';
import * as fs from 'fs';

export const uuid = (): string => {
	const id = randomBytes(32).toString('hex');
	return (Array(32).join('0') + id).slice(-32).replace(/^.{8}|.{4}(?!$)/g, '$&-');
};

export const dir = tmpdir();

export const tempFile = (directory?: string): string => {
	const path = tempFileLoc(directory);
	fs.writeFileSync(path, '');
	return path;
};

export const tempDir = (directory?: string): string => {
	const path = tempDirLoc(directory);
	fs.mkdirSync(path);
	return path;
};

export const tempSymlink = (directory?: string): string => {
	const path = tempFileLoc(directory);
	fs.symlinkSync(tempFile(), path);
	return path;
};

export const tempFileLoc = (directory: string = dir): string => join(directory, `${uuid()}.txt`);

export const tempDirLoc = (directory: string = dir): string => join(directory, uuid());
