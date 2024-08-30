#!bin/bash
echo "please wait ..."
sleep 10s
pnpm db:make
pnpm db:deploy
