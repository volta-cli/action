"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const output_1 = require("./output");
const readable_dir_1 = require("./readable_dir");
const temp_dir_1 = require("./temp_dir");
/**
 * Returns an `ReadableDir` interface from the specified directory.
 * @param dir
 * @public
 */
function fromDir(dir) {
    return new readable_dir_1.default(dir);
}
exports.fromDir = fromDir;
/**
 * Create temporary directory for mutation and return the `TempDir` interface.
 * @public
 */
function createTempDir() {
    return new Promise(resolve => {
        resolve(new temp_dir_1.default());
    });
}
exports.createTempDir = createTempDir;
/**
 * Returns an `Output` interface from the specified `Builder`.
 * @param builder a builder implementation.
 * @public
 */
function fromBuilder(builder) {
    return new output_1.default(builder);
}
exports.fromBuilder = fromBuilder;
/**
 * Create a broccoli `Builder` with the specified outputNode
 * then return the `Output` interface.
 * @param outputNode
 * @public
 */
function createBuilder(outputNode) {
    const Builder = require("broccoli").Builder;
    return fromBuilder(new Builder(outputNode));
}
exports.createBuilder = createBuilder;
/**
 * @deprecated use `createBuilder(outputNode)` or `wrapBuilder(builder)` and `await output.build()`
 * @private
 */
function buildOutput(outputNode) {
    // tslint:disable-next-line:no-console
    console.warn("`buildOutput` is deprecated, use `createBuilder` or `fromBuilder` followed by `builder.build()` instead");
    const output = createBuilder(outputNode);
    return output.build().then(() => output);
}
exports.buildOutput = buildOutput;
/**
 * @deprecated use `fromDir(dir)`
 * @private
 */
function createReadableDir(dir) {
    // tslint:disable-next-line:no-console
    console.warn("`createReadableDir` is deprecated, use `fromDir(dir)` instead");
    return fromDir(dir);
}
exports.createReadableDir = createReadableDir;
/**
 * @deprecated use `fromDir(dir)`
 * @private
 */
function wrapDir(dir) {
    // tslint:disable-next-line:no-console
    console.warn("`wrapDir` is deprecated, use `fromDir(dir)` instead");
    return fromDir(dir);
}
exports.wrapDir = wrapDir;
/**
 * @deprecated use `fromBuilder(builder)`
 * @private
 */
function wrapBuilder(builder) {
    // tslint:disable-next-line:no-console
    console.warn("`wrapBuilder` is deprecated, use `fromBuilder(builder)` instead");
    return fromBuilder(builder);
}
exports.wrapBuilder = wrapBuilder;
//# sourceMappingURL=index.js.map