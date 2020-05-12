import { writeJSON, JsonOptions } from './writeJSON';

/**
 * Writes a Javascript Object to file as JSON atomically.
 * @function writeJsonAtomic
 * @memberof fsn/nextra
 * @param file The path to the file you want to create
 * @param object The javascript object you would like to write to file
 * @param options The options to pass JSON.stringify and writeFile
 */
/**
 * Writes a Javascript Object to file as JSON atomically.
 * @function writeJSONAtomic
 * @memberof fsn/nextra
 * @param file The path to the file you want to create
 * @param object The javascript object you would like to write to file
 * @param options The options to pass JSON.stringify and writeFile
 */
export async function writeJSONAtomic(file: string, object: any, options: JsonOptions = {}): Promise<void> {
	return writeJSON(file, object, options, true);
}

export const writeJsonAtomic = writeJSONAtomic;
