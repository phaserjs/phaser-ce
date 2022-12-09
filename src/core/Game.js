/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Phaser.Game object is the main controller for the entire Phaser game. It is responsible
 * for handling the boot process, parsing the configuration values, creating the renderer,
 * and setting-up all of the Phaser systems, such as physics, sound and input.
 * Once that is complete it will start the default State, and then begin the main game loop.
 *
 * You can access lots of the Phaser systems via the properties on the `game` object. For
 * example `game.renderer` is the Renderer, `game.sound` is the Sound Manager, and so on.
 *
 * Anywhere you can access the `game` property, you can access all of these core systems.
 * For example a Sprite has a `game` property, allowing you to talk to the various parts
 * of Phaser directly, without having to look after your own references.
 *
 * In its most simplest form, a Phaser game can be created by providing the arguments
 * to the constructor:
 *
 * ```javascript
 * var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });
 * ```
 *
 * In the example above it is passing in a State object directly. You can also use the State
 * Manager to do this:
 *
 * ```javascript
 * var game = new Phaser.Game(800, 600, Phaser.AUTO);
 * game.state.add('Boot', BasicGame.Boot);
 * game.state.add('Preloader', BasicGame.Preloader);
 * game.state.add('MainMenu', BasicGame.MainMenu);
 * game.state.add('Game', BasicGame.Game);
 * game.state.start('Boot');
 * ```
 *
 * In the example above, 4 States are added to the State Manager, and Phaser is told to
 * start running the `Boot` state when it has finished initializing. There are example
 * project templates you can use in the Phaser GitHub repo, inside the `resources` folder.
 *
 * Instead of specifying arguments you can also pass {@link GameConfig a single object} instead:
 *
 * ```javascript
 * var config = {
 *     width: 800,
 *     height: 600,
 *     renderer: Phaser.AUTO,
 *     antialias: true,
 *     multiTexture: true,
 *     state: {
 *         preload: preload,
 *         create: create,
 *         update: update
 *     }
 * }
 *
 * var game = new Phaser.Game(config);
 * ```
 *
 * @class Phaser.Game
 * @constructor
 * @param {number|string|GameConfig} [width=800] - The width of your game in game pixels. If given as a string the value must be between 0 and 100 and will be used as the percentage width of the parent container, or the browser window if no parent is given.
 * @param {number|string} [height=600] - The height of your game in game pixels. If given as a string the value must be between 0 and 100 and will be used as the percentage height of the parent container, or the browser window if no parent is given.
 * @param {number} [renderer=Phaser.AUTO] - Which renderer to use: Phaser.AUTO will auto-detect, Phaser.WEBGL, Phaser.WEBGL_MULTI, Phaser.CANVAS or Phaser.HEADLESS (no rendering at all).
 * @param {string|HTMLElement} [parent=''] - The DOM element into which this game canvas will be injected. Either a DOM `id` (string) or the element itself. If omitted (or no such element exists), the game canvas is appended to the document body.
 * @param {object} [state=null] - The default state object. A object consisting of Phaser.State functions (preload, create, update, render) or null.
 * @param {boolean} [transparent=false] - Use a transparent canvas background or not.
 * @param {boolean} [antialias=true] - Draw all image textures anti-aliased or not. The default is for smooth textures, but disable if your game features pixel art.
 * @param {object} [physicsConfig=null] - A physics configuration object to pass to the Physics world on creation.
 */
Phaser.Game = function (width, height, renderer, parent, state, transparent, antialias, physicsConfig)
{
    /**
     * @property {number} id - Phaser Game ID, starting from 0.
     * @readonly
     */
    this.id = (Phaser._ID++);

    /**
     * @property {object} config - The Phaser.Game configuration object.
     */
    this.config = null;

    /**
     * @property {object} physicsConfig - The Phaser.Physics.World configuration object.
     */
    this.physicsConfig = physicsConfig;

    /**
     * @property {string|HTMLElement} parent - The Game's DOM parent (or name thereof), if any, as set when the game was created. The actual parent can be found in `game.canvas.parentNode`. Setting this has no effect after {@link Phaser.ScaleManager} is booted.
     * @readonly
     * @default
     */
    this.parent = '';

    /**
     * The current Game Width in pixels.
     *
     * _Do not modify this property directly:_ use {@link Phaser.ScaleManager#setGameSize} - e.g. `game.scale.setGameSize(width, height)` - instead.
     *
     * @property {integer} width
     * @readonly
     * @default
     */
    this.width = 800;

    /**
     * The current Game Height in pixels.
     *
     * _Do not modify this property directly:_ use {@link Phaser.ScaleManager#setGameSize} - e.g. `game.scale.setGameSize(width, height)` - instead.
     *
     * @property {integer} height
     * @readonly
     * @default
     */
    this.height = 600;

    /**
     * The resolution of your game, as a ratio of canvas pixels to game pixels. This value is read only, but can be changed at start time it via a game configuration object.
     *
     * @property {integer} resolution
     * @readonly
     * @default
     */
    this.resolution = 1;

    /**
     * @property {integer} _width - Private internal var.
     * @private
     */
    this._width = 800;

    /**
     * @property {integer} _height - Private internal var.
     * @private
     */
    this._height = 600;

    /**
     * @property {boolean} transparent - Use a transparent canvas background or not.
     * @default
     */
    this.transparent = false;

    /**
     * @property {boolean} antialias - Anti-alias graphics (as set when the Game is created). By default scaled and rotated images are smoothed in Canvas and WebGL; set `antialias` to false to disable this globally. After the game boots, use `game.stage.smoothed` instead.
     * @readonly
     * @default
     */
    this.antialias = true;

    /**
     * Has support for Multiple bound Textures in WebGL been enabled? This is a read-only property.
     * To set it you need to either specify `Phaser.WEBGL_MULTI` as the renderer type, or use the Game
     * Configuration object with the property `multiTexture` set to true. It has to be enabled before
     * Pixi boots, and cannot be changed after the game is running. Once enabled, take advantage of it
     * via the `game.renderer.setTexturePriority` method.
     *
     * @property {boolean} multiTexture
     * @readonly
     * @default
     */
    this.multiTexture = false;

    /**
     * @property {boolean} preserveDrawingBuffer - The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
     * @default
     */
    this.preserveDrawingBuffer = false;

    /**
     * Clear the Canvas each frame before rendering the display list.
     * You can set this to `false` to gain some performance if your game always contains a background that completely fills the display.
     * This must be `true` to show any {@link Phaser.Stage#backgroundColor} set on the Stage.
     * This is effectively **read-only after the game has booted**.
     * Use the {@link GameConfig} setting `clearBeforeRender` when creating the game, or set `game.renderer.clearBeforeRender` afterwards.
     * @property {boolean} clearBeforeRender
     * @default
     */
    this.clearBeforeRender = true;

    /**
     * @property {PIXI.CanvasRenderer|PIXI.WebGLRenderer} renderer - The Pixi Renderer.
     * @protected
     */
    this.renderer = null;

    /**
     * @property {number} renderType - The Renderer this game will use. Either Phaser.AUTO, Phaser.CANVAS, Phaser.WEBGL, Phaser.WEBGL_MULTI or Phaser.HEADLESS. After the game boots, renderType reflects the renderer in use: AUTO changes to CANVAS or WEBGL and WEBGL_MULTI changes to WEBGL. HEADLESS skips `preRender`, `render`, and `postRender` hooks, just like {@link #lockRender}.
     * @readonly
     */
    this.renderType = Phaser.AUTO;

    /**
     * @property {Phaser.StateManager} state - The StateManager.
     */
    this.state = null;

    /**
     * @property {boolean} isBooted - Whether the game has booted.
     * @readonly
     */
    this.isBooted = false;

    /**
     * @property {boolean} isRunning - Whether the game loop has started.
     * @readonly
     */
    this.isRunning = false;

    /**
     * @property {Phaser.RequestAnimationFrame} raf - Automatically handles the core game loop via requestAnimationFrame or setTimeout
     * @protected
     */
    this.raf = null;

    /**
     * @property {Phaser.GameObjectFactory} add - Reference to the Phaser.GameObjectFactory.
     */
    this.add = null;

    /**
     * @property {Phaser.GameObjectCreator} make - Reference to the GameObject Creator.
     */
    this.make = null;

    /**
     * @property {Phaser.Cache} cache - Reference to the assets cache.
     */
    this.cache = null;

    /**
     * @property {Phaser.Input} input - Reference to the input manager
     */
    this.input = null;

    /**
     * @property {Phaser.Loader} load - Reference to the assets loader.
     */
    this.load = null;

    /**
     * @property {Phaser.Math} math - Reference to the math helper.
     */
    this.math = null;

    /**
     * @property {Phaser.ScaleManager} scale - The game scale manager.
     */
    this.scale = null;

    /**
     * @property {Phaser.SoundManager} sound - Reference to the sound manager.
     */
    this.sound = null;

    /**
     * @property {Phaser.Stage} stage - Reference to the stage.
     */
    this.stage = null;

    /**
     * @property {Phaser.Time} time - Reference to the core game clock.
     */
    this.time = null;

    /**
     * @property {Phaser.TweenManager} tweens - Reference to the tween manager.
     */
    this.tweens = null;

    /**
     * @property {Phaser.World} world - Reference to the world.
     */
    this.world = null;

    /**
     * @property {Phaser.Physics} physics - Reference to the physics manager.
     */
    this.physics = null;

    /**
     * @property {Phaser.PluginManager} plugins - Reference to the plugin manager.
     */
    this.plugins = null;

    /**
     * @property {Phaser.RandomDataGenerator} rnd - Instance of repeatable random data generator helper.
     */
    this.rnd = null;

    /**
     * @property {Phaser.Device} device - Contains device information and capabilities.
     */
    this.device = Phaser.Device;

    /**
     * @property {Phaser.Camera} camera - A handy reference to world.camera.
     */
    this.camera = null;

    /**
     * @property {HTMLCanvasElement} canvas - A handy reference to renderer.view, the canvas that the game is being rendered in to.
     */
    this.canvas = null;

    /**
     * @property {CanvasRenderingContext2D} context - A handy reference to renderer.context (only set for CANVAS games, not WebGL)
     */
    this.context = null;

    /**
     * @property {Phaser.Utils.Debug} debug - A set of useful debug utilities.
     */
    this.debug = null;

    /**
     * @property {Phaser.Particles} particles - The Particle Manager.
     */
    this.particles = null;

    /**
     * @property {Phaser.Create} create - The Asset Generator.
     */
    this.create = null;

    /**
     * If `false` Phaser will automatically render the display list every update. If `true` the render loop will be skipped.
     * You can toggle this value at run-time to gain exact control over when Phaser renders. This can be useful in certain types of game or application.
     * Please note that if you don't render the display list then none of the game object transforms will be updated, so use this value carefully.
     * @property {boolean} lockRender
     * @default
     */
    this.lockRender = false;

    /**
     * @property {boolean} pendingDestroy - Destroy the game at the next update.
     * @default
     */
    this.pendingDestroy = false;

    /**
     * @property {boolean} stepping - Enable core loop stepping with Game.enableStep().
     * @default
     * @readonly
     */
    this.stepping = false;

    /**
     * @property {boolean} pendingStep - An internal property used by enableStep, but also useful to query from your own game objects.
     * @default
     * @readonly
     */
    this.pendingStep = false;

    /**
     * @property {number} stepCount - When stepping is enabled this contains the current step cycle.
     * @default
     * @readonly
     */
    this.stepCount = 0;

    /**
     * @property {Phaser.Signal} onPause - This event is fired when the game pauses.
     */
    this.onPause = new Phaser.Signal();

    /**
     * @property {Phaser.Signal} onResume - This event is fired when the game resumes from a paused state.
     */
    this.onResume = new Phaser.Signal();

    /**
     * @property {Phaser.Signal} onBlur - This event is fired when the game no longer has focus (typically on page hide).
     */
    this.onBlur = new Phaser.Signal();

    /**
     * @property {Phaser.Signal} onFocus - This event is fired when the game has focus (typically on page show).
     */
    this.onFocus = new Phaser.Signal();

    /**
     * @property {Phaser.Signal} onBoot - This event is fired after the game boots but before the first game update.
     */
    this.onBoot = new Phaser.Signal();

    /**
     * @property {Phaser.Signal} onDestroy - This event is fired at the start of the game destroy sequence.
     */
    this.onDestroy = new Phaser.Signal();

    /**
     * @property {boolean} _paused - Is game paused?
     * @private
     */
    this._paused = false;

    /**
     * @property {boolean} _codePaused - Was the game paused via code or a visibility change?
     * @private
     */
    this._codePaused = false;

    /**
     * @property {boolean} _focusGained - The game has just regained focus.
     * @private
     */
    this._focusGained = false;

    /**
     * The ID of the current/last logic update applied this animation frame, starting from 0.
     * The first update is `currentUpdateID === 0` and the last update is `currentUpdateID === updatesThisFrame.`
     * @property {integer} currentUpdateID
     * @protected
     */
    this.currentUpdateID = 0;

    /**
     * Number of logic updates expected to occur this animation frame; will be 1 unless there are catch-ups required (and allowed).
     * @property {integer} updatesThisFrame
     * @protected
     */
    this.updatesThisFrame = 1;

    /**
     * Number of renders expected to occur this animation frame. May be 0 if {@link #forceSingleRender} is off; otherwise it will be 1.
     * @property {integer} rendersThisFrame
     * @protected
     */
    this.rendersThisFrame = 1;

    /**
     * @property {number} _deltaTime - Accumulate elapsed time until a logic update is due.
     * @private
     */
    this._deltaTime = 0;

    /**
     * @property {number} _lastCount - Remember how many 'catch-up' iterations were used on the logicUpdate last frame.
     * @private
     */
    this._lastCount = 0;

    /**
     * @property {number} _spiraling - If the 'catch-up' iterations are spiraling out of control, this counter is incremented.
     * @private
     */
    this._spiraling = 0;

    /**
     * @property {boolean} _kickstart - Force a logic update + render by default (always set on Boot and State swap)
     * @private
     */
    this._kickstart = true;

    /**
     * If the game is struggling to maintain the desired FPS, this signal will be dispatched.
     * The desired/chosen FPS should probably be closer to the {@link Phaser.Time#suggestedFps} value.
     * @property {Phaser.Signal} fpsProblemNotifier
     * @public
     */
    this.fpsProblemNotifier = new Phaser.Signal();

    /**
     * @property {boolean} forceSingleUpdate - Use a variable-step game loop (true) or a fixed-step game loop (false).
     * @default
     * @see Phaser.Time#desiredFps
     */
    this.forceSingleUpdate = true;

    /**
     * @property {boolean} forceSingleRender - Should the game loop make one render per animation frame, even without a preceding logic update?
     * @default
     */
    this.forceSingleRender = false;

    /**
     * @property {boolean} dropFrames - Skip a logic update and render if the delta is too large (see {@link Phaser.Time#deltaMax}). When false, the delta is clamped to the maximum instead.
     * @default
     */
    this.dropFrames = false;

    /**
     * @property {string} powerPreference - When the WebGL renderer is used, hint to the browser which GPU to use.
     * @readonly
     * @default
     */
    this.powerPreference = 'default';

    /**
     * @property {number} _nextNotification - The soonest game.time.time value that the next fpsProblemNotifier can be dispatched.
     * @private
     */
    this._nextFpsNotification = 0;

    //  Parse the configuration object (if any)
    if (arguments.length === 1 && typeof arguments[0] === 'object')
    {
        this.parseConfig(arguments[0]);
    }
    else
    {
        this.config = { enableDebug: true };

        if (typeof width !== 'undefined')
        {
            this._width = width;
        }

        if (typeof height !== 'undefined')
        {
            this._height = height;
        }

        if (typeof renderer !== 'undefined')
        {
            this.renderType = renderer;
        }

        if (typeof parent !== 'undefined')
        {
            this.parent = parent;
        }

        if (typeof transparent !== 'undefined')
        {
            this.transparent = transparent;
        }

        if (typeof antialias !== 'undefined')
        {
            this.antialias = antialias;
        }

        this.rnd = new Phaser.RandomDataGenerator([ (Date.now() * Math.random()).toString() ]);

        this.state = new Phaser.StateManager(this, state);
    }

    this.device.whenReady(this.boot, this);

    return this;
};

/**
 * A configuration object for {@link Phaser.Game}.
 *
 * @typedef {object} GameConfig
 * @property {boolean}            [GameConfig.alignH=false]                  - Sets {@link Phaser.ScaleManager#pageAlignHorizontally}.
 * @property {boolean}            [GameConfig.alignV=false]                  - Sets {@link Phaser.ScaleManager#pageAlignVertically}.
 * @property {boolean}            [GameConfig.antialias=true]
 * @property {number|string}      [GameConfig.backgroundColor=0]             - Sets {@link Phaser.Stage#backgroundColor}.
 * @property {HTMLCanvasElement}  [GameConfig.canvas]                        - An existing canvas to display the game in.
 * @property {string}             [GameConfig.canvasID]                      - `id` attribute value to assign to the game canvas.
 * @property {string}             [GameConfig.canvasStyle]                   - `style` attribute value to assign to the game canvas.
 * @property {boolean}            [GameConfig.clearBeforeRender=true]        - Sets {@link Phaser.Game#clearBeforeRender}.
 * @property {boolean}            [GameConfig.crisp=false]                   - Sets the canvas's `image-rendering` property to `pixelated` or `crisp-edges`. See {@link Phaser.Canvas.setImageRenderingCrisp}.
 * @property {boolean}            [GameConfig.disableVisibilityChange=false] - Sets {@link Phaser.Stage#disableVisibilityChange}
 * @property {boolean}            [GameConfig.disableStart=false]            - Prevents the game loop from starting, allowing you to call updates manually. Helpful for automated testing.
 * @property {boolean}            [GameConfig.enableDebug=true]              - Enable {@link Phaser.Utils.Debug}. You can gain a little performance by disabling this in production.
 * @property {boolean}            [GameConfig.failIfMajorPerformanceCaveat]  - Abort WebGL context creation if performance would be poor. You can use this with renderer AUTO.
 * @property {boolean}            [GameConfig.forceSetTimeOut]               - Use {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout setTimeout} for the game loop even if {@link https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame requestAnimationFrame} is available.
 * @property {number}             [GameConfig.fullScreenScaleMode]           - The scaling method used by the ScaleManager when in fullscreen.
 * @property {HTMLElement}        [GameConfig.fullScreenTarget]              - The DOM element on which the Fullscreen API enter request will be invoked.
 * @property {number|string}      [GameConfig.height=600]
 * @property {boolean}            [GameConfig.keyboard=true]                 - Starts the keyboard input handler.
 * @property {number}             [GameConfig.maxPointers=-1]                - Sets {@link Phaser.Input#maxPointers}.
 * @property {boolean}            [GameConfig.mouse=true]                    - Starts the mouse input handler, if the mspointer and touch handlers were not started.
 * @property {boolean}            [GameConfig.mouseWheel=false]               - Starts the {@link Phaser.MouseWheel mouse wheel} handler, if supported by the device.
 * @property {boolean}            [GameConfig.mspointer=true]                - Starts the {@link Phaser.MSPointer Pointer Events} handler (mspointer), if supported by the device.
 * @property {boolean}            [GameConfig.multiTexture=false]            - Enable support for multiple bound Textures in WebGL. Same as `{renderer: Phaser.WEBGL_MULTI}`.
 * @property {string|HTMLElement} [GameConfig.parent='']                     - The DOM element into which this games canvas will be injected.
 * @property {object}             [GameConfig.physicsConfig]
 * @property {boolean}            [GameConfig.pointerLock=true]              - Starts the {@link Phaser.PointerLock Pointer Lock} handler, if supported by the device.
 * @property {string}             [GameConfig.powerPreference='default']     - Sets the WebGL renderer's powerPreference when the WebGL renderer is used.
 * @property {boolean}            [GameConfig.preserveDrawingBuffer=false]   - Whether or not the contents of the stencil buffer is retained after rendering.
 * @property {number}             [GameConfig.renderer=Phaser.AUTO]
 * @property {number}             [GameConfig.resolution=1]                  - The resolution of your game, as a ratio of canvas pixels to game pixels.
 * @property {boolean}            [GameConfig.roundPixels=false]             - Round pixel coordinates for rendering (rather than interpolating). Handy for crisp pixel art and speed on legacy devices.
 * @property {number}             [GameConfig.scaleH=1]                      - Horizontal scaling factor for USER_SCALE scale mode.
 * @property {number}             [GameConfig.scaleMode]                     - The scaling method used by the ScaleManager when not in fullscreen.
 * @property {number}             [GameConfig.scaleV=1]                      - Vertical scaling factor for USER_SCALE scale mode.
 * @property {number}             [GameConfig.seed]                          - Seed for {@link Phaser.RandomDataGenerator}.
 * @property {object}             [GameConfig.state]
 * @property {boolean}            [GameConfig.touch=true]                    - Starts the {@link Phaser.Touch touch} handler, if supported by the device and the Pointer Events handler (mspointer) was not started.
 * @property {boolean|string}     [GameConfig.transparent=false]             - Sets {@link Phaser.Game#transparent}. `'notMultiplied'` disables the WebGL context attribute `premultipliedAlpha`.
 * @property {number}             [GameConfig.trimH=0]                       - Horizontal trim for USER_SCALE scale mode.
 * @property {number}             [GameConfig.trimV=0]                       - Vertical trim for USER_SCALE scale mode.
 * @property {number|string}      [GameConfig.width=800]
 */
// Documentation stub for linking.

Phaser.Game.prototype = {

    /**
     * Parses a Game configuration object.
     *
     * @method Phaser.Game#parseConfig
     * @protected
     */
    parseConfig: function (config)
    {
        this.config = config;

        if (config.enableDebug === undefined)
        {
            this.config.enableDebug = true;
        }

        if (config.width)
        {
            this._width = config.width;
        }

        if (config.height)
        {
            this._height = config.height;
        }

        if (config.renderer)
        {
            this.renderType = config.renderer;
        }

        if (config.parent)
        {
            this.parent = config.parent;
        }

        if (config.transparent !== undefined)
        {
            this.transparent = config.transparent;
        }

        if (config.antialias !== undefined)
        {
            this.antialias = config.antialias;
        }

        if (config.clearBeforeRender !== undefined)
        {
            this.clearBeforeRender = config.clearBeforeRender;
        }

        if (config.multiTexture !== undefined)
        {
            this.multiTexture = config.multiTexture;
        }

        if (config.resolution)
        {
            this.resolution = config.resolution;
        }

        if (config.preserveDrawingBuffer !== undefined)
        {
            this.preserveDrawingBuffer = config.preserveDrawingBuffer;
        }

        if (config.powerPreference !== undefined)
        {
            this.powerPreference = config.powerPreference;
        }

        if (config.physicsConfig)
        {
            this.physicsConfig = config.physicsConfig;
        }

        var seed = [ (Date.now() * Math.random()).toString() ];

        if (config.seed)
        {
            seed = config.seed;
        }

        this.rnd = new Phaser.RandomDataGenerator(seed);

        var state = null;

        if (config.state)
        {
            state = config.state;
        }

        this.state = new Phaser.StateManager(this, state);
    },

    /**
     * Initialize engine sub modules and start the game.
     *
     * @method Phaser.Game#boot
     * @protected
     */
    boot: function ()
    {
        if (this.isBooted)
        {
            return;
        }

        this.isBooted = true;

        this.math = Phaser.Math;

        this.scale = new Phaser.ScaleManager(this, this._width, this._height);
        this.stage = new Phaser.Stage(this);

        this.setUpRenderer();

        this.world = new Phaser.World(this);
        this.add = new Phaser.GameObjectFactory(this);
        this.make = new Phaser.GameObjectCreator(this);
        this.cache = new Phaser.Cache(this);
        this.load = new Phaser.Loader(this);
        this.time = new Phaser.Time(this);
        this.tweens = new Phaser.TweenManager(this);
        this.input = new Phaser.Input(this);
        this.sound = new Phaser.SoundManager(this);
        this.physics = new Phaser.Physics(this, this.physicsConfig);
        this.particles = new Phaser.Particles(this);
        this.create = new Phaser.Create(this);
        this.plugins = new Phaser.PluginManager(this);

        this.time.boot();
        this.stage.boot();
        this.world.boot();
        this.scale.boot();
        this.input.boot(this.config);
        this.sound.boot();
        this.state.boot();

        if (this.config.enableDebug)
        {
            this.debug = new Phaser.Utils.Debug(this);
            this.debug.boot();
        }
        else
        {
            var noop = function () {};

            this.debug = { preUpdate: noop, update: noop, reset: noop, destroy: noop, isDisabled: true };
        }

        this.showDebugHeader();

        if (this.config && this.config.forceSetTimeOut)
        {
            this.raf = new Phaser.RequestAnimationFrame(this, this.config.forceSetTimeOut);
        }
        else
        {
            this.raf = new Phaser.RequestAnimationFrame(this, false);
        }

        this._kickstart = true;

        this.focusWindow();

        this.onBoot.dispatch(this);

        if (this.config.disableStart)
        {
            return;
        }

        if (this.cache.isReady)
        {
            this.raf.start();

            this.isRunning = true;
        }
        else
        {
            this.cache.onReady.addOnce(function ()
            {
                if (!this.isBooted)
                {
                    // Already destroyed.
                    return;
                }

                this.raf.start();

                this.isRunning = true;
            }, this);
        }
    },

    /**
     * Displays a Phaser version debug header in the console.
     *
     * @method Phaser.Game#showDebugHeader
     * @protected
     */
    showDebugHeader: function ()
    {
        if (window.PhaserGlobal && window.PhaserGlobal.hideBanner)
        {
            return;
        }

        var v = Phaser.VERSION;
        var r = 'Canvas';
        var a = 'HTML Audio';
        var c = 1;

        if (this.renderType === Phaser.WEBGL)
        {
            r = 'WebGL';
            c++;
        }
        else if (this.renderType === Phaser.HEADLESS)
        {
            r = 'Headless';
        }

        if (this.device.webAudio)
        {
            a = 'WebAudio';
            c++;
        }

        if (!this.device.ie) // https://developer.mozilla.org/en-US/docs/Web/API/Console/log#Browser_compatibility
        {
            var args = [
                '%c %c %c Phaser CE v' + v + ' | Pixi.js | ' + r + ' | ' + a + '  %c %c ' + '%c http://phaser.io %c\u2665%c\u2665%c\u2665',
                'background: #fb8cb3',
                'background: #d44a52',
                'color: #ffffff; background: #871905;',
                'background: #d44a52',
                'background: #fb8cb3',
                'background: #ffffff'
            ];

            for (var i = 0; i < 3; i++)
            {
                if (i < c)
                {
                    args.push('color: #ff2424; background: #fff');
                }
                else
                {
                    args.push('color: #959595; background: #fff');
                }
            }

            console.log.apply(console, args);
        }
        else
        {
            console.log('Phaser v' + v + ' | Pixi.js | ' + r + ' | ' + a + ' | http://phaser.io');
        }

        if (!this.debug.isDisabled)
        {
            console.log('`game.debug` is enabled. Disable it in production');
        }
    },

    /**
     * Checks if the device is capable of using the requested renderer and sets it up or an alternative if not.
     *
     * @method Phaser.Game#setUpRenderer
     * @protected
     */
    setUpRenderer: function ()
    {
        if (!this.device.canvas)
        {
            // Nothing else to do
            throw new Error('Phaser.Game - Cannot create Canvas 2d context, aborting.');
        }

        if (this.config.canvas)
        {
            this.canvas = this.config.canvas;
        }
        else
        {
            this.canvas = Phaser.Canvas.create(this, this.width, this.height, this.config.canvasID, true);
        }

        if (this.config.canvasStyle)
        {
            this.canvas.style = this.config.canvasStyle;
        }
        else
        {
            this.canvas.style['-webkit-full-screen'] = 'width: 100%; height: 100%';
        }

        if (this.config.crisp)
        {
            Phaser.Canvas.setImageRenderingCrisp(this.canvas);
        }

        if ((this.renderType === Phaser.WEBGL) ||
            (this.renderType === Phaser.WEBGL_MULTI) ||
            (this.renderType === Phaser.AUTO && this.device.webGL))
        {
            if (this.multiTexture || this.renderType === Phaser.WEBGL_MULTI)
            {
                PIXI.enableMultiTexture();
                this.multiTexture = true;
            }

            try
            {
                this.renderer = new PIXI.WebGLRenderer(this, this.config);
                this.renderType = Phaser.WEBGL;
                this.context = null;
                this.canvas.addEventListener('webglcontextlost', this.contextLost.bind(this), false);
                this.canvas.addEventListener('webglcontextrestored', this.contextRestored.bind(this), false);
            }
            catch (webGLRendererError)
            {
                this.renderer = null;
                this.multiTexture = false;
                PIXI._enableMultiTextureToggle = false;

                if (this.renderType === Phaser.WEBGL)
                {
                    // No fallback
                    throw webGLRendererError;
                }
            }
        }

        if (!this.renderer)
        {
            this.renderer = new PIXI.CanvasRenderer(this, this.config);
            this.context = this.renderer.context;

            if (this.renderType === Phaser.AUTO)
            {
                this.renderType = Phaser.CANVAS;
            }
        }

        if (this.device.cocoonJS)
        {
            this.canvas.screencanvas = (this.renderType === Phaser.CANVAS) ? true : false;
        }

        if (this.renderType !== Phaser.HEADLESS)
        {
            this.stage.smoothed = this.antialias;

            Phaser.Canvas.addToDOM(this.canvas, this.parent, false);
            Phaser.Canvas.setTouchAction(this.canvas);
        }
    },

    /**
     * Handles WebGL context loss.
     *
     * @method Phaser.Game#contextLost
     * @private
     * @param {Event} event - The webglcontextlost event.
     */
    contextLost: function (event)
    {
        event.preventDefault();

        this.renderer.contextLost = true;
    },

    /**
     * Handles WebGL context restoration.
     *
     * @method Phaser.Game#contextRestored
     * @private
     */
    contextRestored: function ()
    {
        this.renderer.initContext();

        this.cache.clearGLTextures();

        this.renderer.contextLost = false;
    },

    /**
     * The core game loop.
     *
     * @method Phaser.Game#update
     * @protected
     * @param {number} time - The current time in milliseconds as provided by RequestAnimationFrame.
     */
    update: function (time)
    {
        if (this.pendingDestroy)
        {
            this.destroy();

            return;
        }

        if (!this.isBooted)
        {
            return;
        }

        // Sets `elapsed`, `elapsedMS`, `now`, `time`
        this.time.update(time);

        if (this._kickstart)
        {
            this.updateLogic(this.time.desiredFpsMult);
            this.updateRender();

            this._kickstart = false;

            return;
        }

        if (this._focusGained)
        {
            this._focusGained = false;

            // Wait for next frame.

            return;
        }

        var elapsed = this.time.elapsed;

        if (elapsed <= 0)
        {
            return;
        }

        if (elapsed > this.time.deltaMax)
        {
            // `dropFrames` not so useful.

            if (this.dropFrames)
            {
                return;
            }
            else
            {
                elapsed = this.time.deltaMax;
            }
        }

        if (this.forceSingleUpdate)
        {
            this.updatesThisFrame = 1;
            this.rendersThisFrame = 1;

            this.updateLogic(0.001 * elapsed / this.time.slowMotion);
            this.updateRender();
        }
        else if (this._spiraling > 2)
        {
            // Skip update and render completely
            this.updatesThisFrame = 0;
            this.rendersThisFrame = 0;

            // Notify
            if (this.time.time > this._nextFpsNotification)
            {
                this._nextFpsNotification = this.time.time + 10000;
                this.fpsProblemNotifier.dispatch();
            }

            // Discard all pending late updates
            this._deltaTime = 0;
            this._spiraling = 0;
        }
        else
        {
            var count = 0;
            var fixedStepSize = 1000 * this.time.desiredFpsMult;

            this._deltaTime += elapsed;

            this.updatesThisFrame = Math.floor(this._deltaTime / fixedStepSize);
            this.rendersThisFrame = this.forceSingleRender ? 1 : Math.min(1, this.updatesThisFrame);

            while (this._deltaTime >= fixedStepSize)
            {
                this._deltaTime -= fixedStepSize;
                this.currentUpdateID = count;

                this.updateLogic(this.time.desiredFpsMult / this.time.slowMotion);
                this.time.refresh();

                count++;
            }

            if (count > this._lastCount)
            {
                this._spiraling++;
            }
            else if (count < this._lastCount)
            {
                this._spiraling = 0;
            }

            this._lastCount = count;

            if (this.rendersThisFrame > 0)
            {
                this.updateRender();
            }
        }
    },

    /**
     * Updates all logic subsystems in Phaser. Called automatically by Game.update.
     *
     * @method Phaser.Game#updateLogic
     * @protected
     * @param {number} delta - The current time step value in seconds, as determined by Game.update.
     */
    updateLogic: function (delta)
    {
        if (!this._paused && !this.pendingStep)
        {
            if (this.stepping)
            {
                this.pendingStep = true;
            }

            this.time.preUpdate(delta);

            this.scale.preUpdate();
            this.debug.preUpdate();
            this.camera.preUpdate();
            this.physics.preUpdate();
            this.state.preUpdate(delta);
            this.plugins.preUpdate(delta);
            this.stage.preUpdate();

            this.state.update();
            this.stage.update();
            this.tweens.update();
            this.sound.update();
            this.input.update();
            this.physics.update();
            this.plugins.update();

            this.stage.postUpdate();
            this.state.postUpdate();
            this.plugins.postUpdate();
        }
        else
        {
            // Scaling and device orientation changes are still reflected when paused.
            this.scale.pauseUpdate();
            this.state.pauseUpdate(delta);
            this.debug.preUpdate();
            this.input.pauseUpdate();
        }

        this.stage.updateTransform();
    },

    /**
     * Runs the Render cycle.
     * It starts by calling State.preRender. In here you can do any last minute adjustments of display objects as required.
     * It then calls the renderer, which renders the entire display list, starting from the Stage object and working down.
     * It then calls plugin.render on any loaded plugins, in the order in which they were enabled.
     * After this State.render is called. Any rendering that happens here will take place on-top of the display list.
     * Finally plugin.postRender is called on any loaded plugins, in the order in which they were enabled.
     * This method is called automatically by Game.update, you don't need to call it directly.
     * Should you wish to have fine-grained control over when Phaser renders then use the `Game.lockRender` boolean.
     * Phaser will only render when this boolean is `false`.
     *
     * @method Phaser.Game#updateRender
     * @protected
     */
    updateRender: function ()
    {
        if (this.lockRender || this.renderType === Phaser.HEADLESS)
        {
            return;
        }

        this.time.preRender();
        this.state.preRender();

        this.renderer.render(this.stage);
        this.plugins.render();
        this.state.render();

        this.plugins.postRender();
        this.renderer.postRender();
    },

    /**
     * Enable core game loop stepping. When enabled you must call game.step() directly (perhaps via a DOM button?)
     * Calling step will advance the game loop by one frame. This is extremely useful for hard to track down errors!
     *
     * @method Phaser.Game#enableStep
     */
    enableStep: function ()
    {
        this.stepping = true;
        this.pendingStep = false;
        this.stepCount = 0;
    },

    /**
     * Disables core game loop stepping.
     *
     * @method Phaser.Game#disableStep
     */
    disableStep: function ()
    {
        this.stepping = false;
        this.pendingStep = false;
    },

    /**
     * When stepping is enabled you must call this function directly (perhaps via a DOM button?) to advance the game loop by one frame.
     * This is extremely useful to hard to track down errors! Use the internal stepCount property to monitor progress.
     *
     * @method Phaser.Game#step
     */
    step: function ()
    {
        this.pendingStep = false;
        this.stepCount++;
    },

    /**
     * Nukes the entire game from orbit.
     *
     * Calls destroy on Game.state, Game.sound, Game.scale, Game.stage, Game.input, Game.physics and Game.plugins.
     *
     * Then sets all of those local handlers to null, destroys the renderer, removes the canvas from the DOM
     * and resets the PIXI default renderer.
     *
     * To destroy the game during an update callback, set {@link #pendingDestroy} instead.
     *
     * @method Phaser.Game#destroy
     */
    destroy: function ()
    {
        if (!this.isBooted)
        {
            this.pendingDestroy = true;

            return;
        }

        this.onDestroy.dispatch(this);

        this.fpsProblemNotifier.dispose();
        this.onBlur.dispose();
        this.onBoot.dispose();
        this.onDestroy.dispose();
        this.onFocus.dispose();
        this.onPause.dispose();
        this.onResume.dispose();

        this.raf.stop();

        this.debug.destroy();
        this.state.destroy();
        this.sound.destroy();
        this.scale.destroy();
        this.stage.destroy();
        this.input.destroy();
        this.physics.destroy();
        this.plugins.destroy();
        this.tweens.destroy();
        this.renderer.destroy(false);

        Phaser.Canvas.removeFromDOM(this.canvas);

        this.add = null;
        this.cache = null;
        this.camera = null;
        this.canvas = null;
        this.create = null;
        this.debug = null;
        this.fpsProblemNotifier = null;
        this.input = null;
        this.load = null;
        this.make = null;
        this.onBlur = null;
        this.onBoot = null;
        this.onDestroy = null;
        this.onFocus = null;
        this.onPause = null;
        this.onResume = null;
        this.particles = null;
        this.physics = null;
        this.plugins = null;
        this.raf = null;
        this.renderer = null;
        this.scale = null;
        this.sound = null;
        this.stage = null;
        this.state = null;
        this.time = null;
        this.tweens = null;
        this.world = null;

        this.isBooted = false;
        this.isRunning = false;
        this.pendingDestroy = false;
    },

    /**
     * Called by the Stage visibility handler.
     *
     * @method Phaser.Game#gamePaused
     * @param {object} event - The DOM event that caused the game to pause, if any.
     * @protected
     */
    gamePaused: function (event)
    {
        //   If the game is already paused it was done via game code, so don't re-pause it
        if (!this._paused)
        {
            this._paused = true;

            this.time.gamePaused();
            this.sound.gamePaused();
            this.onPause.dispatch(event);

            //  Avoids Cordova iOS crash event: https://github.com/photonstorm/phaser/issues/1800
            if (this.device.cordova && this.device.iOS)
            {
                this.lockRender = true;
            }
        }
    },

    /**
     * Called by the Stage visibility handler.
     *
     * @method Phaser.Game#gameResumed
     * @param {object} event - The DOM event that caused the game to pause, if any.
     * @protected
     */
    gameResumed: function (event)
    {
        //  Game is paused, but wasn't paused via code, so resume it
        if (this._paused && !this._codePaused)
        {
            this._paused = false;

            this.time.gameResumed();
            this.input.reset();
            this.sound.gameResumed();
            this.onResume.dispatch(event);

            //  Avoids Cordova iOS crash event: https://github.com/photonstorm/phaser/issues/1800
            if (this.device.cordova && this.device.iOS)
            {
                this.lockRender = false;
            }
        }
    },

    /**
     * Called by the Stage visibility handler.
     *
     * @method Phaser.Game#focusLoss
     * @param {object} event - The DOM event that caused the game to pause, if any.
     * @protected
     */
    focusLoss: function (event)
    {
        this.onBlur.dispatch(event);

        if (!this.stage.disableVisibilityChange)
        {
            this.gamePaused(event);
        }
    },

    /**
     * Called by the Stage visibility handler.
     *
     * @method Phaser.Game#focusGain
     * @param {object} event - The DOM event that caused the game to pause, if any.
     * @protected
     */
    focusGain: function (event)
    {
        this._focusGained = true;

        this.focusWindow();

        this.onFocus.dispatch(event);

        if (!this.stage.disableVisibilityChange)
        {
            this.gameResumed(event);
        }
    },

    /**
     * Try to focus the browsing context, unless prohibited by PhaserGlobal.stopFocus.
     *
     * @private
     */
    focusWindow: function ()
    {
        if (window.focus)
        {
            if (!window.PhaserGlobal || (window.PhaserGlobal && !window.PhaserGlobal.stopFocus))
            {
                window.focus();
            }
        }
    }

};

Phaser.Game.prototype.constructor = Phaser.Game;

/**
 * The paused state of the Game. A paused game doesn't update any of its subsystems.
 * When a game is paused the onPause event is dispatched. When it is resumed the onResume event is dispatched.
 * @name Phaser.Game#paused
 * @property {boolean} paused - Gets and sets the paused state of the Game.
 */
Object.defineProperty(Phaser.Game.prototype, 'paused', {

    get: function ()
    {
        return this._paused;
    },

    set: function (value)
    {
        if (value === true)
        {
            if (this._paused === false)
            {
                this._paused = true;
                if (this.sound.muteOnPause)
                {
                    this.sound.setMute();
                }
                this.time.gamePaused();
                this.onPause.dispatch(this);
            }
            this._codePaused = true;
        }
        else
        {
            if (this._paused)
            {
                this._paused = false;
                this.input.reset();
                this.sound.unsetMute();
                this.time.gameResumed();
                this.onResume.dispatch(this);
            }
            this._codePaused = false;
        }
    }

});

/**
 *
 * "Deleted code is debugged code." - Jeff Sickel
 *
 * ヽ(〃＾▽＾〃)ﾉ
 *
 */
