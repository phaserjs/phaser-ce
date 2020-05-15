/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The BringToTop Component features quick access to Group and DisplayObject sorting-related methods.
 *
 * @class
 */
Phaser.Component.BringToTop = function () {};

/**
 * Brings this Game Object to the top of its parent's display list (the last position).
 * Visually this means it will render over the top of all other children of the same parent.
 *
 * If this Game Object hasn't been added to a custom Group then this method will bring it to the top of the Game World,
 * because the World is the root Group from which all Game Objects descend.
 *
 * @method
 * @return {PIXI.DisplayObject} This instance.
 */
Phaser.Component.BringToTop.prototype.bringToTop = function ()
{
    if (this.parent && this.parent.bringChildToTop)
    {
        this.parent.bringChildToTop(this);
    }

    return this;
};

/**
 * Sends this Game Object to the bottom of its parent's display list (the first position).
 * Visually this means it will render below all other children of the same parent.
 *
 * If this Game Object hasn't been added to a custom Group then this method will send it to the bottom of the Game World,
 * because the World is the root Group from which all Game Objects descend.
 *
 * @method
 * @return {PIXI.DisplayObject} This instance.
 */
Phaser.Component.BringToTop.prototype.sendToBack = function ()
{
    if (this.parent && this.parent.sendChildToBack)
    {
        this.parent.sendChildToBack(this);
    }

    return this;
};

/**
 * Moves this Game Object up one place in its parent's display list.
 * This call has no effect if the Game Object is already at the top of the display list.
 *
 * If this Game Object hasn't been added to a custom Group then this method will move it one object up within the Game World,
 * because the World is the root Group from which all Game Objects descend.
 *
 * @method
 * @return {PIXI.DisplayObject} This instance.
 */
Phaser.Component.BringToTop.prototype.moveUp = function ()
{
    if (this.parent)
    {
        this.parent.moveUp(this);
    }

    return this;
};

/**
 * Moves this Game Object down one place in its parents display list.
 * This call has no effect if the Game Object is already at the bottom of the display list.
 *
 * If this Game Object hasn't been added to a custom Group then this method will move it one object down within the Game World, 
 * because the World is the root Group from which all Game Objects descend.
 *
 * @method
 * @return {PIXI.DisplayObject} This instance.
 */
Phaser.Component.BringToTop.prototype.moveDown = function ()
{
    if (this.parent)
    {
        this.parent.moveDown(this);
    }

    return this;
};
