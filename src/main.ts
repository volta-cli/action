import * as core from '@actions/core';
import * as installer from './installer';

async function run(): Promise<void> {
  try {
    const voltaVersion = core.getInput('volta-version', { required: false });

    await installer.getVolta(voltaVersion);

    const nodeVersion = core.getInput('node-version', { required: false });
    if (nodeVersion !== '') {
      await installer.installNode(nodeVersion);
    }

    const yarnVersion = core.getInput('yarn-version', { required: false });
    if (yarnVersion !== '') {
      await installer.installYarn(yarnVersion);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
