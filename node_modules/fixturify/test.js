var fs = require('fs')
var test = require('tap').test
var rimraf = require('rimraf')

var fixturify = require('./')

test('writeSync', function (t) {
  rimraf.sync('testdir.tmp')
  fixturify.writeSync('testdir.tmp', {
    'foo.txt': 'foo.txt contents',
    'subdir': {
      'bar.txt': 'bar.txt contents'
    }
  })

  t.deepEqual(fs.readdirSync('testdir.tmp').sort(), ['foo.txt', 'subdir'])
  t.deepEqual(fs.readdirSync('testdir.tmp/subdir').sort(), ['bar.txt'])
  t.equal(fs.readFileSync('testdir.tmp/foo.txt', 'UTF8'), 'foo.txt contents')
  t.equal(fs.readFileSync('testdir.tmp/subdir/bar.txt', 'UTF8'), 'bar.txt contents')

  fixturify.writeSync('testdir.tmp', {
    'something': 'foo.txt contents',
    'else': {
      'bar.txt': 'bar.txt contents'
    }
  })

  t.deepEqual(fs.readdirSync('testdir.tmp').sort(), ['else', 'foo.txt', 'something', 'subdir'])
  t.deepEqual(fs.readdirSync('testdir.tmp/subdir').sort(), ['bar.txt'])
  t.deepEqual(fs.readdirSync('testdir.tmp/else').sort(), ['bar.txt'])

  t.equal(fs.readFileSync('testdir.tmp/foo.txt', 'UTF8'), 'foo.txt contents')
  t.equal(fs.readFileSync('testdir.tmp/subdir/bar.txt', 'UTF8'), 'bar.txt contents')
  t.equal(fs.readFileSync('testdir.tmp/else/bar.txt',  'UTF8'), 'bar.txt contents')

  fixturify.writeSync('testdir.tmp', {
    'else': 'else is now a file'
  })

  t.equal(fs.readFileSync('testdir.tmp/else',  'UTF8'), 'else is now a file')

  fixturify.writeSync('testdir.tmp', {
    'empty-dir': { }
  })
  t.deepEqual(fs.readdirSync('testdir.tmp/empty-dir').sort(), [])
  rimraf.sync('testdir.tmp')
  t.end()
})

test('readSync', function (t) {
  rimraf.sync('testdir.tmp')
  fs.mkdirSync('testdir.tmp')
  fs.writeFileSync('testdir.tmp/foo.txt', 'foo.txt contents')
  fs.mkdirSync('testdir.tmp/subdir')
  fs.writeFileSync('testdir.tmp/subdir/bar.txt', 'bar.txt contents')
  fs.symlinkSync('../foo.txt', 'testdir.tmp/subdir/symlink')

  t.deepEqual(fixturify.readSync('testdir.tmp'), {
    'foo.txt': 'foo.txt contents',
    'subdir': {
      'bar.txt': 'bar.txt contents',
      'symlink': 'foo.txt contents'
    }
  })

  rimraf.sync('testdir.tmp')
  t.end()
})

test('readSync include', function (t) {
  rimraf.sync('testdir.tmp')
  fs.mkdirSync('testdir.tmp')
  fs.writeFileSync('testdir.tmp/foo.txt', 'foo.txt contents')
  fs.mkdirSync('testdir.tmp/subdir')
  fs.writeFileSync('testdir.tmp/subdir/bar.txt', 'bar.txt contents')
  fs.symlinkSync('../foo.txt', 'testdir.tmp/subdir/symlink')

  t.deepEqual(fixturify.readSync('testdir.tmp', {
    include: ['foo*']
  }), {
    'foo.txt': 'foo.txt contents'
  })

  rimraf.sync('testdir.tmp')
  t.end()
})

test('readSync exclude', function (t) {
  rimraf.sync('testdir.tmp')
  fs.mkdirSync('testdir.tmp')
  fs.writeFileSync('testdir.tmp/foo.txt', 'foo.txt contents')
  fs.mkdirSync('testdir.tmp/subdir')
  fs.writeFileSync('testdir.tmp/subdir/bar.txt', 'bar.txt contents')
  fs.symlinkSync('../foo.txt', 'testdir.tmp/subdir/symlink')

  t.deepEqual(fixturify.readSync('testdir.tmp', {
    exclude: ['subdir/bar*']
  }), {
    'foo.txt': 'foo.txt contents',
    'subdir': {
      'symlink': 'foo.txt contents'
    }
  })

  rimraf.sync('testdir.tmp')
  t.end()
})

test('writeSync remove', function (t) {
  rimraf.sync('testdir.tmp')
  fs.mkdirSync('testdir.tmp')
  fs.writeFileSync('testdir.tmp/foo.txt', 'foo.txt contents')
  fs.mkdirSync('testdir.tmp/subdir')
  fs.writeFileSync('testdir.tmp/subdir/bar.txt', 'bar.txt contents')
  fs.symlinkSync('../foo.txt', 'testdir.tmp/subdir/symlink')

  fixturify.writeSync('testdir.tmp', {
    'subdir': {
      'symlink': null
    }
  })

  t.deepEqual(fs.readdirSync('testdir.tmp').sort(), ['foo.txt', 'subdir'])
  t.deepEqual(fs.readdirSync('testdir.tmp/subdir').sort(), ['bar.txt'])
  t.equal(fs.readFileSync('testdir.tmp/foo.txt', 'UTF8'), 'foo.txt contents')
  t.equal(fs.readFileSync('testdir.tmp/subdir/bar.txt', 'UTF8'), 'bar.txt contents')

  fixturify.writeSync('testdir.tmp', {
    'subdir': {
      'bar.txt': null
    }
  })

  t.deepEqual(fs.readdirSync('testdir.tmp/').sort(), ['foo.txt', 'subdir'])

  fixturify.writeSync('testdir.tmp', {
    'subdir': {
      'bar.txt': 'hi'
    }
  })

  t.deepEqual(fs.readdirSync('testdir.tmp/').sort(), ['foo.txt', 'subdir'])
  t.equal(fs.readFileSync('testdir.tmp/subdir/bar.txt', 'UTF8'), 'hi')

  fixturify.writeSync('testdir.tmp', {
    'subdir': null
  })
  t.deepEqual(fs.readdirSync('testdir.tmp/').sort(), ['foo.txt'])

  rimraf.sync('testdir.tmp')
  t.end()
})

test('error conditions', function (t) {

  test('writeSync arguments requires specific input', function (t) {
    t.throws(function () {
      fixturify.writeSync()
    })
    t.throws(function () {
      fixturify.writeSync(null)
    })
    t.throws(function () {
      fixturify.writeSync(null, null)
    })
    t.throws(function () {
      fixturify.writeSync(null, {})
    })
    t.end()
  })

  test('writeSync guards against misuse that could cause data loss', function (t) {
    // Test that we guard against usage errors that might cause data loss
    // through fs.removeSync('' + '/' + '') or similar.
    rimraf.sync('testdir.tmp')
    t.throws(function () {
      fixturify.writeSync('', { })
    }, /non-empty string/)
    t.throws(function () {
      fixturify.writeSync('testdir.tmp', { '': 'contents' })
    }, /non-empty string/)
    t.throws(function () {
      fixturify.writeSync('testdir.tmp', { '.': { } })
    }, /must not be "\." or "\.\."/)
    t.throws(function () {
      fixturify.writeSync('testdir.tmp', { '..': { } })
    }, /must not be "\." or "\.\."/)
    t.throws(function () {
      fixturify.writeSync('testdir.tmp', { 'foo/bar': { } })
    }, /must not contain "\/" or "\\"/)
    t.throws(function () {
      fixturify.writeSync('testdir.tmp', { 'foo\\bar': { } })
    }, /must not contain "\/" or "\\"/)
    t.end()
  })

  test('writeSync handles overwriting a file and then creating a new file', function(t) {
    rimraf.sync('testdir.tmp')
    fs.mkdirSync('testdir.tmp')

    fixturify.writeSync('testdir.tmp', {
      'a.txt': 'a.txt content',
      'b': {}
    })

    t.deepEqual(fs.readdirSync('testdir.tmp').sort(), ['a.txt', 'b'])

    fixturify.writeSync('testdir.tmp', {
      'a.txt': 'a.txt updated',
      'c': {}
    })

    t.deepEqual(fs.readdirSync('testdir.tmp').sort(), ['a.txt', 'b', 'c'])

    rimraf.sync('testdir.tmp')
    t.end()
  })

  test('readSync throws on broken symlinks', function(t) {
    rimraf.sync('testdir.tmp')
    fs.mkdirSync('testdir.tmp')
    fs.symlinkSync('doesnotexist', 'testdir.tmp/symlink')
    t.throws(function() {
      fixturify.readSync('testdir.tmp')
    })
    rimraf.sync('testdir.tmp')
    t.end()
  })

  t.end()
})
