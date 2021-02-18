# Ionic

For using Phaser CE with [ionic](https://ionicframework.com), have a look at the [ionic example](https://github.com/photonstorm/phaser-ce/tree/master/resources/Project%20Templates/ionic-example) within project templates. To get phaser-ce working with ionic in general, you've to extend "only" the webpack config used by ionic. To get this done are a few steps are necessary.

1.  Install dependencies [webpack-merge](https://www.npmjs.com/package/webpack-merge) and [expose-loader](https://www.npmjs.com/package/expose-loader):

    ```bash
    npm install webpack-merge expose-loader --save-dev
    ```

2.  Create a [new webpack config](https://github.com/photonstorm/phaser-ce/blob/master/resources/Project%20Templates/ionic-example/webpack.config.js) setting up expose-loader and merging it with the ionic webpack script.

3.  Add own webpack config at package.json, so that ionic will use it:

    ```json
    {
      "config": {
        "ionic_webpack": "./webpack.config.js"
      }
    }
    ```

4.  Import **pixi**, **p2** and **phaser-ce** within your project:

    ```javascript
    import "pixi";
    import "p2";
    import * as Phaser from "phaser-ce";
    ```
