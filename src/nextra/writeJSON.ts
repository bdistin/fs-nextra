import { promises as fsp } from 'fs';

import { writeFileAtomic, BaseEncodingOptions } from './writeFileAtomic';

/**
 * @typedef {Object} JsonOptions
 * @memberof fsn/nextra
 * @property {Function} [replacer] A JSON.stringify replacer function
 * @property {number} [spaces = null] The number of spaces to format the json file with
 * @property {string} [encoding = 'utf8'] The file encoding
 * @property {number} [mode = 0o666] The chmod
 * @property {string} [flag = 'w'] The flag
 */
export interface JsonOptions {
	replacer?: (key: string, value: any) => any;
	spaces?: string | number;
	encoding?: BaseEncodingOptions;
	mode?: number;
	flag?: string;
}

/**
 * Writes a Javascript Object to file as JSON.
 * @function writeJson
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {Object} object The javascript object you would like to write to file
 * @param {JsonOptions} [options = {}] The options to pass JSON.stringify and writeFile
 * @param {boolean} [atomic = false] Whether the operation should run atomically
 * @returns {Promise<void>}
 */
/**
 * Writes a Javascript Object to file as JSON.
 * @function writeJSON
 * @memberof fsn/nextra
 * @param {string} file The path to the file you want to create
 * @param {Object} object The javascript object you would like to write to file
 * @param {JsonOptions} [options = {}] The options to pass JSON.stringify and writeFile
 * @param {boolean} [atomic = false] Whether the operation should run atomically
 * @returns {Promise<void>}
 */
export async function writeJSON(file: string, object: any, atomic?: boolean): Promise<void>;
export async function writeJSON(file: string, object: any, options?: JsonOptions, atomic?: boolean): Promise<void>;
export async function writeJSON(file: string, object: any, options: JsonOptions | boolean = {}, atomic = false): Promise<void> {
	if (typeof options === 'boolean') [atomic, options] = [options, {}];

	const writeMethod = atomic ? writeFileAtomic : fsp.writeFile;
	await writeMethod(file, `${JSON.stringify(object, options.replacer, options.spaces)}\n`, options);
}

export const writeJson = writeJSON;
