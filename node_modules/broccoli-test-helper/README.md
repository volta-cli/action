# broccoli-test-helper

Test helpers for BroccoliPlugins that make testing build and rebuild behavior dead simple and diff friendly.

Has TypeScript declarations and supports async/await style testing.

[![Build status](https://ci.appveyor.com/api/projects/status/4oilygqd42yc8wsl/branch/master?svg=true)](https://ci.appveyor.com/project/embercli/broccoli-test-helper/branch/master)
[![Build Status](https://travis-ci.org/broccolijs/broccoli-test-helper.svg?branch=master)](https://travis-ci.org/broccolijs/broccoli-test-helper)

- [Usage Examples](#usage-examples)
  - [QUnit and TypeScript](#qunit-and-typescript)
  - [Mocha and co](#mocha-and-co)
- [API](docs/api/index.md)

# Usage Examples

## QUnit and TypeScript

Example works in Node 4+ by using `tsc -t ES2015 -m commonjs` to compile async/await to generator wrapped in a helper.

```ts
import { createBuilder, createTempDir } from "broccoli-test-helper";
import Herp2Derp = require("../index");

QUnit.module("Herp2Derp", () => {
  QUnit.test("test build", async assert => {
    const input = await createTempDir();
    try {
      const subject = new Herp2Derp(input.path());
      const output = createBuilder(subject);
      try {
        // INITIAL
        input.write({
          "a.herp": "A",
          lib: {
            "b.herp": "B",
            "c.herp": "C",
          },
        });
        await output.build();

        assert.deepEqual(output.read(), {
          "a.derp": "derp A!",
          lib: {
            "b.derp": "derp B!",
            "c.derp": "derp C!",
          },
        });
        assert.deepEqual(output.changes(), {
          "a.derp": "create",
          "lib/": "mkdir",
          "lib/b.derp": "create",
          "lib/c.derp": "create",
        });

        // UPDATE
        input.write({
          "a.herp": "AA", // change
          lib: null, // rmdir
        });
        await output.build();

        assert.deepEqual(output.read(), {
          "a.derp": "derp AA!",
        });
        assert.deepEqual(output.changes(), {
          "lib/c.derp": "unlink",
          "lib/b.derp": "unlink",
          "lib/": "rmdir",
          "a.derp": "change",
        });

        // NOOP
        await output.build();

        assert.deepEqual(output.changes(), {});
      } finally {
        await output.dispose();
      }
    } finally {
      await input.dispose();
    }
  });
});
```

## Mocha and co

Example works in Node 4+ by using `co` for async/await like generator syntax.

```js
"use strict";
const helper = require("broccoli-test-helper");
const co = require("co");
const expect = require("chai").expect;
const createBuilder = helper.createBuilder;
const createTempDir = helper.createTempDir;
const Herp2Derp = require("../index");

describe("Herp2Derp", function() {
  it(
    "should build",
    co.wrap(function*() {
      const input = yield createTempDir();
      try {
        const subject = new Herp2Derp(input.path());
        const output = createBuilder(subject);
        try {
          // INITIAL
          input.write({
            "a.herp": "A",
            lib: {
              "b.herp": "B",
              "c.herp": "C",
            },
          });
          yield output.build();

          expect(output.read()).to.deep.equal({
            "a.derp": "derp A!",
            lib: {
              "b.derp": "derp B!",
              "c.derp": "derp C!",
            },
          });
          expect(output.changes()).to.deep.equal({
            "a.derp": "create",
            "lib/": "mkdir",
            "lib/b.derp": "create",
            "lib/c.derp": "create",
          });

          // UPDATE
          input.write({
            "a.herp": "AA", // change
            lib: null, // rmdir
          });
          yield output.build();

          expect(output.read()).to.deep.equal({
            "a.derp": "derp AA!",
          });
          expect(output.changes()).to.deep.equal({
            "lib/c.derp": "unlink",
            "lib/b.derp": "unlink",
            "lib/": "rmdir",
            "a.derp": "change",
          });

          // NOOP
          yield output.build();

          expect(output.changes()).to.deep.equal({});
        } finally {
          yield output.dispose();
        }
      } finally {
        yield input.dispose();
      }
    })
  );
});
```
