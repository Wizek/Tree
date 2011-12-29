#! /bin/bash
# Assembles framework to ./dist/
echo "## Beginning assemby"

JQUERY='./lib/jquery'

ROOT="$PWD"
SRC='./src'
DIST='./dist'
TEST='./test'
VER=$( <version.txt) # read the entire file
PAGE="https://github.com/Wizek/Tree"
HEADER="/* Tree.js $VER $PAGE */"

echo "### Wiping" "$DIST"
rm -r "$DIST"
mkdir "$DIST"

echo "#### Copying jQuery"
cp "$JQUERY"/dist/jquery.min.js "$DIST"
# echo "$SRC" "$DIST" "$TEST" | xargs -n 1 cp "$JQUERY"/dist/jquery.min.js

echo "### Assembling styles"
cp ./lib/normalize/normalize.css "$SRC"/normalize.styl
stylus -c "$SRC"/style.styl -o "$DIST"
mv "$DIST"/style.css "$DIST"/tree_style.css
rm "$SRC"/normalize.styl

echo "### Assembling JavaScript"
echo "$HEADER"|cat - "$SRC"/tree.js > /tmp/out && mv /tmp/out "$DIST"/tree.js
#cp "$DIST"/tree.js "$TEST"/tree.js

echo "### Copying Tree"
cp "$SRC"/tree_logo.svg "$DIST"/tree_logo.svg

echo "## Assemby done"