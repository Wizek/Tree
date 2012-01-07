#! /bin/bash
# Assembles framework to ./dist/
echo "## Beginning assemby"

BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

JQUERY="$BASE"/lib/jquery
NORMALIZE="$BASE"/lib/normalize

CSS="$("$BASE"/src/buildCSS.sh)"
CSS="$(echo "$CSS" | sed  "s|\/\*.*\*\/||" )"
CSS="$(echo "$CSS" | sed  "s|'|\\\\\\\\'|g" )"

SRC="$BASE"/src
DIST="$BASE"/dist
TEST="$BASE"/test
VER=$( <"$BASE/version.txt") # read the entire file
PAGE="https://github.com/Wizek/Tree"
HEADER="/* Tree.js v$VER $PAGE */"

echo "### Wiping" "$DIST"
rm -r "$DIST"
mkdir "$DIST"

echo "#### Copying jQuery"
cp "$JQUERY"/dist/jquery.min.js "$DIST"

echo "### Assembling styles"
# mv "$SRC"/style.css "$DIST"/tree_style.css

echo "### Assembling JavaScript"
echo "$HEADER"|cat - "$SRC"/tree.js > /tmp/out
sed "s|var cssAsString = ''|var cssAsString = '$CSS'|" <"/tmp/out" >"$DIST"/tree.js

echo "## Assemby done"