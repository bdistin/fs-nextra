import { createGzip } from 'zlib';

import { createWriteStream, createReadStream } from '../fs';
import { tempFile, pipelinePromise } from '../utils/util';
import move from './move';

/**
 * Gzips a file
 * @function gzip
 * @memberof fsn/nextra
 * @param fileName The filename of the archive
 * @param inputFile The filepath of the input file
 * @param atomic If the gzip file should be created atomically
 */
export default async function gzip(fileName: string, inputFile: string, atomic: boolean = false): Promise<void> {
	if (atomic) {
		const tempPath = tempFile();
		await pipelinePromise(
			createReadStream(inputFile),
			createGzip(),
			createWriteStream(tempPath)
		);
		return move(tempPath, fileName, { overwrite: true });
	}

	return pipelinePromise(
		createReadStream(inputFile),
		createGzip(),
		createWriteStream(fileName)
	);
}
