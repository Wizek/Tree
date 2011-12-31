#! /bin/bash
BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cp "$BASE"/../lib/normalize/normalize.css "$BASE"/normalize.styl
stylus -c "$BASE"/style.styl
rm "$BASE"/normalize.styl