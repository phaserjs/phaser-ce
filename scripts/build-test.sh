set -eu

# Build `dist/phaser-test.js` with annotated Phaser.VERSION.

describe=$(git describe --all --long --dirty | tr -cd 'A-Za-z0-9._/+-')
./node_modules/.bin/grunt test
node --check dist/phaser-test.js
printf "\nPhaser.VERSION += ' (%s)';\n" "$describe" >> dist/phaser-test.js
node --check dist/phaser-test.js
tail -n 1 dist/phaser-test.js
