#!/bin/bash

target_dir=$1; shift
target=$1; shift
jest=./node_modules/.bin/jest
test_target=test/${target%.js}.test.js

if [ -f "$test_target" ]; then
  "$jest" $test_target
fi
