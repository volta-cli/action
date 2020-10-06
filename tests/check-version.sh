#!/bin/bash

# exit when any command fails
set -e

command=$1
expectedVersion=$2

if [[ "$expectedVersion" == "current" ]]; then
  scriptPath="$(dirname "$BASH_SOURCE")/latest-version.js"
  expectedVersion="$(curl --silent "https://volta.sh/latest-version")"
fi

actualVersion="$($command --version)"
echo "$command found at $(which $command)"
echo "Expected $expectedVersion; found $actualVersion"

if [[ "$actualVersion" != "$expectedVersion" ]]; then
  exit 1
fi
