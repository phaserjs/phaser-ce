
# Print the version of Phaser from various sources to verify they are all in sync.

grep -H 'VERSION:' src/Phaser.js build/phaser.js
grep -H '\"version\":' package.json
grep -H -m1 '## Version ' CHANGELOG.md
grep -H 'phaser-ce/releases/tag/v' README.md
