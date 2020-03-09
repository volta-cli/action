"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
class TreeDiff {
    constructor(path) {
        this.path = path;
        this.changes = {};
        this.previous = util_1.readEntries(path);
    }
    diff() {
        const current = util_1.readEntries(this.path);
        this.changes = util_1.diffEntries(current, this.previous);
        this.previous = current;
    }
}
exports.default = TreeDiff;
//# sourceMappingURL=tree_diff.js.map