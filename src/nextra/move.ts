import { resolve, dirname } from 'path';

import { isSrcKid } from '../util';
import { access, rename, stat } from '../fs';

import remove from './remove';
import mkdirs from './mkdirs';
import pathExists from './pathExists';
import copy from './copy';

/**
 * @typedef {Object} MoveOptions
 * @memberof fsn/nextra
 * @property {boolean} [overwrite = false] Should the move overwrite an identical file at the destination path
 */
interface MoveOptions {
	overwrite?: boolean;
}

/**
 * @function move
 * @memberof fsn/nextra
 * @param source The source path of the file
 * @param destination The destination path of the file
 * @param options The options for the move
 */
export default async function move(source: string, destination: string, options: MoveOptions = {}): Promise<void> {
	const overwrite = options.overwrite || false;
	if (resolve(source) === resolve(destination)) return access(source);

	const myStat = await stat(source);
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
		return await rename(source, destination);
	} catch (err) {
		// Cross network moving: Can't test via travis
		/* istanbul ignore next */
		if (err.code === 'EXDEV') {
			const opts = {
				overwrite,
				errorOnExist: true
			};

			await copy(source, destination, opts);
			return remove(source);
		}

		// Hard to produce, such as ENOMEM (Kernel running out of memory): Can't test via travis
		/* istanbul ignore next */
		throw err;
	}
}
