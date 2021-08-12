import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as core from '@actions/core';
import * as github from '@actions/github';

// Mostly copied from https://github.com/actions/setup-node/blob/main/src/authutil.ts

export async function configAuthentication(registryUrl: string, alwaysAuth: string): Promise<void> {
  const npmrc: string = path.resolve(process.env['RUNNER_TEMP'] || process.cwd(), '.npmrc');

  if (!registryUrl.endsWith('/')) {
    registryUrl += '/';
  }

  await writeRegistryToFile(npmrc, registryUrl, alwaysAuth);
}

export async function writeRegistryToFile(
  fileLocation: string,
  registryUrl: string,
  alwaysAuth: string
): Promise<void> {
  let scope: string = core.getInput('scope');

  if (!scope && registryUrl.indexOf('npm.pkg.github.com') > -1) {
    scope = github.context.repo.owner;
  }
  if (scope && scope[0] != '@') {
    scope = '@' + scope;
  }
  if (scope) {
    scope = scope.toLowerCase();
  }

  core.debug(`Setting auth in ${fileLocation}`);
  let newContents = '';

  try {
    const curContents = await fs.readFile(fileLocation, 'utf8');

    curContents.split(os.EOL).forEach((line: string) => {
      // Add current contents unless they are setting the registry
      if (!line.toLowerCase().startsWith('registry')) {
        newContents += line + os.EOL;
      }
    });
  } catch (_) {
    // do nothing...
  }

  // Remove http: or https: from front of registry.
  const authString: string =
    registryUrl.replace(/(^\w+:|^)/, '') + ':_authToken=${NODE_AUTH_TOKEN}';

  const registryString: string = scope
    ? `${scope}:registry=${registryUrl}`
    : `registry=${registryUrl}`;
  const alwaysAuthString = `always-auth=${alwaysAuth}`;

  newContents += `${authString}${os.EOL}${registryString}${os.EOL}${alwaysAuthString}`;

  await fs.writeFile(fileLocation, newContents, { flag: 'w' });

  core.exportVariable('NPM_CONFIG_USERCONFIG', fileLocation);

  // Export empty node_auth_token if didn't exist so npm doesn't complain about not being able to find it
  core.exportVariable('NODE_AUTH_TOKEN', process.env.NODE_AUTH_TOKEN || 'XXXXX-XXXXX-XXXXX-XXXXX');
}
