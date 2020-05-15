/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Mouse class is responsible for handling all aspects of mouse interaction with the browser.
 *
 * It captures and processes mouse events that happen on the game canvas object.
 * It also adds a single `mouseup` listener to `window` which is used to capture the mouse being released
 * when not over the game.
 *
 * You should not normally access this class directly, but instead use a Phaser.Pointer object
 * which normalises all game input for you, including accurate button handling.
 *
 * @class Phaser.Mouse
 * @constructor
 * @param {Phaser.Game} game - A reference to the currently running game.
 */
Phaser.Mouse = function (game)
{
    /**
     * @property {Phaser.Game} game - A reference to the currently running game.
     */
    this.game = game;

    /**
     * @property {Phaser.Input} input - A reference to the Phaser Input Manager.
     * @protected
     */
    this.input = game.input;

    /**
     * @property {object} callbackContext - The context under which callbacks are called.
     */
    this.callbackContext = this.game;

    /**
     * A callback that can be fired when the mouse is pressed down.
     * You should set {@link Phaser.Input.MSPointer#pointerDownCallback} as well.
     * @property {function} mouseDownCallback
     */
    this.mouseDownCallback = null;

    /**
     * A callback that can be fired when the mouse is released from a pressed down state.
     * You should set {@link Phaser.Input.MSPointer#pointerUpCallback} as well.
     * @property {function} mouseUpCallback
     */
    this.mouseUpCallback = null;

    /**
     * A callback that can be fired when the mouse is no longer over the game canvas.
     * You should set {@link Phaser.Input.MSPointer#pointerOutCallback} as well.
     *
     * @property {function} mouseOutCallback
     */
    this.mouseOutCallback = null;

    /**
     * A callback that can be fired when the mouse enters the game canvas (usually after a mouseout).
     * You should set {@link Phaser.Input.MSPointer#pointerOverCallback} as well.
     * @property {function} mouseOverCallback
     */
    this.mouseOverCallback = null;

    /**
     * @property {boolean} capture - If true the DOM mouse events will have event.preventDefault applied to them.
     */
    this.capture = false;

    /**
     * @property {boolean} - Whether the handler has started.
     * @readOnly
     * @see Phaser.Mouse#start
     * @see Phaser.Mouse#stop
     */
    this.active = false;

    /**
     * Whether mouse input is passed to the Input Manager and Mouse Pointer.
     * When enabled is false, `game.input` and `game.input.mousePointer` are not updated by this handler.
     * The handler is still running and will call any added callbacks and apply {@link Phaser.Mouse#capture}.
     * @property {boolean} enabled
     * @default
     */
    this.enabled = true;

    /**
     * If true Pointer.stop will be called if the mouse leaves the game canvas.
     * You should set {@link Phaser.Input.MSPointer#stopOnGameOut} as well.
     * @property {boolean} stopOnGameOut
     * @default
     */
    this.stopOnGameOut = false;

    /**
     * The browser mouse DOM event. Will be null if no mouse event has ever been received.
     * Access this property only inside a Mouse event handler and do not keep references to it.
     * @property {MouseEvent|null} event
     * @default
     */
    this.event = null;

    /**
     * @property {function} _onMouseDown - Internal event handler reference.
     * @private
     */
    this._onMouseDown = null;

    /**
     * @property {function} _onMouseMove - Internal event handler reference.
     * @private
     */
    this._onMouseMove = null;

    /**
     * @property {function} _onMouseUp - Internal event handler reference.
     * @private
     */
    this._onMouseUp = null;

    /**
     * @property {function} _onMouseOut - Internal event handler reference.
     * @private
     */
    this._onMouseOut = null;

    /**
     * @property {function} _onMouseOver - Internal event handler reference.
     * @private
     */
    this._onMouseOver = null;
};

/**
 * @constant
 * @type {number}
 */
Phaser.Mouse.NO_BUTTON = -1;

/**
 * @constant
 * @type {number}
 */
Phaser.Mouse.LEFT_BUTTON = 0;

/**
 * @constant
 * @type {number}
 */
Phaser.Mouse.MIDDLE_BUTTON = 1;

/**
 * @constant
 * @type {number}
 */
Phaser.Mouse.RIGHT_BUTTON = 2;

/**
 * @constant
 * @type {number}
 */
Phaser.Mouse.BACK_BUTTON = 3;

/**
 * @constant
 * @type {number}
 */
Phaser.Mouse.FORWARD_BUTTON = 4;

Phaser.Mouse.prototype = {

    /**
     * Starts the event listeners running.
     * @method Phaser.Mouse#start
     * @return {boolean} - Whether the handler was started.
     */
    start: function ()
    {
        var device = this.game.device;

        if (device.isAndroidStockBrowser() && this.input.touch.active)
        {
            //  Android stock browser fires mouse events even if you preventDefault on the touchStart, so ...
            return false;
        }

        if (this._onMouseDown !== null)
        {
            //  Avoid setting multiple listeners
            return false;
        }

        var _this = this;

        this._onMouseDown = function (event)
        {
            return _this.onMouseDown(event);
        };

        this._onMouseMove = function (event)
        {
            return _this.onMouseMove(event);
        };

        this._onMouseUp = function (event)
        {
            return _this.onMouseUp(event);
        };

        this._onMouseUpGlobal = function (event)
        {
            return _this.onMouseUpGlobal(event);
        };

        this._onMouseOutGlobal = function (event)
        {
            return _this.onMouseOutGlobal(event);
        };

        this._onMouseOut = function (event)
        {
            return _this.onMouseOut(event);
        };

        this._onMouseOver = function (event)
        {
            return _this.onMouseOver(event);
        };

        var canvas = this.game.canvas;

        canvas.addEventListener('mousedown', this._onMouseDown, true);
        canvas.addEventListener('mousemove', this._onMouseMove, true);
        canvas.addEventListener('mouseup', this._onMouseUp, true);

        if (!device.cocoonJS)
        {
            window.addEventListener('mouseup', this._onMouseUpGlobal, true);
            window.addEventListener('mouseout', this._onMouseOutGlobal, true);
            canvas.addEventListener('mouseover', this._onMouseOver, true);
            canvas.addEventListener('mouseout', this._onMouseOut, true);
        }

        this.active = true;

        return true;
    },

    /**
     * The internal method that handles the mouse down event from the browser.
     * @method Phaser.Mouse#onMouseDown
     * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
     */
    onMouseDown: function (event)
    {
        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.mouseDownCallback)
        {
            this.mouseDownCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event.identifier = 0;

        this.input.mousePointer.start(event);
    },

    /**
     * The internal method that handles the mouse move event from the browser.
     * @method Phaser.Mouse#onMouseMove
     * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
     */
    onMouseMove: function (event)
    {
        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.mouseMoveCallback)
        {
            this.mouseMoveCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event.identifier = 0;

        this.input.mousePointer.move(event);
    },

    /**
     * The internal method that handles the mouse up event from the browser.
     * @method Phaser.Mouse#onMouseUp
     * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
     */
    onMouseUp: function (event)
    {
        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.mouseUpCallback)
        {
            this.mouseUpCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event.identifier = 0;

        this.input.mousePointer.stop(event);
    },

    /**
     * The internal method that handles the mouse up event from the window.
     *
     * @method Phaser.Mouse#onMouseUpGlobal
     * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
     */
    onMouseUpGlobal: function (event)
    {
        if (!this.input.mousePointer.withinGame)
        {
            if (this.mouseUpCallback)
            {
                this.mouseUpCallback.call(this.callbackContext, event);
            }

            event.identifier = 0;

            this.input.mousePointer.stop(event);
        }
    },

    /**
     * The internal method that handles the mouse out event from the window.
     *
     * @method Phaser.Mouse#onMouseOutGlobal
     * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
     */
    onMouseOutGlobal: function (event)
    {
        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        this.input.mousePointer.withinGame = false;

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        /*
         *  If we get a mouseout event from the window then basically
         *  something serious has gone down, usually along the lines of
         *  the browser opening a context-menu or similar.
         *  On OS X Chrome especially this is bad news, as it blocks
         *  us then getting a mouseup event, so we need to force that through.
         *
         *  No matter what, we must cancel the left and right buttons
         */

        this.input.mousePointer.stop(event);

        // Clear the button states (again?)
        this.input.mousePointer.resetButtons();
    },

    /**
     * The internal method that handles the mouse out event from the browser.
     *
     * @method Phaser.Mouse#onMouseOut
     * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
     */
    onMouseOut: function (event)
    {
        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        this.input.mousePointer.withinGame = false;

        if (this.mouseOutCallback)
        {
            this.mouseOutCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        this.input.mousePointer.updateButtons(event);

        if (this.stopOnGameOut)
        {
            event.identifier = 0;

            this.input.mousePointer.stop(event);

            this.input.callAll('_pointerOutHandler', this.input.mousePointer);
        }
    },

    /**
     * The internal method that handles the mouse over event from the browser.
     *
     * @method Phaser.Mouse#onMouseOver
     * @param {MouseEvent} event - The native event from the browser. This gets stored in Mouse.event.
     */
    onMouseOver: function (event)
    {
        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        this.input.mousePointer.withinGame = true;

        if (this.mouseOverCallback)
        {
            this.mouseOverCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        this.input.mousePointer.updateButtons(event);
    },

    /**
     * Stop the event listeners.
     * @method Phaser.Mouse#stop
     */
    stop: function ()
    {
        var canvas = this.game.canvas;

        canvas.removeEventListener('mousedown', this._onMouseDown, true);
        canvas.removeEventListener('mousemove', this._onMouseMove, true);
        canvas.removeEventListener('mouseup', this._onMouseUp, true);
        canvas.removeEventListener('mouseover', this._onMouseOver, true);
        canvas.removeEventListener('mouseout', this._onMouseOut, true);

        window.removeEventListener('mouseup', this._onMouseUpGlobal, true);
        window.removeEventListener('mouseout', this._onMouseOutGlobal, true);

        this.active = false;
    }

};

Phaser.Mouse.prototype.constructor = Phaser.Mouse;
