import * as path from 'path';
import { writeRegistryToFile } from './registry';
import { createTempDir } from 'broccoli-test-helper';

const ORIGNAL_CONSOLE = Object.assign({}, console);

describe('registry', () => {
  afterEach(() => {
    Object.assign(console, ORIGNAL_CONSOLE);
  });

  test('creates an .npmrc with the proper registry url', async () => {
    const tmpdir = await createTempDir();

    await writeRegistryToFile(path.join(tmpdir.path(), '.npmrc'), 'some.registry.url', 'false');

    expect(tmpdir.read()).toMatchInlineSnapshot(`
Object {
  ".npmrc": "some.registry.url:_authToken=\${NODE_AUTH_TOKEN}
registry=some.registry.url
always-auth=false",
}
`);
  });

  test('includes existing npmrc', async () => {
    const tmpdir = await createTempDir();

    tmpdir.write({
      '.npmrc': 'some-scope:registry=https://npm.pkg.github.com',
    });

    await writeRegistryToFile(path.join(tmpdir.path(), '.npmrc'), 'some.registry.url', 'false');

    expect(tmpdir.read()).toMatchInlineSnapshot(`
Object {
  ".npmrc": "some-scope:registry=https://npm.pkg.github.com
some.registry.url:_authToken=\${NODE_AUTH_TOKEN}
registry=some.registry.url
always-auth=false",
}
`);
  });
});
