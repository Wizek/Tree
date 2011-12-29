#! /bin/bash
# Does full build of the framework to ./dist/

echo
echo "# Building Tree.js after it's dependencies."
echo

BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
JQUERY="$BASE"/lib/jquery

echo "## Acquiring submodules"
git submodule init
git submodule update

echo "## Making jQuery"
make -C "$JQUERY"

"$BASE"/buildAssemble.sh

echo
echo "# Done."
echo
