# node-fixturify

[![Build Status](https://travis-ci.org/joliss/node-fixturify.png?branch=master)](https://travis-ci.org/joliss/node-fixturify)

[![Build status](https://ci.appveyor.com/api/projects/status/6lub3kelxqccc6cb/branch/master?svg=true)](https://ci.appveyor.com/project/embercli/node-fixturify/branch/master)

Convert JSON objects into directory structures on the file system, and back
again. This package is primarily useful for writing tests.

## Installation

```bash
npm install --save-dev fixturify
```

## Usage

```js
var fs = require('fs')
var fixturify = require('fixturify')

var obj = {
  'foo.txt': 'foo.txt contents',
  'subdir': {
    'bar.txt': 'bar.txt contents'
  }
}

fixturify.writeSync('testdir', obj) // write it to disk

fixturify.readSync('testdir') // => deep-equals obj

fixturify.readSync('testdir', { include: ['foo*'] }) // glob support
// => { foo.txt: 'foo.text contents' }

fixturify.readSync('testdir', { exclude: ['foo*'] }) // glob support
// => { subdir: { bar.txt: 'bar.text contents' } }

fixturify.writeSync('testDir', {
  'subdir': { 'bar.txt': null }
}) // remove subdir/bar.txt

fixturify.readSync('testdir') // => { foo.txt: 'foo.text contents' }

fixturify.writeSync('testDir', {
  'subdir': null
}) // remove subdir/

```

File contents are decoded and encoded with UTF-8.

`fixture.readSync` follows symlinks. It throws an error if it encounters a
broken symlink.

## Limitations

To keep the API simple, node-fixturify has the following limitations:

* Reading or setting file stats (last-modified time, permissions, etc.) is
  not supported.

* Creating symlinks is not supported.

* Special files like FIFOs, sockets, or devices are not supported.

* File contents are automatically encoded/decoded into strings. Binary files
  are not supported.
