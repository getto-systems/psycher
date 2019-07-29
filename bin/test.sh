#!/bin/bash

target_dir=$1; shift
target=$1; shift
jest=./node_modules/.bin/jest

"$jest" $target_dir/$target
