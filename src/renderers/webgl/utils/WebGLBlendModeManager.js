/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLBlendModeManager
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
Phaser.WebGLBlendModeManager = function()
{
    /**
     * @property currentBlendMode
     * @type Number
     */
    this.currentBlendMode = 99999;
};

Phaser.WebGLBlendModeManager.prototype.constructor = Phaser.WebGLBlendModeManager;

/**
 * Sets the WebGL Context.
 *
 * @method setContext
 * @param gl {WebGLContext} the current WebGL drawing context
 */
Phaser.WebGLBlendModeManager.prototype.setContext = function(gl)
{
    this.gl = gl;
};

/**
* Sets-up the given blendMode from WebGL's point of view.
* 
* @method setBlendMode 
* @param blendMode {Number} the blendMode, should be a Pixi const, such as Phaser.BlendModes.ADD
*/
Phaser.WebGLBlendModeManager.prototype.setBlendMode = function(blendMode)
{
    if(this.currentBlendMode === blendMode)return false;

    this.currentBlendMode = blendMode;
    
    var blendModeWebGL = Phaser.blendModesWebGL[this.currentBlendMode];

    if (blendModeWebGL)
    {
        this.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
    }
    
    return true;
};

/**
* Destroys this object.
* 
* @method destroy
*/
Phaser.WebGLBlendModeManager.prototype.destroy = function()
{
    this.gl = null;
};
