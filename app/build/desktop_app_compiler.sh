#!/usr/bin/env bash

cp index-web.html public/index.html
cp package.json public/package.json

brew install wine
brew install mono
brew install gnu-tar graphicsmagick xz
brew install rpm

yarn global add electron@1.6.8
yarn global add electron-builder@18.0.1

#rm -rf src
#rm -rf node_modules
mkdir app
cp package.json app/
cp index.html app/
cp -rf assets/ app/assets/

npm run compile

rm -rf dist/github
rm -rf dist/linux-unpacked
rm -rf dist/mac
rm -rf dist/win-unpacked
rm -rf dist/latest.yml
