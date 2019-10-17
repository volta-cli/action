"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const io = __importStar(require("@actions/io"));
const exec_1 = require("@actions/exec");
const got_1 = __importDefault(require("got"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const semver = __importStar(require("semver"));
const symlinkOrCopy = __importStar(require("symlink-or-copy"));
const fs = __importStar(require("fs"));
function getLatestVolta() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://volta.sh/latest-version';
        const response = yield got_1.default(url);
        return semver.clean(response.body);
    });
}
function buildDownloadUrl(platform, version) {
    let fileName;
    switch (platform) {
        case 'darwin':
            fileName = `volta-${version}-macos.tar.gz`;
            break;
        case 'linux':
            fileName = `volta-${version}-linux-openssl-1.1.tar.gz`;
            break;
        case 'win32':
            throw new Error('windows is not yet supported');
        default:
            throw new Error(`your platform ${platform} is not yet supported`);
    }
    return `https://github.com/volta-cli/volta/releases/download/v${version}/${fileName}`;
}
exports.buildDownloadUrl = buildDownloadUrl;
function buildLayout(toolRoot) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: remove in favor of `volta setup`
        // create the $VOLTA_HOME folder structure (volta doesn't create these
        // folders on demand, and errors when installing node/yarn/tools if it
        // isn't present)
        //
        // once https://github.com/volta-cli/volta/issues/564 lands, this can be
        // removed in favor of calling `volta setup` directly
        yield io.mkdirP(path.join(toolRoot, 'tmp'));
        yield io.mkdirP(path.join(toolRoot, 'bin'));
        yield io.mkdirP(path.join(toolRoot, 'cache/node'));
        yield io.mkdirP(path.join(toolRoot, 'log'));
        yield io.mkdirP(path.join(toolRoot, 'tmp'));
        yield io.mkdirP(path.join(toolRoot, 'tools/image/node'));
        yield io.mkdirP(path.join(toolRoot, 'tools/image/packages'));
        yield io.mkdirP(path.join(toolRoot, 'tools/image/yarn'));
        yield io.mkdirP(path.join(toolRoot, 'tools/inventory/node'));
        yield io.mkdirP(path.join(toolRoot, 'tools/inventory/packages'));
        yield io.mkdirP(path.join(toolRoot, 'tools/inventory/yarn'));
        yield io.mkdirP(path.join(toolRoot, 'tools/user'));
    });
}
exports.buildLayout = buildLayout;
function setupShim(toolRoot, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const shimSource = path.join(toolRoot, 'shim');
        const shimPath = path.join(toolRoot, 'bin', name);
        symlinkOrCopy.sync(shimSource, shimPath);
        // TODO: this is not portable to win32, confirm `volta setup` will take care
        // of this for us
        yield fs.promises.chmod(shimPath, 0o755);
    });
}
function setupShims(toolRoot) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: remove in favor of `volta setup`
        // current volta installations (e.g 0.6.x) expect the common shims
        // to be setup in $VOLTA_HOME/bin
        //
        // once https://github.com/volta-cli/volta/issues/564 lands, this can be
        // removed in favor of calling `volta setup` directly
        setupShim(toolRoot, 'node');
        setupShim(toolRoot, 'yarn');
        setupShim(toolRoot, 'npm');
        setupShim(toolRoot, 'npx');
    });
}
function acquireVolta(version) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        // Download - a tool installer intimately knows how to get the tool (and construct urls)
        //
        let toolPath = tc.find('volta', version);
        if (toolPath === '') {
            core.info(`downloading volta@${version}`);
            const downloadUrl = buildDownloadUrl(os.platform(), version);
            core.debug(`downloading from \`${downloadUrl}\``);
            const downloadPath = yield tc.downloadTool(downloadUrl);
            //
            // Extract
            //
            const toolRoot = yield tc.extractTar(downloadPath);
            core.debug(`extracted tarball to '${toolRoot}'`);
            yield buildLayout(toolRoot);
            yield setupShims(toolRoot);
            //
            // Install into the local tool cache - node extracts with a root folder that matches the fileName downloaded
            //
            toolPath = yield tc.cacheDir(toolRoot, 'volta', version);
            core.info(`caching volta@${version}`);
        }
        else {
            core.info(`using cached volta@${version}`);
        }
        return toolPath;
    });
}
function installNode(version) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec_1.exec('volta', ['install', `node${version === 'true' ? '' : `@${version}`}`]);
    });
}
exports.installNode = installNode;
function installYarn(version) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec_1.exec('volta', ['install', `yarn${version === 'true' ? '' : `@${version}`}`]);
    });
}
exports.installYarn = installYarn;
function getVolta(versionSpec) {
    return __awaiter(this, void 0, void 0, function* () {
        let version = semver.clean(versionSpec) || '';
        // If explicit version
        if (semver.valid(version) === null) {
            version = yield getLatestVolta();
        }
        // download, extract, cache
        const toolPath = yield acquireVolta(version);
        // prepend the tools path. instructs the agent to prepend for future tasks
        if (toolPath !== undefined) {
            core.addPath(toolPath);
            core.addPath(path.join(toolPath, 'bin'));
            core.exportVariable('VOLTA_HOME', toolPath);
        }
    });
}
exports.getVolta = getVolta;
