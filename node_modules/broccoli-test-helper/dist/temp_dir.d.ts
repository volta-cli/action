/// <reference types="node" />
import * as t from "./interfaces";
import ReadableDir from "./readable_dir";
export default class TempDir extends ReadableDir implements t.TempDir {
    dispose: () => Promise<void>;
    constructor();
    write(content: t.Tree, to?: string): void;
    writeBinary(subpath: string, buffer: Buffer): void;
    writeText(subpath: string, text: string, encoding?: string): void;
    makeDir(subpath: string): void;
    copy(from: string, to?: string): void;
}
