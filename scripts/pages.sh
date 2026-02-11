#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "Error: There are uncommitted changes. Commit or stash them first."
  exit 1
fi

rm -rf dist
bun run build

rm -rf /tmp/cat-math
cp -r dist /tmp/cat-math

git switch pages

git rm -rf .
cp -r /tmp/cat-math/* .

git add -A
git commit -m "deploy $(date -Iseconds)"
git push
git switch main
