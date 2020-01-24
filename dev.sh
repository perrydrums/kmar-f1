#!/bin/zsh

for d in ./src/*/dev/; do
    cd "$d" || exit
    tsc -w &
    cd ../../..
done

node app.js
