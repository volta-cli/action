import * as t from "./interfaces";
import ReadableDir from "./readable_dir";
import TreeDiff from "./tree_diff";

export default class Output extends ReadableDir implements t.Output {
  protected treeDiff: TreeDiff;

  constructor(public builder: t.Builder) {
    super(builder.outputPath);
    this.treeDiff = new TreeDiff(builder.outputPath);
  }

  public changes(): t.Changes {
    return this.treeDiff.changes;
  }

  public build(): Promise<void> {
    return this.builder.build().then(() => {
      this.treeDiff.diff();
    });
  }

  public dispose(): Promise<void> {
    return Promise.resolve(this.builder.cleanup());
  }

  public rebuild(): Promise<t.Output> {
    // tslint:disable-next-line:no-console
    console.warn(`rebuild() is deprecated, use build() instead.`);
    return this.build().then(() => this);
  }
}
