#!/bin/sh

echo "npm...";
npm prune;
npm install;

echo "bower...";
bower prune;
bower install;

echo "gulp...";
gulp clean;
gulp build;

