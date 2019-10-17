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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const installer = __importStar(require("./installer"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const voltaVersion = core.getInput('volta-version', { required: false });
            yield installer.getVolta(voltaVersion);
            const nodeVersion = core.getInput('node-version', { required: false });
            if (nodeVersion !== '') {
                core.info(`installing Node ${nodeVersion === 'true' ? '' : nodeVersion}`);
                yield installer.installNode(nodeVersion);
            }
            const yarnVersion = core.getInput('yarn-version', { required: false });
            if (yarnVersion !== '') {
                core.info(`installing Yarn ${yarnVersion === 'true' ? '' : yarnVersion}`);
                yield installer.installYarn(yarnVersion);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
