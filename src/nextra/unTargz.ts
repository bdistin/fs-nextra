import { createGunzip } from 'zlib';
import { resolve } from 'path';

import { writeFile, createReadStream } from '../fs';
import Untar from '../utils/Untar';
import mkdirs from './mkdirs';
import writeFileAtomic from './writeFileAtomic';


/**
 * Extracts files from .tar.gz archives.
 * @function unTargz
 * @memberof fsn/nextra
 * @param outputDirectory The directory to extract to
 * @param inputFile The archive file
 * @param atomic The if the writes should be atomic
 */
export default async function unTargz(outputDirectory: string, inputFile: string, atomic: boolean = false): Promise<void> {
	await mkdirs(outputDirectory);

	const tar = createReadStream(inputFile).pipe(createGunzip()).pipe(new Untar());
	const writeMethod = atomic ? writeFileAtomic : writeFile;

	for await (const { header, file } of tar.files()) await writeMethod(resolve(outputDirectory, header.filename), file);
}
