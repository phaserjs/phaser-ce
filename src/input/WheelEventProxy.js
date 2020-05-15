/**
 * A purely internal event support class to proxy 'wheelscroll' and 'DOMMouseWheel'
 * events to 'wheel'-like events.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/Events/mousewheel for choosing a scale and delta mode.
 *
 * @class Phaser.WheelEventProxy
 * @private
 * @constructor
 * @param {number} scaleFactor - Scale factor as applied to wheelDelta/wheelDeltaX or details.
 * @param {integer} deltaMode - The reported delta mode.
 */
Phaser.WheelEventProxy = function (scaleFactor, deltaMode)
{
    /**
     * @property {number} _scaleFactor - Scale factor as applied to wheelDelta/wheelDeltaX or details.
     * @private
     */
    this._scaleFactor = scaleFactor;

    /**
     * @property {number} _deltaMode - The reported delta mode.
     * @private
     */
    this._deltaMode = deltaMode;

    /**
     * @property {any} originalEvent - The original event _currently_ being proxied; the getters will follow suit.
     * @private
     */
    this.originalEvent = null;
};

Phaser.WheelEventProxy.prototype = {};
Phaser.WheelEventProxy.prototype.constructor = Phaser.WheelEventProxy;

Phaser.WheelEventProxy.prototype.bindEvent = function (event)
{
    // Generate stubs automatically
    if (!Phaser.WheelEventProxy._stubsGenerated && event)
    {
        var makeBinder = function (name)
        {
            return function ()
            {
                var v = this.originalEvent[name];
                return typeof v !== 'function' ? v : v.bind(this.originalEvent);
            };
        };

        for (var prop in event)
        {
            if (!(prop in Phaser.WheelEventProxy.prototype))
            {
                Object.defineProperty(Phaser.WheelEventProxy.prototype, prop, {get: makeBinder(prop)});
            }
        }
        Phaser.WheelEventProxy._stubsGenerated = true;
    }

    this.originalEvent = event;
    return this;
};

Object.defineProperties(Phaser.WheelEventProxy.prototype, {
    type: { value: 'wheel' },
    deltaMode: { get: function () { return this._deltaMode; } },
    deltaY: {
        get: function ()
        {
            return (this._scaleFactor * (this.originalEvent.wheelDelta || this.originalEvent.detail)) || 0;
        }
    },
    deltaX: {
        get: function ()
        {
            return (this._scaleFactor * this.originalEvent.wheelDeltaX) || 0;
        }
    },
    deltaZ: { value: 0 }
});
