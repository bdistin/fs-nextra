<div align="center">
  <p>
    <a href="https://nodei.co/npm/fs-nextra/"><img src="https://nodei.co/npm/fs-nextra.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/fs-nextra"><img src="https://img.shields.io/npm/v/fs-nextra.svg?maxAge=3600" /></a> <a href="https://www.npmjs.com/package/fs-nextra"><img src="https://img.shields.io/npm/dt/fs-nextra.svg?maxAge=3600" /></a>
  </p>
  <p>
    <a href="https://www.codacy.com/app/dirigeants/fs-nextra?utm_source=github.com&utm_medium=referral&utm_content=bdistin/fs-nextra&utm_campaign=badger"><img src="https://api.codacy.com/project/badge/Grade/6bcb7d5133c94dd6902acb5ef626ff27" /></a> <a href="https://travis-ci.org/bdistin/fs-nextra"><img src="https://travis-ci.org/bdistin/fs-nextra.svg?branch=master" /></a>
  </p>
  <p>
    <a href="https://david-dm.org/bdistin/fs-nextra"><img src="https://david-dm.org/bdistin/fs-nextra.svg" /></a> <a href="https://david-dm.org/bdistin/fs-nextra?type=dev"><img src="https://david-dm.org/bdistin/fs-nextra/dev-status.svg" /></a>
  </p>
</div>

Node.js V8 native fs, enhanced with util.promisify and standard extra methods. Written in full ES2017, sans every sync method. *Async is the future!*

Docs
------

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
