import { afterEach, beforeEach, describe, test, expect } from 'vitest';
import * as path from 'path';
import addMatchers from './matchers';
import { createTempDir } from 'broccoli-test-helper';
import type { TempDir } from 'broccoli-test-helper';

const ORIGNAL_CONSOLE = Object.assign({}, console);

describe('addMatchers', () => {
  let output: string[][];
  let tmpdir: TempDir;

  beforeEach(async () => {
    output = [];

    console.log = (...args: string[]) => {
      output.push(args);
    };

    tmpdir = await createTempDir();
  });

  afterEach(() => {
    Object.assign(console, ORIGNAL_CONSOLE);
  });

  test('adds each of the matchers in the `matchers` directory', async () => {
    await addMatchers();

    expect(output).toEqual([
      [`##[add-matcher]${path.join(__dirname, '..', 'matchers', 'eslint-compact.json')}`],
      [`##[add-matcher]${path.join(__dirname, '..', 'matchers', 'eslint-stylish.json')}`],
      [`##[add-matcher]${path.join(__dirname, '..', 'matchers', 'tsc.json')}`],
    ]);
  });

  test('adds matchers found', async () => {
    tmpdir.write({
      'foo.json': '{}',
      'bar.json': '{}',
    });
    await addMatchers(tmpdir.path());

    expect(output).toEqual([
      [`##[add-matcher]${path.normalize(tmpdir.path('bar.json'))}`],
      [`##[add-matcher]${path.normalize(tmpdir.path('foo.json'))}`],
    ]);
  });
});
