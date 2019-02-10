#!/bin/bash
set -e

# For Node != 8, do nothing
if [ "$TRAVIS_NODE_VERSION" != "10" ]; then
  echo -e "Build triggered with Node v${TRAVIS_NODE_VERSION} - testing without reporting."
  npm run test:coverage
  exit 0
fi

echo -e "Build triggered with Node v${TRAVIS_NODE_VERSION} - testing and reporting coverage."

npm run test:coverage

npm run coveralls
