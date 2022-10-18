import { buildLayout, buildDownloadUrl } from './installer';
import { createTempDir } from 'broccoli-test-helper';

describe('buildDownloadUrl', () => {
  describe('volta < 1.1.0', function () {
    test('darwin - x64', async function () {
      expect(await buildDownloadUrl('darwin', 'x64', '0.6.4')).toMatchInlineSnapshot(
        `"https://github.com/volta-cli/volta/releases/download/v0.6.4/volta-0.6.4-macos.tar.gz"`
      );
    });

    test('darwin - arm64', async function () {
      expect(await buildDownloadUrl('darwin', 'arm64', '0.6.4')).toMatchInlineSnapshot(
        `"https://github.com/volta-cli/volta/releases/download/v0.6.4/volta-0.6.4-macos.tar.gz"`
      );
    });

    test('linux', async function () {
      expect(await buildDownloadUrl('linux', 'x64', '0.6.4')).toMatchInlineSnapshot(
        `"https://github.com/volta-cli/volta/releases/download/v0.6.4/volta-0.6.4-linux-openssl-1.1.tar.gz"`
      );
    });

    test('win32', async function () {
      expect(await buildDownloadUrl('win32', 'x86-64', '0.7.2')).toMatchInlineSnapshot(
        `"https://github.com/volta-cli/volta/releases/download/v0.7.2/volta-0.7.2-windows-x86_64.msi"`
      );
    });

    test('aix', async function () {
      expect(
        async () =>
          await buildDownloadUrl('aix', 'hmm, wat?? (I dont know a valid arch for aix)', '0.6.4')
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"your platform aix is not yet supported"`);
    });
  });

  describe('volta@1.1.0', function () {
    test('darwin - x64', async function () {
      expect(await buildDownloadUrl('darwin', 'x64', '1.1.0')).toMatchInlineSnapshot(
        `"https://github.com/volta-cli/volta/releases/download/v1.1.0/volta-1.1.0-macos.tar.gz"`
      );
    });

    test('darwin - arm64', async function () {
      expect(await buildDownloadUrl('darwin', 'arm64', '1.1.0')).toMatchInlineSnapshot(
        `"https://github.com/volta-cli/volta/releases/download/v1.1.0/volta-1.1.0-macos-aarch64.tar.gz"`
      );
    });

    test('linux', async function () {
      expect(await buildDownloadUrl('linux', 'x64', '1.1.0')).toMatchInlineSnapshot(
        `"https://github.com/volta-cli/volta/releases/download/v1.1.0/volta-1.1.0-linux.tar.gz"`
      );

      expect(await buildDownloadUrl('linux', 'x64', '1.1.0')).toMatchInlineSnapshot(
        `"https://github.com/volta-cli/volta/releases/download/v1.1.0/volta-1.1.0-linux.tar.gz"`
      );

      expect(await buildDownloadUrl('linux', 'x64', '1.1.0')).toMatchInlineSnapshot(
        `"https://github.com/volta-cli/volta/releases/download/v1.1.0/volta-1.1.0-linux.tar.gz"`
      );
    });

    test('win32', async function () {
      expect(await buildDownloadUrl('win32', 'x86-64', '1.1.0')).toMatchInlineSnapshot(
        `"https://github.com/volta-cli/volta/releases/download/v1.1.0/volta-1.1.0-windows-x86_64.msi"`
      );
    });

    test('aix', async function () {
      expect(
        async () =>
          await buildDownloadUrl('aix', 'hmm, wat?? (I dont know a valid arch for aix)', '1.1.0')
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"your platform aix is not yet supported"`);
    });
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
