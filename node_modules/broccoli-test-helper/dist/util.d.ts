/// <reference types="node" />
import { ChangeOp, Changes, ReadDirOptions, ReadOptions, Tree } from "./interfaces";
export declare function resolvePath(path: string): string;
export declare function joinPath(path: string, subpath: string): string;
export declare function readTree(path: string, options?: ReadOptions): Tree;
export declare function writeTree(path: string, tree: Tree): void;
export declare function writeFile(path: string, data: string, encoding: string): void;
export declare function writeFile(path: string, data: Buffer): void;
export declare function readFile(path: string, encoding: string): string | undefined;
export declare function readFile(path: string): Buffer | undefined;
export declare function readDir(path: string, options?: ReadDirOptions): string[] | undefined;
export declare function readEntries(path: string): FSTree;
export declare function diffEntries(current: FSTree, previous: FSTree): Changes;
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
export declare type PatchTuple = [ChangeOp, string, Entry];
