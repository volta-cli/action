import * as core from '@actions/core';
import findUp from 'find-up';
import * as installer from './installer';
import * as registry from './registry';
import addMatchers from './matchers';

async function run(): Promise<void> {
  try {
    const authToken = core.getInput('token', { required: false });
    const voltaVersion = core.getInput('volta-version', { required: false });
    const variant = core.getInput('variant', { required: false });

    await installer.getVolta({ versionSpec: voltaVersion, authToken, variant });

    const hasPackageJSON = await findUp('package.json');
    const nodeVersion = core.getInput('node-version', { required: false });
    if (nodeVersion !== '') {
      core.info(`installing Node ${nodeVersion === 'true' ? '' : nodeVersion}`);
      await installer.installNode(nodeVersion);

      if (hasPackageJSON) {
        await installer.pinNode(nodeVersion);
      }
    }

    const npmVersion = core.getInput('npm-version', { required: false });
    if (npmVersion !== '') {
      core.info(`installing NPM ${npmVersion === 'true' ? '' : npmVersion}`);
      await installer.installNpm(npmVersion);

      // cannot pin `npm` when `node` is not pinned as well
      if (nodeVersion !== '' && hasPackageJSON) {
        await installer.pinNpm(npmVersion);
      }
    }

    const yarnVersion = core.getInput('yarn-version', { required: false });
    if (yarnVersion !== '') {
      core.info(`installing Yarn ${yarnVersion === 'true' ? '' : yarnVersion}`);
      await installer.installYarn(yarnVersion);

      // cannot pin `yarn` when `node` is not pinned as well
      if (nodeVersion !== '' && hasPackageJSON) {
        await installer.pinYarn(yarnVersion);
      }
    }

    const registryUrl = core.getInput('registry-url', { required: false });
    const alwaysAuth = core.getInput('always-auth', { required: false });
    if (registryUrl !== '') {
      core.info(`setting up registry url: ${registryUrl}`);
      await registry.configAuthentication(registryUrl, alwaysAuth);
    }

    await addMatchers();
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
