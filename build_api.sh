#!/bin/sh

meteor build --directory ../bin/intf/
cd ../bin/intf/bundle/programs/server/
sudo npm i 
#cd /opt
#tar zcvf bin.tar.gz ./bin
pm2 restart all
