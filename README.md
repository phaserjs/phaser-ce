# Phaser CE (Community Edition)

<img src="https://phaser.io/images/github/arcade-cab.png" align="right" width="400" height="617">

Phaser CE is a fast, free, and fun open source HTML5 game framework. It uses a custom build of [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering, and supports desktop and mobile web browsers. Games can be compiled to iOS, Android and native desktop apps via 3rd party tools. You can use JavaScript or TypeScript for development.

Phaser CE is based on Phaser v2.6.2 by [Photon Storm](http://www.photonstorm.com). [Phaser v3](http://phaser.io/phaser3) and [Phaser v4](https://github.com/phaserjs/phaser4) are in active development.

The [current Phaser CE release is 2.20.0](https://github.com/photonstorm/phaser-ce/releases/tag/v2.20.0).

- **Visit:** The [Phaser website](http://phaser.io) and follow on [Twitter](https://twitter.com/photonstorm) (#[phaserjs](https://twitter.com/hashtag/phaserjs))
- **Learn:** [API Docs](https://photonstorm.github.io/phaser-ce/), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)
- **Code:** 700+ [Examples](https://samme.github.io/phaser-examples-mirror/ "Phaser CE Examples") ([source][examples]), new [Phaser CE examples](https://codepen.io/collection/AMbZgY/)
- **Read:** Weekly [Phaser World](#newsletter) Newsletter
- **Chat:** [Discord](http://phaser.io/community/discord)
- **Extend:** Phaser plugins - [Shop](http://phaser.io/shop/plugins), [GitHub](https://github.com/search?q=topic%3Aphaser-plugin&type=Repositories "Phaser plugins on GitHub"), [NPM](https://www.npmjs.com/browse/keyword/phaser-plugin "Phaser plugins on NPM")
- **Be awesome:** [Support](#support) the future of Phaser

Grab the source and join in the fun!

## Contents

- [Games made with Phaser](#games)
- [Requirements](#requirements)
- [Download Phaser](#download)
- [Getting Started](#getting-started)
- [Building Phaser](#building-phaser)
- [Support Phaser](#support)
- [Phaser World Newsletter](#newsletter)
- [Contributing](#contributing)
- [Change Log](#change-log)

<a name="games"></a>

## Made With Phaser

Thousands of [games](http://phaser.io/news/category/game) have been made in Phaser. From game jam entries, to titles by some of the largest entertainment brands in the world. You can find [hundreds more on our web site](http://phaser.io/games).

We add [new games](http://phaser.io/news/category/game) to the Phaser site weekly, so be sure to send us yours when it's finished!

<a name="requirements"></a>

## Requirements

Phaser CE requires a web browser that supports the [canvas tag](http://caniuse.com/#feat=canvas). This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera on desktop. iOS Safari, Android Browser and Chrome for Android are supported on mobile.

While Phaser CE does its best to ensure a consistent cross-platform experience, always be aware of browser and device limitations. This is especially important with memory and GPU limitations on mobile, and legacy browser HTML5 compatibility.

### IE9

If you need to support IE9 / Android 2.x _and_ use P2 physics, then you must use the polyfills in the [resources/IE9 Polyfill folder](https://github.com/photonstorm/phaser-ce/tree/master/resources/IE9%20Polyfill). If you don't use P2 (or don't care about IE9!) you can skip this.

### JavaScript and TypeScript

Phaser CE is developed in ES5 JavaScript. We've made no assumptions about how you like to code, and were careful not to impose a strict structure upon you. You won't find Phaser CE split into modules, requiring a build step, or making you use a class / inheritance OOP approach. That doesn't mean you can't do so, it just means we don't _force_ you to. It's your choice.

If you code with [TypeScript](http://www.typescriptlang.org/) there are comprehensive definition files in the [typescript folder](https://github.com/photonstorm/phaser-ce/tree/master/typescript). They are for TypeScript 1.4+.

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
<script src="https://cdn.jsdelivr.net/npm/phaser-ce@2.20.0/build/phaser.js"></script>
```

or the minified version:

```html
<script src="https://cdn.jsdelivr.net/npm/phaser-ce@2.20.0"></script>
```

[Custom builds](https://cdn.jsdelivr.net/npm/phaser-ce@2.20.0/build/custom/) are available too, e.g.,

```html
<script src="https://cdn.jsdelivr.net/npm/phaser-ce@2.20.0/build/custom/phaser-arcade-physics.js"></script>
```

<a name="getting-started"></a>

## Getting Started

Our [Getting Started Guide](http://phaser.io/tutorials/getting-started) will get you up to speed quickly: from [setting up a web server](https://phaser.io/tutorials/getting-started/part2) to picking an editor/IDE. After that read our [Making your first Game](http://phaser.io/tutorials/making-your-first-phaser-game) tutorial. Please work through this, **no matter what your development experience**, to learn how Phaser CE approaches things.

Using **TypeScript**? See Phaser CE's [TypeScript definitions](https://github.com/photonstorm/phaser-ce/tree/master/typescript) and the [Using Phaser with TypeScript](https://phaser.io/tutorials/how-to-use-phaser-with-typescript).

Prefer **videos**? Zenva have an excellent [Phaser video course](https://academy.zenva.com/product/the-complete-mobile-game-development-course-platinum-edition/?a=13), with hours of great material.

### Source Code Examples

Currently there are over 700 Phaser 2 examples, with the full source code and assets available.

Browse [Phaser Examples](http://phaser.io/examples) or clone [phaser-examples-mirror](https://github.com/samme/phaser-examples-mirror) and eat your heart out!

### Web Templates

If you'd like to try coding in Phaser CE right now, with nothing more than your web browser, open up the [Phaser CE Game Template](https://codepen.io/pen?template=vyKJvw). There are [CoffeeScript](https://codepen.io/pen?template=OWxELE) and [ES6](https://codepen.io/pen?template=pRGPKG) variants too.

### http-server

For most development, you'll need to run a local web server. If you already have [node](https://nodejs.org), it's as easy as:

```bash
npm install -g http-server
```

Then from your project:

```bash
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

As with browserify, use the **pixi**, **p2**, and **phaser-split** modules in [build/custom](https://github.com/photonstorm/phaser-ce/tree/master/build/custom). You can then use [expose-loader](https://webpack.js.org/loaders/expose-loader/) to expose them as `PIXI`, `p2`, and `Phaser`.

See [our webpack project template](https://github.com/photonstorm/phaser-ce/tree/master/resources/Project%20Templates/Webpack) or [lean/phaser-es6-webpack](https://github.com/lean/phaser-es6-webpack) for a sample configuration.

### Ionic

See [Ionic](https://github.com/photonstorm/phaser-ce/tree/master/resources/Ionic.md).

### Interphase

[Interphase](http://phaser.io/interphase) is a programming book for Phaser developers of all skill levels.

With 400 pages of content you'll find detailed articles, game development "Making Of" guides and tutorials.

As well as the [book](http://phaser.io/interphase) you get all the source code, graphics and assets to go with it, and lots of extras too.

### Phaser Editor - A complete Phaser Editor

[Phaser Editor](http://phaser.io/shop/apps/phaser-editor) is a brand new Eclipse based editor that offers lots of built-in tools specifically for Phaser developers. Handy features include Smart code auto-completion, built-in web server, documentation search, asset management, texture atlas creator, audio sprite creator, asset previews and lots more.

### Game Mechanic Explorer

The [Game Mechanic Explorer](https://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

### Mighty Editor - Visual Game Editor

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

<a name="building-phaser"></a>

## Building Phaser CE

Phaser CE is provided ready compiled in the `build` folder of the repository. There are both plain and minified versions. The plain version is for use during development, and the minified version for production. You can also create your own builds.

### Custom Builds

Phaser CE includes a grunt based build system, which allows you to strip out  features you may not require, saving hundreds of KB in the process. Don't use any Sound in your game? Then exclude the entire sound system. Don't need Keyboard support? That can be excluded too.

As a result of this work the minimum build size of Phaser CE is now just 80KB minified and gzipped.

1. Run `npm install`
2. Run `grunt custom` to see the module and argument lists (it will error; that's OK)
3. Run, e.g., `grunt custom --exclude=sound,keyboard` and then find the built script in [dist](dist/).

See the [Creating a Custom Phaser Build](http://phaser.io/tutorials/creating-custom-phaser-builds) tutorial for details.

### Building from source

Should you wish to build Phaser CE from source you can take advantage of the provided [Grunt](https://gruntjs.com/) scripts. Ensure you have the required packages by running `npm install` first.

Run `grunt` to perform a default build to the `dist` folder.

### Packaging a new release

Releases of new versions of Phaser CE are under the community's control. If you feel there are sufficient fixes, or important ones that warrant a new version release, then please do the following:

1. Make sure the version number is increased, in line with semver policies, in the following files:
    - `package.json`
    - `src/Phaser.js`

2. Make sure that you have added details of the new version to `CHANGELOG.md`. This should include a summary of changes made in the version. You can usually obtain this from the commit / PR history. It's nice to credit who made the changes by linking to their GitHub user ID, but isn't a requirement.

3. From the root repo folder, run `grunt eslint` and make sure there are no errors. If there are, please fix them, or request that the original author of the code does so.

4. Once ESLint passes run `grunt release`, sit back, and wait. It will build all of the versions of Phaser CE required, update the doc files, TypeScript defs and lots more. When finished, commit all of the new files and make sure to include a clear message in your commit saying you want this release pushed to npm. Be sure to tag me when doing this, i.e. 'Phaser CE Version 2.X.X. Please publish to npm @photonstorm' - I'll see it, and then publish as soon as I can (often the same day).

<a name="support"></a>

## Support Phaser

Developing Phaser takes a lot of time, effort, and money. There are monthly running costs; such as the forum and site, which we maintain 100% ad-free. As well as countless hours of development time, community support, and assistance resolving issues. We do this out of our love for Phaser of course, but at the end of the day there are real tangible costs involved.

If you have found Phaser useful in your development life. Or have made income as a result of using it, and are in a position to support us financially, without causing any detriment to yourself, then please do. There are a number of ways:

* A monthly contribution via [Patreon](https://www.patreon.com/photonstorm).
* A [one-off donation](http://phaser.io/community/donate) via PayPal.
* Purchase any of our [plugins or books](http://phaser.io/shop).
* Companies can sponsor a release of Phaser, or an issue of our newsletter.

It all helps cover our running costs, and genuinely contributes towards future development.

If you would like to sponsor Phaser then please [get in touch](mailto:support@phaser.io). We have sponsorship options available on our GitHub repo, web site, and newsletter. All of which receive tens of thousands of eyeballs per day.

<a name="newsletter"></a>

## Weekly Newsletter

Every Friday we publish the [Phaser World](http://phaser.io/community/newsletter) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. It also contains our weekly Development Progress updates. If you want to know what we're working on, this is the newsletter to read!

Previous editions can found on our [Back Issues](http://phaser.io/community/backissues) page.

<a name="contributing"></a>

# Contributing

The [Contributors Guide][contribute] contains full details on how to help with Phaser CE development. The main points are:

- Found a bug? Report it on [GitHub Issues][issues] and include a code sample.
- Before submitting a Pull Request run `npm run test` and fix any errors.
- Before contributing read the [code of conduct](https://github.com/photonstorm/phaser-ce/blob/master/CODE_OF_CONDUCT.md).

Written something cool in Phaser? Please tell us about it in the [forum][forum], or email support@phaser.io

<a name="change-log"></a>

# Change Log

See [Change Log](CHANGELOG.md).

# License

Phaser CE is released under the [MIT License](https://opensource.org/licenses/MIT).

# Created by

Phaser is a [Photon Storm](http://www.photonstorm.com) production.

![storm](https://www.phaser.io/images/github/photonstorm-x2.png)

Created by [Richard Davey](mailto:rich@photonstorm.com). Powered by coffee, anime, pixels and love.

The Phaser logo and characters are © 2017 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)

[get-js]: https://github.com/photonstorm/phaser-ce/releases/download/v2.20.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser-ce/releases/download/v2.20.0/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser-ce/archive/v2.20.0.zip
[get-tgz]: https://github.com/photonstorm/phaser-ce/archive/v2.20.0.tar.gz
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: ssh://git@github.com:photonstorm/phaser.git
[clone-svn]: https://github.com/photonstorm/phaser
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser-ce
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser-ce
[phaser]: https://github.com/photonstorm/phaser-ce
[issues]: https://github.com/photonstorm/phaser-ce/issues
[examples]: https://github.com/samme/phaser-examples-mirror
[contribute]: https://github.com/photonstorm/phaser-ce/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
