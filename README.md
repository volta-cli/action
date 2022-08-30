# GitHub Action to Setup Volta

<p align="left">
  <a href="https://github.com/volta-cli/action"><img alt="GitHub Actions status" src="https://github.com/volta-cli/action/workflows/CI/badge.svg"></a>
</p>

This action installs [volta](https://volta.sh) by:

- downloading and caching volta (adding it to your $PATH)
- optionally downloading and caching a version of node - npm by version spec and add to PATH

# Usage

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

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
