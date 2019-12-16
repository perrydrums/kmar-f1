#!/bin/zsh

for d in ./src/*/dev/; do
    cd "$d" || exit
    echo "Building $d ..."
    tsc
    cd ../../..
done

echo "Build complete!"
