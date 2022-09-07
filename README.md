# GitHub Action to Setup Volta

<p align="left">
  <a href="https://github.com/volta-cli/action"><img alt="GitHub Actions status" src="https://github.com/volta-cli/action/workflows/CI/badge.svg"></a>
</p>

This action installs [volta](https://volta.sh) by:

- downloading and caching volta (adding it to your $PATH)
- optionally downloading and caching a version of node - npm by version spec and add to PATH

<!-- action-docs-inputs -->
## Inputs

| parameter | description | required | default |
| - | - | - | - |
| volta-version | Version Spec of the volta version to use.  Examples: 0.6.x, 10.15.1, >=10.15.0 | `false` |  |
| node-version | Version Spec of the node version to use.  Examples: 10.6.x, 10.15.1, >=10.15.0 | `false` |  |
| npm-version | Version Spec of the npm version to use.  Examples: 7.5.x, 7.5.3, >=7.5.3 | `false` |  |
| yarn-version | Version Spec of the yarn version to use.  Examples: 1.6.x, 10.15.1, >=10.15.0 | `false` |  |
| variant | Specific variant to install. Example: providing the variant "linux-openssl-rhel", which will target installing the volta-${version}-linux-openssl-rhel.tar.gz tarball | `false` |  |
| registry-url | Optional registry to set up for auth. Will set the registry in a project level .npmrc file, and set up auth to read in from env.NODE_AUTH_TOKEN | `false` |  |
| scope | Optional scope for authenticating against scoped registries. Will fall back to the repository owner when using the GitHub Packages registry (https://npm.pkg.github.com/). | `false` |  |
| token | Used to avoid low rate limiting for cached tool downloads.  Since there's a default, this is typically not supplied by the user. | `false` | ${{ github.token }} |
| always-auth | Set always-auth in npmrc | `false` | false |



<!-- action-docs-inputs -->

## Usage

See [action.yml](action.yml)

Basic (when the project's `package.json` has a `volta` property with `node` and/or `yarn` versions pinned):

```yaml
steps:
- uses: actions/checkout@v3
- uses: volta-cli/action@v3
- run: npm install
- run: npm test
```

Manually specifying node and/or yarn versions (e.g. to test a project without `volta` in `package.json`):

```yaml
steps:
- uses: actions/checkout@v3
- uses: volta-cli/action@v3
  with:
    node-version: 18.x
    yarn-version: 1.19.1

- run: yarn install
- run: yarn test
```

Setting up a matrix of node versions:

```yaml
strategy:
  matrix:
    node-version: ['^14.10', '16', '18']

steps:
- uses: actions/checkout@v3
- uses: volta-cli/action@v3
  with:
    node-version: ${{ matrix.node-version }}

- run: npm install
- run: npm test
```

You can also specify the version of npm:

```yaml
strategy:
  matrix:
    node-version: ['^8.12', '10', '12']

steps:
- uses: actions/checkout@v3
- uses: volta-cli/action@v3
  with:
    node-version: ${{ matrix.node-version }}
    npm-version: '7'

- run: npm install
- run: npm test
```

In some cases, you may know the particular variant of the installer that you want to use for Volta. You can specify the `variant` input to the action to use a specific installer:

```yaml
steps:
- uses: actions/checkout@v3
- uses: volta-cli/action@v3
  with:
    variant: 'linux-openssl-rhel'

- run: yarn install
- run: yarn test
```

The `variant` fragment corresponds to a portion of the installer filename, and can be found in the [Volta Releases](https://github.com/volta-cli/action/releases) page.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
