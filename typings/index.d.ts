declare module 'fs-nextra' {

	import { Buffer } from 'buffer';
	import {
		ReadStream,
		WriteStream,
		PathLike,
		FSWatcher,
		Stats,
		constants
	} from 'fs';

	// FS NAMESPACE

	export { constants };

	export function access(path: PathLike, mode?: number): Promise<void>;
	export function appendFile(file: PathLike | number, data: any, options?: { encoding?: string | null, mode?: string | number, flag?: string } | string | null): Promise<void>;
	export function chmod(path: PathLike, mode?: string | number): Promise<void>;
	export function chown(path: PathLike, uid: number, gid: number): Promise<void>;
	export function close(fd: number): Promise<void>;
	export function copyFile(src: PathLike, dst: PathLike, flags?: number): Promise<void>;
	export function createReadStream(path: PathLike, options?: ReadStreamOptions | string): ReadStream;
	export function createWriteStream(path: PathLike, options?: WriteStreamOptions | string): WriteStream;
	export function exists(path: PathLike): Promise<boolean>;
	export function fchmod(fd: number, mode: string | number): Promise<void>;
	export function fchown(fd: number, uid: number, gid: number): Promise<void>;
	export function fdatasync(fd: number): Promise<void>;
	export function fstat(fd: number): Promise<Stats>;
	export function fsync(fd: number): Promise<void>;
	export function ftruncate(fd: number, len?: number | null): Promise<void>;
	export function futimes(fd: number, atime: string | number | Date, mtime: string | number | Date): Promise<void>;
	export function lchmod(path: PathLike, mode: string | number): Promise<void>;
	export function lchown(path: PathLike, uid: number, gid: number): Promise<void>;
	export function link(existingPath: PathLike, newPath: PathLike): Promise<void>;
	export function lstat(path: PathLike): Promise<Stats>;
	export function mkdir(path: PathLike, mode?: number | string | null): Promise<void>;
	export function mkdtemp(prefix: string, options: { encoding: 'buffer' } | 'buffer'): Promise<Buffer>;
	export function mkdtemp(prefix: string, options?: { encoding?: BufferEncoding | null } | BufferEncoding | null): Promise<string>;
	export function mkdtemp(prefix: string, options?: { encoding?: string | null } | string | null): Promise<string | Buffer>;
	export function open(path: PathLike, flags: string | number, mode?: string | number | null): Promise<number>;
	export function read<TBuffer extends Buffer | Uint8Array>(fd: number, buffer: TBuffer, offset: number, length: number, position: number | null): Promise<{ bytesRead: number, buffer: TBuffer }>;
	export function readdir(path: PathLike, options: 'buffer' | { encoding: 'buffer' }): Promise<Buffer[]>;
	export function readdir(path: PathLike, options?: { encoding: BufferEncoding | null } | BufferEncoding | null): Promise<string[]>;
	export function readdir(path: PathLike, options?: { encoding?: string | null } | string | null): Promise<string[] | Buffer[]>;
	export function readFile(path: PathLike | number, options: { encoding: string; flag?: string; } | string): Promise<string>;
	export function readFile(path: PathLike | number, options?: { encoding?: null; flag?: string; } | null): Promise<Buffer>;
	export function readFile(path: PathLike | number, options?: { encoding?: string | null; flag?: string; } | string | null): Promise<string | Buffer>;
	export function readlink(path: PathLike, options: { encoding: 'buffer' } | 'buffer'): Promise<Buffer>;
	export function readlink(path: PathLike, options?: { encoding?: BufferEncoding | null } | BufferEncoding | null): Promise<string>;
	export function readlink(path: PathLike, options?: { encoding?: string | null } | string | null): Promise<string | Buffer>;
	export function realpath(path: PathLike, options: { encoding: 'buffer' } | 'buffer'): Promise<Buffer>;
	export function realpath(path: PathLike, options?: { encoding?: BufferEncoding | null } | BufferEncoding | null): Promise<string>;
	export function realpath(path: PathLike, options?: { encoding?: string | null } | string | null): Promise<string | Buffer>;
	export function rename(oldPath: PathLike, newPath: PathLike): Promise<void>;
	export function rmdir(path: PathLike): Promise<void>;
	export function stat(path: PathLike): Promise<Stats>;
	export function symlink(target: PathLike, path: PathLike, type: SymLinkType): Promise<void>;
	export function truncate(path: PathLike, len: number | null): Promise<void>;
	export function unlink(path: PathLike): Promise<void>;
	export function unwatchFile(filename: PathLike, listener?: (curr: Stats, prev: Stats) => void): void;
	export function utimes(path: PathLike, atime: string | number | Date, mtime: string | number | Date): Promise<void>;
	export function watch(filename: PathLike, listener?: (event: string, filename: string) => any): FSWatcher;
	export function watch(filename: PathLike, options: { encoding: 'buffer', persistent?: boolean, recursive?: boolean } | 'buffer', listener?: (event: string, filename: Buffer) => void): FSWatcher;
	export function watch(filename: PathLike, options: { encoding?: BufferEncoding | null, persistent?: boolean, recursive?: boolean } | BufferEncoding | undefined | null, listener?: (event: string, filename: string) => void): FSWatcher;
	export function watch(filename: PathLike, options: { encoding?: string | null, persistent?: boolean, recursive?: boolean } | string | null, listener?: (event: string, filename: string | Buffer) => void): FSWatcher;
	export function watchFile(filename: PathLike, listener: (curr: Stats, prev: Stats) => void): void;
	export function watchFile(filename: PathLike, options: { persistent?: boolean; interval?: number; } | undefined, listener: (curr: Stats, prev: Stats) => void): void;
	export function write(fd: number, value: string, position?: number | null, encoding?: string | null): Promise<{ bytesWritten: number, buffer: string }>;
	export function write<TBuffer extends Buffer | Uint8Array>(fd: number, value: TBuffer, offset?: number, length?: number, position?: number | null): Promise<{ bytesWritten: number, buffer: TBuffer }>;
	export function writeFile(path: PathLike | number, data: any, options?: { encoding?: string | null; mode?: number | string; flag?: string; } | string | null): Promise<void>;

	export type ReadStreamOptions = {
		autoClose?: boolean;
		defaultEncoding?: BufferEncoding;
		end?: number;
		fd?: number;
		flags?: string;
		mode?: number;
		start?: number;
	};

	export type WriteStreamOptions = {
		autoClose?: boolean;
		defaultEncoding?: BufferEncoding;
		end?: number;
		fd?: number;
		flags?: string;
		mode?: number;
		start?: number;
	};

	export type WriteOptions = {
		encoding?: BufferEncoding;
		flag?: string;
		mode?: number;
	};

	// NEXTRA NAMESPACE

	export function copy(source: string, destination: string, options?: CopyOptions | Function): Promise<void>;
	export function copyFileAtomic(source: string, destination: string, options?: WriteOptions | string): Promise<void>;
	export function createFile(file: string, atomic?: boolean): Promise<void>;
	export function createFileAtomic(file: string): Promise<void>;
	export function createFileCopy(source: string, destination: string, options?: WriteOptions | string, atomic?: boolean): Promise<void>;
	export function createFileCopyAtomic(source: string, destination: string, options?: WriteOptions | string): Promise<void>;
	export function createLink(source: string, destination: string, atomic?: boolean): Promise<void>;
	export function createLinkAtomic(source: string, destination: string): Promise<void>;
	export function createSymlink(source: string, destination: string, type?: SymLinkType, atomic?: boolean): Promise<void>;
	export function createSymlinkAtomic(source: string, destination: string, type?: SymLinkType): Promise<void>;
	export function emptydir(dir: string): Promise<void>;
	export function linkAtomic(source: string, destination: string): Promise<void>;
	export function mkdirs(path: string, options?: MkdirsOptions): Promise<string>;
	export function move(source: string, destination: string, options?: MoveOptions): Promise<void>;
	export function outputFile(file: string, data: string | Buffer | Uint8Array, options?: WriteOptions | string, atomic?: boolean): Promise<void>;
	export function outputFileAtomic(file: string, data: string | Buffer | Uint8Array, options?: WriteOptions | string): Promise<void>;
	export function outputJson(file: string, data: any, options?: WriteOptions | string, atomic?: boolean): Promise<void>;
	export function outputJsonAtomic(file: string, data: any, options?: WriteOptions | string): Promise<void>;
	export function pathExists(path: string): Promise<boolean>;
	export function readJson(file: string, options?: ReadJSONOptions | string): Promise<Object>;
	export function remove(path: string, options?: RemoveOptions): Promise<void>;
	export function scan(path: string, options?: ScanOptions): Promise<Map<string, Stats>>;
	export function symlinkAtomic(source: string, destination: string, type?: SymLinkType): Promise<void>;
	export function writeFileAtomic(file: string, data: string | Buffer | Uint8Array, options?: WriteOptions | string): Promise<void>;
	export function writeJson(file: string, object: any, options?: JsonOptions, atomic?: boolean): Promise<void>;
	export function writeJsonAtomic(file: string, object: any, options?: JsonOptions): Promise<void>;
	export { createFile as ensureFile };
	export { createFileAtomic as ensureFileAtomic };
	export { createFileCopy as ensureFileCopy };
	export { createFileCopyAtomic as ensureFileCopyAtomic };
	export { createLink as ensureLink };
	export { createLinkAtomic as ensureLinkAtomic };
	export { createSymlink as ensureSymlink };
	export { createSymlinkAtomic as ensureSymlinkAtomic };
	export { emptydir as emptyDir };
	export { mkdirs as ensureDir };
	export { mkdirs as mkdirp };
	export { outputJson as outputJSON };
	export { outputJsonAtomic as outputJSONAtomic };
	export { readJson as readJSON };
	export { writeJsonAtomic as writeJSONAtomic };
	export { writeJson as writeJSON };

	export type CopyOptions = {
		clobber?: boolean;
		filter?: (source: string, target: string) => boolean;
		overwrite?: boolean;
		preserveTimestamps?: boolean;
	};

	export type MkdirsOptions = {
		mode?: number;
	};

	export type MoveOptions = {
		clobber?: boolean;
		mkdirp?: boolean;
		overwrite?: boolean;
	};

	export type ReadJSONOptions = {
		encoding?: BufferEncoding;
		reviver?: (key: string, value: any) => any;
	};

	export type RemoveOptions = {
		maxBusyTries?: number;
	};

	export type SymLinkType = 'dir' | 'file' | 'junction';

	export type ScanOptions = {
		depthLimit?: number;
		filter?: (stats: Stats, directory: string) => boolean;
	};

	export type JsonOptions = {
		encoding?: BufferEncoding;
		flag?: string;
		mode?: number;
		replacer: (key: string, value: any) => any;
		spaces?: number;
	};

}
