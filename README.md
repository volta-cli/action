# setup-volta

<p align="left">
  <a href="https://github.com/rwjblue/setup-volta"><img alt="GitHub Actions status" src="https://github.com/rwjblue/setup-volta/workflows/CI/badge.svg"></a>
</p>

This action installs [volta](https://volta.sh) by:

- downloading and caching volta (adding it to your $PATH)
- optionally downloading and caching a version of node - npm by version spec and add to PATH

# Usage

See [action.yml](action.yml)

Basic (when the project's `package.json` has a `volta` property with `node` and/or `yarn` versions pinned):

```yaml
steps:
- uses: actions/checkout@v1
- uses: rwjblue/setup-volta@v1
- run: npm install
- run: npm test
```

Manually specifying node and/or yarn versions (e.g. to test a project without `volta` in `package.json`):

```yaml
steps:
- uses: actions/checkout@v1
- uses: rwjblue/setup-volta@v1
  with:
    node-version: 10.x
    yarn-version: 1.19.1

- run: yarn install
- run: yarn test
```

Setting up a matrix of node versions:

```yaml
strategy:
  matrix:
    node-version: ['^8.12', '10', '12']

steps:
- uses: actions/checkout@v1
- uses: rwjblue/setup-volta@v1
  with:
    node-version: ${{ matrix.node-version }}

- run: npm install
- run: npm test
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
