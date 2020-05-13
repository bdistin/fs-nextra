import { sep, resolve, join, normalize } from 'path';
import { promisify } from 'util';
import { randomBytes } from 'crypto';
import { tmpdir } from 'os';
import { pipeline } from 'stream';

export const umask = process.umask(0o022);

// Fix umask back to original value
process.umask(umask);

export const isWindows: boolean = process.platform === 'win32';

export const invalidWin32Path = (myPath: string): boolean => {
	const root = normalize(resolve(myPath)).split(sep);
	return /[<>:"|?*]/.test(myPath.replace(root[0], ''));
};

export const setTimeoutPromise: typeof setTimeout.__promisify__ = promisify(setTimeout);

export const pipelinePromise: typeof pipeline.__promisify__ = promisify(pipeline);

export const replaceEsc = (str: string): string => str.replace(/\$/g, '$$');

export const isSrcKid = (source: string, destination: string): boolean => {
	const sourceArray = resolve(source).split(sep);
	const destinationArray = resolve(destination).split(sep);
	return sourceArray.every((current, i): boolean => destinationArray[i] === current);
};

export const uuid = (): string => {
	const id = randomBytes(32).toString('hex');
	return (Array(32).join('0') + id).slice(-32).replace(/^.{8}|.{4}(?!$)/g, '$&-');
};

export const tempFile = (ext?: string): string => join(tmpdir(), uuid() + (ext || ''));
