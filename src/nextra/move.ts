import { resolve, dirname } from 'path';
import { promises as fsp } from 'fs';

import { isSrcKid } from '../utils/util';
import { remove } from './remove';
import { mkdirs } from './mkdirs';
import { pathExists } from './pathExists';
import { copy } from './copy';

/**
 * @typedef {Object} MoveOptions
 * @memberof fsn/nextra
 * @property {boolean} [overwrite = false] Should the move overwrite an identical file at the destination path
 */
export interface MoveOptions {
	overwrite?: boolean;
}

/**
 * @function move
 * @memberof fsn/nextra
 * @param source The source path of the file
 * @param destination The destination path of the file
 * @param options The options for the move
 */
export async function move(source: string, destination: string, options: MoveOptions = {}): Promise<void> {
	const overwrite = options.overwrite || false;
	if (resolve(source) === resolve(destination)) return fsp.access(source);

	const myStat = await fsp.lstat(source);
	if (myStat.isDirectory() && isSrcKid(source, destination)) {
		throw new Error('FS-NEXTRA: Moving a parent directory into a child will result in an infinite loop.');
	}

	await mkdirs(dirname(destination));

	if (overwrite) {
		await remove(destination);
	} else if (await pathExists(destination)) {
		throw new Error('FS-NEXTRA: Destination already exists.');
	}

	try {
		return await fsp.rename(source, destination);
	} catch (err) {
		/* istanbul ignore next: Can't test via CI */
		if (err.code === 'EXDEV') {
			const opts = {
				overwrite,
				errorOnExist: true
			};

			await copy(source, destination, opts);
			return remove(source);
		}

		/* istanbul ignore next: Hard to produce, such as ENOMEM (Kernel running out of memory). Can't test via CI */
		throw err;
	}
}
