"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readable_dir_1 = require("./readable_dir");
const tree_diff_1 = require("./tree_diff");
class Output extends readable_dir_1.default {
    constructor(builder) {
        super(builder.outputPath);
        this.builder = builder;
        this.treeDiff = new tree_diff_1.default(builder.outputPath);
    }
    changes() {
        return this.treeDiff.changes;
    }
    build() {
        return this.builder.build().then(() => {
            this.treeDiff.diff();
        });
    }
    dispose() {
        return Promise.resolve(this.builder.cleanup());
    }
    rebuild() {
        // tslint:disable-next-line:no-console
        console.warn(`rebuild() is deprecated, use build() instead.`);
        return this.build().then(() => this);
    }
}
exports.default = Output;
//# sourceMappingURL=output.js.map