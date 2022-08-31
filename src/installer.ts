import * as core from '@actions/core';
import * as hc from '@actions/http-client';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import { exec, ExecOptions } from '@actions/exec';
import type { OutgoingHttpHeaders } from 'http';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';
import * as fs from 'fs';
import { v4 as uuidV4 } from 'uuid';

type VoltaInstallOptions = {
  versionSpec: string;
  authToken: string;
  openSSLVersion: string;
  variant: string;
}

async function getLatestVolta(authToken: string): Promise<string> {
  const url = 'https://api.github.com/repos/volta-cli/volta/releases/latest';

  const http = new hc.HttpClient('volta-cli/action', [], {
    allowRetries: true,
    maxRetries: 3,
  });

  let headers: OutgoingHttpHeaders | undefined;
  if (authToken) {
    headers = {
      authorization: authToken,
    };
  }

  const response = await http.getJson<{ name: string }>(url, headers);
  if (!response.result) {
    throw new Error(`volta-cli/action: Could not download latest release from ${url}`);
  }

  return semver.clean(response.result.name) as string;
}

function voltaVersionHasSetup(version: string): boolean {
  return semver.gte(version, '0.7.0');
}

export async function buildDownloadUrl(
  platform: string,
  version: string,
  options?: Partial<VoltaInstallOptions>
): Promise<string> {
  const mergedOptions = {
    openSSLVersion: '',
    variant: '',
    ...options,
  };
  let fileName: string;

  switch (platform) {
    case 'darwin':
      fileName = `volta-${version}-macos.tar.gz`;
      break;
    case 'linux': {
      const openSSLVersion = await getOpenSSLVersion(mergedOptions.openSSLVersion);

      fileName = `volta-${version}-linux-${openSSLVersion}.tar.gz`;
      break;
    }
    case 'win32':
      fileName = `volta-${version}-windows-x86_64.msi`;
      break;
    default:
      throw new Error(`your platform ${platform} is not yet supported`);
  }

  return `https://github.com/volta-cli/volta/releases/download/v${version}/${fileName}`;
}

async function execOpenSSLVersion() {
  let output = '';
  const options: ExecOptions = {};
  options.listeners = {
    stdout: (data: Buffer) => {
      output += data.toString();
    },
    stderr: (data: Buffer) => {
      output += data.toString();
    },
  };

  await exec('openssl version', [], options);

  return output;
}

async function getOpenSSLVersion(version = ''): Promise<string> {
  const specificVersionViaInput = /^\d{1,3}\.\d{1,3}$/.test(version);

  if (specificVersionViaInput) {
    return `openssl-${version}`;
  }

  if (version === '') {
    version = await execOpenSSLVersion();
  }

  // typical version string looks like 'OpenSSL 1.0.1e-fips 11 Feb 2013'
  const openSSLVersionPattern = /^([^\s]*)\s([0-9]+\.[0-9]+)/;
  const match = openSSLVersionPattern.exec(version);

  if (match === null) {
    throw new Error(
      `No version of OpenSSL was found. @volta-cli/action requires a valid version of OpenSSL. ('openssl version' output: ${version})`
    );
  }

  version = match[2];

  // should return in openssl-1.1 format
  return `openssl-${version}`;
}

/*
 * Used to setup a specific shim when running volta < 0.7
 */
async function setupShim(voltaHome: string, name: string): Promise<void> {
  const shimSource = path.join(voltaHome, 'bin', 'shim');
  const shimPath = path.join(voltaHome, 'bin', name);

  fs.copyFileSync(shimSource, shimPath);

  // TODO: this is not portable to win32, confirm `volta setup` will take care
  // of this for us
  await fs.promises.chmod(shimPath, 0o755);
}

/*
 * Used to setup the node/yarn/npm/npx shims when running volta < 0.7
 */
async function setupShims(voltaHome: string): Promise<void> {
  // current volta installations (e.g 0.6.x) expect the common shims
  // to be setup in $VOLTA_HOME/bin
  setupShim(voltaHome, 'node');
  setupShim(voltaHome, 'yarn');
  setupShim(voltaHome, 'npm');
  setupShim(voltaHome, 'npx');
}

/*
 * Used to build the required folder structure when installing volta < 0.7
 */
export async function buildLayout(voltaHome: string): Promise<void> {
  // create the $VOLTA_HOME folder structure (volta doesn't create these
  // folders on demand, and errors when installing node/yarn/tools if it
  // isn't present)
  await io.mkdirP(path.join(voltaHome, 'tmp'));
  await io.mkdirP(path.join(voltaHome, 'bin'));
  await io.mkdirP(path.join(voltaHome, 'cache/node'));
  await io.mkdirP(path.join(voltaHome, 'log'));
  await io.mkdirP(path.join(voltaHome, 'tmp'));
  await io.mkdirP(path.join(voltaHome, 'tools/image/node'));
  await io.mkdirP(path.join(voltaHome, 'tools/image/packages'));
  await io.mkdirP(path.join(voltaHome, 'tools/image/yarn'));
  await io.mkdirP(path.join(voltaHome, 'tools/inventory/node'));
  await io.mkdirP(path.join(voltaHome, 'tools/inventory/packages'));
  await io.mkdirP(path.join(voltaHome, 'tools/inventory/yarn'));
  await io.mkdirP(path.join(voltaHome, 'tools/user'));
  await setupShims(voltaHome);
}

async function acquireVolta(version: string, options: VoltaInstallOptions): Promise<string> {
  //
  // Download - a tool installer intimately knows how to get the tool (and construct urls)
  //

  core.info(`downloading volta@${version}`);

  const downloadUrl = await buildDownloadUrl(os.platform(), version, options);

  core.debug(`downloading from \`${downloadUrl}\``);
  const downloadPath = await tc.downloadTool(downloadUrl, undefined, options.authToken);

  const voltaHome = path.join(
    // `RUNNER_TEMP` is used by @actions/tool-cache
    process.env['RUNNER_TEMP'] || '',
    uuidV4()
  );

  await io.mkdirP(voltaHome);

  //
  // Extract
  //
  const voltaHomeBin = path.join(voltaHome, 'bin');
  core.debug(`extracting from \`${downloadPath}\` into \`${voltaHomeBin}\``);
  if (os.platform() === 'win32') {
    const tmpExtractTarget = path.join(
      // `RUNNER_TEMP` is used by @actions/tool-cache
      process.env['RUNNER_TEMP'] || '',
      uuidV4()
    );
    const msiexecPath = await io.which('msiexec', true);

    await exec(msiexecPath, ['/a', downloadPath, '/qn', `TARGETDIR=${tmpExtractTarget}`]);
    await io.cp(path.join(tmpExtractTarget, 'PFiles', 'volta'), voltaHomeBin, { recursive: true });
  } else {
    await tc.extractTar(downloadPath, voltaHomeBin);
  }

  core.debug(
    `extracted "${fs.readdirSync(voltaHomeBin).join('","')}" from tarball into '${voltaHomeBin}'`
  );

  return voltaHome;
}

async function setupVolta(version: string, voltaHome: string): Promise<void> {
  if (voltaVersionHasSetup(version)) {
    await exec(path.join(voltaHome, 'bin', 'volta'), ['setup'], {
      env: {
        // VOLTA_HOME needs to be set before calling volta setup
        VOLTA_HOME: voltaHome,
      },
    });
  } else {
    await buildLayout(voltaHome);
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

export async function installNpm(version: string): Promise<void> {
  await execVolta(['install', `npm${version === 'true' ? '' : `@${version}`}`]);
}

export async function installYarn(version: string): Promise<void> {
  await execVolta(['install', `yarn${version === 'true' ? '' : `@${version}`}`]);
}

export async function pinNode(version: string): Promise<void> {
  await execVolta(['pin', `node${version === 'true' ? '' : `@${version}`}`]);
}

export async function pinNpm(version: string): Promise<void> {
  await execVolta(['pin', `npm${version === 'true' ? '' : `@${version}`}`]);
}

export async function pinYarn(version: string): Promise<void> {
  await execVolta(['pin', `yarn${version === 'true' ? '' : `@${version}`}`]);
}

export async function getVoltaVersion(versionSpec: string, authToken: string): Promise<string> {
  let version = semver.clean(versionSpec) || '';
  const validVersionProvided = semver.valid(version) !== null;

  if (validVersionProvided && semver.lt(version, '1.0.0')) {
    throw new Error(
      `volta-cli/action: Volta version must be >= 1.0.0 (you specified ${versionSpec})`
    );
  }

  if (validVersionProvided) {
    core.info(`using user provided version volta@${version}`);
  } else {
    core.info(`looking up latest volta version`);
    version = await getLatestVolta(authToken);
  }

  return version;
}

export async function getVolta(options: VoltaInstallOptions): Promise<void> {
  const version = await getVoltaVersion(options.versionSpec, options.authToken);
  let voltaHome = tc.find('volta', version);

  if (voltaHome === '') {
    // download, extract, cache
    const toolRoot = await acquireVolta(version, options);

    await setupVolta(version, toolRoot);

    // Install into the local tool cache - node extracts with a root folder
    // that matches the fileName downloaded
    voltaHome = await tc.cacheDir(toolRoot, 'volta', version);

    core.info(`caching volta@${version} into ${voltaHome}`);
  } else {
    core.info(`using cached volta@${version}`);
  }

  // prepend the tools path. instructs the agent to prepend for future tasks
  if (voltaHome !== undefined) {
    const binPath = path.join(voltaHome, 'bin');

    core.info(`adding ${binPath} to $PATH`);

    core.addPath(binPath);
    core.exportVariable('VOLTA_HOME', voltaHome);
  }
}
