/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Canvas class handles everything related to creating the `canvas` DOM tag that Phaser will use,
 * including styles, offset and aspect ratio.
 *
 * @class Phaser.Canvas
 * @static
 */
Phaser.Canvas = {

    /**
     * Creates a `canvas` DOM element. The element is not automatically added to the document.
     *
     * @method Phaser.Canvas.create
     * @param {object} parent - The object that will own the canvas that is created.
     * @param {number} [width=256] - The width of the canvas element.
     * @param {number} [height=256] - The height of the canvas element..
     * @param {string} [id=(none)] - If specified, and not the empty string, this will be set as the ID of the canvas element. Otherwise no ID will be set.
     * @param {boolean} [skipPool=false] - If `true` the canvas will not be placed in the CanvasPool global.
     * @return {HTMLCanvasElement} The newly created canvas element.
     */
    create: function (parent, width, height, id, skipPool)
    {
        width = width || 256;
        height = height || 256;

        var canvas = (skipPool) ? document.createElement('canvas') : Phaser.CanvasPool.create(parent, width, height);

        if (typeof id === 'string' && id !== '')
        {
            canvas.id = id;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.style.display = 'block';

        return canvas;
    },

    /**
     * Sets `canvas` dimensions to 1.
     *
     * @method Phaser.Canvas.dispose
     * @param {HTMLCanvasElement} canvas - The canvas to be disposed of.
     * @return {HTMLCanvasElement} The canvas.
     */
    dispose: function (canvas)
    {
        canvas.width = 1;
        canvas.height = 1;

        return canvas;
    },

    /**
     * Sets the background color behind the canvas. This changes the canvas style property.
     *
     * @method Phaser.Canvas.setBackgroundColor
     * @param {HTMLCanvasElement} canvas - The canvas to set the background color on.
     * @param {string} [color='rgb(0,0,0)'] - The color to set. Can be in the format 'rgb(r,g,b)', or '#RRGGBB' or any valid CSS color.
     * @return {HTMLCanvasElement} Returns the source canvas.
     */
    setBackgroundColor: function (canvas, color)
    {
        color = color || 'rgb(0,0,0)';

        canvas.style.backgroundColor = color;

        return canvas;
    },

    /**
     * Sets the touch-action property on the canvas style. Can be used to disable default browser touch actions.
     *
     * @method Phaser.Canvas.setTouchAction
     * @param {HTMLCanvasElement} canvas - The canvas to set the touch action on.
     * @param {string} [value] - The touch action to set. Defaults to 'none'.
     * @return {HTMLCanvasElement} The source canvas.
     */
    setTouchAction: function (canvas, value)
    {
        value = value || 'none';

        canvas.style.msTouchAction = value;
        canvas.style['ms-touch-action'] = value;
        canvas.style['touch-action'] = value;

        return canvas;
    },

    /**
     * Sets the user-select property on the canvas style. Can be used to disable default browser selection actions.
     *
     * @method Phaser.Canvas.setUserSelect
     * @param {HTMLCanvasElement} canvas - The canvas to set the touch action on.
     * @param {string} [value] - The touch action to set. Defaults to 'none'.
     * @return {HTMLCanvasElement} The source canvas.
     */
    setUserSelect: function (canvas, value)
    {
        value = value || 'none';

        canvas.style['-webkit-touch-callout'] = value;
        canvas.style['-webkit-user-select'] = value;
        canvas.style['-khtml-user-select'] = value;
        canvas.style['-moz-user-select'] = value;
        canvas.style['-ms-user-select'] = value;
        canvas.style['user-select'] = value;
        canvas.style['-webkit-tap-highlight-color'] = 'rgba(0, 0, 0, 0)';

        return canvas;
    },

    /**
     * Adds the given canvas element to the DOM. The canvas will be added as a child of the given parent.
     * If no parent is given it will be added as a child of the document.body.
     *
     * @method Phaser.Canvas.addToDOM
     * @param {HTMLCanvasElement} canvas - The canvas to be added to the DOM.
     * @param {string|HTMLElement} parent - The DOM element to add the canvas to.
     * @param {boolean} [overflowHidden=true] - If set to true it will add the overflow='hidden' style to the parent DOM element.
     * @return {HTMLCanvasElement} Returns the source canvas.
     */
    addToDOM: function (canvas, parent, overflowHidden)
    {
        var target;

        if (overflowHidden === undefined) { overflowHidden = true; }

        if (parent)
        {
            if (typeof parent === 'string')
            {
                // hopefully an element ID
                target = document.getElementById(parent);
            }
            else if (typeof parent === 'object' && parent.nodeType === 1)
            {
                // quick test for a HTMLelement
                target = parent;
            }
        }

        // Fallback, covers an invalid ID and a non HTMLelement object
        if (!target)
        {
            target = document.body;
        }

        if (overflowHidden && target.style)
        {
            target.style.overflow = 'hidden';
        }

        target.appendChild(canvas);

        return canvas;
    },

    /**
     * Removes the given canvas element from the DOM.
     *
     * @method Phaser.Canvas.removeFromDOM
     * @param {HTMLCanvasElement} canvas - The canvas to be removed from the DOM.
     */
    removeFromDOM: function (canvas)
    {
        if (canvas.parentNode)
        {
            canvas.parentNode.removeChild(canvas);
        }
    },

    /**
     * Sets the transform of the given canvas to the matrix values provided.
     *
     * @method Phaser.Canvas.setTransform
     * @param {CanvasRenderingContext2D} context - The context to set the transform on.
     * @param {number} translateX - The value to translate horizontally by.
     * @param {number} translateY - The value to translate vertically by.
     * @param {number} scaleX - The value to scale horizontally by.
     * @param {number} scaleY - The value to scale vertically by.
     * @param {number} skewX - The value to skew horizontaly by.
     * @param {number} skewY - The value to skew vertically by.
     * @return {CanvasRenderingContext2D} Returns the source context.
     */
    setTransform: function (context, translateX, translateY, scaleX, scaleY, skewX, skewY)
    {
        context.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);

        return context;
    },

    /**
     * Sets the Image Smoothing property on the given context. Set to false to disable image smoothing.
     * By default browsers have image smoothing enabled, which isn't always what you visually want, especially
     * when using pixel art in a game. Note that this sets the property on the context itself, so that any image
     * drawn to the context will be affected. This sets the property across all current browsers but support is
     * patchy on earlier browsers, especially on mobile.
     *
     * @method Phaser.Canvas.setSmoothingEnabled
     * @param {CanvasRenderingContext2D} context - The context to enable or disable the image smoothing on.
     * @param {boolean} value - If set to true it will enable image smoothing, false will disable it.
     * @return {CanvasRenderingContext2D} Returns the source context.
     */
    setSmoothingEnabled: function (context, value)
    {
        var s = Phaser.Canvas.getSmoothingPrefix(context);

        if (s)
        {
            context[s] = value;
        }

        return context;
    },

    /**
     * Gets the Smoothing Enabled vendor prefix being used on the given context, or null if not set.
     *
     * @method Phaser.Canvas.getSmoothingPrefix
     * @param {CanvasRenderingContext2D} context - The context to enable or disable the image smoothing on.
     * @return {string|null} Returns the smoothingEnabled vendor prefix, or null if not set on the context.
     */
    getSmoothingPrefix: function (context)
    {
        var vendor = [ 'i', 'webkitI', 'msI', 'mozI', 'oI' ];

        for (var prefix in vendor)
        {
            var s = vendor[prefix] + 'mageSmoothingEnabled';

            if (s in context)
            {
                return s;
            }
        }

        return null;
    },

    /**
     * Returns `true` if the given context has image smoothing enabled, otherwise returns `false`.
     *
     * @method Phaser.Canvas.getSmoothingEnabled
     * @param {CanvasRenderingContext2D} context - The context to check for smoothing on.
     * @return {boolean} True if the given context has image smoothing enabled, otherwise false.
     */
    getSmoothingEnabled: function (context)
    {
        var s = Phaser.Canvas.getSmoothingPrefix(context);

        if (s)
        {
            return context[s];
        }
    },

    /**
     * Sets the CSS image-rendering property to `pixelated` or `crisp-edges`.
     * This can remove blurring when the game canvas is scaled up.
     * In some browsers this has no visible effect in WEBGL mode.
     * Note that if this doesn't given the desired result then see the setSmoothingEnabled.
     *
     * @method Phaser.Canvas.setImageRenderingCrisp
     * @param {HTMLCanvasElement} canvas - The canvas to set image-rendering crisp on.
     * @return {HTMLCanvasElement} Returns the source canvas.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
     * @see https://caniuse.com/#feat=css-crisp-edges
     */
    setImageRenderingCrisp: function (canvas)
    {
        var types = [ '-webkit-optimize-contrast', '-moz-crisp-edges', 'crisp-edges', 'pixelated' ];

        for (var i = 0; i < types.length; i++)
        {
            canvas.style['image-rendering'] = types[i];
        }

        canvas.style.msInterpolationMode = 'nearest-neighbor';

        return canvas;
    },

    /**
     * Sets the CSS image-rendering property on the given canvas to be 'bicubic' (aka 'auto').
     * Note that if this doesn't given the desired result then see the CanvasUtils.setSmoothingEnabled method.
     *
     * @method Phaser.Canvas.setImageRenderingBicubic
     * @param {HTMLCanvasElement} canvas The canvas to set image-rendering bicubic on.
     * @return {HTMLCanvasElement} Returns the source canvas.
     */
    setImageRenderingBicubic: function (canvas)
    {
        canvas.style['image-rendering'] = 'auto';
        canvas.style.msInterpolationMode = 'bicubic';

        return canvas;
    }

};
