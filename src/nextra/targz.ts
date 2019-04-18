import { createGzip } from 'zlib';

import { createWriteStream } from '../fs';
import Tar from '../utils/Tar';
import { pipelinePromise } from '../utils/util';
import { dirname } from 'path';
import scan from './scan';
import targzAtomic from './targzAtomic';


/**
 * Tar/Gzips a directory or array of files.
 * @function targz
 * @memberof fsn/nextra
 * @param fileName The filename of the archive
 * @param inputFiles The directory or array of filepaths to .tar.gz
 * @param options The options for this .tar.gz
 */
export default async function targz(fileName: string, inputFiles: string | string[], atomic: boolean = false): Promise<void> {
	if (atomic) return targzAtomic(fileName, inputFiles);
	if (!Array.isArray(inputFiles)) inputFiles = [inputFiles];

	const tar = new Tar(dirname(inputFiles[0]));

	for (const input of inputFiles) {
		const files = await scan(input, { filter: (stats): boolean => stats.isFile() });
		for (const [file, stats] of files) tar.append(file, stats);
	}

	return pipelinePromise(
		tar,
		createGzip(),
		createWriteStream(fileName)
	);
}
