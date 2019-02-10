import { access } from '../fs';

/**
 * Checks if a path exists.
 * @function pathExists
 * @memberof fsn/nextra
 * @param path The path to check
 */
export default async function pathExists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch (err) {
		return false;
	}
}
