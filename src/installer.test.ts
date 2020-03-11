import { buildLayout, buildDownloadUrl } from './installer';
import { createTempDir } from 'broccoli-test-helper';

describe('buildDownloadUrl', () => {
  test('darwin', function() {
    expect(buildDownloadUrl('darwin', '0.6.4')).toMatchInlineSnapshot(
      `"https://github.com/volta-cli/volta/releases/download/v0.6.4/volta-0.6.4-macos.tar.gz"`
    );
  });

  test('linux', function() {
    expect(buildDownloadUrl('linux', '0.6.4')).toMatchInlineSnapshot(
      `"https://github.com/volta-cli/volta/releases/download/v0.6.4/volta-0.6.4-linux-openssl-1.1.tar.gz"`
    );
  });

  test('win32', function() {
    expect(buildDownloadUrl('win32', '0.7.2')).toMatchInlineSnapshot(
      `"https://github.com/volta-cli/volta/releases/download/v0.7.2/volta-0.7.2-windows-x86_64.msi"`
    );
  });

  test('aix', function() {
    expect(() => buildDownloadUrl('aix', '0.6.4')).toThrowErrorMatchingInlineSnapshot(
      `"your platform aix is not yet supported"`
    );
  });
});

describe('buildLayout', () => {
  test('creates the rough folder structure', async () => {
    const tmpdir = await createTempDir();

    tmpdir.write({
      bin: {
        shim: 'shim-file-here',
      },
    });

    await buildLayout(tmpdir.path());

    expect(tmpdir.read()).toMatchInlineSnapshot(`
Object {
  "bin": Object {
    "node": "shim-file-here",
    "npm": "shim-file-here",
    "npx": "shim-file-here",
    "shim": "shim-file-here",
    "yarn": "shim-file-here",
  },
  "cache": Object {
    "node": Object {},
  },
  "log": Object {},
  "tmp": Object {},
  "tools": Object {
    "image": Object {
      "node": Object {},
      "packages": Object {},
      "yarn": Object {},
    },
    "inventory": Object {
      "node": Object {},
      "packages": Object {},
      "yarn": Object {},
    },
    "user": Object {},
  },
}
`);
  });
});
