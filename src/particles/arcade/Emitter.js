/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Emitter is a lightweight particle emitter that uses Arcade Physics.
* It can be used for one-time explosions or for continuous effects like rain and fire.
* All it really does is launch Particle objects out at set intervals, and fixes their positions and velocities accordingly.
*
* @class Phaser.Particles.Arcade.Emitter
* @constructor
* @extends Phaser.Group
* @param {Phaser.Game} game - Current game instance.
* @param {number} [x=0] - The x coordinate within the Emitter that the particles are emitted from.
* @param {number} [y=0] - The y coordinate within the Emitter that the particles are emitted from.
* @param {number} [maxParticles=50] - The total number of particles in this emitter.
*/
Phaser.Particles.Arcade.Emitter = function (game, x, y, maxParticles) {

    /**
    * @property {number} maxParticles - The total number of particles in this emitter.
    * @default
    */
    this.maxParticles = maxParticles || 50;

    Phaser.Group.call(this, game);

    /**
    * @property {number} _id - Internal ID for this emitter -- only used by the Particle System in most cases
    * @private
    */
    this._id = this.game.particles.ID++;

    /**
    * @property {string} name - A handy string name for this emitter. Can be set to anything.
    */
    this.name = 'emitter' + this.id;

    /**
    * @property {number} type - Internal Phaser Type value.
    * @protected
    */
    this.type = Phaser.EMITTER;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.GROUP;

    /**
    * @property {Phaser.Rectangle} area - The {@link #setSize size} of the emitter's emit area. The **actual** emit area is a rectangle of this size centered on (emitX, emitY): `{x: this.left, y: this.top, width: this.area.width, height: this.area.height}`. Particles are generated at a random position within this area.
    * @default
    */
    this.area = new Phaser.Rectangle(x, y, 1, 1);

    /**
     * @property {?number} minAngle - The minimum angle of initial particle velocities, in degrees. When set to a non-null value (with {@link #maxAngle}), {@link #minSpeed} and {@link #maxSpeed} are used and {@link #minParticleSpeed} and {@link #maxParticleSpeed} are ignored.
     * @default
     */
    this.minAngle = null;

    /**
     * @property {?number} maxAngle - The maximum angle of initial particle velocities, in degrees. When set to a non-null value (with {@link #minAngle}), {@link #minSpeed} and {@link #maxSpeed} are used and {@link #minParticleSpeed} and {@link #maxParticleSpeed} are ignored.
     * @default
     */
    this.maxAngle = null;

    /**
     * @property {number} minSpeed - The minimum initial speed of particles released within {@link #minAngle} and {@link #maxAngle}.
     * @default
     */
    this.minSpeed = 0;

    /**
     * @property {number} maxSpeed - The maximum initial speed of particles released within {@link #minAngle} and {@link #maxAngle}.
     * @default
     */
    this.maxSpeed = 100;

    /**
    * @property {Phaser.Point} minParticleSpeed - The minimum possible velocity of a particle.
    * @default
    */
    this.minParticleSpeed = new Phaser.Point(-100, -100);

    /**
    * @property {Phaser.Point} maxParticleSpeed - The maximum possible velocity of a particle.
    * @default
    */
    this.maxParticleSpeed = new Phaser.Point(100, 100);

    /**
    * @property {number} minParticleScale - The minimum possible scale of a particle. This is applied to the X and Y axis. If you need to control each axis see minParticleScaleX.
    * @default
    */
    this.minParticleScale = 1;

    /**
    * @property {number} maxParticleScale - The maximum possible scale of a particle. This is applied to the X and Y axis. If you need to control each axis see maxParticleScaleX.
    * @default
    */
    this.maxParticleScale = 1;

    /**
    * @property {array} scaleData - An array of the calculated scale easing data applied to particles with scaleRates > 0.
    */
    this.scaleData = null;

    /**
    * @property {number} minRotation - The minimum possible angular velocity of a particle.
    * @default
    */
    this.minRotation = -360;

    /**
    * @property {number} maxRotation - The maximum possible angular velocity of a particle.
    * @default
    */
    this.maxRotation = 360;

    /**
    * @property {number} minParticleAlpha - The minimum possible alpha value of a particle.
    * @default
    */
    this.minParticleAlpha = 1;

    /**
    * @property {number} maxParticleAlpha - The maximum possible alpha value of a particle.
    * @default
    */
    this.maxParticleAlpha = 1;

    /**
    * @property {array} alphaData - An array of the calculated alpha easing data applied to particles with alphaRates > 0.
    */
    this.alphaData = null;

    /**
    * @property {function} particleClass - For emitting your own particle class types. They must extend Phaser.Particle.
    * @default
    */
    this.particleClass = Phaser.Particle;

    /**
    * @property {Phaser.Point} particleDrag - The X and Y drag component of particles launched from the emitter.
    */
    this.particleDrag = new Phaser.Point();

    /**
    * @property {number} angularDrag - The angular drag component of particles launched from the emitter if they are rotating.
    * @default
    */
    this.angularDrag = 0;

    /**
    * @property {number} frequency - How often a particle is emitted in ms (if emitter is started with Explode === false).
    * @default
    */
    this.frequency = 100;

    /**
    * @property {number} lifespan - How long each particle lives once it is emitted in ms. Default is 2 seconds. Set lifespan to 'zero' for particles to live forever.
    * @default
    */
    this.lifespan = 2000;

    /**
    * @property {Phaser.Point} bounce - How much each particle should bounce on each axis. 1 = full bounce, 0 = no bounce.
    */
    this.bounce = new Phaser.Point();

    /**
    * @property {boolean} on - Determines whether the emitter is currently emitting particles. It is totally safe to directly toggle this.
    * @default
    */
    this.on = false;

    /**
    * @property {Phaser.Point} particleAnchor - When a particle is created its anchor will be set to match this Point object (defaults to x/y: 0.5 to aid in rotation)
    * @default
    */
    this.particleAnchor = new Phaser.Point(0.5, 0.5);

    /**
    * @property {number} blendMode - The blendMode as set on the particle when emitted from the Emitter. Defaults to NORMAL. Needs browser capable of supporting canvas blend-modes (most not available in WebGL)
    * @default
    */
    this.blendMode = Phaser.blendModes.NORMAL;

    /**
    * The point the particles are emitted from.
    * Emitter.x and Emitter.y control the containers location, which updates all current particles
    * Emitter.emitX and Emitter.emitY control the emission location relative to the x/y position.
    * @property {number} emitX
    */
    this.emitX = x;

    /**
    * The point the particles are emitted from.
    * Emitter.x and Emitter.y control the containers location, which updates all current particles
    * Emitter.emitX and Emitter.emitY control the emission location relative to the x/y position.
    * @property {number} emitY
    */
    this.emitY = y;

    /**
    * @property {boolean} autoScale - When a new Particle is emitted this controls if it will automatically scale in size. Use Emitter.setScale to configure.
    */
    this.autoScale = false;

    /**
    * @property {boolean} autoAlpha - When a new Particle is emitted this controls if it will automatically change alpha. Use Emitter.setAlpha to configure.
    */
    this.autoAlpha = false;

    /**
    * @property {boolean} particleBringToTop - If this is `true` then when the Particle is emitted it will be bought to the top of the Emitters display list.
    * @default
    */
    this.particleBringToTop = false;

    /**
    * @property {boolean} particleSendToBack - If this is `true` then when the Particle is emitted it will be sent to the back of the Emitters display list.
    * @default
    */
    this.particleSendToBack = false;

    /**
    * @property {object} counts - Records emitter activity.
    * @property {number} counts.emitted - How many particles were emitted during the last update.
    * @property {number} counts.failed - How many particles could not be emitted during the last update (because no particles were available).
    * @property {number} counts.totalEmitted - How many particles have been emitted.
    * @property {number} counts.totalFailed - How many particles could not be emitted when they were due (because no particles were available).
    */
    this.counts = {
        emitted: 0,
        failed: 0,
        totalEmitted: 0,
        totalFailed: 0
    };

    /**
    * @property {Phaser.Point} _gravity - Internal gravity value.
    * @private
    */
    this._gravity = new Phaser.Point(0, 100);

    /**
    * @property {Phaser.Point} _minParticleScale - Internal particle scale var.
    * @private
    */
    this._minParticleScale = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} _maxParticleScale - Internal particle scale var.
    * @private
    */
    this._maxParticleScale = new Phaser.Point(1, 1);

    /**
    * @property {number} _total - Internal helper for deciding how many particles to launch (via {@link #start}).
    * @private
    */
    this._total = 0;

    /**
    * @property {number} _timer - Internal helper for deciding when to launch particles or kill them.
    * @private
    */
    this._timer = 0;

    /**
    * @property {number} _counter - Internal counter for figuring out how many particles to launch.
    * @private
    */
    this._counter = 0;

    /**
    * @property {number} _flowQuantity - Internal counter for figuring out how many particles to launch per flow update.
    * @private
    */
    this._flowQuantity = 0;

    /**
    * @property {number} _flowTotal - Internal counter for figuring out how many particles to launch in total (via {@link #flow}).
    * @private
    */
    this._flowTotal = 0;

    /**
    * @property {boolean} _explode - Internal helper for the style of particle emission (all at once, or one at a time).
    * @private
    */
    this._explode = true;

    /**
    * @property {any} _frames - Internal helper for the particle frame.
    * @private
    */
    this._frames = null;

};

Phaser.Particles.Arcade.Emitter.prototype = Object.create(Phaser.Group.prototype);
Phaser.Particles.Arcade.Emitter.prototype.constructor = Phaser.Particles.Arcade.Emitter;

/**
* Called automatically by the game loop, decides when to launch particles and when to "die".
*
* @method Phaser.Particles.Arcade.Emitter#update
*/
Phaser.Particles.Arcade.Emitter.prototype.update = function () {

    this.counts.emitted = 0;
    this.counts.failed = 0;

    if (this.on && this.game.time.time >= this._timer)
    {
        this._timer = this.game.time.time + this.frequency * this.game.time.slowMotion;

        if (this._flowTotal !== 0)
        {
            if (this._flowQuantity > 0)
            {
                for (var i = 0; i < this._flowQuantity; i++)
                {
                    if (this.emitParticle())
                    {
                        this._counter++;

                        if (this._flowTotal !== -1 && this._counter >= this._flowTotal)
                        {
                            this.on = false;
                            break;
                        }
                    }
                }
            }
            else
            {
                if (this.emitParticle())
                {
                    this._counter++;

                    if (this._flowTotal !== -1 && this._counter >= this._flowTotal)
                    {
                        this.on = false;
                    }
                }
            }
        }
        else
        {
            if (this.emitParticle())
            {
                this._counter++;

                if (this._total > 0 && this._counter >= this._total)
                {
                    this.on = false;
                }
            }
        }

    }

    var i = this.children.length;

    while (i--)
    {
        if (this.children[i].exists)
        {
            this.children[i].update();
        }
    }

};

/**
* This function generates a new set of particles for use by this emitter.
* The particles are stored internally waiting to be emitted via Emitter.start.
*
* @method Phaser.Particles.Arcade.Emitter#makeParticles
* @param {array|string} keys - A string or an array of strings that the particle sprites will use as their texture. If an array one is picked at random.
* @param {array|number} [frames=0] - A frame number, or array of frames that the sprite will use. If an array one is picked at random.
* @param {number} [quantity] - The number of particles to generate. If not given it will use the value of Emitter.maxParticles. If the value is greater than Emitter.maxParticles it will use Emitter.maxParticles as the quantity.
* @param {boolean} [collide=false] - If you want the particles to be able to collide with other Arcade Physics bodies then set this to true.
* @param {boolean} [collideWorldBounds=false] - A particle can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
* @param {object} [particleArguments=null] - Custom arguments to pass to your particle class
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.makeParticles = function (keys, frames, quantity, collide, collideWorldBounds, particleArguments) {

    if (frames === undefined) { frames = 0; }
    if (quantity === undefined) { quantity = this.maxParticles; }
    if (collide === undefined) { collide = false; }
    if (collideWorldBounds === undefined) { collideWorldBounds = false; }
    if (particleArguments === undefined) { particleArguments = null; }

    var particle;
    var i = 0;
    var rndKey = keys;
    var rndFrame = frames;
    this._frames = frames;

    if (quantity > this.maxParticles)
    {
        this.maxParticles = quantity;
    }

    while (i < quantity)
    {
        if (Array.isArray(keys))
        {
            rndKey = this.game.rnd.pick(keys);
        }

        if (Array.isArray(frames))
        {
            rndFrame = this.game.rnd.pick(frames);
        }

        particle = new this.particleClass(this.game, 0, 0, rndKey, rndFrame, particleArguments);

        this.game.physics.arcade.enable(particle, false);

        particle.body.checkCollision.none = !collide;
        particle.body.collideWorldBounds = collideWorldBounds;
        particle.body.skipQuadTree = true;

        particle.exists = false;
        particle.visible = false;
        particle.anchor.copyFrom(this.particleAnchor);

        this.add(particle);

        i++;
    }

    return this;

};

/**
* Call this function to turn off all the particles and the emitter.
*
* @method Phaser.Particles.Arcade.Emitter#kill
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.kill = function () {

    this.on = false;
    this.alive = false;
    this.exists = false;

    return this;

};

/**
* Handy for bringing game objects "back to life". Just sets alive and exists back to true.
*
* @method Phaser.Particles.Arcade.Emitter#revive
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.revive = function () {

    this.alive = true;
    this.exists = true;

    return this;

};

/**
* Call this function to emit the given quantity of particles at all once (an explosion)
*
* @method Phaser.Particles.Arcade.Emitter#explode
* @param {number} [lifespan=0] - How long each particle lives once emitted in ms. 0 = forever.
* @param {number} [quantity=this.maxParticles] - How many particles to launch.
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.explode = function (lifespan, quantity) {

    if (quantity === undefined) {
        quantity = this.maxParticles;
    }

    this._flowTotal = 0;

    this.start(true, lifespan, 0, quantity, false);

    return this;

};

/**
* Call this function to start emitting a flow of particles.
* `quantity` particles are released every interval of `frequency` ms until `total` particles have been released (or forever).
* If you set the total to be 20 and quantity to be 5 then flow will emit 4 times in total (4 × 5 = 20 total) and then turn {@link #on off}.
* If you set the total to be -1 then no quantity cap is used and it will keep emitting (as long as there are inactive particles available).
*
* {@link #output}, {@link #lifespanOutput}, and {@link #remainder} describe the particle flow rate.
* During a stable flow, the number of active particles approaches {@link #lifespanOutput} and the number of inactive particles approaches {@link #remainder}.
* If {@link #remainder} is less than 0, there will likely be no particles available for a portion of the flow (see {@link #count}).
*
* @method Phaser.Particles.Arcade.Emitter#flow
* @param {number} [lifespan=0] - How long each particle lives once emitted in ms. 0 = forever.
* @param {number} [frequency=250] - The interval between each release of particles, given in ms. Values between 0 and 16.66 will behave the same (60 releases per second).
* @param {number} [quantity=1] - How many particles to launch at each interval. Not larger than {@link #maxParticles}.
* @param {number} [total=-1] - Turn {@link #on off} after launching this many particles in total. If -1 it will carry on indefinitely.
* @param {boolean} [immediate=true] - Should the flow start immediately (true) or wait until the first frequency event? (false)
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.flow = function (lifespan, frequency, quantity, total, immediate) {

    if (frequency === undefined || frequency === null) { frequency = 250; }
    if (quantity === undefined || quantity === 0) { quantity = 1; }
    if (total === undefined) { total = -1; }
    if (immediate === undefined) { immediate = true; }

    if (quantity > this.maxParticles)
    {
        quantity = this.maxParticles;
    }

    this._counter = 0;
    this._flowQuantity = quantity;
    this._flowTotal = total;

    if (immediate)
    {
        this.start(true, lifespan, frequency, quantity);

        this._counter += quantity;
        this.on = true;
        this._timer = this.game.time.time + frequency * this.game.time.slowMotion;
    }
    else
    {
        this.start(false, lifespan, frequency, quantity);
    }

    return this;

};

/**
* Start emitting particles.
*
* {@link #explode} and {@link #flow} are simpler methods.
*
* There are two patterns, based on the `explode` argument:
*
* ##### explode=true
*
*     start(true, lifespan=0, null, total)
*
* When `explode` is true or `forceQuantity` is true, `start` emits `total` particles immediately. You should pass a nonzero `total`.
*
* ##### explode=false
*
*     start(false, lifespan=0, frequency=250, total=0)
*
* When `explode` is false and `forceQuantity` is false, `start` emits 1 particle every interval of `frequency` ms. If `total` is not zero, the emitter turns itself off after `total` particles have been released. If `total` is zero, the emitter keeps emitting particles as long as they are available. To emit more than 1 particle per flow interval, use {@link #flow} instead.
*
* `forceQuantity` seems equivalent to `explode` and can probably be avoided.
*
* @method Phaser.Particles.Arcade.Emitter#start
* @param {boolean} [explode=true] - Whether the particles should all burst out at once (true) or at the frequency given (false).
* @param {number} [lifespan=0] - How long each particle lives once emitted in ms. 0 = forever.
* @param {number} [frequency=250] - The interval between each release of 1 particle, when `explode` is false. Value given in ms. Ignored if `explode` is set to true.
* @param {number} [total=0] - Turn {@link #on off} after launching this many particles in total.
* @param {number} [forceQuantity=false] - Equivalent to `explodes`.
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.start = function (explode, lifespan, frequency, total, forceQuantity) {

    if (explode === undefined) { explode = true; }
    if (lifespan === undefined) { lifespan = 0; }
    if (frequency === undefined || frequency === null) { frequency = 250; }
    if (total === undefined) { total = 0; }
    if (forceQuantity === undefined) { forceQuantity = false; }

    if (total > this.maxParticles)
    {
        total = this.maxParticles;
    }

    this.revive();

    this.visible = true;

    this.lifespan = lifespan;
    this.frequency = frequency;

    if (explode || forceQuantity)
    {
        for (var i = 0; i < total; i++)
        {
            this.emitParticle();
        }
    }
    else
    {
        this.on = true;
        this._total = total;
        this._counter = 0;
        this._timer = this.game.time.time + frequency * this.game.time.slowMotion;
    }

    return this;

};

/**
* This function is used internally to emit the next particle in the queue.
*
* However it can also be called externally to emit a particle.
*
* When called externally you can use the arguments to override any defaults the Emitter has set.
*
* The newly emitted particle is available in {@link Phaser.Particles.Arcade.Emitter#cursor}.
*
* @method Phaser.Particles.Arcade.Emitter#emitParticle
* @param {number} [x] - The x coordinate to emit the particle from. If `null` or `undefined` it will use `Emitter.emitX` or if the Emitter has a width > 1 a random value between `Emitter.left` and `Emitter.right`.
* @param {number} [y] - The y coordinate to emit the particle from. If `null` or `undefined` it will use `Emitter.emitY` or if the Emitter has a height > 1 a random value between `Emitter.top` and `Emitter.bottom`.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - This is the image or texture used by the Particle during rendering. It can be a string which is a reference to the Cache Image entry, or an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If this Particle is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
* @return {boolean} True if a particle was emitted, otherwise false.
*/
Phaser.Particles.Arcade.Emitter.prototype.emitParticle = function (x, y, key, frame) {

    if (x === undefined) { x = null; }
    if (y === undefined) { y = null; }

    var particle = this.getNextParticle();

    if (particle === null)
    {
        this.counts.failed++;
        this.counts.totalFailed++;

        return false;
    }

    this.counts.emitted++;
    this.counts.totalEmitted++;

    var rnd = this.game.rnd;

    if (key !== undefined && frame !== undefined)
    {
        particle.loadTexture(key, frame);
    }
    else if (key !== undefined)
    {
        particle.loadTexture(key);
        particle.frame = Array.isArray(this._frames) ? rnd.pick(this._frames) : this._frames;
    }

    var emitX = this.emitX;
    var emitY = this.emitY;

    if (x !== null)
    {
        emitX = x;
    }
    else if (this.width > 1)
    {
        emitX = rnd.between(this.left, this.right);
    }

    if (y !== null)
    {
        emitY = y;
    }
    else if (this.height > 1)
    {
        emitY = rnd.between(this.top, this.bottom);
    }

    this.resetParticle(particle, emitX, emitY);

    return true;

};


/**
* Helper for {@link #emitParticle}. Gets the next available particle.
*
* @private
* @return {?Phaser.Particle} The first particle with exists=false, or null
*/
Phaser.Particles.Arcade.Emitter.prototype.getNextParticle = function () {

    var i = this.length;

    while (i--)
    {
        var next = this.next();

        if (!next.exists)
        {
            return next;
        }
    }

    return null;

};

/**
 * Helper for {@link #emitParticle}. Sets particle properties and calls {@link Particle#onEmit}.
 *
 * @private
 * @param {Phaser.Particle} particle
 * @param {number} x
 * @param {number} y
 */
Phaser.Particles.Arcade.Emitter.prototype.resetParticle = function (particle, x, y) {

    var rnd = this.game.rnd;

    particle.reset(x, y);

    particle.angle = 0;
    particle.lifespan = this.lifespan;

    if (this.particleBringToTop)
    {
        this.bringToTop(particle);
    }
    else if (this.particleSendToBack)
    {
        this.sendToBack(particle);
    }

    if (this.autoScale)
    {
        particle.setScaleData(this.scaleData);
    }
    else if (this.minParticleScale !== 1 || this.maxParticleScale !== 1)
    {
        particle.scale.set(rnd.realInRange(this.minParticleScale, this.maxParticleScale));
    }
    else if ((this._minParticleScale.x !== this._maxParticleScale.x) || (this._minParticleScale.y !== this._maxParticleScale.y))
    {
        particle.scale.set(rnd.realInRange(this._minParticleScale.x, this._maxParticleScale.x), rnd.realInRange(this._minParticleScale.y, this._maxParticleScale.y));
    }
    else
    {
        particle.scale.set(this._minParticleScale.x, this._minParticleScale.y);
    }

    if (this.autoAlpha)
    {
        particle.setAlphaData(this.alphaData);
    }
    else
    {
        particle.alpha = rnd.realInRange(this.minParticleAlpha, this.maxParticleAlpha);
    }

    particle.blendMode = this.blendMode;

    var body = particle.body;

    body.updateBounds();

    body.bounce.copyFrom(this.bounce);
    body.drag.copyFrom(this.particleDrag);

    if (this.minAngle != null && this.maxAngle != null)
    {
        this.game.physics.arcade.velocityFromAngle(
            (this.minAngle === this.maxAngle) ? this.minAngle : rnd.between(this.minAngle, this.maxAngle),
            (this.minSpeed === this.maxSpeed) ? this.minSpeed : rnd.between(this.minSpeed, this.maxSpeed),
            body.velocity
            );
    }
    else
    {
        body.velocity.x = rnd.between(this.minParticleSpeed.x, this.maxParticleSpeed.x);
        body.velocity.y = rnd.between(this.minParticleSpeed.y, this.maxParticleSpeed.y);
    }

    body.angularVelocity = rnd.between(this.minRotation, this.maxRotation);
    body.gravity.copyFrom(this.gravity);
    body.angularDrag = this.angularDrag;

    particle.onEmit();

};

/**
* Destroys this Emitter, all associated child Particles and then removes itself from the Particle Manager.
*
* @method Phaser.Particles.Arcade.Emitter#destroy
*/
Phaser.Particles.Arcade.Emitter.prototype.destroy = function () {

    this.game.particles.remove(this);

    Phaser.Group.prototype.destroy.call(this, true, false);

};

/**
* A more compact way of setting the width and height of the emitter.
*
* @method Phaser.Particles.Arcade.Emitter#setSize
* @param {number} width - The desired width of the emitter (particles are spawned randomly within these dimensions).
* @param {number} height - The desired height of the emitter.
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.setSize = function (width, height) {

    this.area.width = width;
    this.area.height = height;

    return this;

};

/**
* A more compact way of setting the X velocity range of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setXSpeed
* @param {number} [min=0] - The minimum value for this range.
* @param {number} [max=0] - The maximum value for this range.
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.setXSpeed = function (min, max) {

    min = min || 0;
    max = max || 0;

    this.minParticleSpeed.x = min;
    this.maxParticleSpeed.x = max;

    return this;

};

/**
* A more compact way of setting the Y velocity range of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setYSpeed
* @param {number} [min=0] - The minimum value for this range.
* @param {number} [max=0] - The maximum value for this range.
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.setYSpeed = function (min, max) {

    min = min || 0;
    max = max || 0;

    this.minParticleSpeed.y = min;
    this.maxParticleSpeed.y = max;

    return this;

};

/**
* A more compact way of setting the angular velocity constraints of the particles.
*
* @method Phaser.Particles.Arcade.Emitter#setRotation
* @param {number} [min=0] - The minimum value for this range.
* @param {number} [max=0] - The maximum value for this range.
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.setRotation = function (min, max) {

    min = min || 0;
    max = max || 0;

    this.minRotation = min;
    this.maxRotation = max;

    return this;

};

/**
* A more compact way of setting the alpha constraints of the particles.
* The rate parameter, if set to a value above zero, lets you set the speed at which the Particle change in alpha from min to max.
* If rate is zero, which is the default, the particle won't change alpha - instead it will pick a random alpha between min and max on emit.
*
* @method Phaser.Particles.Arcade.Emitter#setAlpha
* @param {number} [min=1] - The minimum value for this range.
* @param {number} [max=1] - The maximum value for this range.
* @param {number} [rate=0] - The rate (in ms) at which the particles will change in alpha from min to max, or set to zero to pick a random alpha between the two.
* @param {function} [ease=Phaser.Easing.Linear.None] - If you've set a rate > 0 this is the easing formula applied between the min and max values.
* @param {boolean} [yoyo=false] - If you've set a rate > 0 you can set if the ease will yoyo or not (i.e. ease back to its original values)
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.setAlpha = function (min, max, rate, ease, yoyo) {

    if (min === undefined) { min = 1; }
    if (max === undefined) { max = 1; }
    if (rate === undefined) { rate = 0; }
    if (ease === undefined) { ease = Phaser.Easing.Linear.None; }
    if (yoyo === undefined) { yoyo = false; }

    this.minParticleAlpha = min;
    this.maxParticleAlpha = max;
    this.autoAlpha = false;

    if (rate > 0 && min !== max)
    {
        var tweenData = { v: min };
        var tween = this.game.make.tween(tweenData).to( { v: max }, rate, ease);
        tween.yoyo(yoyo);

        this.alphaData = tween.generateData(60);

        //  Inverse it so we don't have to do array length look-ups in Particle update loops
        this.alphaData.reverse();
        this.autoAlpha = true;
    }

    return this;

};

/**
* A more compact way of setting the scale constraints of the particles.
* The rate parameter, if set to a value above zero, lets you set the speed and ease which the Particle uses to change in scale from min to max across both axis.
* If rate is zero, which is the default, the particle won't change scale during update, instead it will pick a random scale between min and max on emit.
*
* @method Phaser.Particles.Arcade.Emitter#setScale
* @param {number} [minX=1] - The minimum value of Particle.scale.x.
* @param {number} [maxX=1] - The maximum value of Particle.scale.x.
* @param {number} [minY=1] - The minimum value of Particle.scale.y.
* @param {number} [maxY=1] - The maximum value of Particle.scale.y.
* @param {number} [rate=0] - The rate (in ms) at which the particles will change in scale from min to max, or set to zero to pick a random size between the two.
* @param {function} [ease=Phaser.Easing.Linear.None] - If you've set a rate > 0 this is the easing formula applied between the min and max values.
* @param {boolean} [yoyo=false] - If you've set a rate > 0 you can set if the ease will yoyo or not (i.e. ease back to its original values)
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.setScale = function (minX, maxX, minY, maxY, rate, ease, yoyo) {

    if (minX === undefined) { minX = 1; }
    if (maxX === undefined) { maxX = 1; }
    if (minY === undefined) { minY = 1; }
    if (maxY === undefined) { maxY = 1; }
    if (rate === undefined) { rate = 0; }
    if (ease === undefined) { ease = Phaser.Easing.Linear.None; }
    if (yoyo === undefined) { yoyo = false; }

    //  Reset these
    this.minParticleScale = 1;
    this.maxParticleScale = 1;

    this._minParticleScale.set(minX, minY);
    this._maxParticleScale.set(maxX, maxY);

    this.autoScale = false;

    if (rate > 0 && ((minX !== maxX) || (minY !== maxY)))
    {
        var tweenData = { x: minX, y: minY };
        var tween = this.game.make.tween(tweenData).to( { x: maxX, y: maxY }, rate, ease);
        tween.yoyo(yoyo);

        this.scaleData = tween.generateData(60);

        //  Inverse it so we don't have to do array length look-ups in Particle update loops
        this.scaleData.reverse();
        this.autoScale = true;
    }

    return this;

};

/**
 * Sets a radial pattern for emitting particles.
 *
 * This is a shorthand for setting {@link #minAngle}, {@link #maxAngle}, {@link #minSpeed}, and {@link #maxSpeed}.
 *
 * To remove the radial pattern, use `setAngle(null, null)`.
 *
 * @method Phaser.Particles.Arcade.Emitter#setAngle
 * @param {?number} minAngle - The minimum angle of initial particle velocities, in degrees.
 * @param {?number} maxAngle - The maximum angle of initial particle velocities, in degrees.
 * @param {number} [minSpeed] - The minimum initial particle speed.
 * @param {number} [maxSpeed] - The maximum initial particle speed.
 * @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
 */
Phaser.Particles.Arcade.Emitter.prototype.setAngle = function (minAngle, maxAngle, minSpeed, maxSpeed) {

    this.minAngle = minAngle;
    this.maxAngle = maxAngle;

    if (minSpeed != null) { this.minSpeed = minSpeed; }
    if (maxSpeed != null) { this.maxSpeed = maxSpeed; }

    return this;

};

/**
* Change the emitter's center to match the center of any object with a `center` property, such as an Arcade Body.
* If the object doesn't have a `center` property it will be set to the object's anchor-adjusted world position (`object.world`).
*
* @method Phaser.Particles.Arcade.Emitter#at
* @param {object|Phaser.Sprite|Phaser.Image|Phaser.TileSprite|Phaser.Text|PIXI.DisplayObject} object - The object that you wish to match the center with.
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.at = function (object) {

    if (object.center)
    {
        this.emitX = object.center.x;
        this.emitY = object.center.y;
    }
    else
    {
        this.emitX = object.world.x + (object.anchor.x * object.width);
        this.emitY = object.world.y + (object.anchor.y * object.height);
    }

    return this;

};

/**
 * @name Phaser.Particles.Arcade.Emitter#gravity
 * @property {Phaser.Point} gravity - Sets the `body.gravity` of each particle sprite to this on launch.
 */
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "gravity", {

    get: function () {
        return this._gravity;
    },

    set: function (value) {
        if (typeof value === "number")
        {
            this._gravity.y = value;
        }
        else
        {
            this._gravity = value;
        }
    }

});


/**
* @name Phaser.Particles.Arcade.Emitter#id
* @property {number} id - Gets the internal ID that represents this emitter.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "id", {
    get: function () {
        return this._id;
    }
});

/**
* @name Phaser.Particles.Arcade.Emitter#width
* @property {number} width - Gets or sets the width of the Emitter. This is the region in which a particle can be emitted.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "width", {

    get: function () {
        return this.area.width;
    },

    set: function (value) {
        this.area.width = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#height
* @property {number} height - Gets or sets the height of the Emitter. This is the region in which a particle can be emitted.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "height", {

    get: function () {
        return this.area.height;
    },

    set: function (value) {
        this.area.height = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#x
* @property {number} x - Gets or sets the x position of the Emitter.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "x", {

    get: function () {
        return this.emitX;
    },

    set: function (value) {
        this.emitX = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#y
* @property {number} y - Gets or sets the y position of the Emitter.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "y", {

    get: function () {
        return this.emitY;
    },

    set: function (value) {
        this.emitY = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#left
* @property {number} left - Gets the left position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "left", {

    get: function () {
        return Math.floor(this.x - (this.area.width / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#right
* @property {number} right - Gets the right position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "right", {

    get: function () {
        return Math.floor(this.x + (this.area.width / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#top
* @property {number} top - Gets the top position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "top", {

    get: function () {
        return Math.floor(this.y - (this.area.height / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#bottom
* @property {number} bottom - Gets the bottom position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "bottom", {

    get: function () {
        return Math.floor(this.y + (this.area.height / 2));
    }

});

/**
 * @name Phaser.Particles.Arcade.Emitter#output
 * @property {number} output - The number of particles released per second, after calling {@link #flow}.
 * @readonly
 */
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "output", {

    get: function () {
        return 1000 * this._flowQuantity / this.frequency;
    }

});

/**
 * @name Phaser.Particles.Arcade.Emitter#lifespanOutput
 * @property {number} lifespanOutput - The number of particles released during one particle's {@link #lifespan}, after calling {@link #flow}.
 * @readonly
 */
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "lifespanOutput", {

    get: function () {
        return (this.lifespan === 0 ? Infinity : this.lifespan) * this._flowQuantity / this.frequency;
    }

});

/**
 * @name Phaser.Particles.Arcade.Emitter#remainder
 * @property {number} remainder - The expected number of unreleased particles after a flow interval of {@link #lifespan}, after calling {@link #flow}.
 * @readonly
 */
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "remainder", {

    get: function () {
        return this.maxParticles - this.lifespanOutput;
    }

});

/**
* The last particle released, if any.
*
* You should treat this as read-only (and also avoid {@link #next} and {@link #previous}) once the emitter is started. Phaser uses it internally to track particles.
*
* @name Phaser.Particles.Arcade.Emitter#cursor
* @property {?DisplayObject} cursor
* @readonly
*/
// Inherited from Phaser.Group#cursor

/**
* Advances the cursor to the next particle.
*
* @method Phaser.Particles.Arcade.Emitter#next
* @protected
* @return {any} The child the cursor now points to.
*/
// Inherited from Phaser.Group#next

/**
* Moves the group cursor to the previous particle.
*
* @method Phaser.Particles.Arcade.Emitter#previous
* @protected
* @return {any} The child the cursor now points to.
*/
// Inherited from Phaser.Group#previous
