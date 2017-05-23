#!/usr/bin/env bash

git config --global user.email "ZarinPal@Travis"
git config --global user.name "ZarinPal@Travis"
git config --global push.default simple
eval "$(ssh-agent -s)" #start the ssh agent
chmod 600 .ssh-key # this key should have push access
ssh-add .ssh-key
echo "Host *\n    StrictHostKeyChecking no" > ~/.ssh/config
git clone -b release-web git@github.com:ZarinPal/Panel.git public
apt-get install yarn
yarn install
npm run production
cp -R ./assets ./public/
cp -R ./index-web.html ./public/index.html
cd public
if [[ $TRAVIS_BRANCH == 'master' ]]; then
    git add --all .
    git commit -m ":credit_card::tada:"
    git push origin HEAD:release-web
fi
