# become root user
sudo su

# update dependencies
yum -y update

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

. ~/.nvm/nvm.sh

nvm install --lts

yum install git -y

git clone https://github.com/brandon-kyle-bailey/hawkstatus-api.git

cd hawkstatus-api

git checkout dev

npm run deploy