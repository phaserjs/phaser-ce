/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Utils
* @static
*/
Phaser.Utils = {

    /**
    * Takes the given string and reverses it, returning the reversed string.
    * For example if given the string `Atari 520ST` it would return `TS025 iratA`.
    *
    * @method Phaser.Utils.reverseString
    * @param {string} string - The string to be reversed.
    * @return {string} The reversed string.
    */
    reverseString: function (string) {

        return string.split('').reverse().join('');

    },

    /**
    * Gets an object's property by string.
    *
    * @method Phaser.Utils.getProperty
    * @param {object} obj - The object to traverse.
    * @param {string} name - The property name, or a series of names separated by `.` (for nested properties).
    * @return {any} - The value of the property or `undefined` if the property isn't found.
    */
    getProperty: function(obj, name) {

        var parts = name.split('.');

        switch (parts.length)
        {
            case 1:
                return obj[name];
            case 2:
                return obj[parts[0]][parts[1]];
            case 3:
                return obj[parts[0]][parts[1]][parts[2]];
            case 4:
                return obj[parts[0]][parts[1]][parts[2]][parts[3]];
            default:
                return this._getProperty(obj, name);
        }

    },

    /**
     * Sets an object's properties from a map of property names and values.
     *
     * ```javascript
     * Phaser.Utils.setProperties(sprite, {
     *  'animations.paused': true,
     *  'body.enable': false,
     *  'input.draggable': true,
     * });
     * ```
     *
     * @method Phaser.Utils.setProperties
     * @param  {object} obj - The object to modify.
     * @param  {object} props - The property names and values to set on the object (see {@link #setProperty}).
     * @return {object} The modified object.
     */
    setProperties: function(obj, props) {

        for (var name in props)
        {
            this.setProperty(obj, name, props[name]);
        }

        return obj;

    },

    /**
     * Sets an object's property by name and value.
     *
     * ```javascript
     * Phaser.Utils.setProperty(sprite, 'body.velocity.x', 60);
     * ```
     *
     * @method Phaser.Utils.setProperty
     * @param {object} obj - The object to modify.
     * @param {string} name - The property name, or a series of names separated by `.` (for nested properties).
     * @param {any} value - The value.
     * @return {object} The modified object.
     */

    setProperty: function(obj, name, value) {

        var parts = name.split('.');

        switch (parts.length)
        {
            case 1:
                obj[name] = value;
                break;
            case 2:
                obj[parts[0]][parts[1]] = value;
                break;
            case 3:
                obj[parts[0]][parts[1]][parts[2]] = value;
                break;
            case 4:
                obj[parts[0]][parts[1]][parts[2]][parts[3]] = value;
                break;
            default:
                this._setProperty(obj, name, value);
        }
    },

    /**
     * Gets an object's property by string.
     *
     * @private
     * @method Phaser.Utils._getProperty
     * @param {object} obj - The object to traverse.
     * @param {string} name - The property whose value will be returned.
     * @return {any} - The value of the property or `undefined` if the property isn't found.
     */
    _getProperty: function(obj, name) {

        var parts = name.split('.'),
            len = parts.length,
            i = 0,
            val = obj;

        while (i < len)
        {
            var key = parts[i];

            if (val != null)
            {
                val = val[key];
                i++;
            }
            else
            {
                return undefined;
            }
        }

        return val;

    },

    /**
     * Sets an object's property by name and value.
     *
     * @private
     * @method Phaser.Utils._setProperty
     * @param {object} obj - The object to modify.
     * @param {string} name - The property name, or a series of names separated by `.` (for nested properties).
     * @param {any} value - The value.
     * @return {object} The modified object.
     */
    _setProperty: function(obj, name, value) {

        var parts = name.split('.'),
            len = parts.length,
            i = 0,
            currentObj = obj,
            key = parts[0];

        if (len === 1)
        {
            obj[name] = value;
        }
        else
        {
            while (i < (len - 1))
            {
                currentObj = currentObj[key];
                i++;
                key = parts[i];
            }

            currentObj[key] = value;
        }

        return obj;

    },

    /**
    * Generate a random bool result based on the chance value.
    *
    * Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
    * of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
    *
    * @method Phaser.Utils#chanceRoll
    * @param {number} chance - The chance of receiving the value. A number between 0 and 100 (effectively 0% to 100%).
    * @return {boolean} True if the roll passed, or false otherwise.
    */
    chanceRoll: function (chance) {
        if (chance === undefined) { chance = 50; }
        return chance > 0 && (Math.random() * 100 <= chance);
    },

    /**
    * Choose between one of two values randomly.
    *
    * @method Phaser.Utils#randomChoice
    * @param {any} choice1
    * @param {any} choice2
    * @return {any} The randomly selected choice
    */
    randomChoice: function (choice1, choice2) {
        return (Math.random() < 0.5) ? choice1 : choice2;
    },

    /**
    * Get a unit dimension from a string.
    *
    * @method Phaser.Utils.parseDimension
    * @param {string|number} size - The size to parse.
    * @param {number} dimension - The window dimension to check.
    * @return {number} The parsed dimension.
    */
    parseDimension: function (size, dimension) {

        var f = 0;
        var px = 0;

        if (typeof size === 'string')
        {
            //  %?
            if (size.substr(-1) === '%')
            {
                f = parseInt(size, 10) / 100;

                if (dimension === 0)
                {
                    px = window.innerWidth * f;
                }
                else
                {
                    px = window.innerHeight * f;
                }
            }
            else
            {
                px = parseInt(size, 10);
            }
        }
        else
        {
            px = size;
        }

        return px;

    },

    /**
    * Takes the given string and pads it out, to the length required, using the character
    * specified. For example if you need a string to be 6 characters long, you can call:
    *
    * `pad('bob', 6, '-', 2)`
    *
    * This would return: `bob---` as it has padded it out to 6 characters, using the `-` on the right.
    *
    * You can also use it to pad numbers (they are always returned as strings):
    *
    * `pad(512, 6, '0', 1)`
    *
    * Would return: `000512` with the string padded to the left.
    *
    * If you don't specify a direction it'll pad to both sides:
    *
    * `pad('c64', 7, '*')`
    *
    * Would return: `**c64**`
    *
    * @method Phaser.Utils.pad
    * @param {string} str - The target string. `toString()` will be called on the string, which means you can also pass in common data types like numbers.
    * @param {integer} [len=0] - The number of characters to be added.
    * @param {string} [pad=" "] - The string to pad it out with (defaults to a space).
    * @param {integer} [dir=3] - The direction dir = 1 (left), 2 (right), 3 (both).
    * @return {string} The padded string.
    */
    pad: function (str, len, pad, dir) {

        if (len === undefined) { var len = 0; }
        if (pad === undefined) { var pad = ' '; }
        if (dir === undefined) { var dir = 3; }

        str = str.toString();

        var padlen = 0;

        if (len + 1 >= str.length)
        {
            switch (dir)
            {
                case 1:
                    str = new Array(len + 1 - str.length).join(pad) + str;
                    break;

                case 3:
                    var right = Math.ceil((padlen = len - str.length) / 2);
                    var left = padlen - right;
                    str = new Array(left+1).join(pad) + str + new Array(right+1).join(pad);
                    break;

                default:
                    str = str + new Array(len + 1 - str.length).join(pad);
                    break;
            }
        }

        return str;

    },

    /**
    * This is a slightly modified version of jQuery.isPlainObject.
    * A plain object is an object whose internal class property is [object Object].
    * @method Phaser.Utils.isPlainObject
    * @param {object} obj - The object to inspect.
    * @return {boolean} - true if the object is plain, otherwise false.
    */
    isPlainObject: function (obj) {

        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        // - DOM nodes
        // - window
        if (typeof(obj) !== "object" || obj.nodeType || obj === obj.window)
        {
            return false;
        }

        // Support: Firefox <20
        // The try/catch suppresses exceptions thrown when attempting to access
        // the "constructor" property of certain host objects, ie. |window.location|
        // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
        try {
            if (obj.constructor && !({}).hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf"))
            {
                return false;
            }
        } catch (e) {
            return false;
        }

        // If the function hasn't returned already, we're confident that
        // |obj| is a plain object, created by {} or constructed with new Object
        return true;
    },

    /**
    * This is a slightly modified version of http://api.jquery.com/jQuery.extend/
    *
    * @method Phaser.Utils.extend
    * @param {boolean} deep - Perform a deep copy?
    * @param {object} target - The target object to copy to.
    * @return {object} The extended object.
    */
    extend: function () {

        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean")
        {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // extend Phaser if only one argument is passed
        if (length === i)
        {
            target = this;
            --i;
        }

        for (; i < length; i++)
        {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null)
            {
                // Extend the base object
                for (name in options)
                {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy)
                    {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (Phaser.Utils.isPlainObject(copy) || (copyIsArray = Array.isArray(copy))))
                    {
                        if (copyIsArray)
                        {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        }
                        else
                        {
                            clone = src && Phaser.Utils.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = Phaser.Utils.extend(deep, clone, copy);

                    // Don't bring in undefined values
                    }
                    else if (copy !== undefined)
                    {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;

    },

    /**
    * Mixes in an existing mixin object with the target.
    *
    * Values in the mixin that have either `get` or `set` functions are created as properties via `defineProperty`
    * _except_ if they also define a `clone` method - if a clone method is defined that is called instead and
    * the result is assigned directly.
    *
    * @method Phaser.Utils.mixinPrototype
    * @param {object} target - The target object to receive the new functions.
    * @param {object} mixin - The object to copy the functions from.
    * @param {boolean} [replace=false] - If the target object already has a matching function should it be overwritten or not?
    */
    mixinPrototype: function (target, mixin, replace) {

        if (replace === undefined) { replace = false; }

        var mixinKeys = Object.keys(mixin);

        for (var i = 0; i < mixinKeys.length; i++)
        {
            var key = mixinKeys[i];
            var value = mixin[key];

            if (!replace && (key in target))
            {
                //  Not overwriting existing property
                continue;
            }
            else
            {
                if (value &&
                    (typeof value.get === 'function' || typeof value.set === 'function'))
                {
                    //  Special case for classes like Phaser.Point which has a 'set' function!
                    if (typeof value.clone === 'function')
                    {
                        target[key] = value.clone();
                    }
                    else
                    {
                        Object.defineProperty(target, key, value);
                    }
                }
                else
                {
                    target[key] = value;
                }
            }
        }

    },

    /**
    * Mixes the source object into the destination object, returning the newly modified destination object.
    * Based on original code by @mudcube
    *
    * @method Phaser.Utils.mixin
    * @param {object} from - The object to copy (the source object).
    * @param {object} to - The object to copy to (the destination object).
    * @return {object} The modified destination object.
    */
    mixin: function (from, to) {

        if (!from || typeof (from) !== "object")
        {
            return to;
        }

        for (var key in from)
        {
            var o = from[key];

            if (o.childNodes || o.cloneNode)
            {
                continue;
            }

            var type = typeof (from[key]);

            if (!from[key] || type !== "object")
            {
                to[key] = from[key];
            }
            else
            {
                //  Clone sub-object
                if (typeof (to[key]) === type)
                {
                    to[key] = Phaser.Utils.mixin(from[key], to[key]);
                }
                else
                {
                    to[key] = Phaser.Utils.mixin(from[key], new o.constructor());
                }
            }
        }

        return to;

    }

};
