import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import { exec } from '@actions/exec';
import got from 'got';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';
import * as symlinkOrCopy from 'symlink-or-copy';
import * as fs from 'fs';

async function getLatestVolta(): Promise<string> {
  const url = 'https://volta.sh/latest-version';

  const response = await got(url);

  return semver.clean(response.body);
}

function voltaVersionHasSetup(version: string): boolean {
  return semver.gte(version, '0.7.0');
}

export function buildDownloadUrl(platform: string, version: string): string {
  let fileName: string;
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

export async function buildLayout(toolRoot: string): Promise<void> {
  // TODO: remove in favor of `volta setup`
  // create the $VOLTA_HOME folder structure (volta doesn't create these
  // folders on demand, and errors when installing node/yarn/tools if it
  // isn't present)
  //
  // once https://github.com/volta-cli/volta/issues/564 lands, this can be
  // removed in favor of calling `volta setup` directly
  await io.mkdirP(path.join(toolRoot, 'tmp'));
  await io.mkdirP(path.join(toolRoot, 'bin'));
  await io.mkdirP(path.join(toolRoot, 'cache/node'));
  await io.mkdirP(path.join(toolRoot, 'log'));
  await io.mkdirP(path.join(toolRoot, 'tmp'));
  await io.mkdirP(path.join(toolRoot, 'tools/image/node'));
  await io.mkdirP(path.join(toolRoot, 'tools/image/packages'));
  await io.mkdirP(path.join(toolRoot, 'tools/image/yarn'));
  await io.mkdirP(path.join(toolRoot, 'tools/inventory/node'));
  await io.mkdirP(path.join(toolRoot, 'tools/inventory/packages'));
  await io.mkdirP(path.join(toolRoot, 'tools/inventory/yarn'));
  await io.mkdirP(path.join(toolRoot, 'tools/user'));
}

async function setupShim(toolRoot: string, name: string): Promise<void> {
  const shimSource = path.join(toolRoot, 'shim');
  const shimPath = path.join(toolRoot, 'bin', name);

  symlinkOrCopy.sync(shimSource, shimPath);

  // TODO: this is not portable to win32, confirm `volta setup` will take care
  // of this for us
  await fs.promises.chmod(shimPath, 0o755);
}

async function setupShims(toolRoot: string): Promise<void> {
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
}

async function acquireVolta(version: string): Promise<string> {
  //
  // Download - a tool installer intimately knows how to get the tool (and construct urls)
  //

  core.info(`downloading volta@${version}`);

  const downloadUrl = buildDownloadUrl(os.platform(), version);

  core.debug(`downloading from \`${downloadUrl}\``);
  const downloadPath = await tc.downloadTool(downloadUrl);

  //
  // Extract
  //
  const toolRoot = await tc.extractTar(downloadPath);
  core.debug(`extracted tarball to '${toolRoot}'`);

  return toolRoot;
}

async function setupVolta(version: string, toolPath: string): Promise<void> {
  if (voltaVersionHasSetup(version)) {
    await exec(path.join(toolPath, 'bin', 'volta'), ['setup'], {
      env: {
        // VOLTA_HOME needs to be set before calling volta setup
        VOLTA_HOME: toolPath,
      },
    });
  } else {
    await buildLayout(toolPath);
    await setupShims(toolPath);
  }
}

export async function installNode(version: string): Promise<void> {
  await exec('volta', ['install', `node${version === 'true' ? '' : `@${version}`}`]);
}

export async function installYarn(version: string): Promise<void> {
  await exec('volta', ['install', `yarn${version === 'true' ? '' : `@${version}`}`]);
}

export async function getVolta(versionSpec: string): Promise<void> {
  let version = semver.clean(versionSpec) || '';

  // If explicit version
  if (semver.valid(version) === null) {
    version = await getLatestVolta();
  }

  let toolPath = tc.find('volta', version);

  if (toolPath === '') {
    // download, extract, cache
    const toolRoot = await acquireVolta(version);

    await setupVolta(version, toolRoot);

    // Install into the local tool cache - node extracts with a root folder
    // that matches the fileName downloaded
    toolPath = await tc.cacheDir(toolRoot, 'volta', version);

    core.info(`caching volta@${version}`);
  } else {
    core.info(`using cached volta@${version}`);
  }

  // prepend the tools path. instructs the agent to prepend for future tasks
  if (toolPath !== undefined) {
    core.addPath(toolPath);
    core.addPath(path.join(toolPath, 'bin'));
    core.exportVariable('VOLTA_HOME', toolPath);
  }
}
