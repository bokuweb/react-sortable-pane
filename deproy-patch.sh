#!/bin/bash
git config --global -l
git config --global user.email bokuweb12@gmail.com
git config --global user.name bokuweb
git remote --v

npm version patch
git push --tags
npm publish
