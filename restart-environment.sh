#!/usr/bin/env bash

docker-compose -f docker-compose-debug.yml down

rm -rf ./config
rm -rf ./data
rm -rf ./init

docker-compose  -f docker-compose-debug.yml up -d
