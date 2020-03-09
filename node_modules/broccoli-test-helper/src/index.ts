import * as t from "./interfaces";
import Output from "./output";
import ReadableDir from "./readable_dir";
import TempDir from "./temp_dir";

export * from "./interfaces";

/**
 * Returns an `ReadableDir` interface from the specified directory.
 * @param dir
 * @public
 */
export function fromDir(dir: string): t.ReadableDir {
  return new ReadableDir(dir);
}

/**
 * Create temporary directory for mutation and return the `TempDir` interface.
 * @public
 */
export function createTempDir(): Promise<t.TempDir> {
  return new Promise(resolve => {
    resolve(new TempDir());
  });
}

/**
 * Returns an `Output` interface from the specified `Builder`.
 * @param builder a builder implementation.
 * @public
 */
export function fromBuilder(builder: t.Builder): t.Output {
  return new Output(builder);
}

/**
 * Create a broccoli `Builder` with the specified outputNode
 * then return the `Output` interface.
 * @param outputNode
 * @public
 */
export function createBuilder(outputNode: any): t.Output {
  const Builder = require("broccoli").Builder as t.BuilderConstructor;
  return fromBuilder(new Builder(outputNode));
}

/**
 * @deprecated use `createBuilder(outputNode)` or `wrapBuilder(builder)` and `await output.build()`
 * @private
 */
export function buildOutput(outputNode: any): Promise<t.Output> {
  // tslint:disable-next-line:no-console
  console.warn(
    "`buildOutput` is deprecated, use `createBuilder` or `fromBuilder` followed by `builder.build()` instead"
  );
  const output = createBuilder(outputNode);
  return output.build().then(() => output);
}

/**
 * @deprecated use `fromDir(dir)`
 * @private
 */
export function createReadableDir(dir: string): t.ReadableDir {
  // tslint:disable-next-line:no-console
  console.warn("`createReadableDir` is deprecated, use `fromDir(dir)` instead");
  return fromDir(dir);
}

/**
 * @deprecated use `fromDir(dir)`
 * @private
 */
export function wrapDir(dir: string): t.ReadableDir {
  // tslint:disable-next-line:no-console
  console.warn("`wrapDir` is deprecated, use `fromDir(dir)` instead");
  return fromDir(dir);
}

/**
 * @deprecated use `fromBuilder(builder)`
 * @private
 */
export function wrapBuilder(builder: t.Builder): t.Output {
  // tslint:disable-next-line:no-console
  console.warn(
    "`wrapBuilder` is deprecated, use `fromBuilder(builder)` instead"
  );
  return fromBuilder(builder);
}
