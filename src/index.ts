import * as core from '@actions/core';
import { existsSync } from 'fs';
import { dirname } from 'path';
import * as installer from './installer';
import * as registry from './registry';
import addMatchers from './matchers';

async function run(): Promise<void> {
  try {
    const authToken = core.getInput('token', { required: false });
    const voltaVersion = core.getInput('volta-version', { required: false });
    const variant = core.getInput('variant', { required: false });
    let packageJSONPath = core.getInput('package-json-path', { required: false });
    const hasPackageJSONPath = packageJSONPath !== '';

    if (hasPackageJSONPath && !existsSync(packageJSONPath)) {
      core.setFailed(
        `custom \`package-json-path: ${packageJSONPath}\` was specified, but a file was not found at \`${packageJSONPath}\``
      );
      return;
    } else if (!hasPackageJSONPath) {
      packageJSONPath = 'package.json';
    }

    const hasPackageJSON = existsSync(packageJSONPath);
    const workingDirectory = dirname(packageJSONPath);

    await installer.getVolta({ versionSpec: voltaVersion, authToken, variant });

    const nodeVersion = core.getInput('node-version', { required: false });
    if (nodeVersion !== '') {
      core.info(`installing Node ${nodeVersion === 'true' ? '' : nodeVersion}`);
      await installer.installNode(nodeVersion);

      if (hasPackageJSON) {
        await installer.pinNode(workingDirectory, nodeVersion);
      } else {
        core.info(
          `no \`package.json\` file found, if your \`package.json\` is located somewhere other than the root of the working directory you can specify \`package-json-path\` to provide that location. `
        );
      }
    }

    const npmVersion = core.getInput('npm-version', { required: false });
    if (npmVersion !== '') {
      core.info(`installing NPM ${npmVersion.toUpperCase() === 'TRUE' ? '' : npmVersion}`);
      await installer.installNpm(npmVersion);

      // cannot pin `npm` when `node` is not pinned as well
      if (nodeVersion !== '' && hasPackageJSON) {
        await installer.pinNpm(workingDirectory, npmVersion);
      }
    }

    const yarnVersion = core.getInput('yarn-version', { required: false });
    if (yarnVersion !== '') {
      core.info(`installing Yarn ${yarnVersion.toUpperCase() === 'TRUE' ? '' : yarnVersion}`);
      await installer.installYarn(yarnVersion);

      // cannot pin `yarn` when `node` is not pinned as well
      if (nodeVersion !== '' && hasPackageJSON) {
        await installer.pinYarn(workingDirectory, yarnVersion);
      }
    }

    const registryUrl = core.getInput('registry-url', { required: false });
    const alwaysAuth = core.getInput('always-auth', { required: false });
    if (registryUrl !== '') {
      core.info(`setting up registry url: ${registryUrl}`);
      await registry.configAuthentication(registryUrl, alwaysAuth);
    }

    await addMatchers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
