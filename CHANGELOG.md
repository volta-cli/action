# Changelog







## v4.0.0-beta.3 (2022-10-03)

#### :bug: Bug Fix
* [#110](https://github.com/volta-cli/action/pull/110) Fix for self-hoster runners (instead of relying on `RUNNER_TEMP`) ([@jeevcat](https://github.com/jeevcat))
* [#111](https://github.com/volta-cli/action/pull/111) Fall back to downloading latest version from volta.sh on rate-limit ([@ZauberNerd](https://github.com/ZauberNerd))

#### Committers: 2
- Björn Brauer ([@ZauberNerd](https://github.com/ZauberNerd))
- Sam Jeeves ([@jeevcat](https://github.com/jeevcat))


## v4.0.0-beta.2 (2022-09-09)

#### :rocket: Enhancement
* [#107](https://github.com/volta-cli/action/pull/107) Add `package-json-path` input to specify location of `package.json` ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#106](https://github.com/volta-cli/action/pull/106) Update devDependencies to latest ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v4.0.0-beta.1 (2022-09-07)

#### :boom: Breaking Change
* [#102](https://github.com/volta-cli/action/pull/102) Replace `openssl-version` configuration with `variant` ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation
* [#104](https://github.com/volta-cli/action/pull/104) Add action-docs updater ([@rwjblue](https://github.com/rwjblue))
* [#103](https://github.com/volta-cli/action/pull/103) Remove reference to https://volta.sh/latest-version in logging ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#105](https://github.com/volta-cli/action/pull/105) Add CI scenario acceptance test using `variant` ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.0.2 (2022-09-01)

#### :bug: Bug Fix
* [#101](https://github.com/volta-cli/action/pull/101) Use GitHub API to retrieve latest release information. ([@rwjblue](https://github.com/rwjblue))

#### :memo: Documentation
* [#100](https://github.com/volta-cli/action/pull/100) Fix changelog heading ([@Turbo87](https://github.com/Turbo87))

#### Committers: 2
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))


## v3.0.1 (2022-08-30)

#### :memo: Documentation
* [#99](https://github.com/volta-cli/action/pull/99) Update README to include current versions ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v3.0.0 (2022-08-30)

#### :boom: Breaking Change
* [#93](https://github.com/volta-cli/action/pull/93) Drop support for usage with Volta older than 1.0.0 ([@rwjblue](https://github.com/rwjblue))
* [#75](https://github.com/volta-cli/action/pull/75) Output ESM into dist/ ([@rwjblue](https://github.com/rwjblue))
* [#91](https://github.com/volta-cli/action/pull/91) Update action metadata to leverage Node 16 ([@rwjblue](https://github.com/rwjblue))

#### :rocket: Enhancement
* [#97](https://github.com/volta-cli/action/pull/97) Use `${{ github.token }}` to authenticate tool cache downloads ([@rwjblue](https://github.com/rwjblue))
* [#98](https://github.com/volta-cli/action/pull/98) Allow explicitly specifying `openssl-version` (on self-hosted environments the `openssl` command may not be on `$PATH`) ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix
* [#95](https://github.com/volta-cli/action/pull/95) Add `scope` to list of inputs ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#46](https://github.com/volta-cli/action/pull/46) Update to npm@8 ([@rwjblue](https://github.com/rwjblue))
* [#96](https://github.com/volta-cli/action/pull/96) Prevent test harness from defaulting to `./action` as default working directory ([@rwjblue](https://github.com/rwjblue))
* [#92](https://github.com/volta-cli/action/pull/92) Migrate CI jobs to checkout `action` into subdirectory ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.0.0-beta.2 (2022-08-30)

#### :rocket: Enhancement
* [#98](https://github.com/volta-cli/action/pull/98) Allow explicitly specifying `openssl-version` (on self-hosted environments the `openssl` command may not be on `$PATH`) ([@scalvert](https://github.com/scalvert))

#### Committers: 1
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v3.0.0-beta.1 (2022-08-18)

#### :boom: Breaking Change
* [#93](https://github.com/volta-cli/action/pull/93) Drop support for usage with Volta older than 1.0.0 ([@rwjblue](https://github.com/rwjblue))
* [#75](https://github.com/volta-cli/action/pull/75) Output ESM into dist/ ([@rwjblue](https://github.com/rwjblue))
* [#91](https://github.com/volta-cli/action/pull/91) Update action metadata to leverage Node 16 ([@rwjblue](https://github.com/rwjblue))

#### :rocket: Enhancement
* [#97](https://github.com/volta-cli/action/pull/97) Use `${{ github.token }}` to authenticate tool cache downloads ([@rwjblue](https://github.com/rwjblue))

#### :bug: Bug Fix
* [#95](https://github.com/volta-cli/action/pull/95) Add `scope` to list of inputs ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#46](https://github.com/volta-cli/action/pull/46) Update to npm@8 ([@rwjblue](https://github.com/rwjblue))
* [#96](https://github.com/volta-cli/action/pull/96) Prevent test harness from defaulting to `./action` as default working directory ([@rwjblue](https://github.com/rwjblue))
* [#92](https://github.com/volta-cli/action/pull/92) Migrate CI jobs to checkout `action` into subdirectory ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v2.0.1 (2022-08-12)

#### :house: Internal
* [#86](https://github.com/volta-cli/action/pull/86) Update dependencies / devDependencies to latest ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v2.0.0 (2022-08-10)

#### :boom: Breaking Change
* [#89](https://github.com/volta-cli/action/pull/89) Fix usage on Linux distributions other than Ubuntu (e.g. CentOS, RHEL, &c) ([@scalvert](https://github.com/scalvert))

#### :rocket: Enhancement
* [#64](https://github.com/volta-cli/action/pull/64) Adds registry-url and always-auth parameters ([@pzuraq](https://github.com/pzuraq))

#### :bug: Bug Fix
* [#89](https://github.com/volta-cli/action/pull/89) Fix usage on Linux distributions other than Ubuntu (e.g. CentOS, RHEL, &c) ([@scalvert](https://github.com/scalvert))

#### Committers: 3
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v1.7.0 (2021-03-03)

#### :rocket: Enhancement
* [#53](https://github.com/volta-cli/action/pull/53) Add support for specifying `npm-version` as an option ([@felipecrs](https://github.com/felipecrs))

#### :bug: Bug Fix
* [#54](https://github.com/volta-cli/action/pull/54) Update `tsc` matcher to associate failure with correct line/column. ([@rwjblue](https://github.com/rwjblue))

#### :house: Internal
* [#55](https://github.com/volta-cli/action/pull/55) Update release setup. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 2
- Felipe Santos ([@felipecrs](https://github.com/felipecrs))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


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
