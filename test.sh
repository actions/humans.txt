#!bin/bash

set -xeuo pipefail

node action.js txt >/tmp/t1
node action.js json >/tmp/t2
node action.js shell >/tmp/t3

