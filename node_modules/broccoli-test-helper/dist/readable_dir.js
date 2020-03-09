"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tree_diff_1 = require("./tree_diff");
const util_1 = require("./util");
class ReadableDir {
    constructor(dir) {
        this.dir = util_1.resolvePath(dir);
    }
    read(fromOrOptions, options) {
        if (typeof fromOrOptions === "string") {
            return util_1.readTree(this.path(fromOrOptions), options);
        }
        return util_1.readTree(this.path(), fromOrOptions);
    }
    path(subpath) {
        const dir = this.dir;
        if (subpath === undefined) {
            return dir;
        }
        const path = util_1.joinPath(dir, subpath);
        if (!path.startsWith(dir)) {
            throw new Error("subpath should not escape directory");
        }
        return path;
    }
    readBinary(subpath) {
        return util_1.readFile(this.path(subpath));
    }
    readText(subpath, encoding) {
        return util_1.readFile(this.path(subpath), encoding || "utf8");
    }
    readDir(subpathOrOptions, options) {
        if (typeof subpathOrOptions === "string") {
            return util_1.readDir(this.path(subpathOrOptions), options);
        }
        else {
            return util_1.readDir(this.path(), subpathOrOptions);
        }
    }
    changes() {
        if (this.treeDiff === undefined) {
            this.treeDiff = new tree_diff_1.default(this.dir);
        }
        else {
            this.treeDiff.diff();
        }
        return this.treeDiff.changes;
    }
}
exports.default = ReadableDir;
//# sourceMappingURL=readable_dir.js.map