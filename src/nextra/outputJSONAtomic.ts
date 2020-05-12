import { outputJSON } from './outputJSON';
import { JsonOptions } from './writeJSON';

/**
 * Writes a json file to disk, creating all directories needed to meet the filepath provided atomically.
 * @function outputJsonAtomic
 * @memberof fsn/nextra
 * @param file The path to the file you want to create
 * @param data The data to write to file
 * @param options The write options or the encoding string.
 */
/**
 * Writes a json file to disk, creating all directories needed to meet the filepath provided atomically.
 * @function outputJSONAtomic
 * @memberof fsn/nextra
 * @param file The path to the file you want to create
 * @param data The data to write to file
 * @param options The write options or the encoding string.
 */
export function outputJSONAtomic(file: string, data: any, options?: JsonOptions): Promise<void> {
	return outputJSON(file, data, options, true);
}

export const outputJsonAtomic = outputJSONAtomic;
