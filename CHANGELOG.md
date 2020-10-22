## v1.6.0 (2020-10-22)

#### :rocket: Enhancement
* [#42](https://github.com/volta-cli/action/pull/42) Add tsc and eslint matchers. ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#43](https://github.com/volta-cli/action/pull/43) Refactor CI config to simplify testing volta 0.6, 0.7, 0.8, and 0.9. ([@rwjblue](https://github.com/rwjblue))
* [#45](https://github.com/volta-cli/action/pull/45) Update dependencies to latest. ([@rwjblue](https://github.com/rwjblue))
* [#44](https://github.com/volta-cli/action/pull/44) Update release packages to latest. ([@rwjblue](https://github.com/rwjblue))
* [#41](https://github.com/volta-cli/action/pull/41) Remove unused walk-sync devDep. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v1.5.0 (2020-10-07)

#### :rocket: Enhancement
* [#30](https://github.com/volta-cli/action/pull/30) Resolve warnings about the `add-path` command being deprecated. Update @actions/core to latest. ([@dependabot[bot]](https://github.com/apps/dependabot))

#### :house: Internal
* [#40](https://github.com/volta-cli/action/pull/40) Re-roll package-lock.json. ([@rwjblue](https://github.com/rwjblue))
* [#28](https://github.com/volta-cli/action/pull/28) Update dependencies to latest. ([@rwjblue](https://github.com/rwjblue))
* [#39](https://github.com/volta-cli/action/pull/39) Migrate to @vercel/ncc ([@rwjblue](https://github.com/rwjblue))
* [#38](https://github.com/volta-cli/action/pull/38) Update @actions/tool-cache and @actions/exec to latest. ([@rwjblue](https://github.com/rwjblue))
* [#37](https://github.com/volta-cli/action/pull/37) Update jest and related packages to latest. ([@rwjblue](https://github.com/rwjblue))
* [#34](https://github.com/volta-cli/action/pull/34) Ensure all test scripts fail on uncaught exceptions. ([@rwjblue](https://github.com/rwjblue))
* [#36](https://github.com/volta-cli/action/pull/36) Migrate internal workflow tests to shell scripts. ([@rwjblue](https://github.com/rwjblue))
* [#35](https://github.com/volta-cli/action/pull/35) Update uuid to latest. ([@rwjblue](https://github.com/rwjblue))
* [#33](https://github.com/volta-cli/action/pull/33) Update typescript and related @types packages to latest. ([@rwjblue](https://github.com/rwjblue))
* [#32](https://github.com/volta-cli/action/pull/32) Add more logging to tests/log-info.js ([@rwjblue](https://github.com/rwjblue))
* [#31](https://github.com/volta-cli/action/pull/31) Update linting configuration and dependencies. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v1.4.3 (2020-03-27)

#### :bug: Bug Fix
* [#24](https://github.com/volta-cli/action/pull/24) Ensure specifying a `node-version` updates the pinned node. ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#23](https://github.com/volta-cli/action/pull/23) Update to prettier@2. ([@rwjblue](https://github.com/rwjblue))
* [#22](https://github.com/volta-cli/action/pull/22) Update dependencies and devDependencies to latest versions. ([@rwjblue](https://github.com/rwjblue))
* [#19](https://github.com/volta-cli/action/pull/19) Update CI workflow to assert expected versions. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v1.4.2 (2020-03-11)

#### :bug: Bug Fix
* [#20](https://github.com/volta-cli/action/pull/20) Ensure shims work properly when used with volta@0.6 ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v1.4.1 (2020-03-11)

#### :house: Internal
* [#18](https://github.com/volta-cli/action/pull/18) Setup branding for GitHub Marketplace ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v1.4.0 (2020-03-11)

#### :memo: Documentation
* [#17](https://github.com/volta-cli/action/pull/17) Tweak action.yml name and description. ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#15](https://github.com/volta-cli/action/pull/15) Fix repo references (rwjblue/setup-volta -> volta-cli/action). ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v1.3.0 (2020-03-11)

#### :rocket: Enhancement
* [#9](https://github.com/volta-cli/action/pull/9) Add Windows support ([@rwjblue](https://github.com/rwjblue))
* [#12](https://github.com/volta-cli/action/pull/12) When debugging specify `--verbose` when installing default node / yarn. ([@rwjblue](https://github.com/rwjblue))

#### :bug: Bug Fix
* [#10](https://github.com/volta-cli/action/pull/10) Extract downloaded files directly into `$VOLTA_HOME/bin`. ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#13](https://github.com/volta-cli/action/pull/13) Avoid GitHub rate limiting when using `volta install yarn@1` ([@rwjblue](https://github.com/rwjblue))
* [#11](https://github.com/volta-cli/action/pull/11) Run CI against both Ubuntu and macOS. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v1.2.1 (2020-03-10)

#### :house: Internal
* [#8](https://github.com/volta-cli/action/pull/8) Update to latest automated release setup. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v1.2.0 (2020-03-09)

#### :house: Internal
* [#7](https://github.com/volta-cli/action/pull/7) Add automated release setup (via release-it). ([@rwjblue](https://github.com/rwjblue))
* [#6](https://github.com/volta-cli/action/pull/6) Update to latest version of actions/typescript-template. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))

## v1.1.0 (2020-03-08)

#### :rocket: Enhancement
* [#5](https://github.com/volta-cli/action/pull/5) Update to leverage `volta setup` when using Volta 0.7+ ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#4](https://github.com/volta-cli/action/pull/4) Update dependencies to latest versions. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
