#! /bin/bash
# Assembles framework to ./dist/
echo "## Beginning assemby"

BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

JQUERY="$BASE"/lib/jquery
NORMALIZE="$BASE"/lib/normalize

BUILDCSS="$BASE"/src/buildCSS.sh

SRC="$BASE"/src
DIST="$BASE"/dist
TEST="$BASE"/test
VER=$( <"$BASE/version.txt") # read the entire file
PAGE="https://github.com/Wizek/Tree"
HEADER="/* Tree.js $VER $PAGE */"

echo $0
echo "### Wiping" "$DIST"
rm -r "$DIST"
mkdir "$DIST"

echo "#### Copying jQuery"
cp "$JQUERY"/dist/jquery.min.js "$DIST"

echo "### Assembling styles"
"$BUILDCSS"
mv "$SRC"/style.css "$DIST"/tree_style.css
rm "$SRC"/normalize.styl

echo "### Assembling JavaScript"
echo "$HEADER"|cat - "$SRC"/tree.js > /tmp/out && mv /tmp/out "$DIST"/tree.js

echo "## Assemby done"