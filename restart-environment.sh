#!/usr/bin/env bash

docker-compose down

rm -rf ./config
rm -rf ./data
rm -rf ./init

docker-compose up -d
