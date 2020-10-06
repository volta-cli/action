#!/bin/bash

# exit when any command fails
set -e

echo "Current PATH: $PATH"
echo "Current VOLTA_HOME: $VOLTA_HOME"

voltaBinContents="$(ls $VOLTA_HOME/bin)"
echo "Current contents of $VOLTA_HOME\n$voltaBinContents"
echo "Path to volta: $(which volta)"
echo "Path to node: $(which node)"
echo "Path to yarn: $(which yarn)"
