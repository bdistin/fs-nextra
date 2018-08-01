const fs = require('fs');

if (fs.promises) {
	const otherMethods = {};
	for (const [key, value] of Object.entries(fs)) if (!key.includes('Sync') && !(`${key}Sync` in fs)) otherMethods[key] = value;
	module.exports = { ...fs.promises, ...otherMethods };
} else {
	const { promisify } = require('util');

	for (const [key, value] of Object.entries(fs)) {
		if (key.includes('Sync')) continue;
		if (`${key}Sync` in fs) exports[key] = promisify(value);
		else exports[key] = value;
	}
}

/* eslint-disable max-len */

/**
 * @namespace fsn/fs
 * @property {Object} constants Identical to fs.constants.
 * @property {number} constants.F_OK Flag indicating that the file is visible to the calling process.
 * @property {number} constants.R_OK Flag indicating that the file can be read by the calling process.
 * @property {number} constants.W_OK Flag indicating that the file can be written by the calling process.
 * @property {number} constants.X_OK Flag indicating that the file can be executed by the calling process.
 * @property {number} constants.O_RDONLY Flag indicating to open a file for read-only access.
 * @property {number} constants.O_WRONLY Flag indicating to open a file for write-only access.
 * @property {number} constants.O_RDWR Flag indicating to open a file for read-write access.
 * @property {number} constants.O_CREAT Flag indicating to create the file if it does not already exist.
 * @property {number} constants.O_EXCL Flag indicating that opening a file should fail if the O_CREAT flag is set and the file already exists.
 * @property {number} constants.O_NOCTTY Flag indicating that if path identifies a terminal device, opening the path shall not cause that terminal to become the controlling terminal for the process (if the process does not already have one).
 * @property {number} constants.O_TRUNC Flag indicating that if the file exists and is a regular file, and the file is opened successfully for write access, its length shall be truncated to zero.
 * @property {number} constants.O_APPEND Flag indicating that data will be appended to the end of the file.
 * @property {number} constants.O_DIRECTORY Flag indicating that the open should fail if the path is not a directory.
 * @property {number} constants.O_NOATIME Flag indicating reading accesses to the file system will no longer result in an update to the atime information associated with the file. This flag is available on Linux operating systems only.
 * @property {number} constants.O_NOFOLLOW Flag indicating that the open should fail if the path is a symbolic link.
 * @property {number} constants.O_SYNC Flag indicating that the file is opened for synchronous I/O.
 * @property {number} constants.O_SYMLINK Flag indicating to open the symbolic link itself rather than the resource it is pointing to.
 * @property {number} constants.O_DIRECT When set, an attempt will be made to minimize caching effects of file I/O.
 * @property {number} constants.O_NONBLOCK Flag indicating to open the file in nonblocking mode when possible.
 * @property {number} constants.S_IFMT Bit mask used to extract the file type code.
 * @property {number} constants.S_IFREG File type constant for a regular file.
 * @property {number} constants.S_IFDIR File type constant for a directory.
 * @property {number} constants.S_IFCHR File type constant for a character-oriented device file.
 * @property {number} constants.S_IFBLK File type constant for a block-oriented device file.
 * @property {number} constants.S_IFIFO File type constant for a FIFO/pipe.
 * @property {number} constants.S_IFLNK File type constant for a symbolic link.
 * @property {number} constants.S_IFSOCK File type constant for a socket.
 * @property {number} constants.S_IRWXU File mode indicating readable, writable and executable by owner.
 * @property {number} constants.S_IRUSR File mode indicating readable by owner.
 * @property {number} constants.S_IWUSR File mode indicating writable by owner.
 * @property {number} constants.S_IXUSR File mode indicating executable by owner.
 * @property {number} constants.S_IRWXG File mode indicating readable, writable and executable by group.
 * @property {number} constants.S_IRGRP File mode indicating readable by group.
 * @property {number} constants.S_IWGRP File mode indicating writable by group.
 * @property {number} constants.S_IXGRP File mode indicating executable by group.
 * @property {number} constants.S_IRWXO File mode indicating readable, writable and executable by others.
 * @property {number} constants.S_IROTH File mode indicating readable by others.
 * @property {number} constants.S_IWOTH File mode indicating writable by others.
 * @property {number} constants.S_IXOTH File mode indicating executable by others.
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_copyfile_src_dest_flags_callback|fs.copyFile} but returns a promise instead.
 * @function copyFile
 * @memberof fsn/fs
 * @param {string|Buffer|URL} src File path to copy
 * @param {string|Buffer|URL} dest Destination to copy to
 * @param {number} [flags = 0] modifiers for copy operation.
 * @returns {Promise<void>}
 */

/**
 * Objects returned from {@link fsn/fs.watch|watch()} are of this type.
 * Identical to {@link https://nodejs.org/api/fs.html#fs_class_fs_fswatcher|fs.FSWatcher}.
 * @class FSWatcher
 * @fires FSWatcher#change
 * @fires FSWatcher#error
 */

/**
 * Emitted when an error occurs.
 * @event FSWatcher#change
 * @type {fsn/fs.FSWatcher}
 * @property {string} eventType The type of fs change
 * @property {string|Buffer} filename The filename that changed
 * @instance
 */

/**
 * Emitted when an error occurs.
 * @event FSWatcher#error
 * @type {fsn/fs.FSWatcher}
 * @property {Error} error The error
 * @instance
 */

/**
 * Closes the FSWatcher instance
 * @function close
 * @memberof FSWatcher
 * @instance
 */

/**
 * Objects returned from {@link fsn/fs.stat|stat()}, {@link fsn/fs.lstat|lstat()} and {@link fsn/fs.fstat|fstat()} are of this type.
 * Identical to {@link https://nodejs.org/api/fs.html#fs_class_fs_stats|fs.Stats}.
 * @class Stats
 */

/**
 * @function isFile
 * @memberof Stats
 * @instance
 * @returns {boolean}
 */

/**
 * @function isDirectory
 * @memberof Stats
 * @instance
 * @returns {boolean}
 */

/**
 * @function isBlockDevice
 * @memberof Stats
 * @instance
 * @returns {boolean}
 */

/**
 * @function isCharacterDevice
 * @memberof Stats
 * @instance
 * @returns {boolean}
 */

/**
 * @function isSymbolicLink
 * @memberof Stats
 * @instance
 * @returns {boolean}
 */

/**
 * @function isFIFO
 * @memberof Stats
 * @instance
 * @returns {boolean}
 */

/**
 * @function isSocket
 * @memberof Stats
 * @instance
 * @returns {boolean}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_class_fs_readstream|fs.ReadStream}.
 * @class ReadStream
 * @property {number} bytesRead The number of bytes read so far
 * @property {string|Buffer} path The file the stream is reading from
 * @fires ReadStream#close
 * @fires ReadStream#open
 */

/**
 * Emitted when the readstream closes.
 * @event ReadStream#close
 * @instance
 */

/**
 * Emitted when the readstream's file is opened.
 * @event ReadStream#open
 * @property {number} fd The file discriptor.
 * @instance
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_class_fs_writestream|fs.WriteStream}.
 * @class WriteStream
 * @property {number} bytesWritten The number of bytes written so far
 * @property {string|Buffer} path The file the stream is reading from
 * @fires WriteStream#close
 * @fires WriteStream#open
 */

/**
 * Emitted when the readstream closes.
 * @event WriteStream#close
 * @instance
 */

/**
 * Emitted when the readstream's file is opened.
 * @event WriteStream#open
 * @property {number} fd The file discriptor.
 * @instance
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback|fs.access} but returns a promise instead.
 * @function access
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The path to be checked
 * @param {number} [mode] The accessibility checks to be performed
 * @returns {Promise<void>}
 */

/**
 * @typedef AppendFileOptions
 * @memberof fsn/fs
 * @property {string} [encoding = 'utf8'] The file encoding
 * @property {number} [mode = 0o666] The chmod
 * @property {string} [flag = 'a'] The flag
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_appendfile_file_data_options_callback|fs.appendFile} but returns a promise instead.
 * @function appendFile
 * @memberof fsn/fs
 * @param {string|Buffer|number} file Filename or file descriptor
 * @param {string|Buffer} data The data to be written
 * @param {AppendFileOptions|string} [options] Options for the append, or the encoding.
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_chmod_path_mode_callback|fs.chmod} but returns a promise instead.
 * @function chmod
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path File or directory path
 * @param {number} mode The chmod to be applied
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_chown_path_uid_gid_callback|fs.chown} but returns a promise instead.
 * @function chown
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path File or directory path
 * @param {number} uid The new owner id
 * @param {number} gid The new group id
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_close_fd_callback|fs.close} but returns a promise instead.
 * @function close
 * @memberof fsn/fs
 * @param {number} fd The file descriptor
 * @returns {Promise<void>}
 */

/**
 * @typedef ReadStreamOptions
 * @memberof fsn/fs
 * @property {string} [flags = 'r'] The flags to use
 * @property {string} [defaultEncoding = null] The encoding to use
 * @property {number} [fd = null] The file descriptor
 * @property {number} [mode = 0o666] The chmod to use
 * @property {boolean} [autoClose = true] If the stream should auto close
 * @property {number} [start] The starting spot
 * @property {number} [end] The ending spot
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options|fs.createReadStream}.
 * @function createReadStream
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path File or directory path
 * @param {ReadStreamOptions|string} [options] The stream options or the encoding
 * @returns {ReadStream}
 */

/**
 * @typedef WriteStreamOptions
 * @memberof fsn/fs
 * @property {string} [flags = 'w'] The flags to use
 * @property {string} [defaultEncoding = 'utf8'] The encoding to use
 * @property {number} [fd = null] The file descriptor
 * @property {number} [mode = 0o666] The chmod to use
 * @property {boolean} [autoClose = true] If the stream should auto close
 * @property {number} [start] The starting spot
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options|fs.createWriteStream}.
 * @function createWriteStream
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path File or directory path
 * @param {WriteStreamOptions|string} [options] The stream options or the encoding
 * @returns {WriteStream}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_exists_path_callback|fs.exists} but returns a promise instead.
 * @function exists
 * @memberof fsn/fs
 * @deprecated Use {@link https://fs-nextra.js.org/fsn_fs.html#.stat__anchor|Stat} or {@link https://fs-nextra.js.org/fsn_nextra.html#.pathExists__anchor|pathExists} instead.
 * @param {string|Buffer|URL} path The file or directory path
 * @returns {Promise<boolean>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_fchmod_fd_mode_callback|fs.fchmod} but returns a promise instead.
 * @function fchmod
 * @memberof fsn/fs
 * @param {number} fd The file descriptor id
 * @param {number} mode The chmod to be applied
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_fchown_fd_uid_gid_callback|fs.fchown} but returns a promise instead.
 * @function fchown
 * @memberof fsn/fs
 * @param {number} fd The file descriptor id
 * @param {number} uid The new owner id
 * @param {number} gid The new group id
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_fdatasync_fd_callback|fs.fdatasync} but returns a promise instead.
 * @function fdatasync
 * @memberof fsn/fs
 * @param {number} fd The file descriptor id
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_fstat_fd_callback|fs.fstat} but returns a promise instead.
 * @function fstat
 * @memberof fsn/fs
 * @param {number} fd The file descriptor id
 * @returns {Promise<Stats>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_fsync_fd_callback|fs.fsync} but returns a promise instead.
 * @function fsync
 * @memberof fsn/fs
 * @param {number} fd The file descriptor id
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_ftruncate_fd_len_callback|fs.ftruncate} but returns a promise instead.
 * @function ftruncate
 * @memberof fsn/fs
 * @param {number} fd The file descriptor id
 * @param {number} len The length in bytes to truncate to
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_futimes_fd_atime_mtime_callback|fs.futimes} but returns a promise instead.
 * @function futimes
 * @memberof fsn/fs
 * @param {number} fd The file descriptor id
 * @param {number} atime The atime
 * @param {number} mtime The mtime
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_lchmod_path_mode_callback|fs.lchmod} but returns a promise instead.
 * @function lchmod
 * @memberof fsn/fs
 * @param {string|Buffer} path The file path
 * @param {number} mode The chmod
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_lchown_path_uid_gid_callback|fs.lchown} but returns a promise instead.
 * @function lchown
 * @memberof fsn/fs
 * @param {string|Buffer} path The file path
 * @param {number} uid The new owner id
 * @param {number} gid The new group id
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_link_existingpath_newpath_callback|fs.link} but returns a promise instead.
 * @function link
 * @memberof fsn/fs
 * @param {string|Buffer|URL} existingPath The existing file path
 * @param {string|Buffer|URL} newPath The new file path
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_lstat_path_callback|fs.lstat} but returns a promise instead.
 * @function lstat
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The file path
 * @returns {Promise<Stats>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_mkdir_path_mode_callback|fs.mkdir} but returns a promise instead.
 * @function mkdir
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The file path
 * @param {number} [mode = 0o777] The chmod
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} EncodingOptions
 * @memberof fsn/fs
 * @property {string} [encoding = 'utf8'] The encoding for the temperary directory
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_mkdtemp_prefix_options_callback|fs.mkdtemp} but returns a promise instead.
 * @function mkdtemp
 * @memberof fsn/fs
 * @param {string} prefix The prefix of the temperary folder to create
 * @param {EncodingOptions|string} [options = 'utf8'] The temperary directory options, or encoding
 * @returns {Promise<string>} The folder path
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback|fs.open} but returns a promise instead.
 * @function open
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The file path
 * @param {string|number} flags The flags for opening the file.
 * @param {number} [mode = 0o666] The chmod
 * @returns {Promise<integer>} The file descriptor
 */

/**
 * @typedef {Object} ReadObject
 * @memberof fsn/fs
 * @property {number} bytesRead The numberof bytes read
 * @property {Buffer|Uint8Array} buffer The buffer containing the data read
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback|fs.read} but returns a promise instead.
 * @function read
 * @memberof fsn/fs
 * @param {number} fd The file descriptor
 * @param {Buffer|Uint8Array} buffer The buffer that he data will be written to.
 * @param {number} offset The offset in the buffer to start writing at
 * @param {number} length The thenumber of bytes to read
 * @param {number} position The the postition to begin reading from the file
 * @returns {Promise<ReadObject>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback|fs.readdir} but returns a promise instead.
 * @function readdir
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The file path
 * @param {EncodingOptions|string} [options = 'utf8'] The encoding options
 * @returns {Promise<string[]|Buffer>} The files and directories
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback|fs.readFile} but returns a promise instead.
 * @function readFile
 * @memberof fsn/fs
 * @param {string|Buffer|URL|integer} path The file path or file descriptor
 * @param {EncodingOptions|string} [options = {encoding: null, flag: 'r'}] The encoding options
 * @returns {Promise<string|Buffer>} The file contents
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_readlink_path_options_callback|fs.readlink} but returns a promise instead.
 * @function readlink
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The file path
 * @param {EncodingOptions|string} [options = 'utf8'] The encoding options
 * @returns {Promise<string|Buffer>} The linkString
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_realpath_path_options_callback|fs.realpath} but returns a promise instead.
 * @function realpath
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The file path
 * @param {EncodingOptions|string} [options = 'utf8'] The encoding options
 * @returns {Promise<string|Buffer>} The resolvedPath
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback|fs.rename} but returns a promise instead.
 * @function rename
 * @memberof fsn/fs
 * @param {string|Buffer|URL} oldPath The old file path
 * @param {string|Buffer|URL} newPath The new file path
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_rmdir_path_callback|fs.rmdir} but returns a promise instead.
 * @function rmdir
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The directory path
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_stat_path_callback|fs.stat} but returns a promise instead.
 * @function stat
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The file path
 * @returns {Promise<Stats>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_symlink_target_path_type_callback|fs.symlink} but returns a promise instead.
 * @function symlink
 * @memberof fsn/fs
 * @param {string|Buffer|URL} target The path to link from
 * @param {string|Buffer|URL} path The path to link to
 * @param {string} type `dir`, `file`, or `junction` windows only
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_truncate_path_len_callback|fs.truncate} but returns a promise instead.
 * @function truncate
 * @memberof fsn/fs
 * @param {string|Buffer} path The file path
 * @param {number} len The number of bytes to truncate to
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback|fs.unlink} but returns a promise instead.
 * @function unlink
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The file path
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_unwatchfile_filename_listener|fs.unwatchFile}.
 * @function unwatchFile
 * @memberof fsn/fs
 * @param {string|Buffer} path The file path
 * @param {Function} [listener] The listener function
 * @returns {Promise<void>}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_utimes_path_atime_mtime_callback|fs.utimes} but returns a promise instead.
 * @function utimes
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The file path
 * @param {number} atime The atime
 * @param {number} mtime The mtime
 * @returns {Promise<void>}
 */

/**
 * @typedef WatchOptions
 * @memberof fsn/fs
 * @property {boolean} [persistent = true] Indicates whether the process should continue to run as long as files are being watched.
 * @property {boolean} [recursive = false] Indicates whether all subdirectories should be watched, or only the current directory.
 * @property {string} [encoding = 'utf8'] Specifies the character encoding to be used for the filename passed to the listener.
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener|fs.watch}.
 * @function watch
 * @memberof fsn/fs
 * @param {string|Buffer} path The file path
 * @param {WatchOptions} [options] The watch options
 * @param {Function} listener The listener function
 * @returns {FSWatcher}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_watchfile_filename_options_listener|fs.watchFile}.
 * @function watchFile
 * @memberof fsn/fs
 * @param {string|Buffer|URL} path The file path
 * @param {WatchOptions} [options] The watch options
 * @param {Function} listener The listener function
 * @returns {FSWatcher}
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback|fs.write} but returns a promise instead.
 * @function write
 * @memberof fsn/fs
 * @param {number} fd The file descriptor id
 * @param {Buffer|Uint8Array} buffer The buffer to write to file
 * @param {number} [offset] The offset in the buffer to start reading at
 * @param {number} [length] The the number of bytes to write
 * @param {number} [position] The the postition to begin writing to the file
 * @returns {Promise<void>}
 */

/**
 * @typedef WriteOptions
 * @memberof fsn/fs
 * @property {string} [encoding = 'utf8'] The file encoding
 * @property {number} [mode = 0o666] The chmod
 * @property {string} [flag = 'w'] The flag
 */

/**
 * Identical to {@link https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback|fs.writeFile} but returns a promise instead.
 * @function writeFile
 * @memberof fsn/fs
 * @param {string|Buffer|integer} file The filename or file descriptor
 * @param {string|Buffer|Uint8Array} data The data to write to file
 * @param {WriteOptions} [options] The write options
 * @returns {Promise<void>}
 */

/* eslint-enable max-len */
