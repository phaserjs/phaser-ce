/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Smoothed component allows a Game Object to control anti-aliasing of an image based texture.
 *
 * @class
 */
Phaser.Component.Smoothed = function () {};

Phaser.Component.Smoothed.prototype = {

    /**
     * Enable or disable texture smoothing for this Game Object.
     *
     * It only takes effect if the Game Object is using an image based texture.
     *
     * Smoothing is enabled by default.
     *
     * @property {boolean} smoothed
     */
    smoothed: {

        get: function ()
        {
            return !this.texture.baseTexture.scaleMode;
        },

        set: function (value)
        {
            if (value)
            {
                if (this.texture)
                {
                    if (this.texture.baseTexture.scaleMode !== 0)
                    {
                        this.texture.baseTexture.scaleMode = 0;
                        this.texture.baseTexture.dirty();
                    }
                }
            }
            else if (this.texture)
            {
                if (this.texture.baseTexture.scaleMode !== 1)
                {
                    this.texture.baseTexture.scaleMode = 1;
                    this.texture.baseTexture.dirty();
                }
            }
        }

    }

};
