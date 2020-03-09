import * as t from "./interfaces";
import ReadableDir from "./readable_dir";
import TreeDiff from "./tree_diff";
export default class Output extends ReadableDir implements t.Output {
    builder: t.Builder;
    protected treeDiff: TreeDiff;
    constructor(builder: t.Builder);
    changes(): t.Changes;
    build(): Promise<void>;
    dispose(): Promise<void>;
    rebuild(): Promise<t.Output>;
}
