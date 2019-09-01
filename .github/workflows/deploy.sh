#!/bin/bash
set -euxo pipefail

echo -e "\n# Initialise some useful variables"
REPO="https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
BRANCH_OR_TAG=`awk -F/ '{print $2}' <<< $GITHUB_REF`
CURRENT_BRANCH=`awk -F/ '{print $NF}' <<< $GITHUB_REF`

if [ "$BRANCH_OR_TAG" == "heads" ]; then
  SOURCE_TYPE="branch"
else
  SOURCE_TYPE="tag"
fi

echo -e "\n# Checkout the repo in the target branch"
TARGET_BRANCH="gh-pages"
git clone $REPO out -b $TARGET_BRANCH

echo -e "\n# Move the generated docs to the newly-checked-out repo, to be committed and pushed"
rsync -vau dist/ out/

echo -e "\n# Commit and push"
cd out
git add --all .
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git commit -m "Docs build for ${SOURCE_TYPE} ${CURRENT_BRANCH}: ${GITHUB_SHA}" || true
git push origin $TARGET_BRANCH
