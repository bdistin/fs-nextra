/* istanbul ignore file: Types and Docs for fs-promises, should not test or require coverage */

import * as fs from 'fs';
import { URL } from 'url';

export { createReadStream, createWriteStream, unwatchFile, watch, watchFile, Dirent, Stats, ReadStream, WriteStream, constants } from 'fs';

/* eslint-disable max-len */

/**
 * Valid types for path values in 'fs'.
 */
type PathLike = string | Buffer | URL;

export interface MakeDirectoryOptions {
	/**
	 * Indicates whether parent folders should be created.
	 * @default false
	 */
	recursive?: boolean;
	/**
	 * A file mode. If a string is passed, it is parsed as an octal integer. If not specified
	 * @default 0o777.
	 */
	mode?: number;
}

/**
 * [fs.promises] Asynchronously tests a user's permissions for the file specified by path.
 * @param path A path to a file or directory. If a URL is provided, it must use the `file:` protocol.
 * URL support is _experimental_.
 */
export function access(path: PathLike, mode?: number): Promise<void> { return fs.promises.access(path, mode); }

/**
 * [fs.promises] Asynchronously copies `src` to `dest`. By default, `dest` is overwritten if it already exists.
 * Node.js makes no guarantees about the atomicity of the copy operation.
 * If an error occurs after the destination file has been opened for writing, Node.js will attempt
 * to remove the destination.
 * @param src A path to the source file.
 * @param dest A path to the destination file.
 * @param flags An optional integer that specifies the behavior of the copy operation. The only
 * supported flag is `fs.constants.COPYFILE_EXCL`, which causes the copy operation to fail if
 * `dest` already exists.
 */
export function copyFile(src: PathLike, dest: PathLike, flags?: number): Promise<void> { return fs.promises.copyFile(src, dest, flags); }

/**
 * [fs.promises] Asynchronous open(2) - open and possibly create a file.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param mode A file mode. If a string is passed, it is parsed as an octal integer. If not
 * supplied, defaults to `0o666`.
 */
export function open(path: PathLike, flags: string | number, mode?: string | number): Promise<fs.promises.FileHandle> { return fs.promises.open(path, flags, mode); }

/**
 * [fs.promises] Asynchronously reads data from the file referenced by the supplied `FileHandle`.
 * @param handle A `FileHandle`.
 * @param buffer The buffer that the data will be written to.
 * @param offset The offset in the buffer at which to start writing.
 * @param length The number of bytes to read.
 * @param position The offset from the beginning of the file from which data should be read. If
 * `null`, data will be read from the current position.
 */
export function read<Uint8Array>(
	handle: fs.promises.FileHandle,
	buffer: any,
	offset?: number | null,
	length?: number | null,
	position?: number | null,
): Promise<{ bytesRead: number, buffer: Uint8Array }> { return fs.promises.read(handle, buffer, offset, length, position); }

/**
 * [fs.promises] Asynchronously writes `buffer` to the file referenced by the supplied `FileHandle`.
 * It is unsafe to call `fsPromises.write()` multiple times on the same file without waiting for the `Promise`
 * to be resolved (or rejected). For this scenario, `fs.createWriteStream` is strongly recommended.
 * @param handle A `FileHandle`.
 * @param buffer The buffer that the data will be written to.
 * @param offset The part of the buffer to be written. If not supplied, defaults to `0`.
 * @param length The number of bytes to write. If not supplied, defaults to `buffer.length - offset`.
 * @param position The offset from the beginning of the file where this data should be written. If not supplied, defaults to the current position.
 */
export function write<TBuffer extends Buffer | Uint8Array>(
	handle: fs.promises.FileHandle,
	buffer: TBuffer,
	offset?: number | null,
	length?: number | null,
	position?: number | null
): Promise<{ bytesWritten: number, buffer: TBuffer }>;

/**
 * [fs.promises] Asynchronously writes `string` to the file referenced by the supplied `FileHandle`.
 * It is unsafe to call `fsPromises.write()` multiple times on the same file without waiting for the `Promise`
 * to be resolved (or rejected). For this scenario, `fs.createWriteStream` is strongly recommended.
 * @param handle A `FileHandle`.
 * @param data A string to write. If something other than a string is supplied it will be coerced to a string.
 * @param position The offset from the beginning of the file where this data should be written. If not supplied, defaults to the current position.
 * @param encoding The expected string encoding.
 */
export function write(handle: fs.promises.FileHandle, data: any, position?: number | null, encoding?: string | null): Promise<{ bytesWritten: number, buffer: string }>;

export function write<TBuffer extends Uint8Array>(handle: fs.promises.FileHandle, data: TBuffer | any, offsetOrPosition?: number | null, encodingOrLength?: (TBuffer extends Buffer ? number : string) | null): Promise<{ bytesWritten: number, buffer: string | TBuffer }> {
	return fs.promises.write(handle, data, offsetOrPosition, encodingOrLength as (string | null));
}

/**
 * [fs.promises] Asynchronous rename(2) - Change the name or location of a file or directory.
 * @param oldPath A path to a file. If a URL is provided, it must use the `file:` protocol.
 * URL support is _experimental_.
 * @param newPath A path to a file. If a URL is provided, it must use the `file:` protocol.
 * URL support is _experimental_.
 */
export function rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
	return fs.promises.rename(oldPath, newPath);
}

/**
 * [fs.promises] Asynchronous truncate(2) - Truncate a file to a specified length.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param len If not specified, defaults to `0`.
 */
export function truncate(path: PathLike, len?: number): Promise<void> {
	return fs.promises.truncate(path, len);
}

/**
 * [fs.promises] Asynchronous ftruncate(2) - Truncate a file to a specified length.
 * @param handle A `FileHandle`.
 * @param len If not specified, defaults to `0`.
 */
export function ftruncate(handle: fs.promises.FileHandle, len?: number): Promise<void> {
	return fs.promises.ftruncate(handle, len);
}

/**
 * [fs.promises] Asynchronous rmdir(2) - delete a directory.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 */
export function rmdir(path: PathLike): Promise<void> {
	return fs.promises.rmdir(path);
}

/**
 * Asynchronous fdatasync(2) - synchronize a file's in-core state with storage device.
 * @param handle A `FileHandle`.
 */
export function fdatasync(handle: fs.promises.FileHandle): Promise<void> {
	return fs.promises.fdatasync(handle);
}

/**
 * [fs.promises] Asynchronous fsync(2) - synchronize a file's in-core state with the underlying storage device.
 * @param handle A `FileHandle`.
 */
export function fsync(handle: fs.promises.FileHandle): Promise<void> {
	return fs.promises.fsync(handle);
}

/**
 * [fs.promises] Asynchronous mkdir(2) - create a directory.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param options Either the file mode, or an object optionally specifying the file mode and whether parent folders
 * should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
 */
export function mkdir(path: PathLike, options?: number | string | MakeDirectoryOptions | null): Promise<void> {
	return fs.promises.mkdir(path, options);
}

/**
 * [fs.promises] Asynchronous readdir(3) - read a directory.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
 */
export function readdir(path: PathLike, options?: { encoding?: BufferEncoding | null } | BufferEncoding | null): Promise<string[]>;
export function readdir(path: PathLike, options: { encoding: 'buffer' } | 'buffer'): Promise<Buffer[]>;
export function readdir(path: PathLike, options?: { encoding?: string | null } | string | null): Promise<string[] | Buffer[]> {
	return fs.promises.readdir(path, options);
}

/**
 * [fs.promises] Asynchronous readlink(2) - read value of a symbolic link.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
 */
export function readlink(path: PathLike, options?: { encoding?: BufferEncoding | null } | BufferEncoding | null): Promise<string>;
export function readlink(path: PathLike, options: { encoding: 'buffer' } | 'buffer'): Promise<Buffer>;
export function readlink(path: PathLike, options?: { encoding?: string | null } | string | null): Promise<string | Buffer> {
	return fs.promises.readlink(path, options);
}

/**
 * [fs.promises] Asynchronous symlink(2) - Create a new symbolic link to an existing file.
 * @param target A path to an existing file. If a URL is provided, it must use the `file:` protocol.
 * @param path A path to the new symlink. If a URL is provided, it must use the `file:` protocol.
 * @param type May be set to `'dir'`, `'file'`, or `'junction'` (default is `'file'`) and is only available on Windows (ignored on other platforms).
 * When using `'junction'`, the `target` argument will automatically be normalized to an absolute path.
 */
export function symlink(target: PathLike, path: PathLike, type?: string | null): Promise<void> {
	return fs.promises.symlink(target, path, type);
}

/**
 * [fs.promises] Asynchronous fstat(2) - Get file status.
 * @param handle A `FileHandle`.
 */
export function fstat(handle: fs.promises.FileHandle): Promise<fs.Stats> {
	return fs.promises.fstat(handle);
}

/**
 * [fs.promises] Asynchronous lstat(2) - Get file status. Does not dereference symbolic links.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 */
export function lstat(path: PathLike): Promise<fs.Stats> {
	return fs.promises.lstat(path);
}

/**
 * [fs.promises] Asynchronous stat(2) - Get file status.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 */
export function stat(path: PathLike): Promise<fs.Stats> {
	return fs.promises.stat(path);
}

/**
 * [fs.promises] Asynchronous link(2) - Create a new link (also known as a hard link) to an existing file.
 * @param existingPath A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param newPath A path to a file. If a URL is provided, it must use the `file:` protocol.
 */
export function link(existingPath: PathLike, newPath: PathLike): Promise<void> {
	return fs.promises.link(existingPath, newPath);
}

/**
 * [fs.promises] Asynchronous unlink(2) - delete a name and possibly the file it refers to.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 */
export function unlink(path: PathLike): Promise<void> {
	return fs.promises.unlink(path);
}

/**
 * [fs.promises] Asynchronous fchmod(2) - Change permissions of a file.
 * @param handle A `FileHandle`.
 * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
 */
export function fchmod(handle: fs.promises.FileHandle, mode: string | number): Promise<void> {
	return fs.promises.fchmod(handle, mode);
}

/**
 * [fs.promises] Asynchronous chmod(2) - Change permissions of a file.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
 */
export function chmod(path: PathLike, mode: string | number): Promise<void> {
	return fs.promises.chmod(path, mode);
}

/**
 * [fs.promises] Asynchronous lchmod(2) - Change permissions of a file. Does not dereference symbolic links.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
 */
export function lchmod(path: PathLike, mode: string | number): Promise<void> {
	return fs.promises.lchmod(path, mode);
}

/**
 * [fs.promises] Asynchronous lchown(2) - Change ownership of a file. Does not dereference symbolic links.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 */
export function lchown(path: PathLike, uid: number, gid: number): Promise<void> {
	return fs.promises.lchown(path, uid, gid);
}

/**
 * [fs.promises] Asynchronous fchown(2) - Change ownership of a file.
 * @param handle A `FileHandle`.
 */
export function fchown(handle: fs.promises.FileHandle, uid: number, gid: number): Promise<void> {
	return fs.promises.fchown(handle, uid, gid);
}

/**
 * [fs.promises] Asynchronous chown(2) - Change ownership of a file.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 */
export function chown(path: PathLike, uid: number, gid: number): Promise<void> {
	return fs.promises.chown(path, uid, gid);
}

/**
 * [fs.promises] Asynchronously change file timestamps of the file referenced by the supplied path.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param atime The last access time. If a string is provided, it will be coerced to number.
 * @param mtime The last modified time. If a string is provided, it will be coerced to number.
 */
export function utimes(path: PathLike, atime: string | number | Date, mtime: string | number | Date): Promise<void> {
	return fs.promises.utimes(path, atime, mtime);
}

/**
 * [fs.promises] Asynchronously change file timestamps of the file referenced by the supplied `FileHandle`.
 * @param handle A `FileHandle`.
 * @param atime The last access time. If a string is provided, it will be coerced to number.
 * @param mtime The last modified time. If a string is provided, it will be coerced to number.
 */
export function futimes(handle: fs.promises.FileHandle, atime: string | number | Date, mtime: string | number | Date): Promise<void> {
	return fs.promises.futimes(handle, atime, mtime);
}

/**
 * [fs.promises] Asynchronous realpath(3) - return the canonicalized absolute pathname.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
 */
export function realpath(path: PathLike, options?: { encoding?: BufferEncoding | null } | BufferEncoding | null): Promise<string>;
export function realpath(path: PathLike, options: { encoding: 'buffer' } | 'buffer'): Promise<Buffer>;
export function realpath(path: PathLike, options?: { encoding?: string | null } | string | null): Promise<string | Buffer> {
	return fs.promises.realpath(path, options);
}

/**
 * [fs.promises] Asynchronously creates a unique temporary directory.
 * Generates six random characters to be appended behind a required `prefix` to create a unique temporary directory.
 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, `'utf8'` is used.
 */
export function mkdtemp(prefix: string, options?: { encoding?: BufferEncoding | null } | BufferEncoding | null): Promise<string>;
export function mkdtemp(prefix: string, options: { encoding: 'buffer' } | 'buffer'): Promise<Buffer>;
export function mkdtemp(prefix: string, options?: { encoding?: string | null } | string | null): Promise<string | Buffer> {
	return fs.promises.mkdtemp(prefix, options);
}

/**
 * [fs.promises] Asynchronously writes data to a file, replacing the file if it already exists.
 * It is unsafe to call `fsPromises.writeFile()` multiple times on the same file without waiting for the `Promise` to be resolved (or rejected).
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * URL support is _experimental_.
 * If a `FileHandle` is provided, the underlying file will _not_ be closed automatically.
 * @param data The data to write. If something other than a `Buffer` or `Uint8Array` is provided, the value is coerced to a string.
 * @param options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
 * If `encoding` is not supplied, the default of `'utf8'` is used.
 * If `mode` is not supplied, the default of `0o666` is used.
 * If `mode` is a string, it is parsed as an octal integer.
 * If `flag` is not supplied, the default of `'w'` is used.
 */
export function writeFile(path: PathLike | fs.promises.FileHandle, data: any, options?: { encoding?: string | null, mode?: string | number, flag?: string | number } | string | null): Promise<void> {
	return fs.promises.writeFile(path, data, options);
}

/**
 * [fs.promises] Asynchronously append data to a file, creating the file if it does not exist.
 * @param file A path to a file. If a URL is provided, it must use the `file:` protocol.
 * URL support is _experimental_.
 * If a `FileHandle` is provided, the underlying file will _not_ be closed automatically.
 * @param data The data to write. If something other than a `Buffer` or `Uint8Array` is provided, the value is coerced to a string.
 * @param options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
 * If `encoding` is not supplied, the default of `'utf8'` is used.
 * If `mode` is not supplied, the default of `0o666` is used.
 * If `mode` is a string, it is parsed as an octal integer.
 * If `flag` is not supplied, the default of `'a'` is used.
 */
export function appendFile(path: PathLike | fs.promises.FileHandle, data: any, options?: { encoding?: string | null, mode?: string | number, flag?: string | number } | string | null): Promise<void> {
	return fs.promises.appendFile(path, data, options);
}

/**
 * [fs.promises] Asynchronously reads the entire contents of a file.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * If a `FileHandle` is provided, the underlying file will _not_ be closed automatically.
 * @param options An object that may contain an optional flag.
 * If a flag is not provided, it defaults to `'r'`.
 */
export function readFile(path: PathLike | fs.promises.FileHandle, options?: { encoding?: null, flag?: string | number } | null): Promise<Buffer>;
export function readFile(path: PathLike | fs.promises.FileHandle, options?: { encoding?: BufferEncoding, flag?: string | number } | BufferEncoding): Promise<string>;
export function readFile(path: PathLike | fs.promises.FileHandle, options?: { encoding?: string | null, flag?: string | number } | string | null): Promise<string | Buffer> {
	return fs.promises.readFile(path, options);
}


/* eslint-enable max-len */
