import { createGunzip } from 'zlib';

import { createWriteStream, createReadStream } from '../fs';
import { pipelinePromise } from '../utils/util';
import gunzipAtomic from './gunzipAtomic';

/**
 * Un-Gzips a file
 * @function gunzip
 * @memberof fsn/nextra
 * @param fileName The filename of the output file
 * @param inputFile The filepath of the archive
 * @param atomic If the unzip file should be created atomically
 */
export default async function gzip(fileName: string, inputFile: string, atomic: boolean = false): Promise<void> {
	if (atomic) gunzipAtomic(fileName, inputFile);

	return pipelinePromise(
		createReadStream(inputFile),
		createGunzip(),
		createWriteStream(fileName)
	);
}
