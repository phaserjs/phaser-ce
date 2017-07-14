
var path = require( "path" );
var webpackMerge = require( "webpack-merge" );

// root directory ( useful, when config is within a sub folder )
var rootDir = path.resolve( __dirname );

// import webpack config from ionic
var ionicWebpackConfig = require( path.resolve( rootDir, "node_modules", "@ionic", "app-scripts", "config", "webpack.config" ) );

// necessary for expose loader
var phaserModule = path.join(rootDir, "node_modules", "phaser-ce");
var phaser = path.join(phaserModule, "build", "custom", "phaser-split.js");
var pixi = path.join(phaserModule, "build", "custom", "pixi.js");
var p2 = path.join(phaserModule, "build", "custom", "p2.js");

module.exports = webpackMerge.smart(
  ionicWebpackConfig, {
    resolve: {
      // alias resolve (begin)
      alias: {
        "pixi": pixi,
        "p2": p2,
        "phaser-ce": phaser
      }
      // alias resolve (end)
    },
    module: {
      loaders: [
        // exposing pixi, correct phaser and p2 into global scope (begin)
        {
          test: /pixi\.js/,
          loader: "expose-loader?PIXI"
        }, {
          test: /phaser-split\.js/,
          loader: "expose-loader?Phaser"
        }, {
          test: /p2\.js/,
          loader: "expose-loader?p2"
        }
        // exposing pixi, correct phaser and p2 into global scope (end)
      ]
    }
  }
);
