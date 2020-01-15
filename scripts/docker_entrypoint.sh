#!/usr/bin/env bash

nohup bash -c "./scripts/ganache-cli.sh &"
echo "Waiting for ganache-cli to initialize"
sleep 5
npm run server:setup
npm run server:prod
