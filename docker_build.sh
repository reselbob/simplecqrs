#!/usr/bin/env bash

# check if the dist directory exists
FILE=./dist
if [ ! -d "$FILE" ]; then
# if not make it
    tsc
fi

# build the image
docker build -t simplecqrs .






