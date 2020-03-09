import { writeSync } from "fixturify";
import { readFileSync, writeFileSync } from "fs";
import { fromEntries } from "fs-tree-diff";
import * as pathmod from "path";
import * as walkSync from "walk-sync";
import {
  ChangeOp,
  Changes,
  ReadDirOptions,
  ReadOptions,
  Tree,
} from "./interfaces";

function normalizeSlashes(path: string): string {
  return path.replace(/\\/g, "/");
}

export function resolvePath(path: string): string {
  return normalizeSlashes(pathmod.resolve(path));
}

export function joinPath(path: string, subpath: string): string {
  return normalizeSlashes(pathmod.join(path, subpath));
}

export function readTree(path: string, options?: ReadOptions): Tree {
  const tree: Tree = {};
  const subpaths = walkSync(path, {
    globs: options && options.include,
    ignore: options && options.exclude,
  });
  subpaths.forEach(subpath => {
    addToTree(path, tree, subpath);
  });
  return tree;
}

function addToTree(path: string, tree: Tree, subpath: string) {
  let parent = tree;
  const parts = subpath.split("/");
  let i;
  for (i = 0; i < parts.length - 1; i++) {
    parent = getOrCreateChildDir(parent, parts[i]);
  }
  const last = parts[i];
  if (last !== "") {
    parent[last] = readFileSync(pathmod.join(path, subpath), "utf8");
  }
}

function getOrCreateChildDir(parent: Tree, entry: string) {
  let child = parent[entry];
  if (child === undefined) {
    child = parent[entry] = {};
  }
  return child as Tree;
}

export function writeTree(path: string, tree: Tree): void {
  writeSync(path, tree);
}

export function writeFile(path: string, data: string, encoding: string): void;
export function writeFile(path: string, data: Buffer): void;
export function writeFile(
  path: string,
  data: Buffer | string,
  encoding?: string
): void {
  // ensure path exists
  writeSync(pathmod.dirname(path), {});
  if (encoding === undefined) {
    writeFileSync(path, data);
  } else {
    writeFileSync(path, data, encoding);
  }
}

export function readFile(path: string, encoding: string): string | undefined;
export function readFile(path: string): Buffer | undefined;
export function readFile(
  path: string,
  encoding?: string
): string | Buffer | undefined {
  try {
    return encoding === undefined
      ? readFileSync(path)
      : readFileSync(path, encoding);
  } catch (e) {
    if (e.code === "EISDIR" || e.code === "ENOENT") {
      return;
    }
    throw e;
  }
}

export function readDir(path: string, options?: ReadDirOptions) {
  try {
    return walkSync(path, {
      directories: options && options.directories,
      globs: options && options.include,
      ignore: options && options.exclude,
    });
  } catch (e) {
    if (e.code === "ENOTDIR" || e.code === "ENOENT") {
      return;
    }
    throw e;
  }
}

export function readEntries(path: string): FSTree {
  return fromEntries(walkSync.entries(path));
}

export function diffEntries(current: FSTree, previous: FSTree): Changes {
  const patch = previous.calculatePatch(current);
  const changes: Changes = {};
  for (let i = 0; i < patch.length; i++) {
    const op = patch[i][0];
    const path = patch[i][1];
    changes[path] = op;
  }
  return changes;
}

export interface Entry {
  relativePath: string;
  basePath: string;
  fullPath: string;
  mode: number;
  size: number;
  mtime: Date;
  isDirectory(): boolean;
}

export interface FSTree {
  calculatePatch(next: FSTree): PatchTuple[];
}

export type PatchTuple = [ChangeOp, string, Entry];
