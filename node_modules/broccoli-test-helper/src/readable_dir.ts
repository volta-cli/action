import * as t from "./interfaces";
import TreeDiff from "./tree_diff";
import { joinPath, readDir, readFile, readTree, resolvePath } from "./util";

export default class ReadableDir implements t.ReadableDir {
  protected treeDiff?: TreeDiff;
  private dir: string;

  constructor(dir: string) {
    this.dir = resolvePath(dir);
  }

  public read(
    fromOrOptions?: string | t.ReadOptions,
    options?: t.ReadOptions
  ): t.Tree {
    if (typeof fromOrOptions === "string") {
      return readTree(this.path(fromOrOptions), options);
    }
    return readTree(this.path(), fromOrOptions);
  }

  public path(subpath?: string): string {
    const dir = this.dir;
    if (subpath === undefined) {
      return dir;
    }
    const path = joinPath(dir, subpath);
    if (!path.startsWith(dir)) {
      throw new Error("subpath should not escape directory");
    }
    return path;
  }

  public readBinary(subpath: string): Buffer | undefined {
    return readFile(this.path(subpath));
  }

  public readText(subpath: string, encoding?: string): string | undefined {
    return readFile(this.path(subpath), encoding || "utf8");
  }

  public readDir(options?: t.ReadDirOptions): string[];

  public readDir(
    subpath: string,
    options?: t.ReadDirOptions
  ): string[] | undefined;

  public readDir(
    subpathOrOptions?: string | t.ReadDirOptions,
    options?: t.ReadDirOptions
  ): string[] | undefined {
    if (typeof subpathOrOptions === "string") {
      return readDir(this.path(subpathOrOptions), options);
    } else {
      return readDir(this.path(), subpathOrOptions);
    }
  }

  public changes(): t.Changes {
    if (this.treeDiff === undefined) {
      this.treeDiff = new TreeDiff(this.dir);
    } else {
      this.treeDiff.diff();
    }
    return this.treeDiff.changes;
  }
}
