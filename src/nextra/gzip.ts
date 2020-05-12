import { createGzip } from 'zlib';
import { createWriteStream, createReadStream } from 'fs';

import { pipelinePromise } from '../utils/util';
import { gzipAtomic } from './gzipAtomic';

/**
 * Gzips a file
 * @function gzip
 * @memberof fsn/nextra
 * @param fileName The filename of the archive
 * @param inputFile The filepath of the input file
 * @param atomic If the gzip file should be created
 */
export async function gzip(fileName: string, inputFile: string, atomic = false): Promise<void> {
	if (atomic) return gzipAtomic(fileName, inputFile);

	return pipelinePromise(
		createReadStream(inputFile),
		createGzip(),
		createWriteStream(fileName)
	);
}
