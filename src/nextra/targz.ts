import { createGzip } from 'zlib';
import { createWriteStream, promises as fsp } from 'fs';
import { dirname } from 'path';

import { Tar } from '../utils/Tar';
import { pipelinePromise } from '../utils/util';
import { scan } from './scan';
import { targzAtomic } from './targzAtomic';


/**
 * Tar/Gzips a directory or array of files.
 * @function targz
 * @memberof fsn/nextra
 * @param fileName The filename of the archive
 * @param inputFiles The directory or array of filepaths to .tar.gz
 * @param options The options for this .tar.gz
 */
export async function targz(fileName: string, inputFiles: string | string[], atomic = false): Promise<void> {
	if (atomic) return targzAtomic(fileName, inputFiles);
	if (!Array.isArray(inputFiles)) inputFiles = [inputFiles];

	const tar = new Tar(dirname(inputFiles[0]));

	for (const input of inputFiles) {
		const stats = await fsp.lstat(input);
		if (stats.isDirectory()) {
			const files = await scan(input, { filter: (dirent): boolean => dirent.isFile() });
			for (const file of files.keys()) tar.append(file, await fsp.lstat(file));
		} else {
			tar.append(input, stats);
		}
	}

	return pipelinePromise(
		tar,
		createGzip(),
		createWriteStream(fileName)
	);
}
