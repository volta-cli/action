"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fixturify_1 = require("fixturify");
const fs_1 = require("fs");
const fs_tree_diff_1 = require("fs-tree-diff");
const pathmod = require("path");
const walkSync = require("walk-sync");
function normalizeSlashes(path) {
    return path.replace(/\\/g, "/");
}
function resolvePath(path) {
    return normalizeSlashes(pathmod.resolve(path));
}
exports.resolvePath = resolvePath;
function joinPath(path, subpath) {
    return normalizeSlashes(pathmod.join(path, subpath));
}
exports.joinPath = joinPath;
function readTree(path, options) {
    const tree = {};
    const subpaths = walkSync(path, {
        globs: options && options.include,
        ignore: options && options.exclude,
    });
    subpaths.forEach(subpath => {
        addToTree(path, tree, subpath);
    });
    return tree;
}
exports.readTree = readTree;
function addToTree(path, tree, subpath) {
    let parent = tree;
    const parts = subpath.split("/");
    let i;
    for (i = 0; i < parts.length - 1; i++) {
        parent = getOrCreateChildDir(parent, parts[i]);
    }
    const last = parts[i];
    if (last !== "") {
        parent[last] = fs_1.readFileSync(pathmod.join(path, subpath), "utf8");
    }
}
function getOrCreateChildDir(parent, entry) {
    let child = parent[entry];
    if (child === undefined) {
        child = parent[entry] = {};
    }
    return child;
}
function writeTree(path, tree) {
    fixturify_1.writeSync(path, tree);
}
exports.writeTree = writeTree;
function writeFile(path, data, encoding) {
    // ensure path exists
    fixturify_1.writeSync(pathmod.dirname(path), {});
    if (encoding === undefined) {
        fs_1.writeFileSync(path, data);
    }
    else {
        fs_1.writeFileSync(path, data, encoding);
    }
}
exports.writeFile = writeFile;
function readFile(path, encoding) {
    try {
        return encoding === undefined
            ? fs_1.readFileSync(path)
            : fs_1.readFileSync(path, encoding);
    }
    catch (e) {
        if (e.code === "EISDIR" || e.code === "ENOENT") {
            return;
        }
        throw e;
    }
}
exports.readFile = readFile;
function readDir(path, options) {
    try {
        return walkSync(path, {
            directories: options && options.directories,
            globs: options && options.include,
            ignore: options && options.exclude,
        });
    }
    catch (e) {
        if (e.code === "ENOTDIR" || e.code === "ENOENT") {
            return;
        }
        throw e;
    }
}
exports.readDir = readDir;
function readEntries(path) {
    return fs_tree_diff_1.fromEntries(walkSync.entries(path));
}
exports.readEntries = readEntries;
function diffEntries(current, previous) {
    const patch = previous.calculatePatch(current);
    const changes = {};
    for (let i = 0; i < patch.length; i++) {
        const op = patch[i][0];
        const path = patch[i][1];
        changes[path] = op;
    }
    return changes;
}
exports.diffEntries = diffEntries;
//# sourceMappingURL=util.js.map