#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "Error: There are uncommitted changes. Commit or stash them first."
  exit 1
fi

bun run build

rm -rf /tmp/cat-math-beta
cp -r dist /tmp/cat-math-beta

git switch pages

git rm -rf beta
mkdir -p beta
cp -r /tmp/cat-math-beta/* beta/

git add beta
git commit -m "deploy beta $(date -Iseconds)"
git push
git switch main
