#! /bin/bash
# become root user
sudo su

# update dependencies
yum -y update

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

. ~/.nvm/nvm.sh

nvm install --lts

yum install git

git clone git@github.com:brandon-kyle-bailey/hawkstatus-api.git

git checkout dev

npm run build