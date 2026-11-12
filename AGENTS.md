# AGENTS.md

Welcome, agents.

## Project overview

- `src/` is the JavaScript source code. Edit files here, not generated output. Search `src/` rather than the whole repo, because searching the repo also hits `build/`, `docs/`, and `node_modules`, which are full of generated duplicates.
- `build/` contains generated bundles (`phaser.js`, `phaser.min.js`, `custom/`). Do not hand-edit them. Regenerate with Grunt.
- `dist/` is for temporary generated bundles and is untracked.
- `typescript/` holds the TypeScript declaration files. `phaser.d.ts`, `p2.d.ts`, `pixi.d.ts`, `pixi.comments.d.ts`, `box2d.d.ts`, and `phaser_box2d.d.ts` are hand-maintained. `phaser.comments.d.ts` and `pixi.comments.d.ts` are generated at release for authors.
- `filters/` holds shader filter scripts.
- `resources/docstrap-master/template` is the JSDoc HTML template used by the `docs` task (`tasks/jsdoc-conf.json`).
- `resources/jsdoc Export JSON/template` is the JSDoc JSON export template used by the `jsdoc` JSON task (`tasks/jsdocexportjson-conf.json`).
- `tasks/` holds Grunt task configuration and helpers (`tasks/options/`, `tasks/manifests/`, `tasks/jsdoc-plugins/`).
- `scripts/` holds the shell scripts used by `npm test` and build verification.
- `docs/` holds generated JSDoc HTML. Do not hand-edit.
- `src/pixi/` is a vendored fork of Pixi v2 with its own manifests and `Intro.js`/`Outro.js`. It has diverged from upstream, so do not rely on current Pixi docs for it.
- `src/stubs/` holds the replacements used when an optional module is excluded from a custom build (see the `*.stub.json` manifests in `tasks/manifests/`).

## Setup

```sh
npm ci
```

## Build

- `npm run grunt` runs the default task, which is `build`.
- The `build` task compiles all Phaser variants into the temporary `dist/` folder.
- The `dist` task compiles all variants and copies them into `build/`.
- Custom builds: `npm run grunt -- custom --exclude=p2,tilemaps,retrofont`. Run without `--exclude` to list the optional modules.
- Other custom build flags: `--filename`, `--sourcemap true`, `--split true`, `--uglify true`, `--verbose true`.
- Doc tasks: `docs` (JSDoc HTML) and `tsdocs` (TypeScript docs).

## Testing and validation

- `npm test` runs `test-src` (ESLint on `src/`) and then `test-ts` (TypeScript definition checks).
- `npm run test-src` runs `eslint src`.
- `npm run test-ts` runs `scripts/test-ts.sh`, which compiles the `.d.ts` files with `tsc --noImplicitAny`.
- `npm run test-build` runs `scripts/test-build.sh`, which checks syntax of `build/*.js` and `build/custom/*.js` with `node --check`.
- There are no unit tests. Verify runtime behavior by loading a build in a browser.
- Do not claim runtime behavior (rendering, physics, input) is verified unless you ran it in a browser. State what you did not verify.
- CI (`.github/workflows/nodejs.yml`) only runs `npm ci && npm test`. It does not validate `build/` or runtime behavior.
- While iterating, run `npx eslint <file>`. Run `npm test` once at the end, since it also compiles the type definitions.
- Do not run the `dist` task just to verify a change. It overwrites tracked files in `build/`. Use `npm run build-test` instead.

## Waiting in browser tests (Playwright etc.)

Prefer these signals over fixed sleeps, and keep an overall timeout as a backstop. The examples assume the page exposes the game as `window.game`. Register listeners before the event can fire (e.g. in the page's own bootstrap), since signals do not replay.

- Wait for a state to finish creating, then for the next rendered frame, before a screenshot:

  ```js
  await page.evaluate(() => new Promise((resolve) => {
      const rendered = () => game.onPostRender.addOnce(resolve);
      if (game.state.current === 'Menu' && game.state.created) { rendered(); return; }
      const onCreated = (key) => {
          if (key === 'Menu') { game.state.onStateCreated.remove(onCreated); rendered(); }
      };
      game.state.onStateCreated.add(onCreated);
  }));
  ```

- Capture the canvas without `preserveDrawingBuffer` by reading it inside `onPostRender`:

  ```js
  const png = await page.evaluate(() => new Promise((resolve) =>
      game.onPostRender.addOnce(() => resolve(game.canvas.toDataURL('image/png')))));
  ```

- `onPostRender` is not dispatched when `game.lockRender` is true or the renderer is `Phaser.HEADLESS`.
- Detect WebGL context loss with `game.onContextLost` and `game.onContextRestored`.

## Code style

Follow `.eslintrc.json` and `.editorconfig`. Key rules:

- ECMAScript 5 syntax only (`parserOptions.ecmaVersion: 5`). Do not use `let`, `const`, arrow functions, classes, template strings, or modules in `src/`.
- Allman brace style: opening braces go on their own line, for functions, classes, and blocks alike.
- 4-space indentation, LF line endings, UTF-8, final newline, no trailing whitespace.
- No trailing commas.
- Always use braces with `if`, `for`, and `while` (`curly` rule).
- Use `===` and `!==` (`eqeqeq`).
- Prefer `for` loops over `forEach`.
- Array literal brackets have inner spacing: `[ a, b ]`.
- Object and block spacing follows the existing code. Match the surrounding file.
- Keep the `compat/compat` lint rule in mind. Browser features need polyfills listed in `.eslintrc.json` or guards.
- `camelcase` is a warning. Existing code uses some snake_case from external APIs. Do not add new violations.
- Multiline comments must use `/* */`.
- Do not reformat or lint-fix vendored code. `.eslintignore` excludes `src/animation/creature`, `src/physics/p2`, `src/physics/ninja`, `src/plugins`, and the `Intro.js`/`Outro.js` wrappers.

## Conventions

- Each module is wrapped by the `Intro.js` and `Outro.js` UMD wrappers and assembled by Grunt. Do not add a top-level `Phaser` global elsewhere.
- Use the existing namespace and prototype patterns (`Phaser.Foo = function (...) {}`, `Phaser.Foo.prototype = ...`). Match the file you are editing.
- Keep public API changes in sync with the TypeScript definitions in `typescript/phaser.d.ts` and `typescript/pixi.d.ts`.
- Keep JSDoc comments on public members. They feed the generated docs and `phaser.comments.d.ts`. Imitate the tag style (`@property`, `@method`, `@memberof`, etc.) of the current file or a neighbor.
- New files in `src/` must be added to the matching JSON in `tasks/manifests/` (for example `gameobjects.json` or `pixi-main.json`). Otherwise they are not bundled, and nothing warns you.
- For optional modules (`color`, `create`, `debug`, `dom`, `scale`, `sound`, `tilesprite`, `tweens`), check whether the matching stub in `src/stubs/` needs the same change.
- Hot paths (render loops, `update`, the sprite batches) are allocation-sensitive. Avoid creating arrays, objects, or closures per frame, and avoid `forEach` or `bind` there.
- `Phaser` objects extend `PIXI` objects. When changing shared display or renderer code in `src/pixi/`, check both the Canvas and WebGL paths.
- Do not "fix" odd-looking code in the `src/pixi/` renderers without a browser reproduction. Some of it is intentional, such as the batch size thresholds.
- Add a `CHANGELOG.md` entry for user-visible changes. Add `## Unreleased` for in-development changes if it's absent.
- Do not change the version in `package.json` or `bower.json` unless asked. Run `npm run check-version` to compare version strings across `src/Phaser.js`, `build/phaser.js`, `package.json`, `CHANGELOG.md`, and `README.md`.

## Workflow for agents

1. Read the relevant file in `src/` and its neighbors before editing.
2. Before choosing any browser API, check the lowest declared browser support in `package.json` (`browserslist`: currently IE 9 and Android 4.4) and note our polyfills in `.eslintrc.json`. Use only features available there, or add a polyfill or guard.
3. Make the smallest change that solves the problem. Avoid unrelated reformatting.
4. Run `npx eslint src/path.js` (one file) or `npm run test-src` (all) and fix any lint errors you introduced.
5. If you changed public API or types, edit `phaser.d.ts` or `pixi.d.ts` to match the JavaScript source. TypeScript syntax must stay within version 1.4.1. Run `npm run test-ts`.
6. If you need a runnable bundle, run `npm run build-test` and use `dist/phaser-test.js`.
7. Do not edit `docs/`, `build/`, or `dist/` by hand.
8. Do not delete or rewrite `tasks/manifests/` or `tasks/options/` without understanding the build order they define.
9. Before finishing, check that `git status` shows no changes under `build/` or `docs/`. A stray build or docs run is easy to commit by accident.
10. Do not commit, push, or tag unless asked. Releases are handled by maintainers.

## Things to avoid

- Editing generated files in `build/`, `docs/`, or `dist/`.
- Introducing ES6+ syntax into `src/`.
- Adding dependencies to `package.json` without a clear need.
- Changing `overrides` in `package.json` without checking the reason.
- Using newer TypeScript syntax in `typescript/*.d.ts`. Stay within 1.4.1: no `readonly`, `unknown`, or `import type`.
