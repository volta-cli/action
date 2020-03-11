import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import { exec } from '@actions/exec';
import got from 'got';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';
import * as fs from 'fs';
import { v4 as uuidV4 } from 'uuid';

async function getLatestVolta(): Promise<string> {
  const url = 'https://volta.sh/latest-version';

  const response = await got(url);

  return semver.clean(response.body) as string;
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

/*
 * Used to build the required folder structure when installing volta < 0.7
 */
export async function buildLayout(toolRoot: string): Promise<void> {
  // create the $VOLTA_HOME folder structure (volta doesn't create these
  // folders on demand, and errors when installing node/yarn/tools if it
  // isn't present)
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

  core.info(`downloading volta@${version}`);

  const downloadUrl = buildDownloadUrl(os.platform(), version);

  core.debug(`downloading from \`${downloadUrl}\``);
  const downloadPath = await tc.downloadTool(downloadUrl);

  const voltaHome = path.join(
    // `RUNNER_TEMP` is used by @actions/tool-cache
    process.env['RUNNER_TEMP'] || '',
    uuidV4()
  );

  await io.mkdirP(voltaHome);

  //
  // Extract
  //
  const toolRoot = await tc.extractTar(downloadPath, path.join(voltaHome, 'bin'));
  core.debug(`extracted "${fs.readdirSync(toolRoot).join('","')}" from tarball into '${toolRoot}'`);

  return voltaHome;
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
  }
}

export async function execVolta(specifiedArgs: string[]): Promise<void> {
  const args = [...specifiedArgs];
  let options;

  if (core.isDebug()) {
    args.unshift('--verbose');

    options = {
      env: {
        VOLTA_LOGLEVEL: 'debug',
        RUST_STACKTRACE: 'full',
      },
    };
  }

  await exec('volta', args, options);
}

export async function installNode(version: string): Promise<void> {
  await execVolta(['install', `node${version === 'true' ? '' : `@${version}`}`]);
}

export async function installYarn(version: string): Promise<void> {
  await execVolta(['install', `yarn${version === 'true' ? '' : `@${version}`}`]);
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
    core.addPath(path.join(toolPath, 'bin'));
    core.exportVariable('VOLTA_HOME', toolPath);
  }
}
