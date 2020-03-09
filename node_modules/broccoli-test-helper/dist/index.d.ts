import * as t from "./interfaces";
export * from "./interfaces";
/**
 * Returns an `ReadableDir` interface from the specified directory.
 * @param dir
 * @public
 */
export declare function fromDir(dir: string): t.ReadableDir;
/**
 * Create temporary directory for mutation and return the `TempDir` interface.
 * @public
 */
export declare function createTempDir(): Promise<t.TempDir>;
/**
 * Returns an `Output` interface from the specified `Builder`.
 * @param builder a builder implementation.
 * @public
 */
export declare function fromBuilder(builder: t.Builder): t.Output;
/**
 * Create a broccoli `Builder` with the specified outputNode
 * then return the `Output` interface.
 * @param outputNode
 * @public
 */
export declare function createBuilder(outputNode: any): t.Output;
/**
 * @deprecated use `createBuilder(outputNode)` or `wrapBuilder(builder)` and `await output.build()`
 * @private
 */
export declare function buildOutput(outputNode: any): Promise<t.Output>;
/**
 * @deprecated use `fromDir(dir)`
 * @private
 */
export declare function createReadableDir(dir: string): t.ReadableDir;
/**
 * @deprecated use `fromDir(dir)`
 * @private
 */
export declare function wrapDir(dir: string): t.ReadableDir;
/**
 * @deprecated use `fromBuilder(builder)`
 * @private
 */
export declare function wrapBuilder(builder: t.Builder): t.Output;
