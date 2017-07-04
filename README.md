Node.js V8 native fs, enhanced with util.promisify and standard extra methods. Written in full ES2017, sans every sync method. *Async is the future!*

Docs
------

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6bcb7d5133c94dd6902acb5ef626ff27)](https://www.codacy.com/app/dirigeants/fs-nextra?utm_source=github.com&utm_medium=referral&utm_content=bdistin/fs-nextra&utm_campaign=badger)

All `fs` methods which return a callback, return a promise instead. All `fs-extra` methods return a promise exclusivly. No Sync methods are included from either `fs` or `fs-extra`. Requires minimum Node.js v8.1.0.

The full documentation can be found here: [fs-nextra.js.org](https://fs-nextra.js.org/).

Credit
------

`fs-nextra` is heavily based on `fs-extra`, this module wouldn't be possible without it's author:

- [JP Richardson](https://github.com/jprichardson)

License
-------

Licensed under MIT

Copyright (c) 2017 [BDISTIN](https://github.com/bdistin)
