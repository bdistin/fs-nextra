import { dirname } from 'path';

import { default as writeJSON, JsonOptions } from './writeJSON';
import mkdirs from './mkdirs';


/**
 * Writes a json file to disk, creating all directories needed to meet the filepath provided.
 * @function outputJson
 * @memberof fsn/nextra
 * @param file The path to the file you want to create
 * @param data The data to write to file
 * @param options The write options or the encoding string.
 * @param atomic If the operation should be done atomically
 */
/**
 * Writes a json file to disk, creating all directories needed to meet the filepath provided.
 * @function outputJSON
 * @memberof fsn/nextra
 * @param file The path to the file you want to create
 * @param data The data to write to file
 * @param options The write options or the encoding string.
 * @param atomic If the operation should be done atomically
 */
export default async function outputJSON(file: string, data: any, options?: JsonOptions | boolean, atomic: boolean = false): Promise<void> {
	if (typeof options === 'boolean') [atomic, options] = [options, {}];

	await mkdirs(dirname(file));

	return writeJSON(file, data, options, atomic);
}
