/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The CanvasRenderer draws the Stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
 * Don't forget to add the CanvasRenderer.view to your DOM or you will not see anything :)
 *
 * @class PIXI.CanvasRenderer
 * @constructor
 * @param game {Phaser.Game} A reference to the Phaser Game instance
 */
PIXI.CanvasRenderer = function (game, config)
{
    /**
     * @property {Phaser.Game} game - A reference to the Phaser Game instance.
     */
    this.game = game;

    /**
     * The renderer type.
     *
     * @property type
     * @type Number
     */
    this.type = Phaser.CANVAS;

    /**
     * The resolution of the canvas.
     *
     * @property resolution
     * @type Number
     */
    this.resolution = game.resolution;

    /**
     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
     * If the Stage is NOT transparent Pixi will use a canvas sized fillRect operation every frame to set the canvas background color.
     * If the Stage is transparent Pixi will use clearRect to clear the canvas every frame.
     * Disable this by setting this to false. For example if your game has a canvas filling background image you often don't need this set.
     *
     * @property clearBeforeRender
     * @type Boolean
     * @default
     */
    this.clearBeforeRender = game.clearBeforeRender;

    /**
     * Whether the render view is transparent
     *
     * @property transparent
     * @type Boolean
     */
    this.transparent = game.transparent;

    /**
     * Whether the render view should be resized automatically
     *
     * @property autoResize
     * @type Boolean
     */
    this.autoResize = false;

    /**
     * The width of the canvas view
     *
     * @property width
     * @type Number
     * @default 800
     */
    this.width = game.width * this.resolution;

    /**
     * The height of the canvas view
     *
     * @property height
     * @type Number
     * @default 600
     */
    this.height = game.height * this.resolution;

    /**
     * The canvas element that everything is drawn to.
     *
     * @property view
     * @type HTMLCanvasElement
     */
    this.view = game.canvas;

    /**
     * The canvas 2d context that everything is drawn with
     * @property context
     * @type CanvasRenderingContext2D
     */
    this.context = this.view.getContext('2d', { alpha: this.transparent });

    if (!this.context)
    {
        throw new Error('Failed to create a Canvas 2d context.');
    }

    /**
     * Boolean flag controlling canvas refresh.
     *
     * @property refresh
     * @type Boolean
     */
    this.refresh = true;

    /**
     * Internal var.
     *
     * @property count
     * @type Number
     */
    this.count = 0;

    /**
     * Instance of a PIXI.CanvasMaskManager, handles masking when using the canvas renderer
     * @property CanvasMaskManager
     * @type CanvasMaskManager
     */
    this.maskManager = new PIXI.CanvasMaskManager();

    /**
     * The render session is just a bunch of parameter used for rendering
     * @property renderSession
     * @type Object
     */
    this.renderSession = {
        context: this.context,
        maskManager: this.maskManager,
        scaleMode: null,
        smoothProperty: Phaser.Canvas.getSmoothingPrefix(this.context),

        /**
         * If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.
         * Handy for crisp pixel art and speed on legacy devices.
         */
        roundPixels: config.roundPixels || false
    };

    this.mapBlendModes();

    this.resize(this.width, this.height);
};

// constructor
PIXI.CanvasRenderer.prototype.constructor = PIXI.CanvasRenderer;

/**
 * Renders the DisplayObjectContainer, usually the Phaser.Stage, to this canvas view.
 *
 * @method PIXI.CanvasRenderer#render
 * @param root {Phaser.Stage|PIXI.DisplayObjectContainer} The root element to be rendered.
 */
PIXI.CanvasRenderer.prototype.render = function (root)
{
    this.context.setTransform(1, 0, 0, 1, 0, 0);

    this.context.globalAlpha = 1;

    this.renderSession.currentBlendMode = 0;
    this.renderSession.shakeX = this.game.camera._shake.x;
    this.renderSession.shakeY = this.game.camera._shake.y;

    this.context.globalCompositeOperation = 'source-over';

    if (navigator.isCocoonJS && this.view.screencanvas)
    {
        this.context.fillStyle = 'black';
        this.context.clear();
    }

    if (this.clearBeforeRender)
    {
        if (this.transparent)
        {
            this.context.clearRect(0, 0, this.width, this.height);
        }
        else if (root._bgColor)
        {
            this.context.fillStyle = root._bgColor.rgba;
            this.context.fillRect(0, 0, this.width , this.height);
        }
    }

    this.renderDisplayObject(root);
};

PIXI.CanvasRenderer.prototype.postRender = function ()
{
    // Nothing to do.
};

PIXI.CanvasRenderer.prototype.setTexturePriority = function ()
{

    /*
     *  Does nothing on Canvas, but here to allow you to simply set
     *  `game.renderer.setTexturePriority()` without having to worry about
     *  running in WebGL or not.
     */

};

/**
 * Removes everything from the renderer and optionally removes the Canvas DOM element.
 *
 * @method PIXI.CanvasRenderer#destroy
 * @param [removeView=true] {boolean} Removes the Canvas element from the DOM.
 */
PIXI.CanvasRenderer.prototype.destroy = function (removeView)
{
    if (removeView === undefined) { removeView = true; }

    if (removeView && this.view.parent)
    {
        this.view.parent.removeChild(this.view);
    }

    this.view = null;
    this.context = null;
    this.maskManager = null;
    this.renderSession = null;
};

/**
 * Resizes the canvas view to the specified width and height
 *
 * @method PIXI.CanvasRenderer#resize
 * @param width {Number} the new width of the canvas view
 * @param height {Number} the new height of the canvas view
 */
PIXI.CanvasRenderer.prototype.resize = function (width, height)
{
    this.width = width * this.resolution;
    this.height = height * this.resolution;

    this.view.width = this.width;
    this.view.height = this.height;

    if (this.autoResize)
    {
        this.view.style.width = this.width / this.resolution + 'px';
        this.view.style.height = this.height / this.resolution + 'px';
    }

    if (this.renderSession.smoothProperty)
    {
        this.context[this.renderSession.smoothProperty] = (this.renderSession.scaleMode === PIXI.scaleModes.LINEAR);
    }
};

/**
 * Renders a display object
 *
 * @method PIXI.CanvasRenderer#renderDisplayObject
 * @param displayObject {DisplayObject} The displayObject to render
 * @param context {CanvasRenderingContext2D} the context 2d method of the canvas
 * @param [matrix] {Matrix} Optional matrix to apply to the display object before rendering.
 * @private
 */
PIXI.CanvasRenderer.prototype.renderDisplayObject = function (displayObject, context, matrix)
{
    this.renderSession.context = context || this.context;
    this.renderSession.resolution = this.resolution;
    displayObject._renderCanvas(this.renderSession, matrix);
};

/**
 * Maps Pixi blend modes to canvas blend modes.
 *
 * @method PIXI.CanvasRenderer#mapBlendModes
 * @private
 */
PIXI.CanvasRenderer.prototype.mapBlendModes = function ()
{
    if (!PIXI.blendModesCanvas)
    {
        var b = [];
        var modes = PIXI.blendModes;
        var useNew = this.game.device.canUseMultiply;

        b[modes.NORMAL] = 'source-over';
        b[modes.ADD] = 'lighter';
        b[modes.MULTIPLY] = (useNew) ? 'multiply' : 'source-over';
        b[modes.SCREEN] = (useNew) ? 'screen' : 'source-over';
        b[modes.OVERLAY] = (useNew) ? 'overlay' : 'source-over';
        b[modes.DARKEN] = (useNew) ? 'darken' : 'source-over';
        b[modes.LIGHTEN] = (useNew) ? 'lighten' : 'source-over';
        b[modes.COLOR_DODGE] = (useNew) ? 'color-dodge' : 'source-over';
        b[modes.COLOR_BURN] = (useNew) ? 'color-burn' : 'source-over';
        b[modes.HARD_LIGHT] = (useNew) ? 'hard-light' : 'source-over';
        b[modes.SOFT_LIGHT] = (useNew) ? 'soft-light' : 'source-over';
        b[modes.DIFFERENCE] = (useNew) ? 'difference' : 'source-over';
        b[modes.EXCLUSION] = (useNew) ? 'exclusion' : 'source-over';
        b[modes.HUE] = (useNew) ? 'hue' : 'source-over';
        b[modes.SATURATION] = (useNew) ? 'saturation' : 'source-over';
        b[modes.COLOR] = (useNew) ? 'color' : 'source-over';
        b[modes.LUMINOSITY] = (useNew) ? 'luminosity' : 'source-over';

        PIXI.blendModesCanvas = b;
    }
};
