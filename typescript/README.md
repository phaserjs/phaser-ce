# TypeScript Definitions

Since [v2.8.2](https://github.com/photonstorm/phaser-ce/releases/tag/v2.8.2) Phaser's definitions will likely be found automatically when Phaser is installed with npm.

If necessary, reference [phaser.d.ts](./phaser.d.ts) (or [phaser.comments.d.ts](./phaser.comments.d.ts)) in your project. `phaser.d.ts`, `pixi.d.ts`, `p2.d.ts` must remain siblings in the same directory.

## Using [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

```json
{
  "files": [
    "PATH/TO/phaser.d.ts"
  ]
}
```

For npm-installed Phaser, the path will be `./node_modules/phaser-ce/typescript/phaser.d.ts`.

## Using Typings

You can use [typings](https://www.npmjs.com/package/typings), the TypeScript Definition Manager, to include Phaser's typescript definitions in your project:

- Make sure that typings is installed in your system: `npm install -g typings`
- Install phaser typescript definitions as a global dependency:

```bash
typings install github:photonstorm/phaser-ce/typescript/typings.json -GD
```

This will make phaser typescript definitions available for your compiler so that there is no need to reference them from your source files.
For more information, check [the official typings site](https://github.com/typings/typings).

## Contributing

If you find any mistakes in these definitions or you feel they can be improved in any way, please [open an issue](https://github.com/photonstorm/phaser-ce/issues) or [make a pull request](https://github.com/photonstorm/phaser-ce/pulls).

## Note

`Creature` defs are not yet provided.

The Box2D defs come from https://github.com/SBCGames/Phaser-Box2D-Typescript-defs.
