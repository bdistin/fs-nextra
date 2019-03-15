import { createGzip } from 'zlib';

import { readdir, stat, createWriteStream, createReadStream } from '../fs';
import Tar from '../utils/Tar';
import { tempFile, pipelinePromise } from '../utils/util';
import move from './move';
import { resolve, dirname } from 'path';


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

	const tar = await loadTar(inputFiles);

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

async function loadTar(inputFiles: string[], accumilator: Tar = new Tar({ base: dirname(inputFiles[0]) })): Promise<Tar> {
	if (!inputFiles.length) return accumilator;

	const file = inputFiles.shift();
	const stats = await stat(file);

	if (stats.isDirectory()) await loadTar((await readdir(file)).map(subFile => resolve(file, subFile)), accumilator);
	else await accumilator.append(file, stats);

	return loadTar(inputFiles, accumilator);
}
