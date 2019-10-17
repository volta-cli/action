import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as got from 'got';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';

const osPlat: string = os.platform();

async function getLatestVolta(): Promise<string> {
  const url = 'https://volta.sh/latest-version';

  const response = await got(url);

  return response.body;
}

async function acquireVolta(version: string): Promise<string> {
  //
  // Download - a tool installer intimately knows how to get the tool (and construct urls)
  //
  version = semver.clean(version) || '';

  let fileName: string;
  switch (osPlat) {
    case 'darwin':
      fileName = `volta-${version}-macos.tar.gz`;
      break;
    case 'linux':
      fileName = `volta-${version}-linux-openssl-1.1.tar.gz`;
      break;
    case 'win32':
      throw new Error('windows is not yet supported');
    default:
      throw new Error(`your platform ${osPlat} is not yet supported`);
  }

  const downloadUrl = `https://github.com/volta-cli/volta/releases/download/v${version}/${fileName}`;
  core.debug(`downloading from \`${downloadUrl}\``);
  const downloadPath = await tc.downloadTool(downloadUrl);

  //
  // Extract
  //
  const extPath = await tc.extractTar(downloadPath);
  core.debug(`extracted tarball to '${extPath}'`);

  //
  // Install into the local tool cache - node extracts with a root folder that matches the fileName downloaded
  //
  const toolRoot = path.join(extPath, fileName);
  core.debug(`caching '${toolRoot}'`);

  return await tc.cacheDir(toolRoot, 'volta', version);
}

export async function getVolta(versionSpec: string): Promise<void> {
  // check cache
  let toolPath: undefined | string;

  if (versionSpec !== '') {
    toolPath = tc.find('volta', versionSpec);
  }

  // If not found in cache, download
  if (toolPath === undefined) {
    let version: string;
    const c = semver.clean(versionSpec) || '';
    // If explicit version
    if (versionSpec !== '' && semver.valid(c) != null) {
      // version to download
      version = versionSpec;
    } else {
      version = await getLatestVolta();
    }

    // download, extract, cache
    toolPath = await acquireVolta(version);
  }

  // prepend the tools path. instructs the agent to prepend for future tasks
  if (toolPath !== undefined) {
    core.addPath(toolPath);
  }
}
