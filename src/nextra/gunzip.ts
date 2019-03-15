import { createGunzip } from 'zlib';

import { createWriteStream, createReadStream } from '../fs';
import { tempFile, pipelinePromise } from '../utils/util';
import move from './move';

/**
 * Un-Gzips a file
 * @function gunzip
 * @memberof fsn/nextra
 * @param fileName The filename of the output file
 * @param inputFile The filepath of the archive
 * @param atomic If the unzip file should be created atomically
 */
export default async function gzip(fileName: string, inputFile: string, atomic: boolean = false): Promise<void> {
	if (atomic) {
		const tempPath = tempFile();
		await pipelinePromise(
			createReadStream(inputFile),
			createGunzip(),
			createWriteStream(tempPath)
		);
		return move(tempPath, fileName, { overwrite: true });
	}

	return pipelinePromise(
		createReadStream(inputFile),
		createGunzip(),
		createWriteStream(fileName)
	);
}
