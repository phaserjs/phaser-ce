/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * This is the core internal game clock.
 *
 * It manages the elapsed time and calculation of elapsed values, used for game object motion and tweens,
 * and also handles the standard Timer pool.
 *
 * To create a general timed event, use the master {@link Phaser.Timer} accessible through {@link Phaser.Time#events events}.
 *
 * There are different types of time in Phaser.
 *
 * Animations, lifespan, particles, physics, timers, and tweens use game time, represented by {@link Phaser.Time#delta} and {@link Phaser.Time#deltaTotal}.
 * Game time is scaled by {@link Phaser.Time#slowMotion} and does not advance when paused.
 *
 * Input, sounds, and the Scale Manager use clock time, represented by {@link Phaser.Time#time}.
 *
 * @class Phaser.Time
 * @constructor
 * @param {Phaser.Game} game A reference to the currently running game.
 */
Phaser.Time = function (game)
{
    /**
     * @property {Phaser.Game} game - Local reference to game.
     * @protected
     */
    this.game = game;

    /**
     * The `Date.now()` value when the time was last updated.
     * @property {integer} time
     * @protected
     */
    this.time = 0;

    /**
     * An increasing value representing cumulative milliseconds since an undisclosed epoch.
     *
     * While this value is in milliseconds and can be used to compute time deltas,
     * it must must _not_ be used with `Date.now()` as it may not use the same epoch / starting reference.
     *
     * The source may either be from a high-res source (eg. if RAF is available) or the standard Date.now;
     * the value can only be relied upon within a particular game instance.
     *
     * This is updated only once per animation frame, even if multiple logic update steps are done.
     *
     * @property {number} now
     * @protected
     */
    this.now = 0;

    /**
     * Elapsed time since the last time update, in milliseconds, based on `now`.
     *
     * This value _may_ include time that the game is paused/inactive.
     *
     * While the game is active, this will be similar to (1000 / {@link #fps}).
     *
     * This is updated only once per animation frame, even if multiple logic update steps are done.
     *
     * Don't use this for game timing. Use {@link #delta} instead.
     *
     * @property {number} elapsed
     * @see Phaser.Time.time
     * @protected
     */
    this.elapsed = 0;

    /**
     * The time in ms since the last time update, in milliseconds, based on `time`.
     *
     * This value is corrected for game pauses and will be "about zero" after a game is resumed.
     *
     * This is updated at each logic update, possibly more than once per game loop.
     * If multiple consecutive logic update steps are done, `elapsedMS` will be close to zero after the first.
     *
     * Don't use this for game timing. Use {@link #deltaTime} instead.
     *
     * @property {integer} elapsedMS
     * @protected
     */
    this.elapsedMS = 0;

    /**
     * The current game step interval in milliseconds.
     * @property {number} delta
     */
    this.delta = 0;

    /**
     * The total of all step intervals in milliseconds.
     * @property {number} deltaTotal
     */
    this.deltaTotal = 0;

    /**
     * The maximum acceptable step interval in milliseconds, based on `desiredMinFps`. You can also set this directly.
     * @property {number} deltaMax
     */
    this.deltaMax = 200;

    /**
     * The desired step interval in seconds, based on `desiredFps`.
     * @property {integer} desiredFpsMult
     * @protected
     */
    this.desiredFpsMult = 1.0 / 60;

    /**
     * The desired frame rate of the game.
     * @property {number} _desiredFps
     * @private
     * @default
     * @see Phaser.Time#desiredFps
     */
    this._desiredFps = 60;

    /**
     * The suggested frame rate for your game, based on an averaged real frame rate.
     * This value is only populated if `Time.advancedTiming` is enabled.
     *
     * _Note:_ This is not available until after a few frames have passed; until then
     * it's set to the same value as desiredFps.
     *
     * @property {number} suggestedFps
     * @default
     */
    this.suggestedFps = this.desiredFps;

    /**
     * Scaling factor to make the game move smoothly in slow motion (or fast motion)
     *
     * - 1.0 = normal speed
     * - 2.0 = half speed
     * - 0.5 = double speed
     *
     * @property {number} slowMotion
     * @default
     */
    this.slowMotion = 1.0;

    /**
     * If true then advanced profiling, including the fps rate, fps min/max, suggestedFps and msMin/msMax are updated. This isn't expensive, but displaying it with {@link Phaser.Utils.Debug#text} can be, especially in WebGL mode.
     * @property {boolean} advancedTiming
     * @default
     */
    this.advancedTiming = false;

    /**
     * Advanced timing result: The number of animation frames received from the browser in the last second.
     *
     * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
     * @property {integer} frames
     * @readonly
     */
    this.frames = 0;

    /**
     * Advanced timing result: The number of {@link Phaser.Game#updateLogic logic updates} made in the last second.
     *
     * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
     * @property {integer} updates
     * @readonly
     */
    this.updates = 0;

    /**
     * Advanced timing result: The number of {@link Phaser.Game#updateRender renders} made in the last second.
     *
     * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
     * @property {integer} renders
     * @readonly
     */
    this.renders = 0;

    /**
     * Advanced timing result: Frames per second.
     *
     * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
     * @property {number} fps
     * @readonly
     */
    this.fps = 0;

    /**
     * Advanced timing result: Logic updates per second.
     *
     * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
     * @property {number} ups
     * @readonly
     */
    this.ups = 0;

    /**
     * Advanced timing result: Renders per second.
     *
     * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
     * @property {number} rps
     * @readonly
     */
    this.rps = 0;

    /**
     * Advanced timing result: The lowest rate the fps has dropped to.
     *
     * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
     * This value can be manually reset.
     * @property {number} fpsMin
     */
    this.fpsMin = 1000;

    /**
     * Advanced timing result: The highest rate the fps has reached (usually no higher than 60fps).
     *
     * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
     * This value can be manually reset.
     * @property {number} fpsMax
     */
    this.fpsMax = 0;

    /**
     * Advanced timing result: The minimum amount of time the game has taken between consecutive frames.
     *
     * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
     * This value can be manually reset.
     * @property {number} msMin
     * @default
     */
    this.msMin = 1000;

    /**
     * Advanced timing result: The maximum amount of time the game has taken between consecutive frames.
     *
     * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
     * This value can be manually reset.
     * @property {number} msMax
     */
    this.msMax = 0;

    /**
     * Records how long the game was last paused, in milliseconds.
     * (This is not updated until the game is resumed.)
     * @property {number} pauseDuration
     */
    this.pauseDuration = 0;

    /**
     * @property {number} timeToCall - The value that setTimeout needs to work out when to next update
     * @protected
     */
    this.timeToCall = 0;

    /**
     * @property {number} timeExpected - The time when the next call is expected when using setTimer to control the update loop
     * @protected
     */
    this.timeExpected = 0;

    /**
     * A {@link Phaser.Timer} object bound to the master clock (this Time object) which events can be added to.
     * @property {Phaser.Timer} events
     */
    this.events = new Phaser.Timer(this.game, false);

    /**
     * @property {number} _frameCount - count the number of calls to time.update since the last suggestedFps was calculated
     * @private
     */
    this._frameCount = 0;

    /**
     * @property {number} _elapsedAcumulator - sum of the elapsed time since the last suggestedFps was calculated
     * @private
     */
    this._elapsedAccumulator = 0;

    /**
     * @property {number} _started - The time at which the Game instance started.
     * @private
     */
    this._started = 0;

    /**
     * @property {number} _timeLastSecond - The time (in ms) that the last second counter ticked over.
     * @private
     */
    this._timeLastSecond = 0;

    /**
     * @property {number} _pauseStarted - The time the game started being paused.
     * @private
     */
    this._pauseStarted = 0;

    /**
     * @property {Phaser.Timer[]} _timers - Internal store of Phaser.Timer objects.
     * @private
     */
    this._timers = [];
};

Phaser.Time.prototype = {

    /**
     * Called automatically by Phaser.Game after boot. Should not be called directly.
     *
     * @method Phaser.Time#boot
     * @protected
     */
    boot: function ()
    {
        this._started = Date.now();
        this.time = Date.now();
        this.events.start();
        this.timeExpected = this.time;
    },

    /**
     * Adds an existing Phaser.Timer object to the Timer pool.
     *
     * @method Phaser.Time#add
     * @param {Phaser.Timer} timer - An existing Phaser.Timer object.
     * @return {Phaser.Timer} The given Phaser.Timer object.
     */
    add: function (timer)
    {
        this._timers.push(timer);

        return timer;
    },

    /**
     * Creates a new stand-alone Phaser.Timer object.
     *
     * @method Phaser.Time#create
     * @param {boolean} [autoDestroy=true] - A Timer that is set to automatically destroy itself will do so after all of its events have been dispatched (assuming no looping events).
     * @return {Phaser.Timer} The Timer object that was created.
     */
    create: function (autoDestroy)
    {
        if (autoDestroy === undefined) { autoDestroy = true; }

        var timer = new Phaser.Timer(this.game, autoDestroy);

        this._timers.push(timer);

        return timer;
    },

    /**
     * Remove all Timer objects, regardless of their state and clears all Timers from the {@link Phaser.Time#events events} timer.
     *
     * @method Phaser.Time#removeAll
     */
    removeAll: function ()
    {
        for (var i = 0; i < this._timers.length; i++)
        {
            this._timers[i].destroy();
        }

        this._timers = [];

        this.events.removeAll();
    },

    /**
     * Refreshes the Time.time and Time.elapsedMS properties from the system clock.
     *
     * @method Phaser.Time#refresh
     */
    refresh: function ()
    {
        var previousDateNow = this.time;

        this.time = Date.now();
        this.elapsedMS = this.time - previousDateNow;
    },

    /**
     * Updates the game clock and advanced timing data (if enabled) from the given timestamp.
     *
     * This is called automatically by Phaser.Game once per animation frame (RAF or setTimeout).
     *
     * @method Phaser.Time#update
     * @protected
     * @param {number} time - The current relative timestamp; see {@link Phaser.Time#now now}.
     */
    update: function (time)
    {
        //  Set to the old Date.now value
        var previousDateNow = this.time;
        var previousNow = this.now;

        this.time = Date.now();
        this.elapsedMS = this.time - previousDateNow;

        this.now = time;
        this.elapsed = this.now - previousNow;

        if (this.game.raf._isSetTimeOut)
        {
            this.timeToCall = Math.floor(Math.max(0, (1000.0 / this._desiredFps) + this.timeExpected - time));
            this.timeExpected = time + this.timeToCall;
        }

        if (this.advancedTiming)
        {
            this.updateAdvancedTiming();
        }
    },

    /**
     * Handles the updating of the Phaser.Timers (if any)
     * Called automatically by Time.update.
     *
     * @method Phaser.Time#updateTimers
     * @private
     */
    updateTimers: function ()
    {
        var i = 0;
        var len = this._timers.length;

        if (!len) { return; }

        while (i < len)
        {
            if (this._timers[i].update(this.deltaTotal))
            {
                i++;
            }
            else
            {
                //  Timer requests to be removed
                this._timers.splice(i, 1);
                len--;
            }
        }
    },

    /**
     * Handles the updating of the advanced timing values (if enabled)
     * Called automatically by Time.update.
     *
     * @method Phaser.Time#updateAdvancedTiming
     * @private
     */
    updateAdvancedTiming: function ()
    {
        // count the number of time.update calls
        this._frameCount++;
        this._elapsedAccumulator += this.elapsed;

        // occasionally recalculate the suggestedFps based on the accumulated elapsed time
        if (this._frameCount >= this._desiredFps * 2)
        {
            // this formula calculates suggestedFps in multiples of 5 fps
            this.suggestedFps = Math.floor(200 / (this._elapsedAccumulator / this._frameCount)) * 5;

            // the precise amount is (1000 * this._frameCount / this._elapsedAccumulator)

            this._frameCount = 0;
            this._elapsedAccumulator = 0;
        }

        this.msMin = Math.min(this.msMin, this.elapsed);
        this.msMax = Math.max(this.msMax, this.elapsed);

        this.frames++;

        if (this.now > this._timeLastSecond + 1000)
        {
            var interval = this.now - this._timeLastSecond;
            this.fps = Math.round((this.frames * 1000) / interval);
            this.ups = Math.round((this.updates * 1000) / interval);
            this.rps = Math.round((this.renders * 1000) / interval);
            this.fpsMin = Math.min(this.fpsMin, this.fps);
            this.fpsMax = Math.max(this.fpsMax, this.fps);
            this._timeLastSecond = this.now;
            this.frames = 0;
            this.updates = 0;
            this.renders = 0;
        }
    },

    /**
     * Updates the delta values.
     *
     * Counts one logic update if advanced timing is enabled.
     *
     * @method Phaser.Time#preUpdate
     * @private
     */
    preUpdate: function (delta)
    {
        delta *= 1000;

        this.delta = delta;
        this.deltaTotal += delta;

        if (!this.game.paused)
        {
            this.events.update(this.deltaTotal);
            this.updateTimers();
        }

        if (this.advancedTiming)
        {
            this.updates++;
        }
    },

    /**
     * Counts one render (if advanced timing is enabled).
     *
     * @method Phaser.Time#countRender
     * @private
     */
    preRender: function ()
    {
        if (this.advancedTiming)
        {
            this.renders++;
        }
    },

    /**
     * Called when the game enters a paused state.
     *
     * @method Phaser.Time#gamePaused
     * @private
     */
    gamePaused: function ()
    {
        this._pauseStarted = Date.now();
    },

    /**
     * Called when the game resumes from a paused state.
     *
     * @method Phaser.Time#gameResumed
     * @private
     */
    gameResumed: function ()
    {
        // Set the parameter which stores Date.now() to make sure it's correct on resume
        this.time = Date.now();

        this.pauseDuration = this.time - this._pauseStarted;
    },

    /**
     * The number of seconds that have elapsed since the game was started.
     *
     * @method Phaser.Time#totalElapsedSeconds
     * @return {number} The number of seconds that have elapsed since the game was started.
     */
    totalElapsedSeconds: function ()
    {
        return (this.time - this._started) * 0.001;
    },

    /**
     * How long has passed since the given time.
     *
     * @method Phaser.Time#elapsedSince
     * @param {number} since - The time you want to measure against.
     * @return {number} The difference between the given time and now.
     */
    elapsedSince: function (since)
    {
        return this.time - since;
    },

    /**
     * How long has passed since the given time (in seconds).
     *
     * @method Phaser.Time#elapsedSecondsSince
     * @param {number} since - The time you want to measure (in seconds).
     * @return {number} Duration between given time and now (in seconds).
     */
    elapsedSecondsSince: function (since)
    {
        return (this.time - since) * 0.001;
    },

    /**
     * Resets the private _started value to now and removes all currently running Timers.
     *
     * @method Phaser.Time#reset
     */
    reset: function ()
    {
        this._started = this.time;
        this.removeAll();
    }

};

/**
 * The number of logic updates per second.
 *
 * This is used is used to calculate {@link Phaser.Time#delta} when {@link Phaser.Game#forceSingleUpdate} is off.
 *
 * The render rate is unaffected unless you also turn off {@link Phaser.Game#forceSingleRender}.
 *
 * @name Phaser.Time#desiredFps
 * @type {integer}
 * @default 60
 */
Object.defineProperty(Phaser.Time.prototype, 'desiredFps', {

    get: function ()
    {
        return this._desiredFps;
    },

    set: function (value)
    {
        this._desiredFps = value;
        this.desiredFpsMult = 1.0 / value;
    }

});

/**
 * The smallest acceptable logic update rate.
 *
 * This is used is used to calculate {@link Phaser.Time#deltaMax}.
 *
 * It should be substantially smaller than {@link Phaser.Time#desiredFps}.
 *
 * @name Phaser.Time#desiredMinFps
 * @type {integer}
 * @default 5
 */
Object.defineProperty(Phaser.Time.prototype, 'desiredMinFps', {

    get: function ()
    {
        return 1000 / this.deltaMax;
    },

    set: function (value)
    {
        this.deltaMax = 1000 / value;
    }

});

Phaser.Time.prototype.constructor = Phaser.Time;
