#!/bin/bash
set -e

if [ "$TRAVIS_BRANCH" != "master" -o -n "$TRAVIS_TAG" -o "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo -e "Testing a non master branch push - testing without reporting."
  npm run test:coverage
  exit 0
fi

# For Node != 8, do nothing
if [ "$TRAVIS_NODE_VERSION" != "8" ]; then
  echo -e "Build triggered with Node v${TRAVIS_NODE_VERSION} - testing without reporting."
  npm run test:coverage
  exit 0
fi

echo -e "Testing a master branch push - testing and reporting coverage."

npm run test:coverage

npm run coveralls
