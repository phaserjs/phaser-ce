/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class WebGLMaskManager
* @constructor
* @private
*/
Phaser.WebGLMaskManager = function()
{
};

Phaser.WebGLMaskManager.prototype.constructor = Phaser.WebGLMaskManager;

/**
* Sets the drawing context to the one given in parameter.
* 
* @method setContext 
* @param gl {WebGLContext} the current WebGL drawing context
*/
Phaser.WebGLMaskManager.prototype.setContext = function(gl)
{
    this.gl = gl;
};

/**
* Applies the Mask and adds it to the current filter stack.
* 
* @method pushMask
* @param maskData {Array}
* @param renderSession {Object}
*/
Phaser.WebGLMaskManager.prototype.pushMask = function(maskData, renderSession)
{
    var gl = renderSession.gl;

    if (maskData.dirty)
    {
        Phaser.WebGLGraphics.updateGraphics(maskData, gl);
    }

    if (maskData._webGL[gl.id] === undefined || maskData._webGL[gl.id].data === undefined || maskData._webGL[gl.id].data.length === 0)
    {
        return;
    }

    renderSession.stencilManager.pushStencil(maskData, maskData._webGL[gl.id].data[0], renderSession);
};

/**
* Removes the last filter from the filter stack and doesn't return it.
* 
* @method popMask
* @param maskData {Array}
* @param renderSession {Object} an object containing all the useful parameters
*/
Phaser.WebGLMaskManager.prototype.popMask = function(maskData, renderSession)
{
    var gl = this.gl;

    if (maskData._webGL[gl.id] === undefined || maskData._webGL[gl.id].data === undefined || maskData._webGL[gl.id].data.length === 0)
    {
        return;
    }

    renderSession.stencilManager.popStencil(maskData, maskData._webGL[gl.id].data[0], renderSession);

};

/**
* Destroys the mask stack.
* 
* @method destroy
*/
Phaser.WebGLMaskManager.prototype.destroy = function()
{
    this.gl = null;
};
