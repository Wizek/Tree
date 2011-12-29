#! /bin/bash
# Does full build of the framework to ./dist/

echo
echo "# Building Tree.js after it's dependencies."
echo

JQUERY='./lib/jquery'

echo "## Acquiring submodules"
git submodule init
git submodule update

echo "## Making jQuery"
make -C "$JQUERY"

./buildAssemble.sh

echo
echo "# Done."
echo
