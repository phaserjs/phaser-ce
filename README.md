# Phaser CE (Community Edition)

<img src="https://phaser.io/images/github/arcade-cab.png" align="right" width="400" height="617">

Phaser CE is a fast, free, and fun open source HTML5 game framework. It uses a custom build of [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering, and supports desktop and mobile web browsers. Games can be compiled to iOS, Android and native desktop apps via 3rd party tools. You can use JavaScript or TypeScript for development.

Phaser CE is based on Phaser v2.6.2 by Photon Storm. [Phaser](http://phaser.io/) is the current and fully maintained version.

The [current Phaser CE release is 2.20.1](https://github.com/phaserjs/phaser-ce/releases/tag/v2.20.1).

- [Phaser CE API Documentation](https://phaserjs.github.io/phaser-ce/)
- [Phaser 2 Examples](https://samme.github.io/phaser-examples-mirror/) ([source code][examples])
- [New Phaser CE examples](https://codepen.io/collection/AMbZgY/)
- [Phaser 2/CE Forum][forum]
- [Phaser on Discord](http://phaser.io/community/discord)
- [Phaser plugins on GitHub](https://github.com/search?q=topic%3Aphaser-plugin&type=Repositories)
- [Phaser plugins on NPM](https://www.npmjs.com/browse/keyword/phaser-plugin)

If you need API documentation for a [previous version](https://github.com/phaserjs/phaser-ce/releases), download the source code, e.g., <https://github.com/phaserjs/phaser-ce/releases/tag/v2.6.2>, unzip, and open `docs/index.html`.

## Contents

- [Requirements](#requirements)
- [Download Phaser](#download)
- [Getting Started](#getting-started)
- [Building Phaser](#building-phaser)
- [Phaser World Newsletter](#newsletter)
- [Contributing](#contributing)
- [Change Log](#change-log)

<a name="requirements"></a>

## Requirements

Phaser CE requires a web browser that supports the [canvas tag](https://caniuse.com/#feat=canvas). This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera on desktop. iOS Safari, Android Browser and Chrome for Android are supported on mobile.

While Phaser CE does its best to ensure a consistent cross-platform experience, always be aware of browser and device limitations. This is especially important with memory and GPU limitations on mobile, and legacy browser HTML5 compatibility.

### IE9

If you need to support IE9 / Android 2.x _and_ use P2 physics, then you must use the polyfills in the [resources/IE9 Polyfill folder](https://github.com/photonstorm/phaser-ce/tree/master/resources/IE9%20Polyfill). If you don't use P2 (or don't care about IE9!) you can skip this.

### JavaScript and TypeScript

Phaser CE is developed in ES5 JavaScript. We've made no assumptions about how you like to code, and were careful not to impose a strict structure upon you. You won't find Phaser CE split into modules, requiring a build step, or making you use a class / inheritance OOP approach. That doesn't mean you can't do so, it just means we don't _force_ you to. It's your choice.

If you code with [TypeScript](https://www.typescriptlang.org/) there are comprehensive definition files in the [typescript folder](https://github.com/phaserjs/phaser-ce/tree/master/typescript). They are for TypeScript 1.4+.

<a name="download"></a>

## Download Phaser CE

Phaser CE is [hosted on Github][phaser]. There are a number of ways to download it:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or with the Github [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip][get-zip] or [tar.gz][get-tgz]
* Download just the build files: [phaser.js][get-js] and [phaser.min.js][get-minjs]
* Checkout with [svn][clone-svn]

### NPM

Install via [npm](https://www.npmjs.com):

```bash
npm install phaser-ce
```

Please see additional steps for [Browserify/CommonJS](#browserify) and [Webpack](#webpack).

### CDN

[Phaser CE is on jsDelivr](http://www.jsdelivr.com/projects/phaser-ce). Include the following in your html:

```html
<script src="https://cdn.jsdelivr.net/npm/phaser-ce@2.20.1/build/phaser.js"></script>
```

or the minified version:

```html
<script src="https://cdn.jsdelivr.net/npm/phaser-ce@2.20.1"></script>
```

[Custom builds](https://cdn.jsdelivr.net/npm/phaser-ce@2.20.1/build/custom/) are available too, e.g.,

```html
<script src="https://cdn.jsdelivr.net/npm/phaser-ce@2.20.1/build/custom/phaser-arcade-physics.js"></script>
```

<a name="getting-started"></a>

## Getting Started

Our [Getting Started Guide](https://phaser.io/tutorials/getting-started-phaser2/) will get you up to speed quickly: from [setting up a web server](https://phaser.io/tutorials/getting-started/part2) to picking an editor/IDE. After that read our [Making your first Game](https://phaser.io/tutorials/making-your-first-phaser-2-game/) tutorial. Please work through this, **no matter what your development experience**, to learn how Phaser CE approaches things.

Using **TypeScript**? See Phaser CE's [TypeScript definitions](https://github.com/photonstorm/phaser-ce/tree/master/typescript) and the [Using Phaser with TypeScript](https://phaser.io/tutorials/how-to-use-phaser-with-typescript).

### Source Code Examples

Currently there are over [700 Phaser 2 examples](https://github.com/samme/phaser-examples-mirror), with the full source code and assets available.

### Web Templates

If you'd like to try coding in Phaser CE right now, with nothing more than your web browser, open up the [Phaser CE Game Template](https://codepen.io/pen?template=vyKJvw) or [ES6 Template](https://codepen.io/pen?template=pRGPKG).

### http-server

For most development, you'll need to run a local web server. If you already have [node](https://nodejs.org), it's as easy as:

```sh
npm install -g http-server
```

Then from your project:

```sh
http-server . -c-1 -o
```

There are [many other options](https://gist.github.com/willurd/5720255 "List of http static server one-liners") that you may already have installed as well.

<a name="browserify"></a>

### Browserify / CommonJS

Phaser CE (and Phaser 2, before it) were not written to be modular. Everything exists under one single global namespace, and you cannot `require` selected parts of it into your builds. It expects 3 global vars to exist in order to work properly: `Phaser`, `PIXI` and `p2`. The following is one way of doing this:

```javascript
window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
```

If you [build a custom version of Phaser CE](#building-phaser) it will split the 3 core libs out into their own files, allowing you to require them as above.

Full module-based development is available in Phaser v3.

<a name="webpack"></a>

### Webpack

As with browserify, use the **pixi**, **p2**, and **phaser-split** modules in [build/custom](https://github.com/phaserjs/phaser-ce/tree/master/build/custom). You can then use [expose-loader](https://webpack.js.org/loaders/expose-loader/) to expose them as `PIXI`, `p2`, and `Phaser`.

See [our webpack project template](https://github.com/phaserjs/phaser-ce/tree/master/resources/Project%20Templates/Webpack) or [lean/phaser-es6-webpack](https://github.com/lean/phaser-es6-webpack) for a sample configuration.

### Ionic

See [Ionic](https://github.com/phaserjs/phaser-ce/tree/master/resources/Ionic.md).

### Game Mechanic Explorer

The [Game Mechanic Explorer](https://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

<a name="building-phaser"></a>

## Building Phaser CE

Phaser CE is provided ready compiled in the `build` folder of the repository. There are both plain and minified versions. The plain version is for use during development, and the minified version for production. You can also create your own builds.

### Custom Builds

Phaser CE includes a grunt based build system, which allows you to strip out  features you may not require, saving hundreds of KB in the process. Don't use any Sound in your game? Then exclude the entire sound system. Don't need Keyboard support? That can be excluded too.

As a result of this work the minimum build size of Phaser CE is now just 80KB minified and gzipped.

1. Run `npm install`
2. Run `grunt custom` to see the module and argument lists (it will error; that's OK)
3. Run, e.g., `grunt custom --exclude=sound,keyboard` and then find the built script in [dist](dist/).

See the [Creating a Custom Phaser Build](https://phaser.io/tutorials/creating-custom-phaser-builds) tutorial for details.

### Building from source

Should you wish to build Phaser CE from source you can take advantage of the provided [Grunt](https://gruntjs.com/) scripts. Ensure you have the required packages by running `npm install` first.

Run `grunt` to perform a default build to the `dist` folder.

### Packaging a new release

Releases of new versions of Phaser CE are under the community's control. If you feel there are sufficient fixes, or important ones that warrant a new version release, then please do the following:

1. Make sure the version number is increased, in line with semver policies, in the following files:
    - `package.json`
    - `src/Phaser.js`

2. Add details of the new version to `CHANGELOG.md`. This should include a summary of changes made in the version. You can usually obtain this from the commit / PR history. It's nice to credit who made the changes by linking to their GitHub user ID, but isn't a requirement.

3. Update any relevant version numbers in `README.md`.

4. Run `npm run check-version`. Verify all the version numbers match except in `build/phaser.js`, which isn't rebuilt yet.

5. From the root repo folder, run `grunt eslint` and make sure there are no errors. If there are, please fix them, or request that the original author of the code does so.

6. Once ESLint passes run `grunt release`, sit back, and wait. It will build all of the versions of Phaser CE required, update the doc files, TypeScript defs and lots more.

7. Run `npm run check-version` and verify all the version numbers match.

8. When finished, commit all of the new files and include a clear message in your commit saying you want this release pushed to npm: _Phaser CE Version 2.X.X. Please publish to npm @photonstorm_. I'll see it, and then publish as soon as I can (often the same day).

<a name="newsletter"></a>

## Weekly Newsletter

Every Monday we publish the [Phaser World](https://phaser.world) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. It also contains our weekly Development Progress updates. If you want to know what we're working on, this is the newsletter to read!

<a name="contributing"></a>

# Contributing

The [Contributors Guide][contribute] contains full details on how to help with Phaser CE development. The main points are:

- Found a bug? Report it on [GitHub Issues][issues] and include a code sample.
- Before submitting a Pull Request run `npm run test` and fix any errors.
- Before contributing read the [code of conduct](https://github.com/phaserjs/phaser-ce/blob/master/CODE_OF_CONDUCT.md).

Written something cool in Phaser? Please tell us about it in the [forum][forum], or email support@phaser.io

<a name="change-log"></a>

# Change Log

See [Change Log](CHANGELOG.md).

# License

Phaser CE is released under the [MIT License](https://opensource.org/licenses/MIT).

# Created by

Phaser 2 was originally a [Photon Storm](http://www.photonstorm.com) production, but is now maintained by the community. Phaser 3 is maintained by Phaser Studio Inc.

![storm](https://www.phaser.io/images/github/photonstorm-x2.png)

The Phaser logo and characters are © 2024 Photon Storm Limited. All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[get-js]: https://github.com/phaserjs/phaser-ce/releases/download/v2.20.1/phaser.js
[get-minjs]: https://github.com/phaserjs/phaser-ce/releases/download/v2.20.1/phaser.min.js
[get-zip]: https://github.com/phaserjs/phaser-ce/archive/v2.20.1.zip
[get-tgz]: https://github.com/phaserjs/phaser-ce/archive/v2.20.1.tar.gz
[clone-http]: https://github.com/phaserjs/phaser-ce.git
[clone-ssh]: ssh://git@github.com:phaserjs/phaser-ce.git
[clone-svn]: https://github.com/phaserjs/phaser-ce
[clone-ghwin]: github-windows://openRepo/https://github.com/phaserjs/phaser-ce
[clone-ghmac]: github-mac://openRepo/https://github.com/phaserjs/phaser-ce
[phaser]: https://github.com/phaserjs/phaser-ce
[issues]: https://github.com/phaserjs/phaser-ce/issues
[examples]: https://github.com/samme/phaser-examples-mirror
[contribute]: https://github.com/phaserjs/phaser-ce/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/c/phaser2/6
