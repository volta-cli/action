/// <reference types="node" />
import * as t from "./interfaces";
import TreeDiff from "./tree_diff";
export default class ReadableDir implements t.ReadableDir {
    protected treeDiff?: TreeDiff;
    private dir;
    constructor(dir: string);
    read(fromOrOptions?: string | t.ReadOptions, options?: t.ReadOptions): t.Tree;
    path(subpath?: string): string;
    readBinary(subpath: string): Buffer | undefined;
    readText(subpath: string, encoding?: string): string | undefined;
    readDir(options?: t.ReadDirOptions): string[];
    readDir(subpath: string, options?: t.ReadDirOptions): string[] | undefined;
    changes(): t.Changes;
}
