#!/bin/bash

bun run build

rm -r /tmp/cat-math
cp -r dist /tmp/cat-math

git switch pages

rm -r *
cp -r /tmp/cat-math/* .
