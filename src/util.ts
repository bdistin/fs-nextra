import { sep, resolve, join } from 'path';
import { promisify } from 'util';
import { randomBytes } from 'crypto';
import { tmpdir } from 'os';

export const isWindows: boolean = process.platform === 'win32';

export const setTimeoutPromise: typeof setTimeout.__promisify__ = promisify(setTimeout);

export const replaceEsc = (str: string): string => str.replace(/\$/g, '$$');

export const isSrcKid = (source: string, destination: string): boolean => {
	const sourceArray = resolve(source).split(sep);
	const destinationArray = resolve(destination).split(sep);
	return sourceArray.every((current, i) => destinationArray[i] === current);
};

export const uuid = (): string => {
	const id = randomBytes(32).toString('hex');
	return (Array(32).join('0') + id).slice(-32).replace(/^.{8}|.{4}(?!$)/g, '$&-');
};

export const tempFile = (ext?: string): string => join(tmpdir(), uuid() + (ext || ''));
