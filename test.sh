#!/bin/bash

set -xeuo pipefail

node action.js json >/dev/null
node action.js txt
# check default arg
node action.js >/dev/null
node action.js shell

