# Phaser-Webpack

Simple boilerplate project that combines [Phaser](http://phaser.io) with [Webpack](http://webpack.github.io).

## Quick start

```
$ npm install      # install dependencies
$ npm start        # run local server
$ npm run build    # prepare your game for deployment (available on the public folder)
```

## Notes

This is supposed to be a completely barebones project.
There's no extra candy. No ES6, uglyfing your code, compressing your images. Nada.
By providing only the minimum setup you will be able to customize it however you like,
and will make learning the needed steps to integrate webpack and phaser really easy.

## How it works

The only requirement that you need to be aware when using Phaser with Webpack is that Phaser relies on some globally available variables. That can be accomplished in a controlled way by using the `expose-loader` package. We must import the required modules through this loader before importing Phaser. And that's it. No extra configuration is needed.
