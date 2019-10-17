import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import { exec } from '@actions/exec';
import got from 'got';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';

async function getLatestVolta(): Promise<string> {
  const url = 'https://volta.sh/latest-version';

  const response = await got(url);

  return semver.clean(response.body);
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

async function acquireVolta(version: string): Promise<string> {
  //
  // Download - a tool installer intimately knows how to get the tool (and construct urls)
  //

  let toolPath = tc.find('volta', version);

  if (toolPath === '') {
    console.log(`downloading volta@${version}`);

    const downloadUrl = buildDownloadUrl(os.platform(), version);

    core.debug(`downloading from \`${downloadUrl}\``);
    const downloadPath = await tc.downloadTool(downloadUrl);

    //
    // Extract
    //
    const toolRoot = await tc.extractTar(downloadPath);
    core.debug(`extracted tarball to '${toolRoot}'`);

    await buildLayout(toolRoot);

    //
    // Install into the local tool cache - node extracts with a root folder that matches the fileName downloaded
    //
    toolPath = await tc.cacheDir(toolRoot, 'volta', version);
    console.log(`caching volta@${version}`);
  } else {
    console.log(`using cached volta@${version}`);
  }

  return toolPath;
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

  // download, extract, cache
  const toolPath = await acquireVolta(version);

  // prepend the tools path. instructs the agent to prepend for future tasks
  if (toolPath !== undefined) {
    core.addPath(toolPath);
    core.exportVariable('VOLTA_HOME', toolPath);
  }
}
