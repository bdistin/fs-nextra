import { createGunzip } from 'zlib';
import { resolve } from 'path';
import { createReadStream } from 'fs';

import { Untar } from '../utils/Untar';
import { outputFile } from './outputFile';
import { outputFileAtomic } from './outputFileAtomic';


/**
 * Extracts files from .tar.gz archives.
 * @function unTargz
 * @memberof fsn/nextra
 * @param outputDirectory The directory to extract to
 * @param inputFile The archive file
 * @param atomic The if the writes should be atomic
 */
export async function unTargz(outputDirectory: string, inputFile: string, atomic = false): Promise<void> {
	const tar = createReadStream(inputFile).pipe(createGunzip()).pipe(new Untar());
	const writeMethod = atomic ? outputFile : outputFileAtomic;

	for await (const { header, file } of tar.files()) await writeMethod(resolve(outputDirectory, header.filename), file);
}
