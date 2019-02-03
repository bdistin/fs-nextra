import { resolve, join } from 'path';
import { lstat, readdir } from '../fs';
import { Stats } from 'fs';

/**
 * @typedef {Object} ScanOptions
 * @memberof fsn/nextra
 * @property {Function} [filter] A filter function receiving (stats, path) to determine if the returned map should include a given entry
 * @property {number} [depthLimit] How many directories deep the scan should go (0 is just the children of the passed root directory, no subdirectory files)
 */
interface ScanOptions {
	filter?: (stats: Stats, dir: string) => boolean;
	depthLimit?: number;
}
/**
 * Recursively scans a directory, returning a map of stats keyed on the full path to the item.
 * @function scan
 * @memberof fsn/nextra
 * @param root The path to scan
 * @param options The options for the scan
 */
export default function scan(root: string, options: ScanOptions = {}): Promise<Map<string, Stats>> {
	return scanDeep(resolve(root), new Map(), -1, options);
}

const scanDeep = async (dir: string, results: Map<string, Stats>, level: number, options: ScanOptions): Promise<Map<string, Stats>> => {
	const stats = await lstat(dir);
	if (!options.filter || options.filter(stats, dir)) results.set(dir, stats);
	if (stats.isDirectory() && (typeof options.depthLimit === 'undefined' || level < options.depthLimit)) {
		await Promise.all((await readdir(dir)).map(part => scanDeep(join(dir, part), results, ++level, options)));
	}
	return results;
};
