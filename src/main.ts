import * as core from '@actions/core';
import * as installer from './installer';

async function run(): Promise<void> {
  try {
    const voltaVersion = core.getInput('volta-version', { required: false });

    await installer.getVolta(voltaVersion);

    const nodeVersion = core.getInput('node-version', { required: false });
    if (nodeVersion !== '') {
      core.info(`installing Node ${nodeVersion === 'true' ? '' : nodeVersion}`);
      await installer.installNode(nodeVersion);
    }

    const yarnVersion = core.getInput('yarn-version', { required: false });
    if (yarnVersion !== '') {
      core.info(`installing Yarn ${yarnVersion === 'true' ? '' : yarnVersion}`);
      await installer.installYarn(yarnVersion);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
