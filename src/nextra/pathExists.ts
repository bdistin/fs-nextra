import { promises as fsp } from 'fs';

/**
 * Checks if a path exists.
 * @function pathExists
 * @memberof fsn/nextra
 * @param path The path to check
 */
export async function pathExists(path: string): Promise<boolean> {
	try {
		await fsp.access(path);
		return true;
	} catch (err) {
		return false;
	}
}
