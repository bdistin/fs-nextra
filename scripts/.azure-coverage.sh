set -e

# For Node != 10.x or Platform != Linux, do nothing
if [ "$NODE_VERSION" != "10.x" -o "$PLATFORM" != "Linux"]; then
  echo -e "Build triggered on ${PLATFORM} - Node v${NODE_VERSION} - testing without reporting."
  yarn run test:coverage
  exit 0
fi

echo -e "Build triggered on ${PLATFORM} - Node v${NODE_VERSION} - testing and reporting coverage."

yarn run test:coverage

yarn run coveralls
