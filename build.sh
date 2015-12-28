#!/bin/sh

meteor build --directory ../bin
cd ../bin/bundle/programs/server/
npm i
#cd /opt
#tar zcvf bin.tar.gz ./bin
pm2 restart all
