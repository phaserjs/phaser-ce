/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Creates a new Circle object with the center coordinate specified by the x and y parameters and the diameter specified by the diameter parameter.
 * If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
 *
 * @class Phaser.Circle
 * @constructor
 * @param {number} [x=0] - The x coordinate of the center of the circle.
 * @param {number} [y=0] - The y coordinate of the center of the circle.
 * @param {number} [diameter=0] - The diameter of the circle.
 */
Phaser.Circle = function (x, y, diameter)
{
    x = x || 0;
    y = y || 0;
    diameter = diameter || 0;

    /**
     * @property {number} x - The x coordinate of the center of the circle.
     */
    this.x = x;

    /**
     * @property {number} y - The y coordinate of the center of the circle.
     */
    this.y = y;

    /**
     * @property {number} _diameter - The diameter of the circle.
     * @private
     */
    this._diameter = diameter;

    /**
     * @property {number} _radius - The radius of the circle.
     * @private
     */
    this._radius = 0;

    if (diameter > 0)
    {
        this._radius = diameter * 0.5;
    }

    /**
     * @property {number} type - The const type of this object.
     * @readonly
     */
    this.type = Phaser.CIRCLE;
};

Phaser.Circle.prototype = {

    /**
     * The circumference of the circle.
     *
     * @method Phaser.Circle#circumference
     * @return {number} The circumference of the circle.
     */
    circumference: function ()
    {
        return 2 * (Math.PI * this._radius);
    },

    /**
     * Returns a uniformly distributed random point from anywhere within this Circle.
     *
     * @method Phaser.Circle#random
     * @param {Phaser.Point|object} [out] - A Phaser.Point, or any object with public x/y properties, that the values will be set in.
     *     If no object is provided a new Phaser.Point object will be created. In high performance areas avoid this by re-using an existing object.
     * @return {Phaser.Point} An object containing the random point in its `x` and `y` properties.
     */
    random: function (out)
    {
        if (out === undefined) { out = new Phaser.Point(); }

        var t = 2 * Math.PI * Math.random();
        var u = Math.random() + Math.random();
        var r = (u > 1) ? 2 - u : u;
        var x = r * Math.cos(t);
        var y = r * Math.sin(t);

        out.x = this.x + (x * this.radius);
        out.y = this.y + (y * this.radius);

        return out;
    },

    /**
     * Returns the framing rectangle of the circle as a Phaser.Rectangle object.
     *
     * @method Phaser.Circle#getBounds
     * @return {Phaser.Rectangle} The bounds of the Circle.
     */
    getBounds: function ()
    {
        return new Phaser.Rectangle(this.x - this.radius, this.y - this.radius, this.diameter, this.diameter);
    },

    /**
     * Sets the members of Circle to the specified values.
     * @method Phaser.Circle#setTo
     * @param {number} x - The x coordinate of the center of the circle.
     * @param {number} y - The y coordinate of the center of the circle.
     * @param {number} diameter - The diameter of the circle.
     * @return {Circle} This circle object.
     */
    setTo: function (x, y, diameter)
    {
        this.x = x;
        this.y = y;
        this._diameter = diameter;
        this._radius = diameter * 0.5;

        return this;
    },

    /**
     * Copies the x, y and diameter properties from any given object to this Circle.
     * @method Phaser.Circle#copyFrom
     * @param {any} source - The object to copy from.
     * @return {Circle} This Circle object.
     */
    copyFrom: function (source)
    {
        return this.setTo(source.x, source.y, source.diameter);
    },

    /**
     * Copies the x, y and diameter properties from this Circle to any given object.
     * @method Phaser.Circle#copyTo
     * @param {any} dest - The object to copy to.
     * @return {object} This dest object.
     */
    copyTo: function (dest)
    {
        dest.x = this.x;
        dest.y = this.y;
        dest.diameter = this._diameter;

        return dest;
    },

    /**
     * Returns the distance from the center of the Circle object to the given object
     * (can be Circle, Point or anything with x/y properties)
     * @method Phaser.Circle#distance
     * @param {object} dest - The target object. Must have visible x and y properties that represent the center of the object.
     * @param {boolean} [round=false] - Round the distance to the nearest integer.
     * @return {number} The distance between this Point object and the destination Point object.
     */
    distance: function (dest, round)
    {
        var distance = Phaser.Math.distance(this.x, this.y, dest.x, dest.y);
        return round ? Math.round(distance) : distance;
    },

    /**
     * Returns a new Circle object with the same values for the x, y, width, and height properties as this Circle object.
     * @method Phaser.Circle#clone
     * @param {Phaser.Circle} [output] - Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
     * @return {Phaser.Circle} The cloned Circle object.
     */
    clone: function (output)
    {
        if (output === undefined || output === null)
        {
            output = new Phaser.Circle(this.x, this.y, this.diameter);
        }
        else
        {
            output.setTo(this.x, this.y, this.diameter);
        }

        return output;
    },

    /**
     * Return true if the given x/y coordinates are within this Circle object.
     * @method Phaser.Circle#contains
     * @param {number} x - The X value of the coordinate to test.
     * @param {number} y - The Y value of the coordinate to test.
     * @return {boolean} True if the coordinates are within this circle, otherwise false.
     */
    contains: function (x, y)
    {
        return Phaser.Circle.contains(this, x, y);
    },

    /**
     * Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
     * @method Phaser.Circle#circumferencePoint
     * @param {number} angle - The angle in radians (unless asDegrees is true) to return the point from.
     * @param {boolean} [asDegrees=false] - Is the given angle in radians (false) or degrees (true)?
     * @param {Phaser.Point} [out] - An optional Point object to put the result in to. If none specified a new Point object will be created.
     * @return {Phaser.Point} The Point object holding the result.
     */
    circumferencePoint: function (angle, asDegrees, out)
    {
        return Phaser.Circle.circumferencePoint(this, angle, asDegrees, out);
    },

    /**
     * Creates or positions points on the circle.
     *
     * The points are equally distributed in the half-closed interval [startAngle, endAngle). The default arc is the entire circle.
     *
     * If the `out` argument is omitted, this method creates and returns an array of {@link Phaser.Point points}. If an array is passed as `out`, its items are treated as points and placed in the same way.
     *
     * @param {type} [steps=60] - The number of points to place.
     * @param {type} [startAngle=0] - The starting angle in radians (unless asDegrees is true).
     * @param {type} [endAngle=Phaser.Math.PI2] - The end angle in radians (unless asDegrees is true).
     * @param {type} [asDegrees=false]  - Are the given angles in radians (false) or degrees (true)?
     * @param {any[]} [out] - An array of points or point-like objects (e.g., sprites). It should start at index 0 and its length should be equal to or greater than `steps`.
     * @return {any[]} - The modified `out` argument or a new array of points.
     */
    sample: function (steps, startAngle, endAngle, asDegrees, out)
    {
        if (!steps) { steps = 60; }
        if (startAngle == null) { startAngle = 0; }
        if (endAngle == null) { endAngle = Phaser.Math.PI2; }
        if (!out) { out = []; }

        var i = 0;

        while (i < steps)
        {
            this.circumferencePoint(
                Phaser.Math.linear(startAngle, endAngle, i / steps),
                asDegrees,
                out[i] || (out[i] = new Phaser.Point())
            );

            i += 1;
        }

        return out;
    },

    /**
     * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
     * @method Phaser.Circle#offset
     * @param {number} dx - Moves the x value of the Circle object by this amount.
     * @param {number} dy - Moves the y value of the Circle object by this amount.
     * @return {Circle} This Circle object.
     */
    offset: function (dx, dy)
    {
        this.x += dx;
        this.y += dy;

        return this;
    },

    /**
     * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
     * @method Phaser.Circle#offsetPoint
     * @param {Point} point A Point object to use to offset this Circle object (or any valid object with exposed x and y properties).
     * @return {Circle} This Circle object.
     */
    offsetPoint: function (point)
    {
        return this.offset(point.x, point.y);
    },

    /**
     * Returns a string representation of this object.
     * @method Phaser.Circle#toString
     * @return {string} a string representation of the instance.
     */
    toString: function ()
    {
        return '[{Phaser.Circle (x=' + this.x + ' y=' + this.y + ' diameter=' + this.diameter + ' radius=' + this.radius + ')}]';
    }

};

Phaser.Circle.prototype.constructor = Phaser.Circle;

/**
 * The largest distance between any two points on the circle. The same as the radius * 2.
 *
 * @name Phaser.Circle#diameter
 * @property {number} diameter - Gets or sets the diameter of the circle.
 */
Object.defineProperty(Phaser.Circle.prototype, 'diameter', {

    get: function ()
    {
        return this._diameter;
    },

    set: function (value)
    {
        if (value > 0)
        {
            this._diameter = value;
            this._radius = value * 0.5;
        }
    }

});

/**
 * The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
 * @name Phaser.Circle#radius
 * @property {number} radius - Gets or sets the radius of the circle.
 */
Object.defineProperty(Phaser.Circle.prototype, 'radius', {

    get: function ()
    {
        return this._radius;
    },

    set: function (value)
    {
        if (value > 0)
        {
            this._radius = value;
            this._diameter = value * 2;
        }
    }

});

/**
 * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
 * @name Phaser.Circle#left
 * @propety {number} left - Gets or sets the value of the leftmost point of the circle.
 */
Object.defineProperty(Phaser.Circle.prototype, 'left', {

    get: function ()
    {
        return this.x - this._radius;
    },

    set: function (value)
    {
        if (value > this.x)
        {
            this._radius = 0;
            this._diameter = 0;
        }
        else
        {
            this.radius = this.x - value;
        }
    }

});

/**
 * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
 * @name Phaser.Circle#right
 * @property {number} right - Gets or sets the value of the rightmost point of the circle.
 */
Object.defineProperty(Phaser.Circle.prototype, 'right', {

    get: function ()
    {
        return this.x + this._radius;
    },

    set: function (value)
    {
        if (value < this.x)
        {
            this._radius = 0;
            this._diameter = 0;
        }
        else
        {
            this.radius = value - this.x;
        }
    }

});

/**
 * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
 * @name Phaser.Circle#top
 * @property {number} top - Gets or sets the top of the circle.
 */
Object.defineProperty(Phaser.Circle.prototype, 'top', {

    get: function ()
    {
        return this.y - this._radius;
    },

    set: function (value)
    {
        if (value > this.y)
        {
            this._radius = 0;
            this._diameter = 0;
        }
        else
        {
            this.radius = this.y - value;
        }
    }

});

/**
 * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
 * @name Phaser.Circle#bottom
 * @property {number} bottom - Gets or sets the bottom of the circle.
 */
Object.defineProperty(Phaser.Circle.prototype, 'bottom', {

    get: function ()
    {
        return this.y + this._radius;
    },

    set: function (value)
    {
        if (value < this.y)
        {
            this._radius = 0;
            this._diameter = 0;
        }
        else
        {
            this.radius = value - this.y;
        }
    }

});

/**
 * The area of this Circle.
 * @name Phaser.Circle#area
 * @property {number} area - The area of this circle.
 * @readonly
 */
Object.defineProperty(Phaser.Circle.prototype, 'area', {

    get: function ()
    {
        if (this._radius > 0)
        {
            return Math.PI * this._radius * this._radius;
        }
        else
        {
            return 0;
        }
    }

});

/**
 * Determines whether or not this Circle object is empty. Will return a value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
 * If set to true it will reset all of the Circle objects properties to 0. A Circle object is empty if its diameter is less than or equal to 0.
 * @name Phaser.Circle#empty
 * @property {boolean} empty - Gets or sets the empty state of the circle.
 */
Object.defineProperty(Phaser.Circle.prototype, 'empty', {

    get: function ()
    {
        return (this._diameter === 0);
    },

    set: function (value)
    {
        if (value === true)
        {
            this.setTo(0, 0, 0);
        }
    }

});

/**
 * Return true if the given x/y coordinates are within the Circle object.
 * @method Phaser.Circle.contains
 * @param {Phaser.Circle} a - The Circle to be checked.
 * @param {number} x - The X value of the coordinate to test.
 * @param {number} y - The Y value of the coordinate to test.
 * @return {boolean} True if the coordinates are within this circle, otherwise false.
 */
Phaser.Circle.contains = function (a, x, y)
{
    //  Check if x/y are within the bounds first
    if (a.radius > 0 && x >= a.left && x <= a.right && y >= a.top && y <= a.bottom)
    {
        var dx = (a.x - x) * (a.x - x);
        var dy = (a.y - y) * (a.y - y);

        return (dx + dy) <= (a.radius * a.radius);
    }
    else
    {
        return false;
    }
};

/**
 * Determines whether the two Circle objects match. This method compares the x, y and diameter properties.
 * @method Phaser.Circle.equals
 * @param {Phaser.Circle} a - The first Circle object.
 * @param {Phaser.Circle} b - The second Circle object.
 * @return {boolean} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
 */
Phaser.Circle.equals = function (a, b)
{
    return (a.x === b.x && a.y === b.y && a.diameter === b.diameter);
};

/**
 * Determines whether the two Circle objects intersect.
 * This method checks the radius distances between the two Circle objects to see if they intersect.
 * @method Phaser.Circle.intersects
 * @param {Phaser.Circle} a - The first Circle object.
 * @param {Phaser.Circle} b - The second Circle object.
 * @return {boolean} A value of true if the specified object intersects with this Circle object; otherwise false.
 */
Phaser.Circle.intersects = function (a, b)
{
    return (Phaser.Math.distance(a.x, a.y, b.x, b.y) <= (a.radius + b.radius));
};

/**
 * Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
 * @method Phaser.Circle.circumferencePoint
 * @param {Phaser.Circle} a - The first Circle object.
 * @param {number} angle - The angle in radians (unless asDegrees is true) to return the point from.
 * @param {boolean} [asDegrees=false] - Is the given angle in radians (false) or degrees (true)?
 * @param {Phaser.Point} [out] - An optional Point object to put the result in to. If none specified a new Point object will be created.
 * @return {Phaser.Point} The Point object holding the result.
 */
Phaser.Circle.circumferencePoint = function (a, angle, asDegrees, out)
{
    if (asDegrees === undefined) { asDegrees = false; }
    if (out === undefined) { out = new Phaser.Point(); }

    if (asDegrees === true)
    {
        angle = Phaser.Math.degToRad(angle);
    }

    out.x = a.x + a.radius * Math.cos(angle);
    out.y = a.y + a.radius * Math.sin(angle);

    return out;
};

/**
 * Checks if the given Circle and Rectangle objects intersect.
 * @method Phaser.Circle.intersectsRectangle
 * @param {Phaser.Circle} c - The Circle object to test.
 * @param {Phaser.Rectangle} r - The Rectangle object to test.
 * @return {boolean} True if the two objects intersect, otherwise false.
 */
Phaser.Circle.intersectsRectangle = function (c, r)
{
    var cx = Math.abs(c.x - r.x - r.halfWidth);
    var xDist = r.halfWidth + c.radius;

    if (cx > xDist)
    {
        return false;
    }

    var cy = Math.abs(c.y - r.y - r.halfHeight);
    var yDist = r.halfHeight + c.radius;

    if (cy > yDist)
    {
        return false;
    }

    if (cx <= r.halfWidth || cy <= r.halfHeight)
    {
        return true;
    }

    var xCornerDist = cx - r.halfWidth;
    var yCornerDist = cy - r.halfHeight;
    var xCornerDistSq = xCornerDist * xCornerDist;
    var yCornerDistSq = yCornerDist * yCornerDist;
    var maxCornerDistSq = c.radius * c.radius;

    return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;
};

/**
 * Checks if the given Circle and Line objects intersect.
 * @method Phaser.Circle.intersectsLine
 * @param {Phaser.Circle} c - The Circle object to test.
 * @param {Phaser.Line} l - The Line object to test.
 * @param {boolean} [returnpoints] - optional Array Object, Return an array of intersection points if true, otherwise return boolean.
 * @return {boolean} True if the two objects intersect, otherwise false.
 */
Phaser.Circle.intersectsLine = function (c, l, returnPoints)
{
    var h = c.x;
    var k = c.y;
    var m = ((l.end.y - l.start.y) / (l.end.x - l.start.x));
    var n = l.end.y - (m * l.end.x);
    var a = c.radius;
    var b = c.radius;
    var del = n + m * h;

    var x0 = (h * (b * b) - m * (a * a) * (n - k) + a * b * (Math.sqrt((a * a) * (m * m) + (b * b) - (del * del) - (k * k) + (2 * del * k)))) / ((a * a) * (m * m) + (b * b));
    var x1 = (h * (b * b) - m * (a * a) * (n - k) - a * b * (Math.sqrt((a * a) * (m * m) + (b * b) - (del * del) - (k * k) + (2 * del * k)))) / ((a * a) * (m * m) + (b * b));

    var y0 = m * x0 + n;
    var y1 = m * x1 + n;
    var p0 = new Phaser.Point(x0, y0);
    var p1 = new Phaser.Point(x1, y1);
    var p0Exists = l.pointOnSegment(p0.x, p0.y, 0.01);
    var p1Exists = l.pointOnSegment(p1.x, p1.y, 0.01);

    if (p0Exists && p1Exists)
    {
        return returnPoints ? [ p0, p1 ] : true;
    }
    else if (p0Exists)
    {
        return returnPoints ? [ p0 ] : true;
    }
    else if (p1Exists)
    {
        return returnPoints ? [ p1 ] : true;
    }
    else
    {
        return returnPoints ? [] : false;
    }
};

//   Because PIXI uses its own Circle, we'll replace it with ours to avoid duplicating code or confusion.
PIXI.Circle = Phaser.Circle;
