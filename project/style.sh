#!/bin/sh

isort --gitignore .
black -l 79 --exclude=node_modules/* .
flake8 --exclude=node_modules/* .
radon cc -s -nc --exclude=node_modules/* .
xenon -b B -m B -a A --exclude=node_modules/* .

npx prettier ./assets/js/ --write
npx prettier ./assets/modules/ --write
npx prettier ./assets/css/ --write