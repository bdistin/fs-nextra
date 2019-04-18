import { join } from 'path';

import { readdir } from '../fs';

import mkdirs from './mkdirs';
import remove from './remove';

/**
 * Deletes all directories and files within the provided directory.
 * @function emptydir
 * @memberof fsn/nextra
 * @param dir The directory you wish to empty
 */
/**
 * Deletes all directories and files within the provided directory.
 * @function emptyDir
 * @memberof fsn/nextra
 * @param dir The directory you wish to empty
 */
export default async function emptyDir(dir: string): Promise<void> {
	try {
		const items = await readdir(dir);
		await Promise.all(items.map((item): Promise<void> => remove(join(dir, item))));
	} catch (err) {
		await mkdirs(dir);
	}
}
