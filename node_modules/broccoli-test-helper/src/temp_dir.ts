import * as tmp from "tmp";
import * as t from "./interfaces";
import ReadableDir from "./readable_dir";
import { readTree, writeFile, writeTree } from "./util";

tmp.setGracefulCleanup();

export default class TempDir extends ReadableDir implements t.TempDir {
  public dispose: () => Promise<void>;

  constructor() {
    let tmpDir: tmp.SynchrounousResult | undefined = tmp.dirSync({
      unsafeCleanup: true,
    });
    super(tmpDir.name);
    this.dispose = () => {
      return new Promise(resolve => {
        if (tmpDir !== undefined) {
          tmpDir.removeCallback();
          tmpDir = undefined;
        }
        resolve();
      });
    };
    // start change tracking
    this.changes();
  }

  public write(content: t.Tree, to?: string): void {
    writeTree(this.path(to), content);
  }

  public writeBinary(subpath: string, buffer: Buffer) {
    writeFile(this.path(subpath), buffer);
  }

  public writeText(subpath: string, text: string, encoding?: string) {
    writeFile(this.path(subpath), text, encoding || "utf8");
  }

  public makeDir(subpath: string): void {
    writeTree(this.path(subpath), {});
  }

  public copy(from: string, to?: string): void {
    writeTree(this.path(to), readTree(from));
  }
}
