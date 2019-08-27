#!/bin/bash

git remote add maint https://getto-systems:$GITHUB_ACCESS_TOKEN@github.com/getto-systems/psycher-slack.git
git tag $(cat .release-version)
git push maint HEAD:master --tags
git push maint HEAD:maintenance -f
