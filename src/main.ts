import * as core from '@actions/core';
import * as installer from './installer';

async function run() {
  try {
    const version = core.getInput('volta-version');
    if (version) {
      await installer.getVolta(version);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
