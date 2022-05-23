#!/bin/bash

set -x -e

[ "$BUNDLER" == "" ] && BUNDLER=$1

if [ "$BUNDLER" != "" ]; then
  rm -rf tmp/$BUNDLER
  mkdir -p tmp/$BUNDLER
  cp test/browser/fixtures/index.html tmp/$BUNDLER
fi

case $BUNDLER in
  browserify)
    browserify test/browser/test-browser.js -o tmp/browserify/suite.browser.js
    browserify test/browser/test-browser.js --node -o tmp/browserify/suite.node.js
    ;;
  esbuild)
    node src/test/browser/fixtures/esbuild.browser.config.mjs
    node src/test/browser/fixtures/esbuild.node.config.mjs
    ;;
  rollup)
    rollup -c test/browser/fixtures/rollup.browser.config.mjs
    rollup -c test/browser/fixtures/rollup.node.config.mjs
    ;;
  webpack)
    webpack -c test/browser/fixtures/webpack.browser.config.mjs
    webpack -c test/browser/fixtures/webpack.node.config.mjs
    ;;
  *)
    echo "Please set the environment variable BUNDLER to browserify, esbuild, rollup or webpack."
    exit 1
    ;;
esac