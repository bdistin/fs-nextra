FS-Nextra
------

[![npm](https://nodei.co/npm/fs-nextra.png?downloads=true&stars=true)](https://nodei.co/npm/fs-nextra/)

[![npm](https://img.shields.io/npm/v/fs-nextra.svg?maxAge=3600)](https://www.npmjs.com/package/fs-nextra)
[![npm](https://img.shields.io/npm/dt/fs-nextra.svg?maxAge=3600)](https://www.npmjs.com/package/fs-nextra)

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/bdistin/fs-nextra.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/bdistin/fs-nextra/context:javascript)
[![Coverage Status](https://coveralls.io/repos/github/bdistin/fs-nextra/badge.svg?branch=master)](https://coveralls.io/github/bdistin/fs-nextra?branch=master)
[![travic-ci](https://travis-ci.com/bdistin/fs-nextra.svg?branch=master)](https://travis-ci.com/bdistin/fs-nextra)

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=bdistin/fs-nextra)](https://dependabot.com)
[![david](https://david-dm.org/bdistin/fs-nextra.svg)](https://david-dm.org/bdistin/fs-nextra)
[![david](https://david-dm.org/bdistin/fs-nextra/dev-status.svg)](https://david-dm.org/bdistin/fs-nextra?type=dev)

Node.js V8 native fs, enhanced with util.promisify and standard extra methods. Written in full ES2017, sans every sync method. *Async is the future!*

Docs
------

All `fs` methods which return a callback, return a promise instead. All `fs-extra` methods return a promise exclusively. No sync methods are included from either `fs` or `fs-extra`. Requires minimum Node.js v8.5.0.

> Note: If your node version is high enough, fs-nextra will automatically use fs/promises instead of util.promisify-ing fs.

The full documentation can be found here: [fs-nextra.js.org](https://fs-nextra.js.org/).

Credit
------

`fs-nextra` is heavily based on `fs-extra`, this module wouldn't be possible without it's author:

- [JP Richardson](https://github.com/jprichardson)

License
-------

Licensed under MIT

Copyright (c) 2017 [BDISTIN](https://github.com/bdistin)
