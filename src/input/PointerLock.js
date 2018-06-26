/**
* The pointer lock input handler.
* @class
* @constructor
* @param {Phaser.Game} game
*/
Phaser.PointerLock = function (game)
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
    * The element where event listeners are added.
    * @type {HTMLElement}
    */
    this.element = game.canvas;

    /**
    * Whether the input handler is active.
    * @type {boolean}
    * @readOnly
    */
    this.active = false;

    /**
    * Whether the pointer is locked to the game canvas.
    * @type {boolean}
    */
    this.locked = false;

    /**
    * A signal dispatched when the pointer is locked or unlocked.
    * Its arguments are {@link Phaser.PointerLock#locked} and the original event from the browser.
    * @type {Phaser.Signal}
    */
    this.onChange = new Phaser.Signal();

    /**
    * A signal dispatched when a request to lock or unlock the pointer fails.
    * Its argument is the original event from the browser.
    * @type {Phaser.Signal}
    */
    this.onError = new Phaser.Signal();

    /**
    * The 'pointerlockchange' handler, bound to this instance.
    * @type {function}
    * @private
    */
    this.boundOnChangeHandler = this.onChangeHandler.bind(this);

    /**
    * The 'pointerlockerror' handler, bound to this instance.
    * @type {function}
    * @private
    */
    this.boundOnErrorHandler = this.onErrorHandler.bind(this);

    var device = game.device;

    /**
    * The name of the 'pointerLockElement' property (or its equivalent) on this device.
    * @type {?string}
    * @private
    */
    this.pointerLockElement = device.pointerLockElement;

    /**
    * The name of the 'pointerlockchange' event (or its equivalent) on this device.
    * @type {?string}
    * @private
    */
    this.pointerlockchange = device.pointerlockchange;

    /**
    * The name of the 'pointerlockerror' event (or its equivalent) on this device.
    * @type {?string}
    * @private
    */
    this.pointerlockerror = device.pointerlockerror;
};

/**
* Activates the handler, unless already active or Pointer Lock is unsupported on this device.
* @method Phaser.PointerLock#start
* @return {boolean} - True if the handler was started, otherwise false.
*/
Phaser.PointerLock.prototype.start = function ()
{
    if (!this.game.device.pointerLock || this.active)
    {
        return false;
    }

    if (!this.element.requestPointerLock)
    {
        this.element.requestPointerLock = this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock;
    }

    if (!document.exitPointerLock)
    {
        document.exitPointerLock = document.mozExitPointerLock || document.webkitExitPointerLock;
    }

    document.addEventListener(this.pointerlockchange, this.boundOnChangeHandler, true);
    document.addEventListener(this.pointerlockerror, this.boundOnErrorHandler, true);

    this.active = true;

    return true;
};

/**
* Deactivates the handler.
* @method Phaser.PointerLock#stop
*/
Phaser.PointerLock.prototype.stop = function ()
{
    document.removeEventListener(this.pointerlockchange, this.boundOnChangeHandler, true);
    document.removeEventListener(this.pointerlockerror, this.boundOnErrorHandler, true);

    this.active = false;
};

/**
* Requests the browser to lock the pointer to the game canvas.
* Use onChange and onError to track the result of the request.
* @method Phaser.PointerLock#request
*/
Phaser.PointerLock.prototype.request = function ()
{
    if (!this.active || this.locked)
    {
        return;
    }

    this.element.requestPointerLock();
};

/**
* Releases the locked pointer.
* Use onChange and onError to track the result of the request.
* @method Phaser.PointerLock#exit
*/
Phaser.PointerLock.prototype.exit = function ()
{
    document.exitPointerLock();
};

/**
* Handles the 'pointerlockchange' event from the browser.
* @method Phaser.PointerLock#onChangeHandler
* @private
* @param {Event} event
* @emits Phaser.PointerLock#onChange
*/
Phaser.PointerLock.prototype.onChangeHandler = function (event)
{
    this.locked = (document[this.pointerLockElement] === this.element);

    this.onChange.dispatch(this.locked, event);
};

/**
* Handles the 'pointerlockerror' event from the browser.
* @method Phaser.PointerLock#onErrorHandler
* @private
* @param {Event} event
* @emits Phaser.PointerLock#onError
*/
Phaser.PointerLock.prototype.onErrorHandler = function (event)
{
    this.onError.dispatch(event);
};
