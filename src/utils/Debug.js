/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A collection of methods for displaying debug information about game objects.
*
* If your game is running in Canvas mode, then you should invoke all of the Debug methods from
* your game's `render` function. This is because they are drawn directly onto the game canvas
* itself, so if you call any debug methods outside of `render` they are likely to be overwritten
* by the game itself.
*
* If your game is running in WebGL then Debug will create a Sprite that is placed at the top of the Stage display list and bind a canvas texture
* to it, which must be uploaded every frame. Be advised: this is very expensive, especially in browsers like Firefox. So please only enable Debug
* in WebGL mode if you really need it (or your desktop can cope with it well) and disable it for production!
*
* @class Phaser.Utils.Debug
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Utils.Debug = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {Phaser.Image} sprite - If debugging in WebGL mode, this is the Image displaying the debug {@link #bmd BitmapData}.
    */
    this.sprite = null;

    /**
    * @property {Phaser.BitmapData} bmd - In WebGL mode this BitmapData contains a copy of the debug canvas.
    */
    this.bmd = null;

    /**
    * @property {HTMLCanvasElement} canvas - The canvas to which Debug calls draws.
    */
    this.canvas = null;

    /**
    * @property {CanvasRenderingContext2D} context - The 2d context of the canvas.
    */
    this.context = null;

    /**
    * @property {string} font - The font that the debug information is rendered in.
    * @default
    */
    this.font = '14px Courier';

    /**
    * @property {number} columnWidth - The spacing between columns.
    * @default
    */
    this.columnWidth = 100;

    /**
    * @property {number} lineHeight - The line height between the debug text.
    * @default
    */
    this.lineHeight = 16;

    /**
    * @property {number} lineWidth - The width of the stroke on lines and shapes. A positive number.
    * @default
    */
    this.lineWidth = 1;

    /**
    * @property {boolean} renderShadow - Should the text be rendered with a slight shadow? Makes it easier to read on different types of background.
    * @default
    */
    this.renderShadow = true;

    /**
    * @property {string} currentColor - The color last set by {@link #start} or {@link #text}.
    * @default
    * @protected
    */
    this.currentColor = null;

    /**
    * @property {number} currentX - The current X position the debug information will be rendered at.
    * @default
    */
    this.currentX = 0;

    /**
    * @property {number} currentY - The current Y position the debug information will be rendered at.
    * @default
    */
    this.currentY = 0;

    /**
    * @property {number} currentAlpha - The alpha of the Debug context, set before all debug information is rendered to it.
    * @default
    */
    this.currentAlpha = 1;

    /**
    * @property {boolean} dirty - Does the canvas need re-rendering?
    * @default
    */
    this.dirty = false;

    /**
     * @property {boolean} isDisabled - If `enableDebug: false` is passed to {@link Phaser.Game} or if Phaser is built without the Debug class, this will be true.
     * @default
     * @readonly
     */
    this.isDisabled = false;

    /**
     * @property {Phaser.Line} _line - A reusable rendering line.
     * @private
     */
    this._line = null;

    /**
     * @property {Phaser.Rectangle} _rect - A reusable rendering rectangle.
     * @private
     */
    this._rect = null;

};

Phaser.Utils.Debug.prototype = {

    /**
    * Internal method that boots the debug displayer.
    *
    * @method Phaser.Utils.Debug#boot
    * @protected
    */
    boot: function () {

        if (this.game.renderType === Phaser.CANVAS)
        {
            this.context = this.game.context;
        }
        else
        {
            this.bmd = new Phaser.BitmapData(this.game, '__DEBUG', this.game.width, this.game.height, true);
            this.sprite = this.game.make.image(0, 0, this.bmd);
            this.game.stage.addChild(this.sprite);

            this.game.scale.onSizeChange.add(this.resize, this);

            this.canvas = Phaser.CanvasPool.create(this, this.game.width, this.game.height);
            this.context = this.canvas.getContext('2d');
        }

        this._line = new Phaser.Line();
        this._rect = new Phaser.Rectangle();

    },

    /**
    * Internal method that resizes the BitmapData and Canvas.
    * Called by ScaleManager.onSizeChange only in WebGL mode.
    *
    * @method Phaser.Utils.Debug#resize
    * @protected
    */
    resize: function () {

        this.bmd.resize(this.game.width, this.game.height);

        this.canvas.width = this.game.width;
        this.canvas.height = this.game.height;

    },

    /**
    * Internal method that clears the canvas (if a Sprite) ready for a new debug session.
    *
    * @method Phaser.Utils.Debug#preUpdate
    * @protected
    */
    preUpdate: function () {

        if (this.dirty && this.sprite)
        {
            this.bmd.clear();
            this.bmd.draw(this.canvas, 0, 0);

            this.context.clearRect(0, 0, this.game.width, this.game.height);
            this.dirty = false;
        }

    },

    /**
    * Clears the Debug canvas.
    *
    * @method Phaser.Utils.Debug#reset
    */
    reset: function () {

        if (this.context)
        {
            this.context.clearRect(0, 0, this.game.width, this.game.height);
        }

        if (this.sprite)
        {
            this.bmd.clear();
        }

    },

    /**
    * Internal method that resets and starts the debug output values.
    *
    * @method Phaser.Utils.Debug#start
    * @protected
    * @param {number} [x=0] - The X value the debug info will start from.
    * @param {number} [y=0] - The Y value the debug info will start from.
    * @param {string} [color='rgb(255,255,255)'] - The color the debug text will drawn in.
    * @param {number} [columnWidth=0] - The spacing between columns.
    */
    start: function (x, y, color, columnWidth) {

        if (typeof x !== 'number') { x = 0; }
        if (typeof y !== 'number') { y = 0; }
        color = color || 'rgb(255,255,255)';
        if (columnWidth === undefined) { columnWidth = 0; }

        this.currentX = x;
        this.currentY = y;
        this.currentColor = color;
        this.columnWidth = columnWidth;

        this.dirty = true;

        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.font = this.font;
        this.context.globalAlpha = this.currentAlpha;

    },

    /**
    * Internal method that stops the debug output.
    *
    * @method Phaser.Utils.Debug#stop
    * @protected
    */
    stop: function () {

        this.context.restore();

    },

    /**
    * Internal method that outputs a single line of text split over as many columns as needed, one per parameter.
    *
    * @method Phaser.Utils.Debug#line
    * @protected
    */
    line: function () {

        var x = this.currentX;

        for (var i = 0; i < arguments.length; i++)
        {
            if (this.renderShadow)
            {
                this.context.fillStyle = 'rgb(0,0,0)';
                this.context.fillText(arguments[i], x + 1, this.currentY + 1);
                this.context.fillStyle = this.currentColor;
            }

            this.context.fillText(arguments[i], x, this.currentY);

            x += this.columnWidth;
        }

        this.currentY += this.lineHeight;

    },

    /**
    * Render Sound Manager information, including volume, mute, audio mode, and locked status.
    *
    * @method Phaser.Utils.Debug#sound
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    sound: function (x, y, color) {

      var sound = this.game.sound;

      this.start(x, y, color);

      if (sound.noAudio)
      {
        this.line('Audio is disabled');
      }
      else
      {
        this.line('Volume: ' + sound.volume.toFixed(2) + (sound.mute ? ' (Mute)' : ''));
        this.line('Mute on pause: ' + sound.muteOnPause);
        this.line('Using: ' + (sound.usingWebAudio ? ('Web Audio - ' + sound.context.state) : 'Audio Tag'));
        this.line('Touch locked: ' + sound.touchLocked);
        this.line('Sounds: ' + sound._sounds.length);
      }

      this.stop();

    },

    /**
    * Render Sound information, including decoded state, duration, volume and more.
    *
    * @method Phaser.Utils.Debug#soundInfo
    * @param {Phaser.Sound} sound - The sound object to debug.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    soundInfo: function (sound, x, y, color) {

        this.start(x, y, color);
        this.line('Sound: ' + sound.key + ' Touch locked: ' + sound.game.sound.touchLocked);
        this.line('Is Ready?: ' + this.game.cache.isSoundReady(sound.key) + ' Pending Playback: ' + sound.pendingPlayback);
        this.line('Decoded: ' + sound.isDecoded + ' Decoding: ' + sound.isDecoding);
        this.line('Playing: ' + sound.isPlaying + ' Loop: ' + sound.loop);
        this.line('Time: ' + sound.currentTime + 'ms Total: ' + sound.totalDuration.toFixed(3) + 's');
        this.line('Volume: ' + sound.volume.toFixed(2) + (sound.mute ? ' (Mute)' : ''));
        this.line('Using: ' + (sound.usingWebAudio ? 'Web Audio' : 'Audio Tag'));

        if (sound.currentMarker !== '')
        {
            this.line('Marker: ' + sound.currentMarker + ' Duration: ' + sound.duration + ' (ms: ' + sound.durationMS + ')');
            this.line('Start: ' + sound.markers[sound.currentMarker].start + ' Stop: ' + sound.markers[sound.currentMarker].stop);
            this.line('Position: ' + sound.position);
        }

        this.stop();

    },

    /**
    * Marks the follow {@link #target} and {@link #deadzone}.
    *
    * @method Phaser.Utils.Debug#camera
    * @param {Phaser.Camera} camera - The Phaser.Camera to show the debug information for.
    * @param {string} [color] - Color of the debug shapes to be rendered (format is css color string).
    * @param {boolean} [filled=true] - Render the shapes filled (default, true) or stroked (false).
    */
    camera: function (camera, color, filled) {

        var deadzone = camera.deadzone;
        var target = camera.target;
        var view = camera.view;

        if (deadzone)
        {
            this._rect.setTo(view.x + deadzone.x, view.y + deadzone.y, deadzone.width, deadzone.height);
            this.rectangle(this._rect, color, filled);
        }

        if (target)
        {
            this._line.setTo(view.centerX, view.centerY, target.x, target.y);
            this.geom(this._line, color, filled);
            this.geom(target, color, false, 3);
        }

    },

    /**
    * Render camera information including dimensions and location.
    *
    * @method Phaser.Utils.Debug#cameraInfo
    * @param {Phaser.Camera} camera - The Phaser.Camera to show the debug information for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    cameraInfo: function (camera, x, y, color) {

        var bounds = camera.bounds;
        var deadzone = camera.deadzone;
        var target = camera.target;
        var view = camera.view;

        this.start(x, y, color);
        this.line('Camera (' + camera.width + ' x ' + camera.height + ')');
        this.line('x: ' + camera.x + ' y: ' + camera.y);
        this.line('Bounds: ' + (bounds ? ('x: ' + bounds.x + ' y: ' + bounds.y + ' w: ' + bounds.width + ' h: ' + bounds.height) : 'none'));
        this.line('View: x: ' + view.x + ' y: ' + view.y + ' w: ' + view.width + ' h: ' + view.height);
        this.line('Deadzone: ' + (deadzone ? ('x: ' + deadzone.x + ' y: ' + deadzone.y + ' w: ' + deadzone.width + ' h: ' + deadzone.height) : deadzone));
        this.line('Total in view: ' + camera.totalInView);
        this.line('At limit: x: ' + camera.atLimit.x + ' y: ' + camera.atLimit.y);
        this.line('Target: ' + (target ? (target.name || target) : 'none'));
        this.stop();

    },

    /**
    * Render Timer information.
    *
    * @method Phaser.Utils.Debug#timer
    * @param {Phaser.Timer} timer - The Phaser.Timer to show the debug information for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    timer: function (timer, x, y, color) {

        this.start(x, y, color);
        this.line('Timer (running: ' + timer.running + ' expired: ' + timer.expired + ')');
        this.line('Next Tick: ' + timer.next + ' Duration: ' + timer.duration);
        this.line('Paused: ' + timer.paused + ' Length: ' + timer.length);
        this.stop();

    },

    /**
    * Renders the Pointer.circle object onto the stage in green if down or red if up along with debug text.
    *
    * @method Phaser.Utils.Debug#pointer
    * @param {Phaser.Pointer} pointer - The Pointer you wish to display.
    * @param {boolean} [hideIfUp=false] - Doesn't render the circle if the pointer is up.
    * @param {string} [downColor='rgba(0,255,0,0.5)'] - The color the circle is rendered in if down.
    * @param {string} [upColor='rgba(255,0,0,0.5)'] - The color the circle is rendered in if up (and hideIfUp is false).
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    pointer: function (pointer, hideIfUp, downColor, upColor, color) {

        if (pointer == null)
        {
            return;
        }

        if (hideIfUp === undefined) { hideIfUp = false; }
        downColor = downColor || 'rgba(0,255,0,0.5)';
        upColor = upColor || 'rgba(255,0,0,0.5)';

        if (hideIfUp === true && pointer.isUp === true)
        {
            return;
        }

        this.start(pointer.x, pointer.y - 100, color);
        this.context.beginPath();
        this.context.arc(pointer.x, pointer.y, pointer.circle.radius, 0, Math.PI * 2);

        if (pointer.active)
        {
            this.context.fillStyle = downColor;
        }
        else
        {
            this.context.fillStyle = upColor;
        }

        this.context.fill();
        this.context.closePath();

        //  Render the points
        this.context.beginPath();
        this.context.moveTo(pointer.positionDown.x, pointer.positionDown.y);
        this.context.lineTo(pointer.position.x, pointer.position.y);
        this.context.lineWidth = 2;
        this.context.stroke();
        this.context.closePath();

        //  Render the text
        this.line('ID: ' + pointer.id + " Active: " + pointer.active);
        this.line('World X: ' + pointer.worldX + " World Y: " + pointer.worldY);
        this.line('Screen X: ' + pointer.x + " Screen Y: " + pointer.y + " In: " + pointer.withinGame);
        this.line('Duration: ' + pointer.duration + " ms");
        this.line('is Down: ' + pointer.isDown + " is Up: " + pointer.isUp);
        this.stop();

    },

    /**
    * Render Sprite Input Debug information.
    *
    * @method Phaser.Utils.Debug#spriteInputInfo
    * @param {Phaser.Sprite|Phaser.Image} sprite - The sprite to display the input data for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    spriteInputInfo: function (sprite, x, y, color) {

        this.start(x, y, color);
        this.line('Sprite Input: (' + sprite.width + ' x ' + sprite.height + ')');
        this.line('x: ' + sprite.input.pointerX().toFixed(1) + ' y: ' + sprite.input.pointerY().toFixed(1));
        this.line('over: ' + sprite.input.pointerOver() + ' duration: ' + sprite.input.overDuration().toFixed(0));
        this.line('down: ' + sprite.input.pointerDown() + ' duration: ' + sprite.input.downDuration().toFixed(0));
        this.line('just over: ' + sprite.input.justOver() + ' just out: ' + sprite.input.justOut());
        this.stop();

    },

    /**
    * Renders Phaser.Key object information.
    *
    * @method Phaser.Utils.Debug#key
    * @param {Phaser.Key} key - The Key to render the information for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    key: function (key, x, y, color) {

        this.start(x, y, color, 150);

        this.line('Key:', key.keyCode, 'isDown:', key.isDown);
        this.line('justDown:', key.justDown, 'justUp:', key.justUp);
        this.line('Time Down:', key.timeDown.toFixed(0), 'duration:', key.duration.toFixed(0));

        this.stop();

    },

    /**
    * Render debug information about the Input object.
    *
    * @method Phaser.Utils.Debug#inputInfo
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    inputInfo: function (x, y, color) {

        this.start(x, y, color);
        this.line('Input');
        this.line('X: ' + this.game.input.x + ' Y: ' + this.game.input.y);
        this.line('World X: ' + this.game.input.worldX + ' World Y: ' + this.game.input.worldY);
        this.line('Scale X: ' + this.game.input.scale.x.toFixed(1) + ' Scale Y: ' + this.game.input.scale.x.toFixed(1));
        this.line('Screen X: ' + this.game.input.activePointer.screenX + ' Screen Y: ' + this.game.input.activePointer.screenY);
        this.stop();

    },

    /**
    * Renders the Sprites bounds. Note: This is really expensive as it has to calculate the bounds every time you call it!
    *
    * @method Phaser.Utils.Debug#spriteBounds
    * @param {Phaser.Sprite|Phaser.Image} sprite - The sprite to display the bounds of.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {boolean} [filled=true] - Render the rectangle as a fillRect (default, true) or a strokeRect (false)
    */
    spriteBounds: function (sprite, color, filled) {

        var bounds = sprite.getBounds();

        bounds.x += this.game.camera.x;
        bounds.y += this.game.camera.y;

        this.rectangle(bounds, color, filled);

    },

    /**
    * Renders the Rope's segments. Note: This is really expensive as it has to calculate new segments every time you call it
    *
    * @method Phaser.Utils.Debug#ropeSegments
    * @param {Phaser.Rope} rope - The rope to display the segments of.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {boolean} [filled=true] - Render the rectangle as a fillRect (default, true) or a strokeRect (false)
    */
    ropeSegments: function (rope, color, filled) {

        var segments = rope.segments;

        var self = this;

        segments.forEach(function(segment) {
            self.rectangle(segment, color, filled);
        }, this);

    },

    /**
    * Render debug infos (including name, bounds info, position and some other properties) about the Sprite.
    *
    * @method Phaser.Utils.Debug#spriteInfo
    * @param {Phaser.Sprite} sprite - The Sprite to display the information of.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    spriteInfo: function (sprite, x, y, color) {

        this.start(x, y, color);

        this.line('Sprite: ' + (sprite.name || '') + ' (' + sprite.width + ' x ' + sprite.height + ') anchor: ' + sprite.anchor.x + ' x ' + sprite.anchor.y);
        this.line('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1));
        this.line('angle: ' + sprite.angle.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
        this.line('visible: ' + sprite.visible + ' in camera: ' + sprite.inCamera);
        this.line('bounds x: ' + sprite._bounds.x.toFixed(1) + ' y: ' + sprite._bounds.y.toFixed(1) + ' w: ' + sprite._bounds.width.toFixed(1) + ' h: ' + sprite._bounds.height.toFixed(1));

        this.stop();

    },

    /**
    * Renders the sprite coordinates in local, positional and world space.
    *
    * @method Phaser.Utils.Debug#spriteCoords
    * @param {Phaser.Sprite|Phaser.Image} sprite - The sprite to display the coordinates for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    spriteCoords: function (sprite, x, y, color) {

        this.start(x, y, color, 100);

        if (sprite.name)
        {
            this.line(sprite.name);
        }

        this.line('x:', sprite.x.toFixed(2), 'y:', sprite.y.toFixed(2));
        this.line('pos x:', sprite.position.x.toFixed(2), 'pos y:', sprite.position.y.toFixed(2));
        this.line('world x:', sprite.world.x.toFixed(2), 'world y:', sprite.world.y.toFixed(2));

        this.stop();

    },

    /**
    * Renders Line information in the given color.
    *
    * @method Phaser.Utils.Debug#lineInfo
    * @param {Phaser.Line} line - The Line to display the data for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    lineInfo: function (line, x, y, color) {

        this.start(x, y, color, 80);
        this.line('start.x:', line.start.x.toFixed(2), 'start.y:', line.start.y.toFixed(2));
        this.line('end.x:', line.end.x.toFixed(2), 'end.y:', line.end.y.toFixed(2));
        this.line('length:', line.length.toFixed(2), 'angle:', line.angle);
        this.stop();

    },

    /**
    * Renders a single pixel at the given size.
    *
    * @method Phaser.Utils.Debug#pixel
    * @param {number} x - X position of the pixel to be rendered.
    * @param {number} y - Y position of the pixel to be rendered.
    * @param {string} [color] - Color of the pixel (format is css color string).
    * @param {number} [size=2] - The 'size' to render the pixel at.
    */
    pixel: function (x, y, color, size) {

        size = size || 2;

        this.start();
        this.context.fillStyle = color;
        this.context.fillRect(x, y, size, size);
        this.stop();

    },

    /**
    * Renders a Phaser geometry object including Rectangle, Circle, Ellipse, Point or Line.
    *
    * @method Phaser.Utils.Debug#geom
    * @param {Phaser.Rectangle|Phaser.Circle|Phaser.Ellipse|Phaser.Point|Phaser.Line} object - The geometry object to render.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {boolean} [filled=true] - Render the objected as a filled (default, true) or a stroked (false)
    * @param {number} [forceType=0] - Force rendering of a specific type. If 0 no type will be forced, otherwise 1 = Rectangle, 2 = Circle,3 = Point, 4 = Line and 5 = Ellipse.
     */
    geom: function (object, color, filled, forceType) {

        if (filled === undefined) { filled = true; }
        if (forceType === undefined) { forceType = 0; }

        color = color || 'rgba(0,255,0,0.4)';

        this.start();

        this.context.fillStyle = color;
        this.context.strokeStyle = color;
        this.context.lineWidth = this.lineWidth;

        if (object instanceof Phaser.Rectangle || forceType === 1)
        {
            if (filled)
            {
                this.context.fillRect(object.x - this.game.camera.x, object.y - this.game.camera.y, object.width, object.height);
            }
            else
            {
                this.context.strokeRect(object.x - this.game.camera.x, object.y - this.game.camera.y, object.width, object.height);
            }
        }
        else if (object instanceof Phaser.Circle || forceType === 2)
        {
            this.context.beginPath();
            this.context.arc(object.x - this.game.camera.x, object.y - this.game.camera.y, object.radius, 0, Math.PI * 2, false);
            this.context.closePath();

            if (filled)
            {
                this.context.fill();
            }
            else
            {
                this.context.stroke();
            }
        }
        else if (object instanceof Phaser.Point || forceType === 3)
        {
            this.context.fillRect(object.x - this.game.camera.x, object.y - this.game.camera.y, 4, 4);
        }
        else if (object instanceof Phaser.Line || forceType === 4)
        {
            this.context.beginPath();
            this.context.moveTo((object.start.x + 0.5) - this.game.camera.x, (object.start.y + 0.5) - this.game.camera.y);
            this.context.lineTo((object.end.x + 0.5) - this.game.camera.x, (object.end.y + 0.5) - this.game.camera.y);
            this.context.closePath();
            this.context.stroke();
        }
        else if (object instanceof Phaser.Ellipse || forceType === 5)
        {
            this.context.beginPath();
            this.context.ellipse(object.x - this.game.camera.x, object.y - this.game.camera.y, object.width/2, object.height/2, 0,2 * Math.PI,false);
            this.context.closePath();

            if (filled)
            {
                this.context.fill();
            }
            else
            {
                this.context.stroke();
            }
        }

        this.stop();

    },

    /**
    * Renders a Rectangle.
    *
    * @method Phaser.Utils.Debug#rectangle
    * @param {Phaser.Rectangle|object} object - The rectangle to render.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {boolean} [filled=true] - Render the rectangle as filled (default, true) or a stroked (false)
    */
    rectangle: function (object, color, filled) {

        if (filled === undefined) { filled = true; }

        color = color || 'rgba(0, 255, 0, 0.4)';

        this.start();

        if (filled)
        {
            this.context.fillStyle = color;
            this.context.fillRect(object.x - this.game.camera.x, object.y - this.game.camera.y, object.width, object.height);
        }
        else
        {
            this.context.lineWidth = this.lineWidth;
            this.context.strokeStyle = color;
            this.context.strokeRect(object.x - this.game.camera.x, object.y - this.game.camera.y, object.width, object.height);
        }

        this.stop();

    },

    /**
    * Render a string of text.
    *
    * @method Phaser.Utils.Debug#text
    * @param {string} text - The line of text to draw.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {string} [font] - The font of text to draw.
    */
    text: function (text, x, y, color, font) {

        color = color || 'rgb(255,255,255)';
        font = font || this.font;

        this.start();
        this.context.font = font;

        if (this.renderShadow)
        {
            this.context.fillStyle = 'rgb(0,0,0)';
            this.context.fillText(text, x + 1, y + 1);
        }

        this.context.fillStyle = color;
        this.context.fillText(text, x, y);

        this.stop();

    },

    /**
    * Visually renders a QuadTree to the display.
    *
    * @method Phaser.Utils.Debug#quadTree
    * @param {Phaser.QuadTree} quadtree - The quadtree to render.
    * @param {string} color - The color of the lines in the quadtree.
    */
    quadTree: function (quadtree, color) {

        color = color || 'rgba(255,0,0,0.3)';

        this.start();

        var bounds = quadtree.bounds;

        if (quadtree.nodes.length === 0)
        {
            this.context.strokeStyle = color;
            this.context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            this.text('size: ' + quadtree.objects.length, bounds.x + 4, bounds.y + 16, 'rgb(0,200,0)', '12px Courier');

            this.context.strokeStyle = 'rgb(0,255,0)';

            for (var i = 0; i < quadtree.objects.length; i++)
            {
                this.context.strokeRect(quadtree.objects[i].x, quadtree.objects[i].y, quadtree.objects[i].width, quadtree.objects[i].height);
            }
        }
        else
        {
            for (var i = 0; i < quadtree.nodes.length; i++)
            {
                this.quadTree(quadtree.nodes[i]);
            }
        }

        this.stop();

    },

    /**
    * Render a Sprites Physics body if it has one set. The body is rendered as a filled or stroked rectangle.
    * This only works for Arcade Physics, Ninja Physics (AABB and Circle only) and Box2D Physics bodies.
    * To display a P2 Physics body you should enable debug mode on the body when creating it.
    *
    * @method Phaser.Utils.Debug#body
    * @param {Phaser.Sprite} sprite - The Sprite who's body will be rendered.
    * @param {string} [color='rgba(0,255,0,0.4)'] - Color of the debug rectangle to be rendered. The format is a CSS color string such as '#ff0000' or 'rgba(255,0,0,0.5)'.
    * @param {boolean} [filled=true] - Render the body as a filled rectangle (true) or a stroked rectangle (false)
    */
    body: function (sprite, color, filled) {

        if (sprite.body)
        {
            this.start();

            if (sprite.body.type === Phaser.Physics.ARCADE)
            {
                Phaser.Physics.Arcade.Body.render(this.context, sprite.body, color, filled, this.lineWidth);
            }
            else if (sprite.body.type === Phaser.Physics.NINJA)
            {
                Phaser.Physics.Ninja.Body.render(this.context, sprite.body, color, filled);
            }
            else if (sprite.body.type === Phaser.Physics.BOX2D)
            {
                Phaser.Physics.Box2D.renderBody(this.context, sprite.body, color);
            }

            this.stop();
        }

    },

    /**
    * Render a Sprites Physic Body information.
    *
    * @method Phaser.Utils.Debug#bodyInfo
    * @param {Phaser.Sprite} sprite - The sprite to be rendered.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    bodyInfo: function (sprite, x, y, color) {

        if (sprite.body)
        {
            this.start(x, y, color, 210);

            if (sprite.body.type === Phaser.Physics.ARCADE)
            {
                Phaser.Physics.Arcade.Body.renderBodyInfo(this, sprite.body);
            }
            else if (sprite.body.type === Phaser.Physics.BOX2D)
            {
                this.game.physics.box2d.renderBodyInfo(this, sprite.body);
            }

            this.stop();
        }

    },

    /**
    * Renders 'debug draw' data for the Box2D world if it exists.
    * This uses the standard debug drawing feature of Box2D, so colors will be decided by
    * the Box2D engine.
    *
    * @method Phaser.Utils.Debug#box2dWorld
    */
    box2dWorld: function () {

        this.start();

        this.context.translate(-this.game.camera.view.x, -this.game.camera.view.y, 0);
        this.game.physics.box2d.renderDebugDraw(this.context);

        this.stop();

    },

    /**
    * Renders 'debug draw' data for the given Box2D body.
    * This uses the standard debug drawing feature of Box2D, so colors will be decided by the Box2D engine.
    *
    * @method Phaser.Utils.Debug#box2dBody
    * @param {Phaser.Physics.Box2D.Body} body - The body to be rendered.
    * @param {string} [color='rgb(0,255,0)'] - Color of the rendering (format is css color string).
    */
    box2dBody: function (body, color) {

        this.start();
        Phaser.Physics.Box2D.renderBody(this.context, body, color);
        this.stop();

    },

    /**
    * Call this function from the Dev Tools console.
    *
    * It will scan the display list and output all of the Objects it finds, and their renderOrderIDs.
    *
    * **Note** Requires a browser that supports console.group and console.groupEnd (such as Chrome)
    *
    * @method Phaser.Utils.Debug#displayList
    * @param {Object} [displayObject] - The displayObject level display object to start from. Defaults to the World.
    */
    displayList: function (displayObject) {

        if (displayObject === undefined) { displayObject = this.game.world; }

        if (displayObject.hasOwnProperty('renderOrderID'))
        {
            console.log('[' + displayObject.renderOrderID + ']', displayObject);
        }
        else
        {
            console.log('[]', displayObject);
        }

        if (displayObject.children && displayObject.children.length > 0)
        {
            for (var i = 0; i < displayObject.children.length; i++)
            {
                this.game.debug.displayList(displayObject.children[i]);
            }
        }

    },

    /**
     * Prints a description of the {@link Phaser.Game#renderer renderer} and render session.
     *
     * @method Phaser.Utils.Debug#renderer
     * @param {number} [x=0] - The X value the debug info will start from.
     * @param {number} [y=0] - The Y value the debug info will start from.
     * @param {string} [color='rgb(255,255,255)'] - The color the debug text will drawn in.
     */
    renderer: function (x, y, color) {

        var r = this.game.renderer;
        var s = r.renderSession;

        this.start(x, y, color);

        this.line((r.gl ? 'WebGL' : 'Canvas') + ' Renderer (' + r.width + ' x ' + r.height + ')');
        this.line('autoResize: ' + r.autoResize);
        this.line('clearBeforeRender: ' + r.clearBeforeRender);
        this.line('resolution: ' + r.resolution);
        this.line('transparent: ' + r.transparent);
        this.line('renderSession:');

        if (r.gl)
        {
            this.line('  currentBatchedTextures: ('+ r.currentBatchedTextures.length + ')');

            for (var i = 0; i < r.currentBatchedTextures.length; i++)
            {
                this.line('    ' + r.currentBatchedTextures[i]);
            }

            this.line('  drawCount: ' + s.drawCount);
            this.line('  maxTextures: ' + r.maxTextures);
            this.line('  maxTextureSize: ' + r.maxTextureSize);
            this.line('  maxTextureAvailableSpace: ' + s.maxTextureAvailableSpace);
            this.line('  roundPixels: ' + s.roundPixels);
        }
        else
        {
            this.line('  roundPixels: ' + s.roundPixels);
            this.line('  scaleMode: ' + (s.scaleMode === 0 ? 'LINEAR' : (s.scaleMode === 1 ? 'NEAREST' : s.scaleMode)));
        }

        this.stop();

    },

    canvasPool: function (x, y, color, columnWidth) {
        var pool = Phaser.CanvasPool;

        this.start(x, y, color, columnWidth || 100);
        this.line('Canvas Pool');
        this.line('Used:', pool.getTotal());
        this.line('Free:', pool.getFree());
        this.line('Total:', pool.length);
        this.stop();
    },

    /**
    * Render each physics {@link #body} in a group.
    *
    * @method Phaser.Utils.Debug#physicsGroup
    * @param {Phaser.Group} group - A group containing physics-enabled sprites.
    * @param {string} [color='rgba(0,255,0,0.4)'] - Color of the debug rectangle to be rendered. The format is a CSS color string such as '#ff0000' or 'rgba(255,0,0,0.5)'.
    * @param {boolean} [filled=true] - Render the body as a filled rectangle (true) or a stroked rectangle (false).
    * @param {boolean} [checkExists=false] Render only children with `exists=true`.
    */
    physicsGroup: function (group, color, filled, checkExists) {

        group.forEach(this.body, this, checkExists, color, filled);

    },

    /**
     * Prints Phaser {@link Phaser.VERSION version}, {@link Phaser.Game.#renderType rendering mode}, and {@link Phaser.Device#webAudio device audio support}.
     *
     * @method Phaser.Utils.Debug#phaser
     * @param {number} x - The X value the debug info will start from.
     * @param {number} y - The Y value the debug info will start from.
     * @param {string} [color='rgb(255,255,255)'] - The color the debug text will drawn in.
     */
    phaser: function (x, y, color) {

        this.text('Phaser v' + Phaser.VERSION + ' ' +
            (this.game.renderType === Phaser.WEBGL ? 'WebGL' : 'Canvas') + ' ' +
            (this.game.device.webAudio ? 'WebAudio' : 'HTML Audio'),
            x, y, color, this.font);

    },

    /**
    * Prints game/canvas dimensions and {@link Phaser.ScaleManager game scale} settings.
    *
    * @method Phaser.Utils.Debug#scale
    * @param {number} x - The X value the debug info will start from.
    * @param {number} y - The Y value the debug info will start from.
    * @param {string} [color='rgb(255,255,255)'] - The color the debug text will drawn in.
    */
    scale: function (x, y, color) {

        this.start(x, y, color);

        var scale = this.game.scale;
        var factor = scale.scaleFactorInversed;
        var bounds = scale._parentBounds;
        var x = ' x ';

        this.line('Game: ' + this.game.width + x + this.game.height);
        this.line('Canvas: ' + scale.width + x + scale.height +
            ' (' + factor.x.toFixed(2) + x + factor.y.toFixed(2) + ')' +
            ' [' + scale.aspectRatio.toFixed(2) + ']');
        this.line('Mode: ' + Phaser.ScaleManager.MODES[scale.currentScaleMode] +
            (scale.currentScaleMode === Phaser.ScaleManager.USER_SCALE ?
            (' (' + scale._userScaleFactor.x + x + scale._userScaleFactor.y + ')') :
            ''));
        this.line('Parent: ' + (scale.parentIsWindow ? 'window' : scale.parentNode) +
            (bounds.empty ? '' : (' (' + bounds.width + x + bounds.height + ')')));
        this.line('Screen: ' + scale.classifyOrientation(scale.screenOrientation) +
            (scale.incorrectOrientation ? ' (incorrect)' : ''));

        this.stop();

    },

    /**
    * Prints the progress of a {@link Phaser.Loader}.
    *
    * Typically you would call this within a {@link State#loadRender} callback and pass `game.load` ({@link Phaser.Game#load}).
    *
    * You can enable {@link Phaser.Loader#resetLocked} to temporarily hold the loader in its 'complete' state.
    * Just remember to disable it before restarting the loader (such as when changing states).
    *
    * @method Phaser.Utils.Debug#loader
    * @param {Phaser.Loader} loader - The loader. Usually `game.load` ({@link Phaser.Game#load}).
    * @param {number} x - The X value the debug info will start from.
    * @param {number} y - The Y value the debug info will start from.
    * @param {string} [color='rgb(255,255,255)'] - The color the debug text will drawn in.
    */
    loader: function (loader, x, y, color) {

        var pad = Phaser.Utils.pad;

        this.start(x, y, color);

        if (loader.hasLoaded)
        {
            this.line('Complete' + (loader.resetLocked ? ' [locked]' : ''));
        }
        else if (loader.isLoading)
        {
            this.line('Loading');
        }
        else
        {
            this.line('Not started');
        }

        if (!loader.hasLoaded || loader.resetLocked)
        {
            this.line('Progress: ' + (pad(loader.progress, 3) + '%'));
            this.line('Files: ' + loader._loadedFileCount + ' of ' +
                                  loader._totalFileCount);
            this.line('Packs: ' + loader._loadedPackCount + ' of ' +
                                  loader._loadedPackCount);
        }

        this.stop();

    },

    /**
    * Destroy this object.
    *
    * @method Phaser.Utils.Debug#destroy
    */
    destroy: function () {

        Phaser.CanvasPool.remove(this);

    }

};

Phaser.Utils.Debug.prototype.constructor = Phaser.Utils.Debug;
