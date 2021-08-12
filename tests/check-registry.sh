#!/bin/bash

# exit when any command fails
set -e

expectedRegistry=$1

# Dummy auth token so that the registry can be read
export NODE_AUTH_TOKEN="test-123"

actualRegistry="$(npm config get registry)"

if [[ $expectedRegistry == $actualRegistry ]]; then
  echo "npm registry was set to \"$expectedRegistry\""
  exit 0
else
  echo "npm registry was set to \"$actualRegistry\" which was incorrect, expected \"$expectedRegistry\""
  exit 1
fi
