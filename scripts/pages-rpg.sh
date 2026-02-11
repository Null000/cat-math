#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "Error: There are uncommitted changes. Commit or stash them first."
  exit 1
fi

bun run build

rm -rf /tmp/cat-math-rpg
cp -r dist/rpg /tmp/cat-math-rpg

git switch pages

rm -rf node_modules
git rm -rf rpg
mkdir -p rpg
cp -r /tmp/cat-math-rpg/* rpg/

git add rpg
git commit -m "deploy rpg $(date -Iseconds)"
git push
git switch main
