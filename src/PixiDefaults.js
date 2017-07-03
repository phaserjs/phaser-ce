/* global Phaser:true */
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

if (Phaser.Texture.emptyTexture === undefined)
{
    Phaser.Texture.emptyTexture = new Phaser.Texture(new Phaser.BaseTexture());
}

if (Phaser.DisplayObject._tempMatrix === undefined)
{
    Phaser.DisplayObject._tempMatrix = new Phaser.Matrix();
}

Phaser.TextureSilentFail = true;

// Required by Particle Storm (as PIXI.canUseNewCanvasBlendModes!)
Phaser.canUseNewCanvasBlendModes = function () {
    return Phaser.Device.canUseMultiply;
};
