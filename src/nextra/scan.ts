import { resolve, join } from 'path';
import { promises as fsp, Dirent } from 'fs';

/**
 * @typedef {Object} ScanOptions
 * @memberof fsn/nextra
 * @property {Function} [filter] A filter function receiving (dirent, path) to determine if the returned map should include a given entry
 * @property {number} [depthLimit] How many directories deep the scan should go (0 is just the children of the passed root directory, no subdirectory files)
 */
export interface ScanOptions {
	filter?: (dirent: Dirent, path: string) => boolean;
	depthLimit?: number;
}

/**
 * Recursively scans a directory, returning a map of stats keyed on the full path to the item.
 * @function scan
 * @memberof fsn/nextra
 * @param root The path to scan
 * @param options The options for the scan
 */
export function scan(root: string, options: ScanOptions = {}): Promise<Map<string, Dirent>> {
	return scanDeep(resolve(root), new Map(), 0, options);
}

async function scanDeep(path: string, results: Map<string, Dirent>, level: number, options: ScanOptions): Promise<Map<string, Dirent>> {
	const dir = await fsp.opendir(path);

	for await (const dirent of dir) {
		const fullPath = join(path, dirent.name);

		if (!options.filter || options.filter(dirent, fullPath)) results.set(fullPath, dirent);
		if (dirent.isDirectory() && (typeof options.depthLimit === 'undefined' || level < options.depthLimit)) {
			await scanDeep(join(path, dirent.name), results, level + 1, options);
		}
	}

	return results;
}
