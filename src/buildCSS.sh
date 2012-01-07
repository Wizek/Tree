#! /bin/bash
## Meant to be executed from project folder (just outside src)
BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
stylus < "$BASE"/tree.styl --include-css -c | "$BASE"/../node_modules/clean-css/bin/cleancss