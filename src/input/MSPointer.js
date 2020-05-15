/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The MSPointer class handles pointer interactions with the game via the {@link https://developers.google.com/web/updates/2016/10/pointer-events Pointer Events API}. (It's named after the nonstandard {@link https://msdn.microsoft.com/library/hh673557(v=vs.85).aspx MSPointerEvent}, ancestor of the current API.)
 *
 * It's {@link http://caniuse.com/#feat=pointer currently supported  in IE 10+, Edge, Chrome (including Android), and Opera}.
 *
 * You should not normally access this class directly, but instead use a {@link Phaser.Pointer} object which
 * normalises all game input for you including accurate button handling.
 *
 * Phaser does not yet support {@link http://www.w3.org/TR/pointerevents/#chorded-button-interactions chorded button interactions}.
 *
 * You can disable Phaser's use of Pointer Events:
 *
 * ```javascript
 * new Phaser.Game({ mspointer: false });
 * ```
 *
 * @class Phaser.MSPointer
 * @constructor
 * @param {Phaser.Game} game - A reference to the currently running game.
 */
Phaser.MSPointer = function (game)
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
     * @property {object} callbackContext - The context under which callbacks are called (defaults to game).
     */
    this.callbackContext = this.game;

    /**
     * @property {function} pointerDownCallback - A callback that can be fired on a pointerdown event.
     */
    this.pointerDownCallback = null;

    /**
     * @property {function} pointerMoveCallback - A callback that can be fired on a pointermove event.
     */
    this.pointerMoveCallback = null;

    /**
     * @property {function} pointerUpCallback - A callback that can be fired on a pointerup event.
     */
    this.pointerUpCallback = null;

    /**
     * @property {function} pointerOutCallback - A callback that can be fired on a pointerout event.
     */
    this.pointerOutCallback = null;

    /**
     * @property {function} pointerOverCallback - A callback that can be fired on a pointerover event.
     */
    this.pointerOverCallback = null;

    /**
     * @property {function} pointerCancelCallback - A callback that can be fired on a pointercancel event.
     */
    this.pointerCancelCallback = null;

    /**
     * If true the PointerEvent will call preventDefault(), canceling the corresponding MouseEvent or
     * TouchEvent.
     *
     * If the {@link Phaser.Mouse Mouse} handler is active as well, you should set this to true to avoid
     * duplicate events.
     *
     * "Mouse events can only be prevented when the pointer is down. Hovering pointers (e.g. a mouse with
     * no buttons pressed) cannot have their mouse events prevented. And, the `mouseover` and `mouseout`
     * events are never prevented (even if the pointer is down)."
     *
     * @property {boolean} capture
     * @see https://www.w3.org/Submission/pointer-events/#mapping-for-devices-that-support-hover
     */
    this.capture = false;

    /**
     * The most recent PointerEvent from the browser. Will be null if no event has ever been received.
     * Access this property only inside a Pointer event handler and do not keep references to it.
     * @property {MSPointerEvent|PointerEvent|null} event
     * @default
     */
    this.event = null;

    /**
     * Whether the input handler is active.
     * @property {boolean} active
     * @readOnly
     * @default
     */
    this.active = false;

    /**
     * PointerEvent input will only be processed if enabled.
     * @property {boolean} enabled
     * @default
     */
    this.enabled = true;

    /**
     * If true Pointer.stop() will be called if the pointer leaves the game canvas.
     * @property {boolean} stopOnGameOut
     * @default
     */
    this.stopOnGameOut = false;

    /**
     * @property {function} _onMSPointerDown - Internal function to handle MSPointer events.
     * @private
     */
    this._onMSPointerDown = null;

    /**
     * @property {function} _onMSPointerMove - Internal function to handle MSPointer events.
     * @private
     */
    this._onMSPointerMove = null;

    /**
     * @property {function} _onMSPointerUp - Internal function to handle MSPointer events.
     * @private
     */
    this._onMSPointerUp = null;

    /**
     * @property {function} _onMSPointerUpGlobal - Internal function to handle MSPointer events.
     * @private
     */
    this._onMSPointerUpGlobal = null;

    /**
     * @property {function} _onMSPointerOut - Internal function to handle MSPointer events.
     * @private
     */
    this._onMSPointerOut = null;

    /**
     * @property {function} _onMSPointerOver - Internal function to handle MSPointer events.
     * @private
     */
    this._onMSPointerOver = null;
};

Phaser.MSPointer.prototype = {

    /**
     * Starts the event listeners running.
     * @method Phaser.MSPointer#start
     */
    start: function ()
    {
        if (!this.game.device.mspointer)
        {
            return false;
        }

        if (this._onMSPointerDown !== null)
        {
            //  Avoid setting multiple listeners
            return false;
        }

        var _this = this;

        this._onMSPointerDown = function (event)
        {
            return _this.onPointerDown(event);
        };

        this._onMSPointerMove = function (event)
        {
            return _this.onPointerMove(event);
        };

        this._onMSPointerUp = function (event)
        {
            return _this.onPointerUp(event);
        };

        this._onMSPointerUpGlobal = function (event)
        {
            return _this.onPointerUpGlobal(event);
        };

        this._onMSPointerOut = function (event)
        {
            return _this.onPointerOut(event);
        };

        this._onMSPointerOver = function (event)
        {
            return _this.onPointerOver(event);
        };

        this._onMSPointerCancel = function (event)
        {
            return _this.onPointerCancel(event);
        };

        var canvas = this.game.canvas;

        canvas.addEventListener('MSPointerDown', this._onMSPointerDown, false);
        canvas.addEventListener('MSPointerMove', this._onMSPointerMove, false);
        canvas.addEventListener('MSPointerUp', this._onMSPointerUp, false);
        canvas.addEventListener('MSPointerCancel', this._onMSPointerCancel, false);

        //  IE11+ uses non-prefix events
        canvas.addEventListener('pointerdown', this._onMSPointerDown, false);
        canvas.addEventListener('pointermove', this._onMSPointerMove, false);
        canvas.addEventListener('pointerup', this._onMSPointerUp, false);
        canvas.addEventListener('pointercancel', this._onMSPointerCancel, false);

        canvas.style['-ms-content-zooming'] = 'none';
        canvas.style['-ms-touch-action'] = 'none';

        if (!this.game.device.cocoonJS)
        {
            window.addEventListener('MSPointerUp', this._onMSPointerUpGlobal, true);
            canvas.addEventListener('MSPointerOver', this._onMSPointerOver, true);
            canvas.addEventListener('MSPointerOut', this._onMSPointerOut, true);

            //  IE11+ uses non-prefix events
            window.addEventListener('pointerup', this._onMSPointerUpGlobal, true);
            canvas.addEventListener('pointerover', this._onMSPointerOver, true);
            canvas.addEventListener('pointerout', this._onMSPointerOut, true);
        }

        this.active = true;

        return true;
    },

    /**
     * The function that handles the PointerDown event.
     *
     * @method Phaser.MSPointer#onPointerDown
     * @param {PointerEvent} event - The native DOM event.
     */
    onPointerDown: function (event)
    {
        this.game.input.executeTouchLockCallbacks(false, event);

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.pointerDownCallback)
        {
            this.pointerDownCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event.identifier = event.pointerId;

        if (this.isMousePointerEvent(event))
        {
            this.input.mousePointer.start(event);
        }
        else
        {
            this.input.startPointer(event);
        }
    },

    /**
     * The function that handles the PointerMove event.
     * @method Phaser.MSPointer#onPointerMove
     * @param {PointerEvent} event - The native DOM event.
     */
    onPointerMove: function (event)
    {
        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.pointerMoveCallback)
        {
            this.pointerMoveCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event.identifier = event.pointerId;

        if (this.isMousePointerEvent(event))
        {
            this.input.mousePointer.move(event);
        }
        else
        {
            this.input.updatePointer(event);
        }
    },

    /**
     * The function that handles the PointerUp event.
     * @method Phaser.MSPointer#onPointerUp
     * @param {PointerEvent} event - The native DOM event.
     */
    onPointerUp: function (event)
    {
        this.game.input.executeTouchLockCallbacks(true, event);

        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        if (this.pointerUpCallback)
        {
            this.pointerUpCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        event.identifier = event.pointerId;

        if (this.isMousePointerEvent(event))
        {
            this.input.mousePointer.stop(event);
        }
        else
        {
            this.input.stopPointer(event);
        }
    },

    /**
     * The internal method that handles the mouse up event from the window.
     *
     * @method Phaser.MSPointer#onPointerUpGlobal
     * @param {PointerEvent} event - The native event from the browser. This gets stored in MSPointer.event.
     */
    onPointerUpGlobal: function (event)
    {
        event.identifier = event.pointerId;

        if (this.isMousePointerEvent(event) && !this.input.mousePointer.withinGame)
        {
            this.onPointerUp(event);
        }
        else
        {
            var pointer = this.input.getPointerFromIdentifier(event.identifier);

            if (pointer && pointer.withinGame)
            {
                this.onPointerUp(event);
            }
        }
    },

    /**
     * The internal method that handles the pointer out event from the browser.
     *
     * @method Phaser.MSPointer#onPointerOut
     * @param {PointerEvent} event - The native event from the browser. This gets stored in MSPointer.event.
     */
    onPointerOut: function (event)
    {
        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        event.identifier = event.pointerId;

        var pointer = this.getPointerFromEvent(event);

        if (pointer)
        {
            pointer.withinGame = false;
        }

        if (this.pointerOutCallback)
        {
            this.pointerOutCallback.call(this.callbackContext, event);
        }

        if (!this.input.enabled || !this.enabled)
        {
            return;
        }

        if (this.stopOnGameOut)
        {
            event.identifier = 0;

            if (!pointer)
            {
                pointer = this.input.mousePointer;
            }

            pointer.stop(event);

            this.input.callAll('_pointerOutHandler', pointer);
        }
    },

    /**
     * The internal method that handles the pointer over event from the browser.
     *
     * @method Phaser.MSPointer#onPointerOut
     * @param {PointerEvent} event - The native event from the browser. This gets stored in MSPointer.event.
     */
    onPointerOver: function (event)
    {
        this.event = event;

        if (this.capture)
        {
            event.preventDefault();
        }

        event.identifier = event.pointerId;

        var pointer = this.getPointerFromEvent(event);

        if (pointer)
        {
            pointer.withinGame = true;
        }

        if (this.pointerOverCallback)
        {
            this.pointerOverCallback.call(this.callbackContext, event);
        }
    },

    /**
     * The internal method that handles the pointer cancel event from the browser.
     *
     * @method Phaser.MSPointer#onPointerCancel
     * @param {PointerEvent} event
     */
    onPointerCancel: function (event)
    {
        this.event = event;

        if (this.pointerCancelCallback)
        {
            this.pointerCancelCallback.call(this.callbackContext, event);
        }

        if (!this.game.input.enabled || !this.enabled)
        {
            return;
        }

        event.identifier = event.pointerId;

        if (this.isMousePointerEvent(event))
        {
            this.input.mousePointer.stop(event);
        }
        else
        {
            this.input.stopPointer(event);
        }
    },

    /**
     * Stop the event listeners.
     * @method Phaser.MSPointer#stop
     */
    stop: function ()
    {
        var canvas = this.game.canvas;

        canvas.removeEventListener('MSPointerDown', this._onMSPointerDown, false);
        canvas.removeEventListener('MSPointerMove', this._onMSPointerMove, false);
        canvas.removeEventListener('MSPointerUp', this._onMSPointerUp, false);

        //  IE11+ uses non-prefix events
        canvas.removeEventListener('pointerdown', this._onMSPointerDown, false);
        canvas.removeEventListener('pointermove', this._onMSPointerMove, false);
        canvas.removeEventListener('pointerup', this._onMSPointerUp, false);

        window.removeEventListener('MSPointerUp', this._onMSPointerUpGlobal, true);
        canvas.removeEventListener('MSPointerOver', this._onMSPointerOver, true);
        canvas.removeEventListener('MSPointerOut', this._onMSPointerOut, true);

        //  IE11+ uses non-prefix events
        window.removeEventListener('pointerup', this._onMSPointerUpGlobal, true);
        canvas.removeEventListener('pointerover', this._onMSPointerOver, true);
        canvas.removeEventListener('pointerout', this._onMSPointerOut, true);

        this.active = false;
    },

    /**
     * @private
     * @param {PointerEvent} event
     * @return {boolean}
     */
    isMousePointerEvent: function (event)
    {
        return (event.pointerType === 'mouse' || event.pointerType === 0x00000004);
    },

    /**
     * @private
     * @param {PointerEvent} event
     * @return {?Phaser.Pointer}
     */
    getPointerFromEvent: function (event)
    {
        return this.isMousePointerEvent(event)
            ? this.input.mousePointer
            : this.input.getPointerFromIdentifier(event.identifier);
    }

};

Phaser.MSPointer.prototype.constructor = Phaser.MSPointer;
