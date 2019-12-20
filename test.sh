#!/bin/bash

set -xeuo pipefail

node action.js json >/dev/null
node action.js txt
# check default arg
node action.js >/dev/null
node action.js shell
node action.js html
node action.js txt /tmp/hu-output
grep "Current humans" /tmp/hu-output

