#! /bin/bash
## Meant to be executed from project folder (just outside src)
BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
stylus --include-css -w "$BASE"/tree.styl -o "$BASE"