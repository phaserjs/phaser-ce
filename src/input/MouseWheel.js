/**
 * The mouse wheel input handler.
 * @class
 * @constructor
 * @param {Phaser.Game} game
 */
Phaser.MouseWheel = function (game)
{
    /**
     * The currently running game.
     * @type {Phaser.Game}
     */
    this.game = game;

    /**
     * The Input Manager.
     * @type {Phaser.Input}
     */
    this.input = game.input;

    /**
     * The element where event listeners are added (the game canvas).
     * @type {HTMLElement}
     */
    this.element = game.canvas;

    /**
     * Whether the default mouse wheel actions (usually zoom or pan) are cancelled.
     * @type {boolean}
     * @default
     */
    this.preventDefault = true;

    /**
     * Whether the handler is active.
     * @type {boolean}
     * @readOnly
     * @see Phaser.MouseWheel#start
     * @see Phaser.MouseWheel#stop
     */
    this.active = false;

    /**
     * A callback to call for each wheel event.
     * It receives an `event` parameter.
     * @type {function}
     */
    this.callback = null;

    /**
     * The context for {@link Phaser.MouseWheel#callback}.
     * The default is {@link Phaser.MouseWheel#game}.
     * @type {any}
     */
    this.callbackContext = game;

    /**
     * The direction of the last wheel event.
     * Between -1 (down) and 1 (up).
     * @type {number}
     * @readOnly
     * @default
     */
    this.delta = 0;

    /**
     * The name of the wheel event supported by the device, if any.
     * 'wheel' (standard), 'mousewheel' (deprecated), or 'DOMMouseScroll' (obsolete Firefox).
     * @type {?string}
     * @private
     * @see https://developer.mozilla.org/en-US/docs/Web/Events/wheel
     * @see https://developer.mozilla.org/en-US/docs/Web/Events/mousewheel
     * @see https://developer.mozilla.org/en-US/docs/Web/Events/DOMMouseScroll
     */
    this.wheelEventName = game.device.wheelEvent;

    /**
     * The wheel event handler, bound to this instance.
     * @type {function}
     * @private
     * @see Phaser.MouseWheel#onWheelHandler
     */
    this.boundOnWheelHandler = this.onWheelHandler.bind(this);

    /**
     * Wheel proxy event object, if required. Shared for all wheel events for this mouse.
     * @type {Phaser.WheelEventProxy}
     * @private
     */
    this.eventProxy = null;
};

/**
 * @constant
 * @type {number}
 */
Phaser.MouseWheel.UP = 1;

/**
 * @constant
 * @type {number}
 */
Phaser.MouseWheel.DOWN = -1;

/**
 * Activates the handler, unless unsupported or already activate.
 * @method Phaser.MouseWheel#start
 * @returns {boolean} - True if the handler was started, otherwise false.
 */
Phaser.MouseWheel.prototype.start = function ()
{
    if (!this.wheelEventName || this.active)
    {
        return false;
    }

    this.element.addEventListener(this.wheelEventName, this.boundOnWheelHandler, true);

    if (this.wheelEventName === 'mousewheel')
    {
        this.eventProxy = new Phaser.WheelEventProxy(-1 / 40, 1);
    }
    else if (this.wheelEventName === 'DOMMouseScroll')
    {
        this.eventProxy = new Phaser.WheelEventProxy(1, 1);
    }

    this.active = true;

    return true;
};

/**
 * Deactivates the handler.
 * @method Phaser.MouseWheel#stop
 */
Phaser.MouseWheel.prototype.stop = function ()
{
    if (!this.active)
    {
        return;
    }

    this.element.removeEventListener(this.wheelEventName, this.boundOnWheelHandler, true);

    this.active = false;
};

/**
 * Processes the wheel event from the browser.
 * @method Phaser.MouseWheel#onWheelHandler
 * @private
 * @param {WheelEvent|MouseWheelEvent|MouseScrollEvent} event
 */
Phaser.MouseWheel.prototype.onWheelHandler = function (event)
{
    if (this.eventProxy)
    {
        event = this.eventProxy.bindEvent(event);
    }

    if (this.preventDefault)
    {
        event.preventDefault();
    }

    // reverse delta for firefox
    this.delta = Phaser.Math.clamp(-event.deltaY, -1, 1);

    if (this.callback)
    {
        this.callback.call(this.callbackContext, event);
    }
};
