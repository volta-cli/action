"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmp = require("tmp");
const readable_dir_1 = require("./readable_dir");
const util_1 = require("./util");
tmp.setGracefulCleanup();
class TempDir extends readable_dir_1.default {
    constructor() {
        let tmpDir = tmp.dirSync({
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
    write(content, to) {
        util_1.writeTree(this.path(to), content);
    }
    writeBinary(subpath, buffer) {
        util_1.writeFile(this.path(subpath), buffer);
    }
    writeText(subpath, text, encoding) {
        util_1.writeFile(this.path(subpath), text, encoding || "utf8");
    }
    makeDir(subpath) {
        util_1.writeTree(this.path(subpath), {});
    }
    copy(from, to) {
        util_1.writeTree(this.path(to), util_1.readTree(from));
    }
}
exports.default = TempDir;
//# sourceMappingURL=temp_dir.js.map