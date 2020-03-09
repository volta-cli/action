import { Changes } from "./interfaces";
import { diffEntries, FSTree, readEntries } from "./util";

export default class TreeDiff {
  public changes: Changes = {};
  private previous: FSTree;

  constructor(private path: string) {
    this.previous = readEntries(path);
  }

  public diff(): void {
    const current = readEntries(this.path);
    this.changes = diffEntries(current, this.previous);
    this.previous = current;
  }
}
