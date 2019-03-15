import { createGzip } from 'zlib';

import { createWriteStream } from '../fs';
import Tar from '../utils/Tar';
import { tempFile, pipelinePromise } from '../utils/util';
import move from './move';
import { dirname } from 'path';
import scan from './scan';


/**
 * Tar/Gzips a directory or array of files.
 * @function targz
 * @memberof fsn/nextra
 * @param fileName The filename of the archive
 * @param inputFiles The directory or array of filepaths to .tar.gz
 * @param options The options for this .tar.gz
 */
export default async function targz(fileName: string, inputFiles: string | string[], atomic: boolean = false): Promise<void> {
	if (!Array.isArray(inputFiles)) inputFiles = [inputFiles];

	const tar = new Tar(dirname(inputFiles[0]));

	for (const input of inputFiles) {
		const files = await scan(input, { filter: stats => stats.isFile() });
		for (const [file, stats] of files) await tar.append(file, stats);
	}

	if (atomic) {
		const tempPath = tempFile();
		await pipelinePromise(
			tar.close(),
			createGzip(),
			createWriteStream(tempPath)
		);
		return move(tempPath, fileName, { overwrite: true });
	}

	return pipelinePromise(
		tar.close(),
		createGzip(),
		createWriteStream(fileName)
	);
}
