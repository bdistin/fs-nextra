declare module 'fs-nextra' {

	// FS NAMESPACE

	export const constants: FSConstants;

	export function access(path: string|Buffer|URL, mode?: number): Promise<void>;
	export function appendFile(file: string|Buffer|number, data: string|Buffer, options?: AppendFileOptions|string): Promise<void>;
	export function chmod(path: string|Buffer|URL, mode?: number): Promise<void>;
	export function chown(path: string|Buffer|URL, uid: number, gid: number): Promise<void>;
	export function close(fd: number): Promise<void>;
	export function copyFile(existingPath: string|Buffer|URL, newPath: string|Buffer|URL, flags?: number): Promise<void>;
	export function createReadStream(path: string|Buffer|URL, options?: readStreamOptions|string): Promise<void>;
	export function createWriteStream(path: string|Buffer|URL, options?: writeStreamOptions|string): Promise<void>;
	export function exists(path: string|Buffer|URL): Promise<boolean>;
	export function fchmod(fd: number, mode: number): Promise<void>;
	export function fchown(fd: number, uid: number, gid: number): Promise<void>;
	export function fdatasync(fd: number): Promise<void>;
	export function fstat(fd: number): Promise<Stats>;
	export function fsync(fd: number): Promise<void>;
	export function ftruncate(fd: number, len: number): Promise<void>;
	export function futimes(fd: number, atime: number, mtime: number): Promise<void>;
	export function lchmod(path: string|Buffer, mode: number): Promise<void>;
	export function lchown(path: string|Buffer, uid: number, gid: number): Promise<void>;
	export function link(existingPath: string|Buffer|URL, newPath: string|Buffer|URL): Promise<void>;
	export function lstat(path: string|Buffer|URL): Promise<Stats>;
	export function mkdir(path: string|Buffer|URL, mode?: number): Promise<void>;
	export function mkdtemp(prefix: string, options?: encodingOptions|string): Promise<string>;
	export function open(path: string|Buffer|URL, flags: string|number, mode?: number): Promise<number>;
	export function read(fd: number, buffer: Buffer|Uint8Array, offset: number, length: number, position: number): Promise<readObject>;
	export function readdir(path: string|Buffer|URL, options?: encodingOptions|string): Promise<Array<string>>;
	export function readFile(path: string|Buffer|URL|number, options?: encodingOptions|string): Promise<string|Buffer>;
	export function readlink(path: string|Buffer|URL, options?: encodingOptions|string): Promise<string|Buffer>;
	export function realpath(path: string|Buffer|URL, options?: encodingOptions|string): Promise<string|Buffer>;
	export function rename(oldPath: string|Buffer|URL, newPath: string|Buffer|URL): Promise<void>;
	export function rmdir(path: string|Buffer|URL): Promise<void>;
	export function stat(path: string|Buffer|URL): Promise<Stats>;
	export function symlink(target: string|Buffer|URL, path: string|Buffer|URL, type: SymLinkType): Promise<void>;
	export function truncate(path: string|Buffer, len: number): Promise<void>;
	export function unlink(path: string|Buffer|URL): Promise<void>;
	export function unwatchFile(path: string|Buffer, listener?: Function): Promise<void>;
	export function utimes(path: string|Buffer|URL, atime: number, mtime: number): Promise<void>;
	export function watch(path: string|Buffer, options: watchOptions, listener: Function): FSWatcher;
	export function watch(path: string|Buffer, listener: Function): FSWatcher;
	export function watchFile(path: string|Buffer|URL, options: watchOptions, listener: Function): FSWatcher;
	export function watchFile(path: string|Buffer|URL, listener: Function): FSWatcher;
	export function write(fd: number, buffer: Buffer|Uint8Array, offset?: number, length?: number, position?: number): Promise<void>;
	export function writeFile(file: string|Buffer|number, data: string|Buffer|Uint8Array, options?: writeOptions): Promise<void>;

	export class FSWatcher {

		public close(): Promise<void>;
		public on(event: 'change', listener: (eventType: string, filename: string|Buffer) => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;

	}

	export class Stats {

		public isBlockDevice(): boolean;
		public isCharacterDevice(): boolean;
		public isDirectory(): boolean;
		public isFIFO(): boolean;
		public isFile(): boolean;
		public isSocket(): boolean;
		public isSymbolicLink(): boolean;

	}

	export class ReadStream {

		public bytesRead: number;
		public path: string|Buffer;
		public on(event: 'close', listener: () => void): this;
		public on(event: 'open', listener: (fd: number) => void): this;

	}

	export class WriteStream {

		public bytesWritten: number;
		public path: string|Buffer;
		public on(event: 'close', listener: () => void): this;
		public on(event: 'open', listener: (fd: number) => void): this;

	}

	export type FSConstants = {
		F_OK: number;
		R_OK: number;
		W_OK: number;
		X_OK: number;
		O_RDONLY: number;
		O_WRONLY: number;
		O_RDWR: number;
		O_CREAT: number;
		O_EXCL: number;
		O_NOCTTY: number;
		O_TRUNC: number;
		O_APPEND: number;
		O_DIRECTORY: number;
		O_NOATIME: number;
		O_NOFOLLOW: number;
		O_SYNC: number;
		O_SYMLINK: number;
		O_DIRECT: number;
		O_NONBLOCK: number;
		S_IFMT: number;
		S_IFREG: number;
		S_IFDIR: number;
		S_IFCHR: number;
		S_IFBLK: number;
		S_IFIFO: number;
		S_IFLNK: number;
		S_IFSOCK: number;
		S_IRWXU: number;
		S_IRUSR: number;
		S_IWUSR: number;
		S_IXUSR: number;
		S_IRWXG: number;
		S_IRGRP: number;
		S_IWGRP: number;
		S_IXGRP: number;
		S_IRWXO: number;
		S_IROTH: number;
		S_IWOTH: number;
		S_IXOTH: number;
	};

	export type AppendFileOptions = {
		encoding?: string;
		mode?: number;
		flag?: string;
	};

	export type encodingOptions = {
		encoding?: string;
	};

	export type readObject = {
		bytesRead: number;
		buffer: Buffer|Uint8Array;
	};

	export type readStreamOptions = {
		flags?: string;
		defaultEncoding?: string;
		fd?: number;
		mode?: number;
		autoClose?: boolean;
		start?: number;
		end?: number;
	};

	export type watchFileOptions = {
		persistent?: boolean;
		interval?: number;
	};

	export type watchOptions = {
		persistent?: boolean;
		recursive?: boolean;
		encoding?: string;
	};

	export type writeOptions = {
		encoding?: string;
		mode?: number;
		flag?: string;
	};

	export type writeStreamOptions = {
		flags?: string;
		defaultEncoding?: string;
		fd?: number;
		mode?: number;
		autoClose?: boolean;
		start?: number;
		end?: number;
	};

	// NEXTRA NAMESPACE

	export function writeJsonAtomic(file: string, object: Object, options?: jsonOptions): Promise<void>;
	export function writeJSONAtomic(file: string, object: Object, options?: jsonOptions): Promise<void>;
	export function writeJson(file: string, object: Object, options?: jsonOptions, atomic?: boolean): Promise<void>;
	export function writeJSON(file: string, object: Object, options?: jsonOptions, atomic?: boolean): Promise<void>;
	export function writeFileAtomic(file: string, data: string|Buffer|Uint8Array, options?: writeOptions|string): Promise<void>;
	export function symlinkAtomic(source: string, destination: string, type?: SymLinkType): Promise<void>;
	export function scan(path: string, options?: scanOptions): Promise<Map<string, Stats>>;
	export function remove(path: string, options?: removeOptions): Promise<void>;
	export function readJson(file: string, options?: readJSONOptions|string): Promise<Object>;
	export function readJSON(file: string, options?: readJSONOptions|string): Promise<Object>;
	export function pathExists(path: string): Promise<boolean>;
	export function outputJsonAtomic(file: string, data: Object|Array<any>, options?: writeOptions|string): Promise<void>;
	export function outputJSONAtomic(file: string, data: Object|Array<any>, options?: writeOptions|string): Promise<void>;
	export function outputJson(file: string, data: Object|Array<any>, options?: writeOptions|string, atomic?: boolean): Promise<void>;
	export function outputJSON(file: string, data: Object|Array<any>, options?: writeOptions|string, atomic?: boolean): Promise<void>;
	export function outputFileAtomic(file: string, data: string|Buffer|Uint8Array, options?: writeOptions|string): Promise<void>;
	export function outputFile(file: string, data: string|Buffer|Uint8Array, options?: writeOptions|string, atomic?: boolean): Promise<void>;
	export function move(source: string, destination: string, options?: moveOptions): Promise<void>;
	export function mkdirs(path: string, options?: mkdirsOptions, made?: string): Promise<string>;
	export function mkdirp(path: string, options?: mkdirsOptions, made?: string): Promise<string>;
	export function ensureDir(path: string, options?: mkdirsOptions, made?: string): Promise<string>;
	export function linkAtomic(source: string, destination: string): Promise<void>;
	export function emptydir(dir: string): Promise<void>;
	export function emptyDir(dir: string): Promise<void>;
	export function createSymlinkAtomic(source: string, destination: string, type?: SymLinkType): Promise<void>;
	export function ensureSymlinkAtomic(source: string, destination: string, type?: SymLinkType): Promise<void>;
	export function createSymlink(source: string, destination: string, type?: SymLinkType, atomic?: boolean): Promise<void>;
	export function ensureSymlink(source: string, destination: string, type?: SymLinkType, atomic?: boolean): Promise<void>;
	export function createLinkAtomic(source: string, destination: string): Promise<void>;
	export function ensureLinkAtomic(source: string, destination: string): Promise<void>;
	export function createLink(source: string, destination: string, atomic?: boolean): Promise<void>;
	export function ensureLink(source: string, destination: string, atomic?: boolean): Promise<void>;
	export function createFileCopyAtomic(source: string, destination: string, options?: writeOptions|string): Promise<void>;
	export function ensureFileCopyAtomic(source: string, destination: string, options?: writeOptions|string): Promise<void>;
	export function createFileCopy(source: string, destination: string, options?: writeOptions|string, atomic?: boolean): Promise<void>;
	export function ensureFileCopy(source: string, destination: string, options?: writeOptions|string, atomic?: boolean): Promise<void>;
	export function createFileAtomic(file: string): Promise<void>;
	export function ensureFileAtomic(file: string): Promise<void>;
	export function createFile(file: string, atomic?: boolean): Promise<void>;
	export function ensureFile(file: string, atomic?: boolean): Promise<void>;
	export function copyFileAtomic(source: string, destination: string, options?: writeOptions|string): Promise<void>;
	export function copy(source: string, destination: string, options?: CopyOptions|Function): Promise<void>;

	export type CopyOptions = {
		filter?: Function;
		overwrite?: boolean;
		clobber?: boolean;
		preserveTimestamps?: boolean;
	};

	export type mkdirsOptions = {
		mode?: number;
	};

	export type moveOptions = {
		mkdirp?: boolean;
		overwrite?: boolean;
		clobber?: boolean;
	};

	export type readJSONOptions = {
		encoding?: string;
		reviver?: Function;
	};

	export type removeOptions = {
		maxBusyTries?: number;
	};

	export type SymLinkType = 'dir'|'file';

	export type scanOptions = {
		filter?: Function;
		depthLimit?: number;
	};

	export type jsonOptions = {
		replacer: Function;
		spaces?: number;
		encoding?: string;
		mode?: number;
		flag?: string;
	};

}
