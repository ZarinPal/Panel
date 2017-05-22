#!/usr/bin/env bash

cp index-web.html public/index.html
cp package.json public/package.json

brew install wine --without-x11
brew install mono
brew install gnu-tar graphicsmagick xz
brew install rpm

npm run compile --projectDir=public


rm -rf dist/github
rm -rf dist/linux-unpacked
rm -rf dist/mac
rm -rf dist/win-unpacked
rm -rf dist/latest.yml