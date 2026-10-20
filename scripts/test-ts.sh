# Check the TypeScript definition files for errors.

set -e

tsc --noImplicitAny ./typescript/p2.d.ts ./typescript/phaser.d.ts ./typescript/pixi.d.ts;
tsc --noImplicitAny ./typescript/phaser.comments.d.ts ./typescript/pixi.comments.d.ts
