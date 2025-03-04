# Change Log

## Version 2.20.2 - 20 February 2025

### Bug Fixes

- Fixed no sound from Web Audio in iOS 17 and 18 after refocusing Safari (#748).

### Thanks

Oussama

## Version 2.20.1 - 5 October 2024

### Updates

- The canvases used for device capability checks and input hit testing are now created with `willReadFrequently: true`.

### Bug Fixes

- Fixed an error when a video loaded after the game was destroyed (#742).

### Documentation

- Set [Phaser.Game#forceSingleUpdate](https://phaserjs.github.io/phaser-ce/Phaser.Game.html#forceSingleUpdate) to `false` for better consistency in physics calculations.

### Thanks

@Akurn

## Version 2.20.0 - 10 December 2022

### API Changes

- Removed `Phaser.GAMES`.
- Removed `PIXI.defaultRenderer`.
- Removed `PIXI.game`.
- Phaser.Game#isRunning has changed slightly: it now changes from `false` to `true` when the core game loop starts running and to `false` when the game is destroyed.

### New Features

- Phaser.Game#onDestroy is a new signal that is fired at the beginning of the game destroy sequence.
- Phaser.CanvasPool.clear() empties the canvas pool.

### Updates

- Phaser.Utils.Debug now has all its methods stubbed when disabled.
- There's a console message reminding you to disable the debug canvas in production, if it's enabled. You can disable it by passing `{ enableDebug: false }` in the game config or making a custom build of Phaser CE without the `debug` module.
- When the game is destroyed, its signals are disposed, more properties are nullified, and `isBooted` and `isRunning` change to `false`.

### Bug Fixes

- Fixed incorrect result in Phaser.Point.multiplyAdd().
- Fixed Phaser.Rope appearing in the Canvas renderer when invisible.
- Fixed an error destroying the game before it's booted (#728).
- Fixed an error creating a RenderTexture after destroying the game (#729).

### Thanks

@gm0nk, @timiyay

## Version 2.19.2 - 24 October 2021

### Bug Fixes

- Fixed a WebGL error (#709).

### Thanks

@photonstorm, @XWILKINX

## Version 2.19.1 - 13 October 2021

### Bug Fixes

- [TilemapLayer#getRayCastTiles()](https://phaserjs.github.io/phaser-ce/Phaser.TilemapLayer.html#getRayCastTiles) was less efficient and behaved incorrectly for horizontal or vertical rays.
- [Text](https://phaserjs.github.io/phaser-ce/Phaser.Text.html#Text) no longer errors when missing a `style` parameter.
- Fixed some WebGL warnings.

### Thanks

@noocsharp

## Version 2.19.0 - 23 August 2021

### API Changes

#### Text

- Text height is now calculated from [actualBoundingBoxAscent](https://caniuse.com/mdn-api_textmetrics_actualboundingboxascent) and [actualBoundingBoxDescent](https://caniuse.com/mdn-api_textmetrics_actualboundingboxdescent) where available or estimated from character widths otherwise. If you need uniform display across devices, it's best to pass `style.fontProperties` when creating a Text object.
- The default [Text#testString](https://phaserjs.github.io/phaser-ce/Phaser.Text.html#testString) changed to `|MÂÉQfjq_`.

#### Tilemaps

- [Tilemap object](https://phaserjs.github.io/phaser-ce/global.html#TilemapObject) properties `ellipse`, `gid`, `point`, `polygon`, `polyline`, `properties`, `rectangle`, `template`, and `text` have default values (`false` or `null`).
- [Tilemap object](https://phaserjs.github.io/phaser-ce/global.html#TilemapObject) `properties` is an object, as in the Tiled JSON v1.1 format (#623).
- [Tilemap#createFromObjects()](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createFromObjects) returns an array instead of `undefined`.

### New Features

- You can pass `style.fontProperties` when creating a [Text](https://phaserjs.github.io/phaser-ce/Phaser.Text.html) game object or in [Text#setStyle()](https://phaserjs.github.io/phaser-ce/Phaser.Text.html#setStyle).
- You can pass `style.testString` when creating a [Text](https://phaserjs.github.io/phaser-ce/Phaser.Text.html) game object or in [Text#setStyle()](https://phaserjs.github.io/phaser-ce/Phaser.Text.html#setStyle).
- [Tilemap#getObject()](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#getObject) gets a tilemap object by `id`, from any object layer.
- [Tilemap#getObjects()](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#getObjects) gets the tilemap objects matching the given property name and value.

### Updates

- When the [Tilemap#createFromObjects()](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createFromObjects) `search` argument is an array, e.g. `['type', 'enemy']`, it matches objects with that property name and value.
- When the [Tilemap#createFromObjects()](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createFromObjects) `search` argument is `null`, it matches all objects in the layer.
- When the [Tilemap#createFromObjects()](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createFromObjects) `group` argument is `null`, it doesn't add the created sprites to a group.

### Bug Fixes

- [Tilemap#createFromObjects()](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createFromObjects) was adjusting y-coordinates for all tile objects, which was incorrect. Now it adjusts y-coordinates for tile objects only, which have origin (0, 1) in Tiled.

## Version 2.18.0 - 7 May 2021

### Updates

- Re-enabled fix from v2.13.3, [Fixed webGL making excessive calls (#641)](https://github.com/photonstorm/phaser-ce/pull/641), but only when multitexture batching is disabled.

### Bug Fixes

- Videos are loaded using the [Loader#crossOrigin](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#crossOrigin) value.

### Thanks

@drfrankius, @photonstorm, @samme

## Version 2.17.0 - 16 March 2021

### API Changes

The core game loop and timekeeping have been redone. Game timing should now work consistently at any device frame rate, for any `desiredFps`, with `forceSingleUpdate` on or off.

Animations, lifespan, particles, physics, timers, and tweens now all use the same delta time, represented by `delta` and `deltaTotal`. The delta is scaled by `slowMotion`. There's no need to adjust `desiredFps` to match `slowMotion` now; they work independently. The delta size is clamped by `deltaMax`, which can be controlled by `desiredMinFps` as well.

Phaser.Game#forceSingleUpdate now switches between a **variable-step** or **fixed-step** game loop.

When `forceSingleUpdate` is on (the default), the game makes one logic update and one render per animation frame received from the device. This is usually at 60Hz, but can be lower (33Hz) or higher (75Hz, 144Hz, 240Hz).

When `forceSingleUpdate` is off, the game makes logic updates only at the rate given by `desiredFps` (60Hz or 16.6ms by default). Depending on the `desiredFps` value and the device frame rate, this will make zero, one, or several logic updates per animation frame. There is one render per animation frame only if at least one update was made or `forceSingleRender` is on; otherwise there is none.

#### Added

- Phaser.Game#onBoot is a signal dispatched after the game boots but before the first update is made. You could use it to configure the game before a game state is started.
- Phaser.Particles.Arcade.Emitter#setGravity() sets the gravity of emitted particles.
- Phaser.Particles.Arcade.Emitter#setSpeed() sets the speed ranges of emitted particles.
- Phaser.Time#delta is the time step for the current logic update, in game time.
- Phaser.Time#deltaMax is the desired maximum delta size in ms. The default is 200ms.
- Phaser.Time#deltaTotal is the cumulative delta, so the current "time" in game time.
- Phaser.Time#desiredMinFps is the desired minimum logic update rate. It sets `deltaMax`. The default is 5.
- PIXI.CanvasRenderer#postRender
- PIXI.WebGLRenderer#postRender

#### Changed

- Phaser.Game#dropFrames skips updates and renders when the animation frame interval is larger than `deltaMax`. It's probably not very useful.
- Phaser.Game#forceSingleUpdate switches between a variable-step or fixed-step game loop.

#### Removed

- Phaser.Game#maxUpdates
- Phaser.Game#net (`game.net`)
- Phaser.Net
- Phaser.Time#physicsElapsed
- Phaser.Time#physicsElapsedMS
- Phaser.Time#prevTime
- Phaser.Timer#timeCap
- Phaser.Tween#frameBased
- Phaser.TweenManager#frameBased
- The `elapsedTime` argument in Phaser.State#preRender

### Bug Fixes

- Fixed some errors when destroying a game while Web Audio sounds were decoding (#684).
- Fixed tweens running at different speeds depending on device frame rate (#685).
- Fixed incorrect step interval when using `setTimeout()` (#687)

### Thanks

@jf-m, @photonstorm, @samme

## Version 2.16.2 - 8 March 2021

### Updates

- Better parsing of Tiled object properties (#682)

### Bug Fixes

- Web Audio sounds will not progress while the audio context is suspended.

### Deprecated

These will be removed in v2.17.0:

- [Phaser.Net](https://phaserjs.github.io/phaser-ce/Phaser.Net.html)
- [Phaser.Time#physicsElapsed](https://phaserjs.github.io/phaser-ce/Phaser.Time.html#physicsElapsed)
- [Phaser.Time#physicsElapsedMS](https://phaserjs.github.io/phaser-ce/Phaser.Time.html#physicsElapsedMS)
- [Phaser.Tween#frameBased](https://phaserjs.github.io/phaser-ce/Phaser.Tween.html#frameBased)
- [Phaser.TweenManager#frameBased](https://phaserjs.github.io/phaser-ce/Phaser.TweenManager.html#frameBased)

### Thanks

@f0rdP3rf3ct, @photonstorm, @samme

## Version 2.16.1 - 21 Oct 2020

### New Features

- [Phaser.Video#createVideoFromURL](https://phaserjs.github.io/phaser-ce/Phaser.Video.html#createVideoFromURL) has a `crossOrigin` argument (#676).
- [Phaser.Video#startMediaStream](https://phaserjs.github.io/phaser-ce/Phaser.Video.html#startMediaStream) accepts [MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) in its `captureAudio` and `captureVideo` arguments (#677).
- [Phaser.Loader#image](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#image) supports loading one of several alternative formats (e.g., AVIF, WebP, SVG) according to browser support.

### Updates

- Removed the codec parameter for the [Phaser.Device#wav](https://phaserjs.github.io/phaser-ce/Phaser.Device.html#wav) test because it gave a false negative in Safari.

### Thanks

@jorginius, @photonstorm, @samme

## Version 2.16.0 - 1 Jun 2020

### API Changes

- [Mouse wheel input](https://phaserjs.github.io/phaser-ce/Phaser.MouseWheel.html) is disabled by default. You can enable it by setting `{ mouseWheel: true }` in the game config.
- [Phaser.StateManager#onStateChange](https://phaserjs.github.io/phaser-ce/Phaser.StateManager.html#onStateChange) is dispatched before [Phaser.Scene#init](https://phaserjs.github.io/phaser-ce/Phaser.State.html#init), rather than after.

### New Features

- [Phaser.Camera#fadeIn](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#fadeIn) is a new camera effect. It does the opposite of [Phaser.Camera#fade](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#fade).
- [Phaser.SoundManager#onStateChange](https://phaserjs.github.io/phaser-ce/Phaser.SoundManager.html#onStateChange) is a new signal, dispatched when the Web Audio context changes [state](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state), when using Web Audio.
- [Phaser.Utils.Debug#state](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#state) shows the current game state.

### Updates

- The Web Audio context is resumed automatically when resuming or refocusing the game (#667).

### Thanks

@samme, @SBCGames

## Version 2.15.1 - 15 May 2020

### New Features

- [Phaser.BitmapData#getBase64()](https://phaserjs.github.io/phaser-ce/Phaser.BitmapData.html#getBase64)
- [Phaser.BitmapData#getImage()](https://phaserjs.github.io/phaser-ce/Phaser.BitmapData.html#getImage)
- [Phaser.Game#maxUpdates](https://phaserjs.github.io/phaser-ce/Phaser.Game.html#maxUpdates)
- [Phaser.MSPointer#pointerCancelCallback](https://phaserjs.github.io/phaser-ce/Phaser.MSPointer.html#pointerCancelCallback)
- There is a new data cache to let you store arbitrary data throughout the game. The new methods are [Phaser.Cache#addData()](https://phaserjs.github.io/phaser-ce/Phaser.Cache.html#addData), [Phaser.Cache#checkDataKey()](https://phaserjs.github.io/phaser-ce/Phaser.Cache.html#checkDataKey), [Phaser.Cache#getData()](https://phaserjs.github.io/phaser-ce/Phaser.Cache.html#getData), and [Phaser.Cache#removeData()](https://phaserjs.github.io/phaser-ce/Phaser.Cache.html#removeData). You can use them from `this.cache` in a scene or `game.cache`.
- [Phaser.Utils.Debug#gameInfo()](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#gameInfo)

### Updates

- [Phaser.RenderTexture#getBase64()](https://phaserjs.github.io/phaser-ce/Phaser.RenderTexture.html#getBase64) has `type` and `encoderOptions` arguments.
- [Phaser.RenderTexture#getImage()](https://phaserjs.github.io/phaser-ce/Phaser.RenderTexture.html#getImage) has `type`, `encoderOptions`, `onLoadCallback`, and `onErrorCallback` arguments.
- [Phaser.Tilemap#searchTileIndex()](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#searchTileIndex) has an `all` argument, returning all matching tiles.

### Bug Fixes

- Input pointers are stopped for the 'pointercancel' event. This should prevent lost/frozen pointers after OS gestures (#663).
- Destroying the game during loading does not cause an error when loader completes (#666).

### Thanks

@jf-m, @samme

## Version 2.15.0 - 6 Mar 2020

### API Changes

* Removed Phaser.Component.Core.skipTypeChecks.

### Updates

* [Phaser.Component.Core.init()](https://phaserjs.github.io/phaser-ce/Phaser.Component.Core.html#_init) no longer checks types.

### Bug Fixes

* Fixed multitexture rendering of texture atlases (#644, #641).

### Thanks

@weedshaker

## Version 2.14.0 - 19 Jan 2020

### API Changes

- Looped audio tag sounds no longer dispatch [onPlay](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html#onPlay) when looping, only [onLoop](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html#onLoop).
- Looped Web Audio sound markers no longer dispatch [onPlay](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html#onPlay) when looping, only [onLoop](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html#onLoop).

### New Features

- You can pass `powerPreference` in your [game config](https://phaserjs.github.io/phaser-ce/global.html#GameConfig) to set the `powerPreference` WebGL context attribute when creating the game. Possible values are `default`, `high-performance`, and `low-power` (#652).

### Updates

- [Rope.refresh](https://phaserjs.github.io/phaser-ce/Phaser.Rope.html#refresh) no longer has a pointless duplicated modulus check in the for-loop and iterates from zero, allowing the removal of several direct array assignments.

### Bug Fixes

* Fixed glitching sound playing when using looping audio-sprites with audio-tag (#653).
* A sprite's [tintedTexture](https://phaserjs.github.io/phaser-ce/PIXI.Sprite.html#tintedTexture) canvas is now returned to the Canvas Pool when the sprite is destroyed (#651).

### Thanks

@dhashvir, @photonstorm, @rarecoil, @samme, @taoabc

## Version 2.13.3 - 17 Sep 2019

### Bug Fixes

* Fixed webGL making excessive calls, which was negatively impacting the frame-rate of low-end machines and mobile devices (#356, #641).
* Fixed Web Audio sounds failing to play in certain browsers (#588).
* Fixed Point.fuzzyEquals and Point.fuzzyEqualsXY (#634).
* Fixed unnecessarily marking a texture dirty when its `smoothed` property was set but not changed (#636).
* Fixed some bad output when cloning FrameData (#640).
* Fixed `smoothed` setting on textures not being respected (#641).
* Fixed updateTexture() happening on textures that hadn't loaded their source yet (#641).
* Fixed a flickering issue on some Android devices (#641).

### Thanks

@Cerlancism, @SBCGames, @Tobepeter, @Weedshaker, @ferryhalim, @jamieallen1234, @ndee85, @pieshop, @samme

## Version 2.13.2 - 22 May 2019

### Bug Fixes

* Fixed an error when destroying or disabling a button from an input handler (#630).

### Thanks

@leandrop20, @photonstorm, @samme, @ts1985, @XWILKINX

## Version 2.13.1 - 15 May 2019

### Bug Fixes

* Fixed incorrect [Sound#currentTime](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html#currentTime) after pause/resume, when using audio tags.
* Fixed missing mouse movement values when the pointer is locked.
* Fixed elastic easing functions.

### Thanks

@micsun-al, @photonstorm, @samme

## Version 2.13.0 - 11 May 2019

### API Changes

* When using audio tags, [Sound#currentTime](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html#currentTime) is now always synced to the audio source. This should prevent timing errors from playback latency (#585). After [Sound#play()](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html#play) is called, [Sound#isPlaying](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html#isPlaying) and [Sound#onPlay](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html#onPlay) are still triggered immediately (this is consistent with Sounds using Web Audio), but Sound#currentTime will not advance until playback does.
* When the mouse cursor leaves the game canvas, input out will be triggered only if [Mouse#stopOnGameOut](https://phaserjs.github.io/phaser-ce/Phaser.Mouse.html#stopOnGameOut) is true or [MSPointer#stopOnGameOut](https://phaserjs.github.io/phaser-ce/Phaser.MSPointer.html#stopOnGameOut) is true (#429). They are false by default.
* [MSPointer#pointerOverCallback](https://phaserjs.github.io/phaser-ce/Phaser.MSPointer.html#pointerOverCallback) replaces MSPointer's use of Mouse#mouseOverCallback.
* [MSPointer#pointerOutCallback](https://phaserjs.github.io/phaser-ce/Phaser.MSPointer.html#pointerOutCallback) replaces MSPointer's use of Mouse#mouseOutCallback.
* [MSPointer#stopOnGameOut](https://phaserjs.github.io/phaser-ce/Phaser.MSPointer.html#stopOnGameOut) replaces MSPointer's use of Mouse#stopOnGameOut.
* Removed Phaser.Mouse.WHEEL_UP. Use [Phaser.MouseWheel.UP](https://phaserjs.github.io/phaser-ce/Phaser.MouseWheel.html#_UP) instead.
* Removed Phaser.Mouse.WHEEL_DOWN. Use [Phaser.MouseWheel.DOWN](https://phaserjs.github.io/phaser-ce/Phaser.MouseWheel.html#_DOWN) instead.
* Removed Phaser.Mouse#releasePointerLock. Use [Phaser.PointerLock#exit](https://phaserjs.github.io/phaser-ce/Phaser.PointerLock.html#exit) instead.
* Removed Phaser.Mouse#requestPointerLock. Use [Phaser.PointerLock#request](https://phaserjs.github.io/phaser-ce/Phaser.PointerLock.html#request) instead.

If you don't want to worry about managing both input handlers, you can disable [MSPointer](https://phaserjs.github.io/phaser-ce/Phaser.MSPointer.html) by passing `{ mspointer: false }` in your game config.

### New Features

* [Loader#tilemapCSV](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#tilemapCSV) is a shortcut method for loading CSV maps.
* [Loader#tilemapTiledJSON](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#tilemapTiledJSON) is a shortcut method for loading Tiled JSON maps.

### Bug Fixes

* Animation speeds are more accurate (#606).

### Thanks

@jf-m, @josalmi, @photonstorm, @samme

## Version 2.12.1 - 6 May 2019

### New Features

* [ScaleManager#startFullScreen](https://phaserjs.github.io/phaser-ce/Phaser.ScaleManager.html#startFullScreen) has an `options` argument.

### Bug Fixes

* Fixed undefined value in [BitmapData#smoothed](https://phaserjs.github.io/phaser-ce/Phaser.BitmapData.html#smoothed).
* Better tracking of pointer out events (#624).
* Fixed alpha for different Creature regions (#625).

### Updates

* Videos now have their `playsinline` attribute set.
* Added a warning for Tiled JSON maps version > 1.1. Object properties and tile properties in these maps may not work in Phaser CE. You can enable the json1 plugin and reexport the map in _Tiled 1.1_ format to use these features in Phaser CE (#623).
* Hide navigation UI in fullscreen mode in Chrome/Android (#626)

### Thanks

@daniel-nth, @highlyinteractive, @mikeks, @ndee85, @photonstorm, @samme, @thomasMeynckens

## Version 2.12.0 - 6 February 2019

If you're using the `loadAnchors` argument in the Phaser.Creature constructor, you'll have to change your code.

### New Features / API Changes

* BitmapText has a new property [letterSpacing](https://phaserjs.github.io/phaser-ce/Phaser.BitmapText.html#letterSpacing) which accepts a positive or negative number to add or reduce spacing between characters.
* Camera now has new properties [centerX](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#centerX) and [centerY](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#centerY) to get the center of the camera's current viewport.
* Updated Creature runtime. **The [Phaser.Creature](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html) constructor arguments have changed:** the `loadAnchors` argument was removed and a `useFlatData` argument was added. [Phaser.GameObjectFactory#creature](https://phaserjs.github.io/phaser-ce/Phaser.GameObjectFactory.html#creature) also added arguments (`mesh`, `animation`, `useFlatData`) but its existing arguments weren't changed.
* [Phaser.Creature](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html) now has new functions `setMetaData`, `enableSkinSwap`, `disableSkinSwap`, `setActiveItemSwap`, and `removeActiveItemSwap` adding Skin and Item Swapping support for Creature animations.
* [Phaser.Graphics#getVisualBounds](https://phaserjs.github.io/phaser-ce/Phaser.Graphics.html#getVisualBounds) is a new method that gets the bounds (extent) of the shapes drawn on a graphics object (#578). Unlike [Phaser.Graphics#getBounds](https://phaserjs.github.io/phaser-ce/Phaser.Graphics.html#getBounds), it gives the same result whether or not a graphics object is being used as a mask.
* [Phaser.SoundManager#baseLatency](https://phaserjs.github.io/phaser-ce/Phaser.SoundManager.html#baseLatency) is a new property representing the processing latency of the underlying Web Audio context, in seconds.

### Bug Fixes

* Fixed issue causing BitmapFont to fail loading if a kerning value for a character that doesn't exist in the font is defined in the xml/json (#598).
* Fix for Creature runtime modifying the JSON object you give it from the Phaser.Cache making subsequent uses of that JSON not behave in various ways, depending on how you use the runtime (when having multiple Creature objects of the same character for example).
* [Phaser.PointerLock#stop](https://phaserjs.github.io/phaser-ce/Phaser.PointerLock.html#stop) will now only stop its event listeners if they were started in the first place. This avoids issues where a 3rd party lib, such as Ionic, intercepts event functions and parses them itself (thanks @photonstorm and manuelhe).
* Fixed an error when destroying a [touch-locked Video](https://phaserjs.github.io/phaser-ce/Phaser.Video.html#touchLocked) (#616).
* Fixed an error when unplugging a gamepad (#610).
* Fixed streaming video in Firefox (#607).
* Fixed [global volume](https://phaserjs.github.io/phaser-ce/Phaser.SoundManager.html#volume) not affecting sounds not currently playing, when [using HTML audio](https://phaserjs.github.io/phaser-ce/Phaser.SoundManager.html#usingAudioTag) (as in IE11) (#617).

### Thanks

@Aram19, manuelhe, @micsun-al, @photonstorm, @rroylance, @samme, @Weedshaker, @wtravO

## Version 2.11.1 - 2 October 2018

### Bug Fixes

* Fixed an error passing `box2d` options in the game configuration settings (#553).
* Fixed some compressed texture formats failing to load (#562).
* Fixed an issue where if the WebGL renderer failed to initialize that RenderTexture's would still try to use it if no renderer was provided (#575).
* Fixed an inconsistent return value in BitmapData#copy (#580).
* Tweens are now cleaned up completely when destroying the game (#581).
* Game now nulls a reference to itself from PIXI after destroy (#583).
* Fixed a BitmapFont frame error when using trim frame in atlas (#587).
* Fixed BitmapData#shadow ignoring blur or x/y offset when set to 0 (#591).

### Updates

* AnimationParser.spriteSheet now tells you the minimum image dimensions it expects if it fails to produce at least one complete frame from the spritesheet (#559).
* Game now checks SoundManager's `muteOnPause` property whenever the game's `paused` property is set so one can control whether sounds play when the game is manually paused. Previously, the property was only used when the game focus was lost in the DOM (#572).

### TypeScript definitions

* Fixed the definition for bitmapText() in GameObjectFactory (#561).
* Fixed the definition for clear() in RenderTexture (#573).
* Fixed the definition for Video volume.

### Documentation

* Changed [the game configuration object's](https://phaserjs.github.io/phaser-ce/global.html#GameConfig) `canvasID` property name. The previous name, `canvasId`, was incorrect and would be ignored.
* Clarified the `spacing` argument in Loader#spritesheet (#448, #559).
* Corrected P2#createGearConstraint (#566).
* Corrected Tilemap#copy, Tilemap#replace (#586).
* Typo (#594).
* Corrected Key#upDuration, Keyboard#upDuration (#595).

### Thanks

@B10215029, @CorayThan, @FostUK, @Jazcash, @Lucas-C, @Mertank, @Nek-, @aeonwilliams, @dywedir, @foreverip, @giniwren, @josalmi, @joshlory, @rydash, @samme, @tiagokeller, @zhaxiu3

## Version 2.11.0 - 26 June 2018

If you're starting or stopping input handlers manually, you'll have to make some simple changes to your code.

### API Changes / New Features

* Phaser now starts the [Pointer Events handler](https://phaserjs.github.io/phaser-ce/Phaser.MSPointer.html) (with capture off) or the [Mouse handler](https://phaserjs.github.io/phaser-ce/Phaser.Mouse.html) (with capture off), but not both. This makes input behavior more consistent and avoids some rare conflicts between the two when running simultaneously.

  If you want to disable the Pointer Events handler, pass `{ mspointer: false }` in your game config. The Mouse handler will be used instead.

  If you want to run both handlers together, you can start the Mouse handler manually. You should also turn on capture for the Pointer Events handler to avoid duplicate events:

  ```javascript
  game.input.mouse.start();
  game.input.mspointer.capture = true;
  ```

  The [Touch handler](https://phaserjs.github.io/phaser-ce/Phaser.Touch.html) is started (with capture on) only if the device supports touch and the Pointer Events handler was not started. This is the same as in previous versions.

  #### Which input handlers are running, depending on device capabilities

Device has                  | mspointer | touch   | mouse
----------------------------|-----------|---------|-------
Pointer Events              | active    |         |
no Pointer Events; Touch    |           | active† | active
no Pointer Events; no Touch |           |         | active

  (†) capture on

* [Mouse wheel input](https://phaserjs.github.io/phaser-ce/Phaser.MouseWheel.html) was moved to `input.mouseWheel`. The changed properties are

  - `input.mouse.wheelDelta`         → `input.mouseWheel.delta`
  - `input.mouse.mouseWheelCallback` → `input.mouseWheel.callback`

  The old properties will keep working for now.

  The mouse wheel input handler uses `input.mouseWheel.preventDefault`, not `input.mouse.capture`.

* [Pointer lock input](https://phaserjs.github.io/phaser-ce/Phaser.PointerLock.html) was moved to `input.pointerLock`. The changed properties are

  - `input.mouse.pointerLock`          → `input.pointerLock.onChange`
  - `input.mouse.requestPointerLock()` → `input.pointerLock.request()`
  - `input.mouse.locked`               → `input.pointerLock.locked`
  - `input.mouse.releasePointerLock()` → `input.pointerLock.exit()`

  The old properties will keep working for now.

  There is a new Signal, `input.pointerLock.onError`, dispatched when a request fails.

  Beware that [Chrome < 68 doesn't pass movement values when using Pointer Events with pointer lock](https://bugs.chromium.org/p/chromium/issues/detail?id=836995), so you should use the Mouse handler instead for that.

* `game.debug.inputInfo()` now shows which input handlers and pointers are active.

* All the input handlers have an `active` property that shows whether they've been started. Their `start` methods return true if they've been started or false otherwise.

* The `skipFrames` argument in [AnimationParser#spriteSheet](https://phaserjs.github.io/phaser-ce/Phaser.AnimationParser.html#_spriteSheet) now works as an offset (#514). When positive, it's an offset from the start of the parsed frame list; when negative, it's an offset from the end. Negative `frameWidth` and `frameHeight` arguments are no longer allowed.

* preRender() and postRender() hooks are no longer called for the HEADLESS renderer.

* `game.make.group()` no longer assigns a default parent. This is more consistent with the rest of the [game.make](https://phaserjs.github.io/phaser-ce/Phaser.GameObjectCreator.html) methods (#525). Use `game.add.group()` instead to add the Group to the game world.

* [Point.parse()](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#_parse) no longer converts coordinates to integers (#502). Use the new method [Point.trunc()](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#_trunc) as well if you want the previous behavior.

* The default [Debug#font](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#font) is now '14px monospace'.

* The unused and deprecated property MSPointer#button was removed.

### New Features

* States have a new [postUpdate](https://phaserjs.github.io/phaser-ce/Phaser.State.html#postUpdate) method hook. It's called after game objects have received all their own updates (including physics), but before the Stage has calculated the final transformations.
* [Debug#spriteInfo](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#spriteInfo) shows the sprite's parent, if any.
* When a sprite is being dragged you can read its change in position (as `deltaX`, `deltaY`) in the [onDragUpdate](https://phaserjs.github.io/phaser-ce/Phaser.Events.html#onDragUpdate) handler.
* [Phaser.Math.trunc()](https://phaserjs.github.io/phaser-ce/Phaser.Math.html#trunc) truncates a number.
* Phaser.EmptyRectangle replaces PIXI.EmptyRectangle.
* [Debug#device](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#device) shows device graphics, audio, and input support. It may be helpful on devices where you can't see `console` output easily.
* [Debug#pointer](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#pointer) shows the pointer's movementX/movementY values and button states (for mouse pointers).
* `maxPointers` can be passed in the [game config](https://phaserjs.github.io/phaser-ce/global.html#GameConfig), setting [Input#maxPointers](https://phaserjs.github.io/phaser-ce/Phaser.Input.html#maxPointers).

### Updates

* Removed the unnecessary 'Audio source already exists' warning.

### Bug Fixes

* Masks are no longer disabled by getBounds() and are excluded from bounds calculations (#334).
* Sprites' [bringToTop()](https://phaserjs.github.io/phaser-ce/Phaser.Sprite.html#bringToTop) and [sendToBack()](https://phaserjs.github.io/phaser-ce/Phaser.Sprite.html#sendToBack) methods now work as expected for all parent types, not just Groups (#549).

### Thanks

@giniwren, @griever989, @mindcity, @omretterry, @photonstorm, @samme, @Siri0n, @tobspr

## Version 2.10.6 - 1st June 2018

* Fixed audio playback when restarting a paused sound (#538).
* TypeScript and documentation fixes (#537, #540, #544, #545).

### Thanks

@bseiller, @GrindheadGames, @josalmi, @photonstorm, @qdrj, @samme, @Siri0n, @zhanghuanchong

## Version 2.10.5 - 8th May 2018

### Bug Fixes

* Phaser could fail to resume a suspended Web Audio context if the mouse cursor left the browser window before clicking on the game canvas (#437).

## Version 2.10.4 - 3rd May 2018

### New Features

* Phaser.Text#testString is the character string used to calculate the text's width and height.
* Ellipse#centerX
* Ellipse#centerY

### Updates

* Callbacks added with Phaser.Input#addMoveCallback receive an `event` parameter.

### Bug Fixes

* Fixed a bogus warning when selecting tilemap layer 0 (#511).
* Fixed wrong position in Ellipse#random (#522).
* Fixed an Animation skipping the final frame in low-FPS situations (#524).
* Fixed wrong ellipse position in Debug#geom (#526).
* Fixed `forceType` failing to override some geometry types in Debug#geom.
* Fixed unnecessary text updates when using Text#setText with `immediate=true` (#525).
* Fixed issues restarting a Sound in Firefox (#530).
* Fixed an IndexSizeError in Edge/Firefox when a very small texture crop rectangle is used (#532).

### TypeScript definitions

* Corrected definitions for ContactMaterial#frictionStiffness, Convex (#513).

### Documentation

* Fixed typos (#517, #521).
* The Tilemap methods fill, random, replace, shuffle, and swap modify the tile index only (#484).
* The special GameConfig.transparent value 'notMultiplied' disables the WebGL context attribute `premultipliedAlpha`.

### Thanks

@budda, @Hagisus, @HaoboZ, @hardylr, @intersrc, @jamesjsewell, @josalmi, @joshlory, @melissaelopez, @mickeyren, @photonstorm, @samme, @tobspr

## Version 2.10.3 - 21st March 2018

### Bug Fixes

* Fixed an error when activating a Cocoon application (#506).

### Thanks

@KIVassilev, @photonstorm, @samme

## Version 2.10.2 - 15th March 2018

### New Features

* You can set [clearBeforeRender](https://phaserjs.github.io/phaser-ce/global.html#GameConfig) when creating the game (#481).

### Updates

* Phaser tries to resume a suspended WebAudio context after a user click/tap on any device (#437, #482).

### Bug Fixes

* Phaser.Text objects show the correct [type](https://phaserjs.github.io/phaser-ce/Phaser.Text.html#type) (#479).
* [game.add.plugin](https://phaserjs.github.io/phaser-ce/Phaser.GameObjectFactory.html#plugin) forwards all arguments to [game.plugins.add](https://phaserjs.github.io/phaser-ce/Phaser.PluginManager.html#add) (#486).
* [Phaser.Signal#memorized](https://phaserjs.github.io/phaser-ce/Phaser.Signal.html#memorize) works correctly after only one listener is added (#495).

### TypeScript

* PIXI.Rectangle includes more of Phaser.Rectangle's properties (#491).

### Documentation

* Game Objects show [width](https://phaserjs.github.io/phaser-ce/PIXI.DisplayObjectContainer.html#width) and [height](https://phaserjs.github.io/phaser-ce/PIXI.DisplayObjectContainer.html#height) properties (#488).

### Thanks

@KIVassilev, @koalaylj, @photonstorm, @RedPanduzer, @samme, @Siri0n

## Version 2.10.1 - 18th February 2018

### New Features

* [Phaser.Sound#playOnce](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html#playOnce) flags a sound for deletion after it is played once. This is a simple method for avoiding [adding](https://phaserjs.github.io/phaser-ce/Phaser.SoundManager.html#add) new Sound objects for sounds that are intended to just be played once and done.
* A final [State#loadUpdate](https://phaserjs.github.io/phaser-ce/Phaser.State.html#loadUpdate) call is made right before the loader is reset, when [Loader#progress](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#progress) is 100, instead of after, when Loader#progress is 0 (#468).
* [Loader#onBeforeLoadComplete](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#onBeforeLoadComplete) is a signal dispatched right before the Loader is reset (unlike [Loader#onLoadComplete](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#onLoadComplete)).

### Updates

* Clarified `margin` and `spacing` arguments in [Phaser.Loader#spritesheet](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#spritesheet) (#448).
* [Debug#text](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#text) now uses [Debug#font](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#font) as its default.

### Bug Fixes

* Fixed audio sprites failing to loop after pause and resume (#323).
* Fixed sounds not looping when using audio tags (#446).
* Fixed circular Arcade bodies sticking to each other during some collisions (#451).
* Fixed a sprite with [input.enabled](https://phaserjs.github.io/phaser-ce/Phaser.InputHandler.html#enabled) `false` triggering its [onInputOut](https://phaserjs.github.io/phaser-ce/Phaser.Events.html#onInputOut) signal when the mouse leaves the game canvas (#454).
* Fixed spelling error in API documentation (#458).
* Fixed some TypeScript definitions (#442, #447, #455, #460, #462, #463, #469, #475).
* The canvas now correctly scales inside a [container](https://phaserjs.github.io/phaser-ce/Phaser.ScaleManager.html#parentNode) if using relative values for `width` and `height` in the [Phaser.Game](https://phaserjs.github.io/phaser-ce/Phaser.Game.html) constructor (#467). Make sure you give the container a [height](https://developer.mozilla.org/en-US/docs/Web/CSS/height).
* Fixed [State#loadUpdate](https://phaserjs.github.io/phaser-ce/Phaser.State.html#loadUpdate) being called once when no assets have been loaded (#468).
* Fixed [Debug#spriteInfo](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#spriteInfo) failing to show `sprite.name` as promised (#471).

### Thanks

@bseiller, @dhashvir, @Lucas-C, @mmacvicar, @Nek-, @netdreamer, @omretterry, @pantoninho, @photonstorm, @samme, @seiyria, @squaresun, @Tembac, @wtravO

## Version 2.10.0 - 18th January 2018

### New Features

* New [game config](https://phaserjs.github.io/phaser-ce/global.html#GameConfig) arguments:
    - `alignH`, `alignV`
    - `crisp`
    - `disableStart`
    - `failIfMajorPerformanceCaveat`
    - `roundPixels`
    - `scaleH`, `scaleV`, `trimH`, `trimV`
* New game loop features:
    - Phaser.Game#dropFrames skips renders when the game loop delta time is spiraling upwards (#314).
    - Phaser.Game#forceSingleRender can be set to `false` to reduce the render rate to match Phaser.Time#desiredFps (#313).
    - Phaser.Time#ups tracks updates per second when [advanced timing](https://phaserjs.github.io/phaser-ce/Phaser.Time#advancedTiming) is enabled.
    - Phaser.Time#rps tracks renders per second when [advanced timing](https://phaserjs.github.io/phaser-ce/Phaser.Time#advancedTiming) is enabled.
* [Phaser.Color](https://phaserjs.github.io/phaser-ce/Phaser.Color.html) constants AQUA, BLACK, BLUE, GRAY, GREEN, ORANGE, RED, VIOLET, WHITE, and YELLOW. You can use these anywhere you use a numeric (hex) color value: [Graphics](https://phaserjs.github.io/phaser-ce/Phaser.Graphics.html), [Sprite#tint](https://phaserjs.github.io/phaser-ce/Phaser.Sprite.html#tint), [Stage#backgroundColor](https://phaserjs.github.io/phaser-ce/Phaser.Stage.html#backgroundColor).
* Phaser.Game#pendingDestroy marks the game for destruction at the next update. It can be used safely within an update callback.
* Phaser.Point#round rounds a point's coordinates.
* Phaser.SoundManager#onTouchUnlock signal (#434)
* Phaser.SoundManager#removeAll destroys all sounds and removes them from the Manager.
* [Phaser.Utils.Debug](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html) methods:
    - Debug#loader displays [loader](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html) progress.
    - Debug#scale displays game/canvas dimensions and [Scale Manager](https://phaserjs.github.io/phaser-ce/Phaser.ScaleManager.html) state.
    - Debug#sound displays [Sound Manager](https://phaserjs.github.io/phaser-ce/Phaser.SoundManager.html) state.
* Phaser.Video#playWhenUnlocked
* Phaser.Video#onTouchUnlock signal

### Updates

* Phaser now falls back to the Canvas renderer if AUTO is selected and WebGL context creation fails. [Phaser.Device#webGL](https://phaserjs.github.io/phaser-ce/Phaser.Device.html#webGL) is now a soft check and doesn't create a test WebGL context. This is slightly more accurate (#402) and slightly faster (#420). Phaser.Device#webGLError was removed.
* [Gamepad](https://phaserjs.github.io/phaser-ce/Phaser.Gamepad.html) input is now enabled while the game is paused (#423).
* Removed gain smoothing for WebAudio volume changes (#385).
* Updated ionic example project (#381).
* Removed these deprecated items (#403):
    - Phaser.ArrayUtils.rotate             → [Phaser.ArrayUtils.rotateLeft](https://phaserjs.github.io/phaser-ce/Phaser.ArrayUtils.html#_rotateLeft)
    - Phaser.Device.isConsoleOpen
    - Phaser.Loader#useXDomainRequest      → [xhrLoadWithXDR.js](resources/IE9/xhrLoadWithXDR.js)
    - Phaser.Loader#xhrLoadWithXDR         → [xhrLoadWithXDR.js](resources/IE9/xhrLoadWithXDR.js)
    - Phaser.Particles#update
    - Phaser.Polygon#points (as a setter)  → [Phaser.Polygon#setTo](https://phaserjs.github.io/phaser-ce/Phaser.Polygon.html#setTo)
    - Phaser.Touch#addTouchLockCallback    → [Phaser.Input#addTouchLockCallback](https://phaserjs.github.io/phaser-ce/Phaser.Input.html#addTouchLockCallback)
    - Phaser.Touch#removeTouchLockCallback → [Phaser.Input#removeTouchLockCallback](https://phaserjs.github.io/phaser-ce/Phaser.Input.html#removeTouchLockCallback)
    - PIXI.BaseTexture#updateSourceImage   → [Phaser.Component.LoadTexture#loadTexture](https://phaserjs.github.io/phaser-ce/Phaser.Component.LoadTexture.html#loadTexture)
    - RevoluteConstraint#motorIsEnabled    → RevoluteConstraint#motorEnabled
    - Shape.RECTANGLE                      → Shape.BOX

### Bug Fixes

* Fixed a false positive in [TweenManager#isTweening](https://phaserjs.github.io/phaser-ce/Phaser.TweenManager.html#isTweening) (#414).
* Changing a display object's [smoothed](https://phaserjs.github.io/phaser-ce/Phaser.Sprite.html#smoothed) property now marks the WebGL texture as dirty (#432, #433).
* Fixed Phaser.Sound temporarily having an incorrect gain setting at creation time.
* Fixed sprites not receiving [onInputOut](https://phaserjs.github.io/phaser-ce/Phaser.Events.html#onInputOver) when the pointer leaves the game canvas (#429).
* Fixed some TypeScript definitions.

### Thanks

@ankush-badyal, @Dreaded-Gnu, @Mertank, @pavle-goloskokovic, @photonstorm, @qdrj, @samme, @squaresun

## Version 2.9.4 - 20th December 2017

### New Features

* [TweenManager#isTweening](https://phaserjs.github.io/phaser-ce/Phaser.TweenManager.html#isTweening) has a `checkIsRunning` argument (#414).
* You can now pass `game.stage` as the `parent` parameter in the `game.add` [methods](https://phaserjs.github.io/phaser-ce/Phaser.GameObjectFactory.html).
* [Arcade#closest](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.html#closest), [Arcade#distanceBetween](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.html#distanceBetween), and [Arcade#farthest](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.html#farthest) have a `useCenter` argument (#418).

### Updates

* [Phaser.Device](https://phaserjs.github.io/phaser-ce/Phaser.Device.html) tests for WebGL stencil buffer support (#402).

### Bug Fixes

* Fixed a TypeError when a [Text](https://phaserjs.github.io/phaser-ce/Phaser.Text.html) object is created without a `style` argument (#415).

### Thanks

@bananatron, @mblais, @mepsoid, @naglfar, @photonstorm, @samme

## Version 2.9.3 - 11th December 2017

### New Features

* [Phaser.BitmapData#polygon](https://phaserjs.github.io/phaser-ce/Phaser.BitmapData.html#polygon) draws a polygon.
* [Phaser.Keyboard#removeCallbacks](https://phaserjs.github.io/phaser-ce/Phaser.Keyboard.html#removeCallbacks) removes callbacks added by [Phaser.Keyboard#addCallbacks](https://phaserjs.github.io/phaser-ce/Phaser.Keyboard.html#addCallbacks).
* [Phaser.Line#fromPoints](https://phaserjs.github.io/phaser-ce/Phaser.Line.html#fromPoints)
* [Phaser.Loader#imageFromGrid](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#imageFromGrid) and [Phaser.Loader#imageFromTexture](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#imageFromTexture) are image-loading counterparts of [Phaser.Create#grid](https://phaserjs.github.io/phaser-ce/Phaser.Create.html#grid) and [Phaser.Create#texture](https://phaserjs.github.io/phaser-ce/Phaser.Create.html#texture).
* [Phaser.Point.sortClockwise](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#sortClockwise) sorts points around a reference point.
* [Phaser.Point#angleXY](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#angleXY)
* [Phaser.Point#atan](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#atan) computes a point's arctangent.
* [Phaser.Point#expand](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#expand) increases a point's magnitude to a minimum length.
* [Phaser.World#wrapAll](https://phaserjs.github.io/phaser-ce/Phaser.World.html#wrapAll) wraps all members of a group.

### Updates

* Audio and video are now [touch-unlocked](https://phaserjs.github.io/phaser-ce/Phaser.Device.html#needsTouchUnlock) only via the [touchend](https://developer.mozilla.org/en-US/docs/Web/Events/touchend) event (#92). Previously we used `touchend` for audio on newer Chrome and iOS clients and `touchstart` in all other cases.
* [Tilemap#addTilesetImage](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#addTilesetImage), [Tilemap#createFromObjects](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createFromObjects), and [Tilemap#createLayer](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createLayer) print the map's contents (following the usual warning) in the console if you pass a bad name or identifier, to help you correct it.
* [Tileset#addTilesetImage](https://phaserjs.github.io/phaser-ce/Phaser.Tileset.html#addTilesetImage) gives a little more information when warning about image dimension mismatches.
* Optimized [Phaser.Utils.getProperty](https://phaserjs.github.io/phaser-ce/Phaser.Utils.html#_getProperty).
* Removed Phaser.TweenData#yoyoCounter, an extraneous property that Phaser never used.
* p2 TypeScript definitions fixes and updates (#406).

### Bug Fixes

* [Phaser.Tween#start](https://phaserjs.github.io/phaser-ce/Phaser.Tween.html#start) no longer tries to start a tween marked for deletion (such as by [Tween#stop](https://phaserjs.github.io/phaser-ce/Phaser.Tween.html#stop)). Instead it prints a warning to the console (#401).
* Fixed drag movement of [fixedToCamera](https://phaserjs.github.io/phaser-ce/Phaser.Sprite.html#fixedToCamera) sprites when the camera is scaled (#405).
* Fixed tweens not repeating when [Tween#start](https://phaserjs.github.io/phaser-ce/Phaser.Tween.html#start) is called after [Tween#repeat](https://phaserjs.github.io/phaser-ce/Phaser.Tween.html#repeat) (#408).
* [StateManager#loadComplete](https://phaserjs.github.io/phaser-ce/Phaser.StateManager.html) is no longer called by the [Loader](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html) if the state has been destroyed (#410).
* Added TypeScript definitions for [Phaser.Sprite#outOfCameraBoundsKill](https://phaserjs.github.io/phaser-ce/Phaser.Sprite.html#outOfCameraBoundsKill).

### Documentation

* `canvas`, `canvasId`, `canvasStyle`, and [forceSetTimeOut](https://phaserjs.github.io/phaser-ce/Phaser.RequestAnimationFrame.html#forceSetTimeOut) can be set in the [game configuration object](https://phaserjs.github.io/phaser-ce/global.html#GameConfig).

### Thanks

@clesquir, @GrindheadGames, @husengbatute29, @Nek-, @photonstorm, @samme

## Version 2.9.2 - 9th November 2017

### New Features

* Added `adjustSize` parameter to [Phaser.Tilemap#createFromObjects](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createFromObjects). Setting this to false will disable copying the object's `width` and `height` to the new sprite.

### Updates

* When [using Web Audio](https://phaserjs.github.io/phaser-ce/Phaser.SoundManager.html#usingWebAudio) (gain), [volume](https://phaserjs.github.io/phaser-ce/Phaser.SoundManager.html#volume) and [mute](https://phaserjs.github.io/phaser-ce/Phaser.SoundManager.html#mute) changes are smoothed (#385).

### Bug Fixes

* Fixed a bug that did not show the last line of text of a [BitmapText](https://phaserjs.github.io/phaser-ce/Phaser.BitmapText.html) when the last character was the one that created the need for a new line (when [maxWidth](https://phaserjs.github.io/phaser-ce/Phaser.BitmapText.html#maxWidth) was set).
* Fixed grammar in the error message if an invalid State object is provided to the StateManager.
* Fixed [Button#forceOut](https://phaserjs.github.io/phaser-ce/Phaser.Button.html#forceOut) and [Button#justReleasedPreventsOver](https://phaserjs.github.io/phaser-ce/Phaser.Button.html#justReleasedPreventsOver) failing on touch devices. The correct [Phaser.PointerMode#CONTACT](https://phaserjs.github.io/phaser-ce/Phaser.PointerMode.html#_CONTACT) is now used instead of the undefined Phaser.PointerMode.TOUCH (#392).
* Fixed dead, physics-enabled game objects not being destroyed by [pendingDestroy](https://phaserjs.github.io/phaser-ce/Phaser.Component.Core.html#pendingDestroy) (#399).

### Thanks

@16patsle, @andiCR, @daniel-nth, @JamesSkemp, @martinlindhe, @photonstorm, @rmartone, @samme

## Version 2.9.1 - 10th October 2017

### Bug Fixes

* [Phaser.Tilemap#setTileIndexCallback](https://github.com/photonstorm/phaser-ce/blob/master/src/tilemap/Tilemap.js#L798) now correctly removes a callback when `null` is passed.
* Fixed [Emitter#counts](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#counts) not counting.
* Fixed missing TypeScript return values (#382).

### Thanks

@masondesu, @pavle-goloskokovic, @photonstorm, @samme

## Version 2.9.0 - 8th October 2017

The minor version increase is for changes to [Emitter#cursor](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#cursor).

### New Features

* Tiled polygons and rectangles are now converted into p2 physics bodies when using [Phaser.Physics.P2#convertCollisionObjects](https://phaserjs.github.io/phaser-ce/Phaser.Physics.P2.html#convertCollisionObjects) (#369).
* Tileset-level collision objects created in Tiled are now added to a map's [collision](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#collision) and [objects](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#objects) properties using the layer's name as the key (#369).
* [Phaser.ArrayUtils.numberArray](https://phaserjs.github.io/phaser-ce/Phaser.ArrayUtils.html#_numberArray) can be passed a single argument to create a range starting from 0.
* [Phaser.ArrayUtils.remove](https://phaserjs.github.io/phaser-ce/Phaser.ArrayUtils.html#_remove) is a faster alternative to Array#splice.
* [Phaser.Camera#fixedView](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#fixedView) is like [Phaser.Camera#view](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#view) but it never moves. You can use it to align objects independent of the camera's position.
* [Phaser.CanvasPool.log](https://phaserjs.github.io/phaser-ce/Phaser.CanvasPool.html#_log) prints canvas pool counts to the console.
* [Phaser.Circle#intersectsLine](https://phaserjs.github.io/phaser-ce/Phaser.Circle.html#intersectsLine)
* [Phaser.Circle#sample](https://phaserjs.github.io/phaser-ce/Phaser.Circle.html#sample) creates or positions a set of points or objects on the circle.
* [Phaser.Color.interpolateColor](https://phaserjs.github.io/phaser-ce/Phaser.Color.html#_interpolateColor) can use either HSL or RGB color spaces.
* [Phaser.Color.linear](https://phaserjs.github.io/phaser-ce/Phaser.Color.html#_linear) interpolates two numeric color values.
* [Phaser.Color.linearInterpolation](https://phaserjs.github.io/phaser-ce/Phaser.Color.html#_linearInterpolation) interpolates an array of numeric color values. You can assign it to [TweenData#interpolationFunction](https://phaserjs.github.io/phaser-ce/Phaser.TweenData.html#interpolationFunction) to tween through such an array.
* [Phaser.Ellipse#intersectsLine](https://phaserjs.github.io/phaser-ce/Phaser.Ellipse.html#intersectsLine)
* [Phaser.Group#count](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#count) counts children matching a key-value query.
* [Phaser.Group#createMultiple](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#createMultiple) now has a callback argument that lets you modify each new child.
* [Phaser.Group#getFirst](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#getFirst) fetches the first child matching a key-value query.
* [Phaser.Group#kill](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#kill) and [Phaser.Group#revive](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#revive) toggle a Group's `alive`, `exists`, and `visible` properties (#339).
* [Phaser.Line#intersectionWithRectangle](https://phaserjs.github.io/phaser-ce/Phaser.Line.html#_intersectionWithRectangle) finds the closest line-rectangle intersection (#260). You can use it for precise raycasting.
* [Phaser.Physics.Arcade#closest](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade#closest) finds the point or display object closest to another.
* [Phaser.Physics.Arcade#farthest](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade#farthest) finds the point or display object farthest from another.
* [Phaser.Point#clip](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#clip) constrains a Point to a rectangular area.
* [Phaser.Point#equalsXY](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#equalsXY)
* [Phaser.Point#fuzzyEquals](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#fuzzyEquals) and [Phaser.Point#fuzzyEqualsXY](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#fuzzyEqualsXY) test approximate Point equality.
* [Phaser.Rectangle#copyFromBounds](https://phaserjs.github.io/phaser-ce/Phaser.Rectangle.html#copyFromBounds) and [Phaser.Rectangle.createFromBounds](https://phaserjs.github.io/phaser-ce/Phaser.Rectangle.html#_createFromBounds) are variations of [copyFrom](https://phaserjs.github.io/phaser-ce/Phaser.Rectangle.html#copyFrom) and [clone](https://phaserjs.github.io/phaser-ce/Phaser.Rectangle.html#_clone) that extract `left` and `top` properties instead of `x` and `y`.
* [Phaser.Rectangle#sides](https://phaserjs.github.io/phaser-ce/Phaser.Rectangle.html#sides) creates or positions four lines representing the rectangle's sides.
* [Phaser.ScaleManager#align](https://phaserjs.github.io/phaser-ce/Phaser.ScaleManager.html#align) is a shortcut for setting pageAlignHorizontally and pageAlignVertically.
* [Phaser.Tween.updateColor](https://phaserjs.github.io/phaser-ce/Phaser.Tween.html#_updateColor) is a helper for tweening color objects.
* [Phaser.Utils.Debug#canvasPool](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#canvasPool) displays canvas pool counts.
* [Phaser.Utils.Debug#geom](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#geom) can display Ellipses.
* [Phaser.Utils.Debug#phaser](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#phaser) displays Phaser's version, rendering mode, and device audio support.
* [Phaser.Utils.Debug#physicsGroup](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#physicsGroup) displays all the physics bodies in a Group.
* [Phaser.Utils.setProperties](https://phaserjs.github.io/phaser-ce/Phaser.Utils.html#_setProperties) is deep-property setter that works on any object.

### Updates

* Particle emitter release has been made more efficient (#333).
* You can access the most recently emitted particle in [Emitter#cursor](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#cursor). After the emitter has started, you should treat Emitter#cursor as read-only, because Phaser will modify it while it emits particles.

### Bug Fixes

* Fixed some TypeScript definitions (#374).
* [Phaser.Tilemap#createFromObjects](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createFromObjects) no longer overrides the `visibility` property value as set in Tiled.
* Fixed and optimized [Phaser.Utils.setProperty](https://phaserjs.github.io/phaser-ce/Phaser.Utils.html#_setProperty).

### Documentation

* Added missing arguments in [Phaser.State](https://phaserjs.github.io/phaser-ce/Phaser.State.html) methods.
* [Phaser.Game#clearBeforeRender](https://phaserjs.github.io/phaser-ce/Phaser.Game#clearBeforeRender) must be true for [Phaser.Stage#backgroundColor](https://phaserjs.github.io/phaser-ce/Phaser.Stage#backgroundColor) to appear (#377).
* [Phaser.Stage#backgroundColor](https://phaserjs.github.io/phaser-ce/Phaser.Stage#backgroundColor) and [Phaser.Stage#disableVisibilityChange](https://phaserjs.github.io/phaser-ce/Phaser.Stage#disableVisibilityChange) can be set directly in a [Phaser.Game](https://phaserjs.github.io/phaser-ce/Phaser.Game.html) configuration object.

### Thanks

@cursorial, @HeinousTugboat, @masondesu, @photonstorm, @samme, @samid737

## Version 2.8.8 - 25th September 2017

### Updates

* Renamed [Emitter#count](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#count) to [Emitter#counts](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#counts). Emitter#count is deprecated and will be removed in v2.9.0.
* Removed deprecated Phaser.Events#onRemovedFromWorld.

### Bug Fixes

* Fixed p2 polygon collisions (#366).
* Fixed a nonfatal error when clicking the game canvas in browsers not supporting [Document.hasFocus()](https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus) (e.g., Opera Mini, older Opera) (#367). In these browsers the game may not automatically resume when refocused in an iframe; use one of the workarounds in #236.
* [Phaser.Color.updateColor](https://phaserjs.github.io/phaser-ce/Phaser.Color.html#_updateColor) now rounds fractional RGB values to integers when updating the `rgba` property (#361).
* Added `roundPixels` to [WebGLRenderer#renderSession](https://phaserjs.github.io/phaser-ce/PIXI.WebGLRenderer.html#renderSession) (#362).
* Fixed some TypeScript definitions (#354, #368).

### Documentation

* Updated [TypeScript guide](https://github.com/photonstorm/phaser-ce/issues/292) (#292). Edits are welcome.
* Added [Phaser.Button](https://phaserjs.github.io/phaser-ce/Phaser.Button.html) `callback` arguments (same as [Phaser.Events#onInputUp](https://phaserjs.github.io/phaser-ce/Phaser.Events.html#onInputUp)) (#353).
* Added [Phaser.Input](https://phaserjs.github.io/phaser-ce/Phaser.Input.html) callback arguments (#368).
* Added [Phaser.Plugin: Callbacks](https://phaserjs.github.io/phaser-ce/Phaser.Plugin.html).
* Corrected [Phaser.Tileset#containsTileIndex](https://phaserjs.github.io/phaser-ce/Phaser.Tileset.html#containsTileIndex) (#358).
* Corrected [Phaser.State: Callbacks](https://phaserjs.github.io/phaser-ce/Phaser.State.html).

### Thanks

@bobhfut, @falquaddoomi, @HaoboZ, @pavle-goloskokovic, @photonstorm, @samme

## Version 2.8.7 - 12th September 2017

### Bug Fixes

* Fixed TypeScript error (#351).
* [onChildInputDown](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#onChildInputDown), [onChildInputUp](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#onChildInputUp), [onChildInputOver](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#onChildInputOver), and [onChildInputOut](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#onChildInputOut) signals now fire correctly for particle emitters (#349).

### Thanks

@lucasgray, @photonstorm, @samme, @yupaul

## Version 2.8.6 - 10th September 2017

### Updates

* Several internal changes in [Phaser.DeviceButton](https://phaserjs.github.io/phaser-ce/Phaser.DeviceButton.html) and [Phaser.Pointer](https://phaserjs.github.io/phaser-ce/Phaser.Pointer.html) (#340).

### Bug Fixes

* Fixed an issue where the [DEFAULT](https://phaserjs.github.io/phaser-ce/Phaser.Cache.html#_DEFAULT) and [MISSING](https://phaserjs.github.io/phaser-ce/Phaser.Cache.html#_MISSING) textures could be missing from the game cache when the game starts (#280 via #138).
* Fixed several issues related to [Phaser.MSPointer](https://phaserjs.github.io/phaser-ce/Phaser.MSPointer) and pointer events (#293, #250)
* Fixed an error when using [TweenData#generateData](https://phaserjs.github.io/phaser-ce/Phaser.TweenData.html#generateData) with an array-based tween (#346).
* Fixed game in an iframe not auto-resuming when refocused (#236).
* Fixed some TypeScript definitions (#342, #344).

### Documentation

* Fixed navigation menu obscuring anchor link targets at the top of the window (#343).
* Updated [Phaser.MSPointer](https://phaserjs.github.io/phaser-ce/Phaser.MSPointer.html)
* Added example for [Tween#tween.onUpdateCallback](https://phaserjs.github.io/phaser-ce/Phaser.Tween.html#onUpdateCallback).
* Updated [TweenData#value](https://phaserjs.github.io/phaser-ce/Phaser.TweenData.html#value).

### Thanks

@2called-chaos, @bseiller, @falquaddoomi, @johnbuttcoingalt, @photonstorm, @samme, @samvieten, @yupaul

## Version 2.8.5 - 30th August 2017

### Updates

* Since v2.8.4 custom build commands need a slightly different argument syntax (#321, #324), e.g.,

  ```bash
  grunt custom --exclude=moduleName --filename=phaser-custom
  ```

* Updated [Ionic project template](https://github.com/photonstorm/phaser-ce/tree/master/resources/Project%20Templates/ionic-example) (#328).
* [API Docs](https://github.com/photonstorm/phaser-ce/) have a new look.

### Bug Fixes

* Fixed sprite texture being destroyed in [PIXI.Sprite#setTexture](https://phaserjs.github.io/phaser-ce/PIXI.Sprite.html#setTexture) contrary to `destroyBase=false`.
* Fixed a ReferenceError in Phaser.Input#executeTouchLockCallbacks affecting Firefox Mobile (#336).

### Documentation

* [Arcade.Body#friction](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#friction): a moving, immovable Body applies its own `friction` to a non-immovable riding Body
* [DisplayObject](https://phaserjs.github.io/phaser-ce/global.html#DisplayObject)
* [Emitter#area](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#area): only the `width` and `height` are used.
* [Emitter#flow](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#flow)
* [Emitter#start](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#start) (#330)
* [PhaserGlobal](https://phaserjs.github.io/phaser-ce/PhaserGlobal.html): added.

### Thanks

@Dreaded-Gnu, @goldfire, @photonstorm, @rafelsanso, @ryanrossiter, @samme, @Zykino

## Version 2.8.4 - 15th August 2017

### Updates

* Arcade#collide and Arcade#overlap skip empty array members in calls like `collide(group, [undefined])`, so you don't unintentionally collide a group against itself.
* Added an `epsilon` argument for fuzzy comparisons in [Phaser.Line#pointOnLine](https://phaserjs.github.io/phaser-ce/Phaser.Line.html#pointOnLine) and [Phaser.Line#pointOnSegment](https://phaserjs.github.io/phaser-ce/Phaser.Line.html#pointOnSegment) (#312).
* Removed obsolete PIXI TypeScript definitions.
* Removed [filters/pixi](https://github.com/photonstorm/phaser-ce/tree/v2.8.3/filters/pixi). They require PIXI.AbstractFilter, which was removed in 2.7.0.
* Updated NPM dependencies (except [typescript](https://www.npmjs.com/package/typescript); photonstorm/phaser#2198) and added [package-lock.json](https://docs.npmjs.com/files/package-lock.json).
* Deprecated [Phaser.Device.isConsoleOpen](https://phaserjs.github.io/phaser-ce/Phaser.Device.html#isConsoleOpen). Now it always returns false.
* Phaser.Input now handles touch unlocking via Phaser.Touch or Phaser.MSPointer. [Phaser.Touch#addTouchLockCallback](https://phaserjs.github.io/phaser-ce/Phaser.Touch.html#addTouchLockCallback) and [Phaser.Touch#removeTouchLockCallback](https://phaserjs.github.io/phaser-ce/Phaser.Touch.html#removeTouchLockCallback) are still available but deprecated; you should use [Phaser.Input#addTouchLockCallback](https://phaserjs.github.io/phaser-ce/Phaser.Input.html#addTouchLockCallback) and [Phaser.Input.#removeTouchLockCallback](https://phaserjs.github.io/phaser-ce/Phaser.Input.html#removeTouchLockCallback) instead (#37).

### Bug Fixes

* Improved animation synchronization during irregular frame rates (#310).
* Fixed bad `game` reference in [Phaser.Creature](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html).
* Fixed wrong dimensions of [Debug#canvas](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#canvas) and [Debug#sprite](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#sprite) when a WEBGL game is scaled (#298).
* [TileSprite#tint](https://phaserjs.github.io/phaser-ce/Phaser.TileSprite.html#tint) now works when rendering with CANVAS.
* Fixed sprites not receiving a preUpdate when they have a `fresh` ancestor with a physics body, which would leave them `fresh` and with incorrect `world` and `body.position` values for several frames (#299).
* Fixed movement of sprites with [fixedToCamera](https://phaserjs.github.io/phaser-ce/Phaser.Sprite.html#fixedToCamera) when dragged by pointer (#297).
* Fixed Creature relative anchor points to be absolute (#288).
* Fixed P2 Physics body not rotating shape (#258).
* Audio is now also unlocked for Android Chrome ≥ 55, fixing audio not playing in cross-origin iframes (#37).
* Fixed some TypeScript definitions (#317, #319).

### Documentation

* [Arcade Physics bodies](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html) don't scale with [camera scale](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#scale) (#315).
* [cacheAsBitmap](https://phaserjs.github.io/phaser-ce/PIXI.DisplayObject.html#cacheAsBitmap) and [generateTexture](https://phaserjs.github.io/phaser-ce/PIXI.DisplayObject.html#generateTexture) can trim transparent pixels (#283).
* [Phaser.Physics.P2.Body#addPolygon](https://phaserjs.github.io/phaser-ce/Phaser.Physics.P2.Body#addPolygon.html#addPolygon) can mutate the `points` argument (#301).
* [InputHandler#enableDrag](https://phaserjs.github.io/phaser-ce/Phaser.InputHandler.html#enableDrag) `alphaThreshold` argument is a number, not boolean.
* [Phaser.ScaleManager#startFullScreen](https://phaserjs.github.io/phaser-ce/Phaser.ScaleManager.html#startFullScreen)
* [Health#damage](https://phaserjs.github.io/phaser-ce/Phaser.Component.Health.html#damage), [Health#heal](https://phaserjs.github.io/phaser-ce/Phaser.Component.Health.html#heal), and [Health#setHealth](https://phaserjs.github.io/phaser-ce/Phaser.Component.Health.html#setHealth) were missing (#308).

### Thanks

@Aerolivier, @AleBles, @andrewjb123, @davvidbaker, @Formic, @fyyyyy, @Majirefy, @photonstorm, @Plukers, @samid737, @samme, @sarbasamuel, @tommitytom

## Version 2.8.3 - 21st July 2017

### Updates

* Added [Ionic project template](https://github.com/photonstorm/phaser-ce/tree/master/resources/Project%20Templates/ionic-example) and a [small guide](https://github.com/photonstorm/phaser-ce/blob/master/README.md#ionic) to README (#96).

### Bug Fixes

* Fixed some TypeScript definitions (#284, #285, #286).

### PIXI Updates

* Replaced all references to PIXI.Matrix and PIXI.identityMatrix with [Phaser.Matrix](https://phaserjs.github.io/phaser-ce/Phaser.Matrix.html) and Phaser.identityMatrix.

### Thanks

@Arche-san, @cloakedninjas, @dolanmiu, @Dreaded-Gnu, @photonstorm, @samme

## Version 2.8.2 - 14th July 2017

### New Features

* Phaser.Point.set is a static counterpart to [Phaser.Point#set](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#set). It can be used on any point-like object, e.g.,

  ```javascript
  Phaser.Point.set(PIXI.Sprite.defaultAnchor, 0.5); //-> {x: 0.5, y: 0.5}
  ```

### Updates

* Added TypeScript `types` to package.json (#276).
* New [webpack project template](https://github.com/photonstorm/phaser-ce/tree/master/resources/Project%20Templates/Webpack) (#95).
* [Phaser.Component.Core.init](https://phaserjs.github.io/phaser-ce/Phaser.Component.Core.html) checks types of the `game`, `x`, and `y` arguments, since these mistakes can be hard to track down (outside of TypeScript). The cost is likely trivial, but you can skip these by setting [Phaser.Component.Core.skipTypeChecks](https://phaserjs.github.io/phaser-ce/Phaser.Component.Core.html#skipTypeChecks) to true.
* [Phaser.Utils.Debug#renderer](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#renderer) lists [currentBatchedTextures](https://phaserjs.github.io/phaser-ce/PIXI.WebGLRenderer.html#currentBatchedTextures) (added by [PIXI.WebGLRenderer#setTexturePriority](https://phaserjs.github.io/phaser-ce/PIXI.WebGLRenderer.html#setTexturePriority)).
* [Phaser.TilemapParser.parseTiledJSON](https://phaserjs.github.io/phaser-ce/Phaser.TilemapParser.html#parseTiledJSON) warns if a tilemap contains an external tileset, which Phaser doesn't read (#273).
* [Phaser.Tilemap#createFromObjects](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createFromObjects) assigns the width and height of [Object Tiles](http://doc.mapeditor.org/manual/objects/#insert-tile) to the newly created Sprite (previously these were ignored).

### Bug Fixes

* Added missing [PIXI.DisplayObject#constructor](https://phaserjs.github.io/phaser-ce/PIXI.DisplayObject.html) (#278).
* [Arcade.Body#render](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#render), [Debug#geom](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#geom) (circles, ellipses), [Debug#rectangle](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#rectangle), and [Debug#spriteBounds](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#setBounds) use [Debug#lineWidth](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#lineWidth).
* Fixed [PIXI.CanvasRenderer#renderSession.roundPixels](https://phaserjs.github.io/phaser-ce/PIXI.CanvasRenderer.html#renderSession) misspelled as `roundPx` in [Debug#renderer](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#renderer). ([roundPx](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#roundPx) is a Camera property.)
* Fixed some TypeScript definitions (#174, #270, #274, #277).
* The debug canvas is returned to the canvas pool when the game is destroyed (#269).

### Thanks

@bulgakovk, @cmd-johnson, @dolanmiu, @georgesboris, @johnbuttcoingalt, @mindcity, @photonstorm, @samme

## Version 2.8.1 - 20th June 2017

### New Features

* [Debug#camera](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#camera) shows the camera [follow target](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#target) and [deadzone](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#deadzone).
* [Debug#renderer](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#renderer) prints some useful properties of the [game renderer](https://phaserjs.github.io/phaser-ce/Phaser.Game.html#renderer). In WebGL mode, this includes draw counts, texture space limit, and texture batch size.
* [Point#setToPolar](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#setToPolar) places a Point from polar coordinates (angle and distance). You can use it to set velocity or acceleration (as `velocity.setToPolar(angle, speed)`), as many of the Arcade Physics helpers now do.
* [Arcade.Body#blocked.none](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#blocked) describes whether a Body is blocked on any edge. `blocked` and [touching](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#touching) now have identical keys.
* [Arcade.Body#stop](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#stop) halts all motion.
* [Emitter#count](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#count) records some diagnostic quantities: `count.emitted`, `count.failed`, `count.totalEmitted`, `count.totalFailed`.
* [Group#shuffle](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#shuffle) orders children randomly.
* [PIXI.Sprite.defaultAnchor](https://phaserjs.github.io/phaser-ce/PIXI.Sprite.html#defaultAnchor) holds the initial anchor values for new Sprites (default: [x=0, y=0]).
* Phaser.Math.HALF_PI is π / 2.

### Updates

* Added PIXI.canUseNewCanvasBlendModes to support [Particle Storm Plugin](https://phaser.io/shop/plugins/particlestorm) (photonstorm/phaser#2909). It's equivalent to [Phaser.Device.canUseMultiply](https://phaserjs.github.io/phaser-ce/Phaser.Device.html#canUseMultiply).
* [Debug#cameraInfo](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#cameraInfo) now displays the follow target (`target`), `roundPx`, `atLimit`, and `deadzone`.
* [Debug#isDisabled](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#isDisabled) is now defined in two additional cases: `true` when a new game is created with `enableDebug: false`; and `false` otherwise. As before, it is `true` when Phaser is built without the Debug class.
* [ScaleManager#forceOrientation](https://phaserjs.github.io/phaser-ce/Phaser.ScaleManager.html#forceOrientation) warns if you try to force both orientations.
* [WebGLRenderer#setTexturePriority](https://phaserjs.github.io/phaser-ce/PIXI.WebGLRenderer.html#setTexturePriority) warns if `maxTextureAvailableSpace` is exhausted.
* Documented an undocumented feature of [Phaser.Signal](https://phaserjs.github.io/phaser-ce/Phaser.Signal.html): returning `false` from a callback stops Signal propagation, just as [Signal#halt](https://phaserjs.github.io/phaser-ce/Phaser.Signal.html#halt) does (#243).

### Bug Fixes

* Fixed [WebGLRenderer#setTexturePriority](https://phaserjs.github.io/phaser-ce/PIXI.WebGLRenderer.html#setTexturePriority) not clearing the current batch.
* Fixed incorrect `worldRotation` for some objects (#259).
* Fixed `NaN` value for some objects' `worldRotation` and `worldScale` properties. `worldTransform` was still correct.
* Fixed [Phaser.Input#hitTest](https://phaserjs.github.io/phaser-ce/Phaser.Input.html#hitTest) when texture resolution ≠ 1.
* Fixed an incorrect area in [Phaser.Input#hitTest](https://phaserjs.github.io/phaser-ce/Phaser.Input.html#hitTest) when a Creature is reversed on either axis.
* Fixed camera shake failing to be reset to 0 when camera is reset.
* Added some missing TypeScript return values (#255).
* Fixed typo for TypeScript definition of `IGameConfig.multiTexture` property.

### Thanks

@andrewjb123, @dhashvir, @Formic, @jbpuryear, @noidexe, @pavle-goloskokovic, @photonstorm, @rgk, @samme, stupot

## Version 2.8.0 - 30th May 2017

We've bumped the minor version (2.8) for changes in how circular Arcade Physics bodies behave with scaled sprites. We consider this a bug fix (#235), but since the prior behavior wasn't documented and existing code might be relying on it, we wanted to give you a heads-up.

### New Features

* You can emit particles in a radial pattern with [Emitter#setAngle](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#setAngle).
* [Emitter#output](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#output), [Emitter#lifespanOutput](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#lifespanOutput), and [Emitter#remainder](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#remainder) describe particle flow rate.
* You can toggle drag (resistance) on or off with [Arcade.Body#allowDrag](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#allowDrag). You might apply drag only when a character is touching the ground, for example.
* [Group#checkAny](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#checkAny) tests if at least one child matches a given property value.
* [Group#killAll](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#killAll) kills all existing children. (Also useful for shutting off particle emitters.)
* [Group#reviveAll](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#reviveAll) revives all non-existing children.
* [Group#resetAll](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#resetAll) calls resetChild on all children (changing position, texture, and frame, if specified).
* [Group#scatter](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#scatter) places each child at a random position within a Rectangle or the World bounds.
* [Point.isPoint](https://phaserjs.github.io/phaser-ce/Phaser.Point.html#isPoint) identifies objects that can be safely used in Point operations.

### Updates

* [Arcade.Body#radius](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#radius) represents a length relative to the sprite's texture dimensions. The effective radius of the body scales automatically when the sprite scale changes, as with rectangular bodies, and the body is sized correctly when the sprite's scale is different from (1, 1) (#235).
* [Create#grid](https://phaserjs.github.io/phaser-ce/Phaser.Create.html#grid) and [Create#texture](https://phaserjs.github.io/phaser-ce/Phaser.Create.html#texture) accept callbacks (#241, #136) and can return a BitmapData object when passed `generateTexture=false`.

### Bug Fixes

* Fixed incorrect Phaser.Text dimensions when assigning a numeric string to [strokeThickness](https://phaserjs.github.io/phaser-ce/Phaser.Text.html#strokeThickness) (#239). (You should still use a number instead, though.)
* Fixed Sounds ignoring changes to global volume when using audio tags.
* Fixed looping timers not getting removed completely when destroyed.

### Thanks

@ColaColin, @GameDevFox, @goldfire, @netgfx, @photonstorm, @rblopes, @samme, @shunsei, @Xesenix

## Version 2.7.10 - 19th May 2017

### New Features

* Added [Creature alpha](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html#alpha) (`creature.alpha = 0.5` for 50% opacity)
* Added [Creature tinting](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html#tint) (`creature.tint = 0xFF0000` for red tint)
* You can now set [Phaser.Utils.Debug#lineWidth](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#lineWidth), the width of the stroke of shapes drawn by [Debug#body](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#body) and [Debug#geom](https://phaserjs.github.io/phaser-ce/Phaser.Utils.Debug.html#geom).

### Updates

* [Group#checkProperty](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#checkProperty) now returns false if the `child` argument is not a child of the Group. Use [Phaser.Utils.getProperty](https://phaserjs.github.io/phaser-ce/Phaser.Utils.html#.getProperty) instead to read a property value on any object.
* Removed `/docs` and `/resources` from Phaser CE's Bower and [NPM](https://www.npmjs.com/package/phaser-ce) packages, which are now much smaller.
* Removed some duplicate files from `/build`.

### Bug Fixes

* Fixed a TypeError in pointer-over checks when Phaser.Creature is missing
* Fixed [Group#checkAll](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#checkAll) and [Group#checkProperty](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#checkProperty) returning a false negative when `force` was used (#219).
* [Utils.getProperty](https://phaserjs.github.io/phaser-ce/Phaser.Utils.html#.getProperty) now returns undefined for missing properties. It had claimed to return null, but could return either null or undefined depending on chain length (#218).
* Fixed [Group#checkAll](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#checkAll), [Group#checkProperty](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#checkProperty), and [Utils.getProperty](https://phaserjs.github.io/phaser-ce/Phaser.Utils.html#.getProperty) failing to retrieve nested properties (#220).
* Corrected [Group#checkAll](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#checkAll) and [Group#checkProperty](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#checkProperty) argument types (#216).
* [Group#getAll](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#getAll) now correctly returns all children when the `property` and `value` arguments are omitted.
* Fixed [Emitter#emitParticle](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#emitParticle) failing to apply certain particle scale values.

### Thanks

@andrewjb123, @EmilSV, @entozoon, @greut, @jbpuryear, @mikkoh85, @MrBaummann, @photonstorm, @rblopes, @rmkubik, @samme

## Version 2.7.9 - 9th May 2017

### Updates

* Emitter#gravity can now be set as a number (as in Phaser versions prior to 2.7.2) or a Point (#203). Reading the value will always give you a Point.

### Bug Fixes

* Fixed a crash when a Text object's alignment was not set (#208).
* Fixed a bug in creature hitboxes for pointer input - if creature reversed (negative number) it would calculate incorrect area for hit box.

## Version 2.7.8 - 8th May 2017

### New Features

* You can now set [Group#updateOnlyExistingChildren](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#updateOnlyExistingChildren) to skip [update](https://phaserjs.github.io/phaser-ce/Phaser.Component.Core.html#update) calls on children with `exists = false` (#187).
* [Phaser.ScaleManager#setUserScale](https://phaserjs.github.io/phaser-ce/Phaser.ScaleManager.html#setUserScale) now has `queueUpdate` and `force` parameters. Set these to false if your [resize callback](https://phaserjs.github.io/phaser-ce/Phaser.ScaleManager.html#setResizeCallback) is being called repeatedly (#197).
* Added [Phaser.Creature#createAllAnimations](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html#createAllAnimations) to force load all animations in a creature mesh. It must be called before [Phaser.Creature#setAnimation](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html#setAnimation).
* Added [Phaser.Creature#setAnimationPlaySpeed](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html#setAnimationPlaySpeed).
* Added [Phaser.Creature.html#height](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html#height) and [Phaser.Creature#width](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html#width). You can set these dimensions directly rather than by using `scale`.
* Added [Phaser.Creature#setAnchorPointEnabled](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html#setAnchorPointEnabled), [Phaser.Creature#anchorX](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html#anchorX), and [Phaser.Creature#anchorY](https://phaserjs.github.io/phaser-ce/Phaser.Creature.html#anchorY) for setting a Creature's anchor point dynamically (still experimental).

### Updates

* Removed the upper limit of 12 for [Phaser.Loader#maxParallelDownloads](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#maxParallelDownloads). The default value is still 4. Most browsers limit parallel connections to 6 per domain. Older IE and Android browsers may suffer with a value above 4 (#170).
* Arcade Physics Bodies no longer receive angular motion updates while they have [allowRotation](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#allowRotation) disabled, as this was unnecessary.
* [Phaser.Text#align](https://phaserjs.github.io/phaser-ce/Phaser.Text.html#align) can now be set in any case or mix of cases (e.g., 'left', 'Left', 'LEFT').
* [Phaser CE API](https://phaserjs.github.io/phaser-ce/) now shows a synopsis like the Phaser 2.6 docs. You can still find the complete [README](https://github.com/photonstorm/phaser-ce/blob/master/README.md) on GitHub.
* Updated [ScaleManager](https://phaserjs.github.io/phaser-ce/Phaser.ScaleManager.html) docs.
* Clarified `gid` argument in [Phaser.Tilemap#createFromObjects](https://phaserjs.github.io/phaser-ce/Phaser.Tilemap.html#createFromObjects). It can represent an object's `gid`, `id`, or `name`.
* Clarified [Phaser.Image](https://phaserjs.github.io/phaser-ce/Phaser.Image.html)'s use of the Animation component (#185). Images can be animated the same way Sprites can.

### Bug Fixes

* Fixed an issue where Sprites sharing the same texture were distorted or hidden when a WebGLFilter was applied (#39, #153, #154).
* Fixed a 'memory exhausted' error in PIXI.PixiFastShader when compiling shaders with multiTexture enabled.
* Fixed a TypeError in PIXI.WebGLGraphics when trying to render a Graphics object with a missing WebGL context (#178)
* Fixed a ReferenceError in [PIXI.WebGLRenderer](https://phaserjs.github.io/phaser-ce/PIXI.WebGLRenderer.html) when running Phaser in ES5 strict mode.
* Fixed some Typescript definitions (#167).
* Phaser now correctly sets a Creature's anchor point (as set in Creature editor) when a creature mesh is loaded.
* Fixed CreatureManager#CreateAllAnimations crashing in Chrome.

### Thanks

@aaronransley, @andrewjb123, @Cryt1c, @goldfire, @gre, @LandonSchropp, @NickH-nz, @noseglid, @photonstorm, @samme, @tanquetav, @vantreeseba, @vpmedia, @Xan0C

## Version 2.7.7 - 20th April 2017

### Bug Fixes

* Fixed failure to load compressed textures when using URLs with query strings (#166)
* Fixed some TypeScript definitions (#168)
* Fixed missing default values for `resolution` in Phaser.LoaderParser BitmapFont methods (#168).
* Fixed particle [autoAlpha](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#autoAlpha) and [autoScale](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#autoScale) tweens running at double speed (#160).
* Fixed loading of compressed textures (#17, #162)
* Removed `any` key in [Phaser.Physics.Arcade.Body#checkCollision](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#checkCollision). It was never used, so setting it had no effect (#161). Use `!checkCollision.none` instead.
* Fixed [Phaser.Sound](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html) exception when using IE with AudioTag and high volume values (#157). Now volume is clamped between 0 and 1 in every browser when using AudioTags.
* Fixed incorrect [worldScale](https://phaserjs.github.io/phaser-ce/PIXI.DisplayObject.html#worldScale) calculation (#15)

### Thanks

@fridrisnew, @goldfire, @hdodov, @Peter42, @photonstorm, @samme, @SBCGames, @vpmedia

## Version 2.7.6 - 13th April 2017

### New Features

* New method [Phaser.Loader#imageFromBitmapData](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#imageFromBitmapData) lets you preload an image extracted from a BitmapData canvas.
* [BitmapData#generateTexture](https://phaserjs.github.io/phaser-ce/Phaser.BitmapData.html#generateTexture) now has an optional callback argument. Most browsers now load the generated image asynchronously, so without a callback you're not guaranteed a valid texture (#136).
* [Phaser.GameObjectFactory#weapon](https://phaserjs.github.io/phaser-ce/Phaser.GameObjectFactory.html#weapon) (used as `game.add.weapon`) now has a `bulletClass` argument. Without this it was difficult to set `bulletClass` before creating the bullet pool.

### Updates

* [Phaser.Cache#addImage](https://phaserjs.github.io/phaser-ce/Phaser.Cache.html#addImage) now emits a warning if you add an image that hasn't completed loading.
* [Phaser.Frame](https://phaserjs.github.io/phaser-ce/Phaser.Frame.html) now emits a warning if a Frame is constructed with a zero width or height.
* [Phaser.Physics.Arcade#velocityFromAngle](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.html#velocityFromAngle) now uses [Phaser.Math](https://phaserjs.github.io/phaser-ce/Phaser.Math.html) instead of `game.math`, so you can use it without a reference to a running game (#131).
* Clarified [Emitter#start](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#start) documentation. It's really easier to use [Emitter#explode](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#explode) or [Emitter#flow](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#flow).
* The game canvas's [cursor style](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) is now `pointer` when the cursor is over an object with `input.useHandCursor` enabled and empty at all other times. This should make it easier to set your own cursor style for the game (#110).
* TypeScript definitions fixes and updates (#75, #101, #107)
* Docs typo fixes (#101)
* Added [photonstorm/phaser-plugins](https://github.com/photonstorm/phaser-plugins) to the Phaser CE docs: see [Phaser.Plugin](https://phaserjs.github.io/phaser-ce/Phaser.Plugin.html) (#107)
* BitmapData and RenderTexture objects are now destroyed when clearing the cache (#68). This should reduce memory use.

### Bug Fixes

* Fixed an issue where a display object's preUpdate call would be skipped if a sibling was removed or destroyed, which could create small discrepancies in position, lifespan, or renderOrderID (#103).
* Fixed an issue where display objects using the default texture could have an incorrect size (1×1) and appear blank (#138). The built-in DEFAULT and MISSING textures are now loaded asynchronously to ensure that they're valid.
* Fixed an issue where [game.device.canUseMultiply](https://phaserjs.github.io/phaser-ce/Phaser.Device.html#canUseMultiply) could hold a false negative on first (Firefox, Safari) or even subsequent (Chrome 57) page loads, disabling most blend modes when using the Canvas renderer (#130).
* [Phaser.Keyboard#lastChar](https://phaserjs.github.io/phaser-ce/Phaser.Keyboard.html#lastChar) is now `null` if Phaser has recorded no key presses yet. Reading it before a key press no longer raises an error (#132).
* Previously, the `center` of a moving Arcade Physics Body was inaccurate during the game's update phase, and that made collision checks of circular Bodies less accurate (#122). This was fixed by updating `center` during preUpdate.
* Fixed an issue when dragging a sprite whose parent is scaled or rotated (#108). Now the sprite follows the cursor correctly.
* Fixed audio skipping when restarting playback (#78)
* Fixed bad rendering of multiple tinted BitmapText objects (#58)
* Fixed Object.assign not existing on older devices (#81)
* Previously, the HEADLESS renderer essentially became a CANVAS renderer after boot, which was incorrect (#74). Phaser.HEADLESS now sets up a PIXI.CanvasRenderer and a detached (invisible) canvas. It skips `render` hooks but not the `preRender` and `postRender` hooks (strange). [game.renderType](https://phaserjs.github.io/phaser-ce/Phaser.Game.html#renderType) now contains either Phaser.CANVAS, Phaser.HEADLESS, or Phaser.WEBGL after boot.

### Thanks

@alexus85, @Arcanorum, @digitsensitive, @Dreaded-Gnu, @hdodov, @IVA-apps, @JTronLabs, @Lightning3105, @mikewesthad, @nalgorry, @photonstorm, @qarlosh, @samme, @trpzn, @vpmedia

## Version 2.7.5 - 23rd March 2017

* A hotfix to patch the error `this.preUpdateLifeSpan is not a function` in 2.7.4 (#72)

## Version 2.7.4 - 23rd March 2017

### New Features

* New method [Phaser.Math.hypot()](https://phaserjs.github.io/phaser-ce/Phaser.Math.html#hypot) calculates the length of the hypotenuse spanning two given lengths
* Added [Phaser.BitmapData#copyBitmapData](https://phaserjs.github.io/phaser-ce/Phaser.BitmapData.html#copyBitmapData)
* Added noPause logic to src/input/Pointer.js
* Added timeStep parameter pass to state.pauseUpdate call at src/core/Game.js
* Added [Phaser.TilemapLayer#tileOffset](https://phaserjs.github.io/phaser-ce/Phaser.TilemapLayer.html#tileOffset) (Phaser.Point). This allows offsetting layer positions in a way that plays well with the camera and Arcade physics. Also, the `offsetx` and `offsety` properties are now read from the layer properties of Tiled maps.

### Updates

* Changed [Phaser.Loader#loadImageTag](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html#loadImageTag) to exclude Firefox from loading cached images (phaser #2534)
* Added yarn lock file
* Added travis-ci build script
* Fixed Phaser.Plugin.AStar Typescript definitions and phaser-ce module name to get `grunt tsdocs` to work again (#33)
* Fixed Phaser.Plugin.AStar.DISTANCE_MANHATTAN Typescript definitions
* Changed bower package name to `phaser-ce`
* [Phaser.Particles.Arcade.Emitter#explode()](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#explode) now launches all particles if the `quantity` argument is omitted (#7). You should pass quantity `0` if you want to launch no particles.
* [overlapR](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#overlapR), [overlapX](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#overlapX), and [overlapY](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#overlapY) are now correctly reset to 0 when an Arcade Physics Body isn't colliding (#23)
* [Phaser.Physics.P2.Body.loadPolygon()](https://phaserjs.github.io/phaser-ce/Phaser.Physics.P2.Body.html#loadPolygon) now has a `scale` parameter that allows the loaded polygon to have a different scale
* Fixed documentation of [Phaser.Video#createVideoFromBlob](https://phaserjs.github.io/phaser-ce/Phaser.Video.html#createVideoFromBlob)
* Clarified documentation of [Phaser.AnimationManager#updateIfVisible](https://phaserjs.github.io/phaser-ce/Phaser.AnimationManager.html#updateIfVisible)
* Updated [Phaser.Text#setStyle](https://phaserjs.github.io/phaser-ce/Phaser.Text.html#setStyle) to not mutate the passed style
* Added `particleArguments` parameter to [Phaser.Particles.Arcade.Emitter#makeParticles](https://phaserjs.github.io/phaser-ce/Phaser.Particles.Arcade.Emitter.html#makeParticles). It lets you pass custom parameters to a particle class
* Fixed jshint issues (#46)
* Updated README and CHANGELOG markdown (#69)

### Bug Fixes

* [Phaser.Image#lifespan](https://phaserjs.github.io/phaser-ce/Phaser.Image.html#lifespan) now works properly (#46).
* [Phaser.Physics.Arcade.Body.reset()](https://phaserjs.github.io/phaser-ce/Phaser.Physics.Arcade.Body.html#reset) now resizes the body if the sprite scale has changed (#10).
* Fixed [Phaser.Camera.checkBounds()](https://phaserjs.github.io/phaser-ce/Phaser.Camera.html#checkBounds) so it doesn't flicker when its view is bigger than its bounds.
* Fixed [Phaser.Math#between](https://phaserjs.github.io/phaser-ce/Phaser.Math.html#between) and [Phaser.Math#random](https://phaserjs.github.io/phaser-ce/Phaser.Math.html#random) to work again
* [Phaser.Loader](https://phaserjs.github.io/phaser-ce/Phaser.Loader.html) is now reset just before it signals loading is complete (#53)
* Fixed rendering on devices that use older versions of javascript
* Fixed crashes on very old devices
* Fixed an error when destroying a sprite during [Phaser.Group#update](https://phaserjs.github.io/phaser-ce/Phaser.Group.html#update)
* Fixed local rotation tracking in [Phaser.Weapon#fire](https://phaserjs.github.io/phaser-ce/Phaser.Weapon.html#fire) (#66)
* Fixed WebAudio memory leak on in [Phaser.Sound](https://phaserjs.github.io/phaser-ce/Phaser.Sound.html)

### Pixi Updates

* Fixed wrong parameter PIXI.DisplayObject#\_generateCachedSprite

## Version 2.7.3 - 9th January 2017

* Replaced missing jshintrc file (#2912)
* Added tempPoint argument / undefined block to Graphics.containsPoint
* Fixed Text.setCharacterLimit conditional check
* Added resolution argument to LoaderParser.jsonBitmapFont
* Fixed Phaser.Plugin.AStar TypeScript definitions to match plugin source

## Version 2.7.2 - 6th December 2016

### New Features

* Added feature: set character limit with suffix

### Updates

* Clarification of time units in Phaser.Sound
* Clarification of `group.exists` behavior
* Clarification of fixedToCamera semantics
* change Emitter.gravity from number to Phaser.Point
* Fixed issue causing tsc to crap out under certain circumstances

### Bug Fixes

* Floating Gamepad buttons now work correctly when partially pressing and releasing
* Phaser.Line.intersectsRectangle() now works correctly for horizontal and vertical lines ([#2942](https://github.com/photonstorm/phaser/issues/2942)).
* removeTextureAtlas now deletes the correct cache object.

## Version 2.7.1 - 28th November 2016

### Updates

* Added a third optional parameter to PIXI.BaseTexture allowing textures to be scaled according to devicePixelRatio (thanks @cloakedninjas)
* TypeScript definitions fixes and updates (thanks @Aleksey-Danchin)

### Bug Fixes

* Phaser.AnimationParser.spriteSheet() now works like it is supposed to work (thanks @stoneman1, @qarlosh)
* EarCut was not included in the build because of wrong path in grunt tasks. It should  now work (thanks @stoneman1)
* Some browsers uses CancelRequestAnimationFrame instead of CancelAnimationFrame and it is now fixed (thanks @stoneman1)

## Version 2.7.0 - "World's End" - 22nd November 2016

Phaser 2.7 is now released to the community to maintain. Please see the README for more details.

### New Features

* Multiple Batched Texture support is now available. This is a WebGL feature that can seriously decrease the volume of draw calls made in complex, or asset heavy, games. To enable it you can either use the new renderer type `Phaser.WEBGL_MULTI`, or you can pass the property `multiTexture: true` in a Phaser.Game configuration object. Once enabled, it cannot be disabled.
* `game.renderer.setTexturePriority` is the method that goes with the Multiple Texture support. It takes an array as its single argument. The array consists of Phaser.Cache image key strings. Phaser will then try to batch as many of the textures as it can, depending on the hardware limits. If for example the GPU can only batch 8 textures, and you provide an array of 16, then only the first 8 in the array will be batched.
* Phaser now supports Compressed Textures under WebGL. It will handle loading PVRTC, DDS, ETC1, KTX and PKM texture formats, and supports PVRTC, S3TC and ETC1 compression formats, with a TrueColor fallback for standard PNGs. Using compressed textures allows the GPU to decode, and access, the texture data much faster than traditional image compression schemes such as JPEG. iOS devices in particular benefit greatly from using PowerVR Texture Compression (PVRTC). The resulting textures take up less memory than their traditional counterparts, and when it comes to iOS, every bit of memory helps! Look at the new `Loader.texture` method for details on using this. You can also pass a file object to `Loader.image`, again, please see the docs for details.
* Support for Rotated Frames in Texture Atlases is now included for WebGL and Canvas. If you use software such as Texture Packer, you may now enable the 'Allow Rotation' checkbox, which can often help getting smaller, or more compact, atlases. As a result, the `Texture.rotated` and `Frame.rotated` properties are now in use.
* `Frame.rotationDirection` has been removed. It isn't needed, as modern texture packers only rotate 90 degrees clockwise anyway, and Phaser only supports this rotation direction.
* Weapon.multiFire is a new property that allows you to set a Weapon as being allowed to call `fire` as many times as you like, per game loop. This allows a single Weapon instance to fire multiple bullets.
* Weapon.fire has two new arguments: `offsetX` and `offsetY`. If the bullet is fired from a tracked Sprite or Pointer, or the `from` argument is set, this applies a horizontal and vertical offset from the launch position.
* Weapon.fireOffset attempts to fire a single Bullet from a tracked Sprite or Pointer, but applies an offset to the position first. This is a shorter form of calling `Weapon.fire` and passing in the offset arguments.
* Weapon.fireMany attempts to fire multiple bullets from the positions defined in the given array. If you provide a `from` argument, or if there is a tracked Sprite or Pointer, then the positions are treated as __offsets__ from the given objects position. If `from` is undefined, and there is no tracked object, then the bullets are fired from the given positions, as they exist in the world.
* When loading a Sprite Sheet you can now specify the number of frames to skip, as the frames are extracted from the sheet and converted to Frames (thanks @arefiev #2763)
* Math.random returns a random float in the range given (thanks @JTronLabs #2760)
* Text.splitRegExp is a new property that allows you to control the regular expression that is used to split the text into multiple lines (thanks @dai-shi #1403)
* Cache.addBitmapFontFromAtlas allows you to add a Bitmap Font to the Cache, that is comprised of a frame from a Texture Atlas, and the font data (in JSON or XML format). Once added you can use the Bitmap Font in the same way as you would any Bitmap Font (#2614)

### Updates

* TypeScript definitions fixes and updates (thanks @chriteixeira @StealthC @Lopdo @nickdbush)
* Docs typo fixes (thanks @JTronLabs @samme @jorgesumle)
* `Phaser.Line.fromSprite` now uses the Sprite.centerX and centerY properties if the `useCenter` argument is true. Before it required you to have overridden the Sprite and added the property yourself (thanks @samme #2729)
* Updated the pointer check code in the Device class, to get rid of the message `Navigator.pointerEnabled is a non-standard API added for experiments only. It will be removed in near future.` in Chrome.
* The P2 Physics library has been updated to 0.7.1. This is still quite out of date, but as soon as they release their latest build (hopefully soon) we'll update to that.
* Math.between has been strengthened and the docs improved (thanks @JTronLabs #2760)
* Camera.fade has a new argument `alpha` to control the alpha level of the effect (thanks @rgk #2493)
* Camera.flash has a new argument `alpha` to control the alpha level of the effect (thanks @rgk #2493)
* Phaser.SpriteBatch was incorrectly applying the prototypes, causing the Sprite Batch render methods to be replaced by the normal DisplayObjectContainer ones, meaning nothing was really batched at all. This has now been fixed, and PIXI.SpriteBatch removed, as it's no longer required.
* PIXI.RenderTexture has been removed, and all functionality merged in to Phaser.RenderTexture, to cut down on the number of internal classes and inheritance going on.
* PIXI.TilingSprite has been removed, and all functionality merged in to Phaser.TileSprite, to cut down on the number of internal classes and inheritance going on.
* PIXI.CanvasPool has been moved into the Phaser `utils` folder, and renamed to `Phaser.CanvasPool`. All references to PIXI.CanvasPool have been updated to match the new namespace.
* PIXI.EarCut has been moved into the Phaser `utils` folder, and renamed to `Phaser.EarCut`. All references to PIXI.EarCut have been updated to match the new namespace.
* Device.canHandleAlpha is a new boolean property that stores is the browser is capable of tinting with alpha.
* Device.canUseMultiply is a new boolean property that stores whether or not the Canvas BlendModes are supported, consequently the ability to tint using the multiply method.
* Math.getNextPowerOfTwo will get the next power of two for the given value.
* Math.isPowerOfTwo will return a boolean if the given width and height are a power of two.
* Color.hexToRGBArray converts a hex color value to an [R, G, B] array.
* Color.RGBArrayToHex converts an RGB color array, in the format: [R, G, B], to a hex color value.
* PIXI.AbstractFilter has been merged into the Phaser.Filter class. All references to PIXI.AbstractFilter have been updated to use Phaser.Filter instead.
* PIXI.Rope and PIXI.Strip have been removed, and all functionality merged in to Phaser.Rope, to cut down on the number of internal classes and inheritance going on.
* PIXI.Graphics and PIXI.GraphicsData have been removed, and all functionality merged in to Phaser.Graphics, to cut down on the number of internal classes and inheritance going on.
* WebGLGraphics and CanvasGraphics have been updated so that it checks for Phaser Geometry shape types internally.
* PIXI.PI_2 has been removed, because it's available via Phaser.Math.PI2. The only place PI_2 was used has been updated to now use PI2.
* The polyfills.js file now polyfills in for Float32Array, Uint16Array and ArrayBuffer.
* PIXI.Float32Array, PIXI.Uint16Array, PIXI.Uint32Array and PIXI.ArrayBuffer have all been removed, and replaced with their own proper native versions. The polyfill now captures any instances where the browser needs to fall back to an Array instead.


### Bug Fixes

* `DisplayObjectContainer.removeChildren` was incorrectly using the `begin` var, instead of `beginIndex` (thanks @alex-espinoza #2742 #2741)
* Camera.fx is tested to see if it exists, before resetting it (thanks @samme #2739 #2738)
* The Weapon Plugin will no longer crash if the Weapon's bullets have not yet been initialized before setting a new bullet class (thanks @JTronLabs #2731)
* Groups with `fixedToCamera` set on them now factor in the camera scale (thanks @kevinAlbs #2771)
* Text.width and Text.height now divide the result by the Text.resolution, to avoid incorrect dimensions on High DPI devices (thanks @mattahj #2146)
* If you called Video.changeSource, and then immediately called Video.play after it, it would fire the `onComplete` event twice (thanks @jaraiza #2543)
* The Video.playing property didn't check to see if the Video existed, and would throw the error `Uncaught TypeError: Cannot read property 'paused' of null` if you called it after destroying the video (thanks @Tetley #2740)
* Fixed bug in DisplayObject where it was using `PI_2` instead of `PI2`.

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* WebGL Renderer and shaders updated to support multi-texture batching (see main docs above)
* WebGL and Canvas both now support rotated texture atlas frames.
* WebGL support for compressed texture formats added.
* PIXI.SpriteBatch has been removed as it's no longer used internally.
* PIXI.RenderTexture has been removed as it's no longer used internally.
* PIXI.TileSprite has been removed as it's no longer used internally.
* PIXI.EarCut has been removed as it's no longer used internally.
* PIXI.Utils has been removed. All functionality is now available in Phaser.
* PIXI.EventTarget has been removed as it's no longer used internally.
* PIXI.AbstractFilter has been removed as it's no longer used internally. All functionality is now available via Phaser.Filter.
* PIXI.Strip and PIXI.Rope have been removed. All functionality is now available via Phaser.Rope.
* PIXI.Graphics and PIXI.GraphicsData have been removed. All functionality is now available via Phaser.Graphics. The respective renderers have been updated.
* PIXI.PI_2, PIXI.RAD_TO_DEG and PIXI.DEG_TO_RAD have all been removed, as they are no longer used internally, and are all available under Phaser.Math.
* PIXI.RETINA_PREFIX has been removed, as it was never used anywhere internally.
* PIXI._UID has been removed, all affected classes now use Phaser._UID.
* PIXI.Float32Array, PIXI.Uint16Array, PIXI.Uint32Array and PIXI.ArrayBuffer have all been removed, and replaced with their own proper native versions.

## Version 2.6.2 - "Kore Springs" - 26th August 2016

### New Features

* Group.getRandomExists will return a random child from the Group that has exists set to true.
* Group.getAll will return all children in the Group, or a section of the Group, with the optional ability to test if the child has a property matching the given value or not.
* Group.iterate has a new `returnType`: `RETURN_ALL`. This allows you to return all children that pass the iteration test in an array.
* The property `checkCollision.none` in the ArcadePhysics.Body class was available, but never used internally. It is now used and checked by the `separate` method. By setting `checkCollision.none = true` you can disable all collision and overlap checks on a Body, but still retain its motion updates (thanks @samme #2661)
* Math.rotateToAngle takes two angles (in radians), and an interpolation value, and returns a new angle, based on the shortest rotational distance between the two.
* Math.getShortestAngle will return the shortest angle between the two given angles. Angles are in the range -180 to 180, which is what `Sprite.angle` uses. So you can happily feed this method two sprite angles, and get the shortest angle back between them (#2494)

### Updates

* TypeScript definitions fixes and updates (thanks @calvindavis @AlvaroBarua)
* Docs typo fixes (thanks @rroylance @Owumaro @boniatillo-com @samme @kjav)
* The InputHandler.flagged property has been removed. It was never used internally, or exposed via the API, so was just overhead.
* The src/system folder has been removed and all files relocated to the src/utils folder. This doesn't change anything from an API point of view, but did change the grunt build scripts slightly.
* BitmapData.shadow and BitmapData.text now both `return this` keeping them in-line with the docs (thanks @greeny #2634)
* Group.align has had its arguments changed so that it's now `(width, height, ...)` instead of `(rows, columns, ...)` (thanks @deargle #2643)
* Group.align now returns `true` if the Group was aligned, or `false` if not.
* The Loader.headers object has a new property `requestedWith`. By default this is set to `false`, but it can be used to set the `X-Requested-With` header to `XMLHttpRequest` (or any other value you need). To enable this do `this.load.headers.requestedWith = 'XMLHttpRequest'` before adding anything to the Loader.
* ScaleManager.hasPhaserSetFullScreen is a new boolean that identifies if the browser is in full screen mode or not, and if Phaser was the one that requested it. As it's possible to enter full screen mode outside of Phaser, and it then gets confused about what bounding parent to use.
* Phaser.Tileset has a new property `lastgid` which is populated automatically by the TilemapParser when importing Tiled map data, or can be set manually if building your own tileset.
* Stage will now check if `document.hidden` is available first, and if it is then never even check for the prefixed versions. This stops warnings like "mozHidden and mozVisibilityState are deprecated" in newer versions of browsers and retain backward compatibility (thanks @leopoldobrines7 #2656)
* As a result of changes in #2573 Graphics objects were calling `updateLocalBounds` on any shape change, which could cause dramatic performances drops in Graphics heavy situations (#2618). Graphics objects now have a new flag `_boundsDirty` which is used to detect if the bounds have been invalidated, i.e. by a Graphics being cleared or drawn to. If this is set to true then `updateLocalBounds` is called once in the `postUpdate` method (thanks @pengchuan #2618)
* Phaser.Image now has the ScaleMinMax component.
* Animations now allow for speeds greater than 0, rather than forcing them to be greater than 1. This allows you to have animation speeds slower than 1 frame per second (thanks @jayrobin #2664)
* Weapon.fire and all related methods (fireAtXY, fireAtPointer, fireAtSprite) now all return the instance of the Phaser.Bullet that was fired, or `null` if nothing was fired. Previously it would return a boolean, but this change allows you to perform additional processing on the Bullet as required (thanks @JTronLabs #2696)
* Sound.loopFull now returns the Sound instance that was looped (thanks @hilts-vaughan #2697)
* ArcadePhysics Body.rotation now reads its initial value from sprite.angle instead of sprite.rotation. The property was immediately replaced with the correct value in Body.preUpdate regardless, but it keeps it consistent (thanks @samme #2708)
* Weapon.fire now tracks rotation properly, when using an offset and tracking a sprite (thanks @bobonthenet #2672)

### Bug Fixes

* A Group with `inputEnableChildren` set would re-start the Input Handler on a Sprite, even if that handler had been disabled previously.
* Weapon.autofire wouldn't fire after the first bullet, or until `fire` was called, neither of which are requirements. If you now set this boolean the Weapon will fire continuously until you toggle it back to false (thanks @alverLopez #2647)
* ArcadePhysics.World.angleBetweenCenters now uses `centerX` and `centerY` properties to check for the angle between, instead of `center.x/y` as that property no longer exists (thanks @leopoldobrines7 #2654)
* The Emitter.makeParticles `collide` argument didn't work, as a result of #2661, but is now properly respected thanks to that change (thanks @samme #2662)
* Sound.play would throw the error "Uncaught DOMException: Failed to execute 'disconnect' on 'AudioNode': the given destination is not connected." in Chrome, if you tried to play an audio marker that didn't exist, while a valid marker was already playing.
* Text bounds would incorrectly displace if the Text resolution was greater than 1 (thanks @valent-novem #2685)
* TilemapParser would calculate widthInPixels and heightInPixels were being read incorrectly from JSON data (capitalisation of properties) (thanks @hexus #2691)
* A tinted Texture in Canvas mode wouldn't be updated properly if it was also cropped, beyond the initial crop. Now a cropped texture will re-tint itself every time the crop is updated, and has changed (thanks @phoenixyjll #2688)
* The Weapon.fireRateVariance property was never taken into account internally. It's now applied to the firing rate correctly (thanks @noseglid #2715)
* Text.updateText now sets `Text.dirty = false`, which stops Text objects from having `updateText` called twice on them after creation.

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* This version contains significant fixes for `DisplayObject.getBounds` and `DisplayObjectContainer.getBounds`. The methods can now accept an optional argument `targetCoordinateSpace` which makes it much more flexible, allowing you to check the bounds against any target, not just local and global ones. If the `targetCoordinateSpace` is a valid DisplayObject:

    - If it's a parent of the caller at some level it will return the bounds
    relative to it.
    - if it's not parenting the caller at all, it will get the global bounds of
    it, and the caller and will calculate the x and y bounds of the caller
    relative to the targetCoordinateSpace DisplayObject.

As a result this also fixes how empty Groups are treated when they have no other children except Groups. So now calculations are correct.
* DisplayObjectContainer.contains(child) is a new method which determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance itself. This method is used in the new getBounds function.
* Corrected DisplayObjects default `_bounds` rect from (0, 0, 1, 1) to (0, 0, 0, 0).
* Thanks to @fmflame for his hard work on the above (#2639 #2627)
* The methods `setStageReference` and `removeStageReference` have been removed from all Pixi classes. Objects no longer have `stage` properties, or references to the Stage object. This is because no reference to the Stage is required for any calculations, and Phaser can only have 1 Stage, so adding and removing references to it were superfluous actions.
* The file pixi/utils/Polyk.js has been removed, as it was no longer used with Pixi or Phaser (we replaced it with EarCut a while ago)

## Version 2.6.1 - "Caemlyn" - 11th July 2016

### Bug Fixes

* Fixed `Uncaught TypeError: Cannot set property 'x' of undefined` in Body.js (thanks @ErwanErwan #2607)

## Version 2.6.0 - "Fal Moran" - 8th July 2016

### New Features

* The Loader has a new property `headers`. This is an object checked by XHR Requests, used to set the Request Header of certain file types. JSON and XML are pre-configured, but you can add to, or modify this property as required (thanks @stoneman1 #2585 #2485)
* Phaser now has support for Typings, the TypeScript Definition Manager. See the `typescript/readme.md` file for installation instructions (thanks @monagames #2576)
* Phaser.Utils.reverseString will take the given string, reverse it, and then return it.
* Phaser.ArrayUtils.rotateRight is the opposite of ArrayUtils.rotate. It takes an array, removes the element from the end of the array, and inserts it at the start, shifting everything else 1 space in the process.
* Phaser.ArrayUtils.rotateLeft is the new name for Phaser.ArrayUtils.rotate. The old method is now deprecated (but still available in this release)
* Phaser.Color.toABGR converts RGBA components to a 32 bit integer in AABBGGRR format.
* ArcadePhysics.Body.setCircle is a new method that allows you to define an Arcade Physics Body as being a circle instead of a rectangle. You can control the radius of the body and the offset from the parent sprite.
* ArcadePhysics.World.separateCircle is a new method that handles all circular body collisions internally within Arcade Physics (thanks @VitaZheltyakov)
* All of the Arcade Physics internal methods, such as `collideGroupVsSelf`, `collideSpriteVsSprite` and so on, have been updated to work with circular body shapes (thanks @VitaZheltyakov)
* ArcadePhysics.Body.onWorldBounds is a new Signal that is dispatched whenever the Body collides with the world bounds, something that was previously difficult to detect. Due to the potentially high volume of signals this could create it is disabled by default. To use this feature set this property to a Phaser.Signal: `sprite.body.onWorldBounds = new Phaser.Signal()` and it will be called when a collision happens, passing five arguments: the sprite on which it occurred, and 4 booleans mapping to up, down, left and right, indicating on which side of the world the collision occurred.
* ArcadePhysics.Body.onCollide is a new Signal that is dispatched whenever the Body collides with another Body. Due to the potentially high volume of signals this could create it is disabled by default. To use this feature set this property to a Phaser.Signal: `sprite.body.onCollide = new Phaser.Signal()` and it will be called when a collision happens, passing two arguments: the sprites which collided.
* ArcadePhysics.Body.onOverlap is a new Signal that is dispatched whenever the Body overlaps with another Body. Due to the potentially high volume of signals this could create it is disabled by default. To use this feature set this property to a Phaser.Signal: `sprite.body.onOverlap = new Phaser.Signal()` and it will be called when an overlap happens, passing two arguments: the sprites which collided.
* Groups now have the following properties, which are getters and setters: `centerX`, `centerY`, `left`, `right`, `top` and `bottom`. These calculate the bounds of the Group, based on all visible children, and then allow you to apply positioning based on that. This means you can, for example, now get the horizontal center of a Group by called `Group.centerX`. These properties are also setters, so you can position the Groups, and it will take scale and rotation into consideration.
* Groups have a new method `alignIn`. It allows you to align the Group within another Game Object, or a Rectangle. You can specify one of 9 positions which are the new position constants such as: `Phaser.TOP_LEFT` or `Phaser.CENTER` (see docs for the complete list). The Groups are positioned based on their child bounds, which takes rotation and scaling into consideration. You can easily place Groups into the corners of the screen, or game world, or align them within other Sprites, using this method.
* Groups have a new method `alignTo`. It allows you to align a Group to the side of another Game Object, or a Rectangle. You can specify one of 11 positions which are the new position constants such as: `Phaser.TOP_LEFT` or `Phaser.LEFT_BOTTOM` (see docs for the complete list). The Groups are positioned based on their child bounds, which takes rotation and scaling into consideration. You can easily align Groups next to other Sprites using this method.

### Updates

* TypeScript definitions fixes and updates (thanks @monagames)
* Docs typo fixes (thanks @drhayes)
* The TilemapParser will now add more data when importing Image object types from Tiled. The extra data available is: image width, image height, and flags to see if the image is flipped either horizontally, vertically or diagonally (thanks @gotenxds #2564 #2554)
* TilemapLayer.renderRegion has had an assignment to the obsolete `tileColor` property removed (thanks @cryptographer #2583)
* Group.getFurthestFrom and Group.getClosestTo has a new optional argument: `callback`. This allows you to apply your own additional filtering to the distance checks, ultimately influencing the selected child (thanks @LoneStranger #2577)
* Text.setText has a new optional argument `immediate` which will re-create the texture immediately upon call, rather than wait for the next render pass to do so (thanks @Scraft #2594)
* Phaser.Utils.pad now calls `toString` on the input given, which means you can pass in common data types, such as numbers, and have them padded and returned as strings.
* The canvas created by Phaser.Debug for use when displaying debug data is no longer stored in the CanvasPool, and is instead a stand-alone canvas, free from ever being re-used by another game object.
* BitmapData has a new, optional, fifth argument: `skipPool`. By default BitmapData objects will ask for the first free canvas found in the CanvasPool, but this behavior can now be customized on a per object basis.
* Phaser.ArrayUtils.rotate is now deprecated. Please use Phaser.ArrayUtils.rotateLeft instead.
* Phaser.Text.fontPropertiesCanvas used to be taken from the CanvasPool, but as it's constantly needed it is now generated directly from the document.
* The default image texture, for when none is supplied, is now available under `Phaser.Cache.DEFAULT`.
* The missing image texture, for when an image has failed to load, is now available under `Phaser.Cache.MISSING`.
* Phaser.Cache.addImage will now check the key given, and if `__default` or `__missing` it will update the new consts `Phaser.Cache.DEFAULT` and `Phaser.Cache.MISSING` accordingly, allowing you to replace the default or missing image textures used by Phaser.
* Phaser.Cache.getPixiTexture has now been removed, as the Pixi Cache isn't used internally anywhere any longer.
* Phaser.Cache.getPixiBaseTexture has now been removed, as the Pixi Cache isn't used internally anywhere any longer.
* The second argument to Phaser.Cache.removeImage has been renamed from `removeFromPixi` to `destroyBaseTexture`, as that is fundamentally what the argument always did.
* AnimationManager.refreshFrame has been removed as it never actually did anything internally.
* Sound.stop will check to see if `gainNode` exists before trying to disconnect from it (#2597)

### Bug Fixes

* Fixed issue in Group.align where the cell wouldn't increase if `rows` was great than -1
* Sound.volume was accidentally repeated twice in the source (thanks @LoneStranger #2569)
* Animation.setFrame wouldn't work correctly if the `useLocalFrameIndex` argument was true, and the frame ID was a number (thanks @uboot #2571)
* Polygon.contains would only work with non-flattened Polygon objects. It now works with both flat and non-flat Polygons.
* Graphics objects enabled for input would fail to do anything if a Phaser Polygon was given to the Graphics object (which it was in nearly all cases), as it wouldn't detect input correctly with flattened polygons (thanks @symbiane #2591)
* P2.World.clear will now clear out the World.walls property, resetting all of the wall bounds to `null`. This allows the walls to be re-created accurately when the P2 World is reset, which happens on a State change or restart (thanks @ewpolly1 @codermua #2574)

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* Removed `_renderWebGL`, `_renderCanvas`, `getLocalBounds` and `getBounds` from PIXI.DisplayObject, as they were only there to pass ancient jshint rules.
* All Pixi.Graphics methods that change the Graphics, i.e. `drawShape`, `lineTo`, `arc`, etc will now all automatically call `Graphics.updateLocalBounds`. This is so that the bounds of the Graphics object are kept updated, allowing you to scale and rotate the Graphics object and still obtain correct dimensions from it (thanks @kelu-smiley #2573)
* PIXI.CanvasPool no longer _just_ checks for `null` parent comparisons. It will check for all falsy parents, helping free-up canvases when the parent objects have been removed elsewhere.
* PIXI.CanvasPool.remove and `removeByCanvas` both now set the removed canvas width and height to 1.
* PIXI.Texture.fromImage, PIXI.BaseTexture.fromImage and PIXI.Sprite.fromImage have all been removed. They should never have actually been used, as they bypass the Phaser Loader, and don't factor in CORs or any other advanced loader settings.
* The PIXI.BaseTexture.imageUrl property has been removed, as it was never actually populated.
* The PIXI.BaseTexture._UID property has been removed, as it was never actually used internally.
* All references to PIXI.BaseTextureCache have been removed (primarily from BaseTexture.destroy and Texture.destroy), as the BaseTextureCache was never used internally by Phaser, or by our custom version of Pixi.
* PIXI.TextureCache has been removed. It was only ever used by the __default and __missing images that Phaser generates on start-up. It wasn't used internally by Phaser anywhere else, and the only references Pixi has to it have all been removed. If you need it in your own game, please refactor it to avoid it, or re-create the object on the PIXI global object.
* Canvases created by `BaseTexture.fromCanvas` no longer have the `_pixiId` property attached to them, as this was never used internally by Phaser or Pixi.
* PIXI.BaseTexture.updateSourceImage is now deprecated. Please use `Sprite.loadTexture` instead.
* The property PIXI.BaseTextureCacheIdGenerator has been removed, as it is no longer used internally by Phaser or Pixi.
* PIXI.Texture.addTextureToCache has been removed. The PIXI Texture Cache was never actually used by Phaser, and was leading to complications internally.
* PIXI.Texture.removeTextureFromCache has been removed. The PIXI Texture Cache was never actually used by Phaser, and was leading to complications internally.
* PIXI.Texture.fromFrame and PIXI.Sprite.fromFrame have been removed. They relied on the PIXI Texture Cache, which was never actually used by Phaser, and was never used internally by Pixi either.
* The property PIXI.TextureCacheIdGenerator has been removed, as it was not used internally.
* The property PIXI.FrameCache has been removed, as it was not used internally.
* PIXI.DisplayObjectContainer calls `updateTransform` at the start of `getBounds` to help avoid the bounds being out of date.

Thanks to Corin Wilkins at Aardman Digital, for lots of the investigation work, leading to the Pixi changes listed above.

## Version 2.5.0 - "Five Kings" - 17th June 2016

**Note:** This version was also released as 2.4.9 'Four Kings' on 16th June 2016. The 2.5.0 release marks us moving to a more strict adherence of the Semver rules, and also contains some TypeScript definitions fixes.

### New Features

* Phaser.Line.intersectsRectangle checks for intersection between a Line and a Rectangle, or any Rectangle-like object such as a Sprite or Body.
* Group.getClosestTo will return the child closest to the given point (thanks @Nuuf #2504)
* Group.getFurthestFrom will return the child farthest away from the given point (thanks @Nuuf #2504)
* Animation.reverse will reverse the currently playing animation direction (thanks @gotenxds #2505)
* Animation.reverseOnce will reverse the animation direction for the current, or next animation only (thanks @gotenxds #2505)
* The way the display list updates and Camera movements are handled has been completely revamped, which should result is significantly smoother motion when the Camera is following tweened or physics controlled sprites. The `Stage.postUpdate` function is now vastly reduced in complexity. It takes control over updating the display list (calling `updateTransform` on itself), rather than letting the Canvas or WebGL renderers do this. Because of this change, the `Camera.updateTarget` function uses the Sprites `worldPosition` property instead, which is now frame accurate (thanks @whig @Upperfoot @Whoisnt @hexus #2482)
* Game Objects including Sprite, Image, Particle, TilemapLayer, Text, BitmapText and TileSprite have a new property called `data`. This is an empty Object that Phaser will never touch internally, but your own code, or Phaser Plugins, can store Game Object specific data within it. This allows you to associate data with a Game Object without having to pollute or change its class shape.
* TilemapLayers will now collide properly when they have a position that isn't set to 0x0. For example if you're stitching together several maps, one after the other, and manually adjust their `scrollX/Y` properties (thanks @Upperfoot #2522)
* There are a bunch of new Phaser consts available to help with setting the angle of a Game Object. They are `Phaser.ANGLE_UP`, `ANGLE_DOWN`, `ANGLE_LEFT`, `ANGLE_RIGHT`, `ANGLE_NORTH_EAST`, `ANGLE_NORTH_WEST`, `ANGLE_SOUTH_EAST` and `ANGLE_SOUTH_WEST`.
* Math.between will return a value between the given `min` and `max` values.
* InputHandler.dragDistanceThreshold gives you more fine control over when a Sprite Drag event will start. It allows you to specify a distance, in pixels, that the pointer must have moved before the drag will begin.
* InputHandler.dragTimeThreshold gives you more fine control over when a Sprite Drag event will start. It allows you to specify a time, in ms that the pointer must have been held down for, before the drag will begin.
* InputHandler.downPoint is a new Point object that contains the coordinates of the Pointer when it was first pressed down on the Sprite.
* There are two new Phaser consts available, for help with orientation of games or Game Objects. They are `Phaser.HORIZONTAL`, `Phaser.VERTICAL`, `Phaser.LANDSCAPE` and `Phaser.PORTRAIT`.
* InputHandler.dragStopBlocksInputUp is a boolean that allows you to control what happens with the input events. If `false` (the default) then both the `onInputUp` and `onDragStop` events will get dispatched when a Sprite stops being dragged. If `true` then only the `onDragStop` event is dispatched, and the `onInputUp` is skipped.
* Group.inputEnableChildren is a new property. If set to `true` will automatically call `inputEnabled = true` on any children _added_ to, or _created_ by, the Group.
* PIXI.DisplayObjectContainer.ignoreChildInput is a new property. If `true` then the children will _not_ be considered as valid for Input events. Because this has been applied to `DisplayObjectContainer` it means it's available in Group, Sprite and any other display level object. Using this boolean you can disable input events for all children in an entire Group, without having to iterate anything or deep-set flags.
* InputHandler._pointerOverHandler and _pointerOutHandler have new arguments `silent` - if `true` then they will not dispatch any Signals from the parent Sprite.
* Pointer.interactiveCandidates is a new Array that is erased and re-populated every time this Pointer is updated. It contains references to all of the Game Objects that were considered as being valid for processing by this Pointer, during the most recent update. To be valid they must have suitable a `priorityID`, be Input enabled, be visible and actually have the Pointer over them. You can check the contents of this array in events such as `onInputDown`, but beware: it is reset every update.
* Pointer.swapTarget allows you to change the `Pointer.targetObject` object to be the one provided. This allows you to have fine-grained control over which object the Pointer is targeting.
* Input.setInteractiveCandidateHandler allows you to add a callback that is fired every time `Pointer.processInteractiveObjects` is called. The purpose of `processInteractiveObjects` is to work out which Game Object the Pointer is going to interact with. It works by polling all of the valid game objects, and then slowly discounting those that don't meet the criteria (i.e. they aren't under the Pointer, are disabled, invisible, etc). Eventually a short-list of 'candidates' is created. These are all of the Game Objects which are valid for input and overlap with the Pointer. If you need fine-grained control over which of the items is selected then you can use this callback to do so. The callback will be sent 3 parameters: 1) A reference to the Phaser.Pointer object that is processing the Items. 2) An array containing all potential interactive candidates. This is an array of `InputHandler` objects, not Sprites. 3) The current 'favorite' candidate, based on its priorityID and position in the display list. Your callback MUST return one of the candidates sent to it.
* Group.onChildInputDown is a new Signal that you can listen to. It will be dispatched whenever any immediate child of the Group emits an `onInputDown` signal itself. This allows you to listen for a Signal from the Group, rather than every Sprite within it.
* Group.onChildInputUp is a new Signal that you can listen to. It will be dispatched whenever any immediate child of the Group emits an `onInputUp` signal itself. This allows you to listen for a Signal from the Group, rather than every Sprite within it.
* Group.onChildInputOver is a new Signal that you can listen to. It will be dispatched whenever any immediate child of the Group emits an `onInputOver` signal itself. This allows you to listen for a Signal from the Group, rather than every Sprite within it.
* Group.onChildInputOut is a new Signal that you can listen to. It will be dispatched whenever any immediate child of the Group emits an `onInputOut` signal itself. This allows you to listen for a Signal from the Group, rather than every Sprite within it.
* Phaser.Weapon is a brand new plugin that provides the ability to easily create a bullet pool and manager. Weapons fire Phaser.Bullet objects, which are essentially Sprites with a few extra properties. The Bullets are enabled for Arcade Physics. They do not currently work with P2 Physics. The Bullets are created inside of `Weapon.bullets`, which is a Phaser.Group instance. Anything you can usually do with a Group, such as move it around the display list, iterate it, etc can be done to the bullets Group too. Bullets can have textures and even animations. You can control the speed at which they are fired, the firing rate, the firing angle, and even set things like gravity for them. Please see the Documentation for more details, or view the [Weapon examples](https://github.com/photonstorm/phaser-examples/tree/master/examples/weapon) in the Examples repo.
* BitmapData.smoothProperty is a new property that holds the string based prefix needed to set image scaling on the BitmapData context.
* BitmapData.copyTransform allows you to draw a Game Object to the BitmapData, using its `worldTransform` property to control the location, scaling and rotation of the object. You can optionally provide
* BitmapData.drawGroup now uses the new `copyTransform` method, to provide for far more accurate results. Previously nested Game Objects wouldn't render correctly, nor would Sprites added via `addChild` to another Sprite. BitmapText objects also rendered without rotation taken into account, and the Sprites smoothing property was ignored. All of these things are now covered by the new drawGroup method, which also handles full deep iteration down the display list.
* Added the following new constants: `Phaser.TOP_LEFT`, `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.LEFT_TOP`, `Phaser.LEFT_CENTER`, `Phaser.LEFT_BOTTOM`, `Phaser.CENTER`, `Phaser.RIGHT_TOP`, `Phaser.RIGHT_CENTER`, `Phaser.RIGHT_BOTTOM`, `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER` and `Phaser.BOTTOM_RIGHT`.
* Rectangle.getPoint is a new method that returns a point based on the given position constant, such as `Phaser.BOTTOM_LEFT`. It returns the same result as calling `Rectangle.bottomLeft` (etc) but unlike those getters you are able to provide your own Point object.
* The Game Object Bounds component has been updated to include two new properties: `centerX` and `centerY`. This means you can, for example, now get the horizontal center of a Sprite by called `Sprite.centerX`. These properties are also setters, so you can position the Game Objects, and it will take scale and anchor into consideration.
* All Game Objects with the Bounds component; which includes Sprites, Images, Text, BitmapText, TileSprites and anything that extend these, now have the new method `alignIn`. It allows you to align the Game Object within another Game Object, or a Rectangle. You can specify one of 9 positions which are the new position constants such as: `Phaser.TOP_LEFT` or `Phaser.CENTER` (see above for the complete list). The Game Objects are positioned based on their Bounds, which takes rotation, scaling and anchor into consideration. You can easily place Sprites into the corners of the screen, or game world, or align them within other Sprites, using this method.
* All Game Objects with the Bounds component; which includes Sprites, Images, Text, BitmapText, TileSprites and anything that extend these, now have the new method `alignTo`. It allows you to align a Game Object to the side of another Game Object, or a Rectangle. You can specify one of 11 positions which are the new position constants such as: `Phaser.TOP_LEFT` or `Phaser.LEFT_BOTTOM` (see above for the complete list). The Game Objects are positioned based on their Bounds, which takes rotation, scaling and anchor into consideration. You can easily align Sprites next to other Sprites using this method.
* Group.align is a new method that allows you to layout all the children of the Group in a grid formation. You can specify the dimensions of the grid, including the width, height and cell size. You can also control where children are positioned within each grid cell. The grid width and height values can also be set to -1, making them fluid, so the grid expands until all children are aligned. Finally an optional child index argument can be set. This is a great way to quickly and comprehensively align Group children, and has lots of use cases.
* The Arcade Physics Body has two new experimental methods: `moveTo` and `moveFrom`. These allow you to move a Physics Body for a given distance, or duration, after which it will stop and emit the `onMoveComplete` Signal. It is still capable of colliding and rebounding like usual.

### Updates

* TypeScript definitions fixes and updates (thanks @wingyplus @monagames @marineorganism @obamor @BaroqueEngine @danzel)
* Docs typo fixes (thanks @seanirby @johnrees)
* The TypeScript defs ambient declaration has been updated to make it compatible with the SystemJS loader (thanks @monagames)
* You can no longer intersect check a Body against itself (thanks @VitaZheltyakov #2514)
* The mobile template has been updated (thanks @cryptographer #2518)
* Video.onComplete wouldn't fire on iOS if the user hit the 'Done' button before the video had finished playing. It now uses the `webkitendfullscreen` event to detect this, and dispatches the `onComplete` signal should that event fire (thanks @kelu-smiley #2498)
* Sound.addMarker now has a default value for the `duration` argument (1 second) to avoid the DOM Exception 11 error if you accidentally miss it out (thanks @mari8i #2508)
* Removed the `Stage.updateTransform` calls from the main game loop, because it happens automatically as part of `Game.updateLogic` anyway, so was duplicating the workload for no reason.
* TilemapLayer.postUpdate could potentially be called several times per frame (depending on device frame rate), which would cause multiple texture redraws, even though only the last texture is used during rendering. This has now been modified so that the local TilemapLayer canvas is only re-rendered once per frame, during the rendering phase, and not during the logic update phase.
* Group.preUpdate now iterate through the display list forwards, instead of in reverse, to match it with how `Stage.preUpdate` works.
* Stage.postUpdate is now a lot smaller, with no conditional branching if there is a Camera Target or not.
* Within RequestAnimationFrame both `updateRAF` and `updateSetTimeout` now only call `game.update` if `isRunning` is true. This should avoid asynchronous Game destroy errors under environments like Angular (thanks @flogvit #2521)
* Group.removeAll has a new argument `destroyTexture` which allows you to optionally destroy the BaseTexture of each child, as it is removed from the Group (thanks @stoneman1 #2487)
* PluginManager.remove has a new argument `destroy` (defaults to `true`) which will let you optionally called the `destroy` method of the Plugin being removed.
* Cache.getJSON used to incorrectly bring back a deep-copy of the Phaser.Utils object, instead of just a clone of the JSON object requested (thanks @drhayes #2524 #2526)
* The `DisplayObject.renderOrderID` used to run in reverse. I.e. in a display list with 10 sprites on it, the first sprite (at the bottom of the list, rendering behind all the others) would have a `renderOrderID` of 9, where-as the top-most sprite, rendering above all others, would have a `renderOrderID` of 0. While this didn't cause any side-effects internally, it's arguably illogical. So the process has been reversed, and `renderOrderID`s are now accumulative, starting at zero each frame, and increasing as it iterates down the display list. So the higher the ID, the more "on-top" of the output the object is.
* `InputHandler.validForInput` and `Pointer.processInteractiveObjects` have been updated to reflect the new `renderOrderID` sequence (see above).
* Group.add has a new optional argument `index` which controls the index within the group to insert the child to. Where 0 is the bottom of the Group.
* Group.addAt has been refactored to be a simple call to `Group.add`, removing lots of duplicate code in the process.
* Group.create has a new optional argument `index` which controls the index within the group to insert the child to. Where 0 is the bottom of the Group. It also now makes proper use of `Group.add`, cutting down on more duplicate code.
* Group.createMultiple now returns an Array containing references to all of the children that the method created.
* Cache.getJSON will now return an Array if the `key` you provided points to an array instead of an Object (thanks @drhayes #2552 #2551)
* Phaser.Matrix if passed a 0 value would consider it falsy, and replace it with the default by mistake. It now checks if the arguments are `undefined` or `null` and only then sets the defaults (thanks mmcs)
* Group.createMultiple can now accept Arrays for both the `key` and `frame` arguments. This allows you to create multiple sprites using each key and/or frame in the arrays, which is a great and quick way to build diverse Groups. See the JSDocs for complete details and code examples.
* The Game Object Bounds component has been updated so that it now provides setters for all of the properties, as well as getters. Previously `Sprite.left`, `Sprite.right`, `Sprite.top` and `Sprite.bottom` were read-only, but they are now available to be set as well, and take into consideration the anchor and scale of the Game Objects.

### Bug Fixes

* Arcade Physics Body incorrectly positioned if the Sprite had a negative scale (see http://www.html5gamedevs.com/topic/22695-247-248-body-anchoring-any-migration-tips/) (thanks @SBCGames @icameron @Nuuf @EvolViper #2488 #2490)
* InputHandler.checkPointerDown had an incorrect single pipe character |, instead of an OR check ||, and an `isDown` check, causing Button Over events to fail (thanks @pengchuan #2486)
* BitmapText objects with lines greater than `maxWidth` now handle alignment values correctly, causing them to properly center align (thanks @kevinleedrum  #2499 @crippledcactus #2496)
* Text has a new private method `measureLine` which is used to calculate the final Text line length, after factoring in color stops and other style changes. This should prevent characters from becoming truncated (thanks @TadejZupancic #2519 #2512)
* Sometimes the browser would cause a race condition where any connected Game Pads were being detected before the callback had a chance to be established. Also sometimes the rawPad references would become stale, and are now checked constantly (thanks @cwleonard #2471)
* Sound.isPlaying was set to false when doing an audio loop, but never set back to true if it's a sound not using a marker (thanks @TheJasonReynolds #2529)
* Phaser.Rectangle.aabb would fail if the Rectangles used negative offsets. It now calculates the bounds accurately (thanks @fillmoreb #2545)
* The `DisplayObject.worldRotation` value didn't sign the `wt.c` value correctly, meaning the rotation would be wrong.
* The `DisplayObject.worldScale` value didn't multiply the local objects scale into the calculation, meaning the value wasn't a true representation of the objects world scale.

## Version 2.4.8 - "Watch Hill" - 19th May 2016

### New Features

* BitmapData.copy, and by extension any method that uses it, including BitmapData.draw, drawGroup and drawFull, now all support drawing RenderTexture objects. These can either be passed directly, or be the textures of Sprites, such as from a call to generateTexture.
* Arcade Physics has had a new `world` argument added to the following functions: `distanceBetween`, `distanceToXY`, `distanceToPointer`, `angleBetween`, `angleToXY` and `angleToPointer`. The argument (which is false by default), when enabled will calculate the angles or distances based on the Game Objects `world` property, instead of its `x` and `y` properties. This allows it to work for objects that are placed in offset Groups, or are children of other display objects (thanks @Skeptron for the thread #2463)
* Arcade Physics Body has a new property `worldBounce`. This controls the elasticity of the Body specifically when colliding with the World bounds. By default this property is `null`, in which case Body.bounce is used instead. Set this property to a Phaser.Point object in order to enable a World bounds specific bounce value (thanks @VitaZheltyakov #2465)

### Updates

* TypeScript definitions fixes and updates (thanks @osev7 @staff0rd @galen-manuel)
* Docs typo fixes (thanks @dedoubleyou1 @mortonfox @zeterain)
* You can now access the intensity of the Camera shake effect via the getter / setter `Camera.shakeIntensity`. Useful if you wish to tween the intensity while running. (thanks @drhayes #2443)
* The Arcade Physics overlap method would return false if two bodies were overlapping but neither had any velocity (i.e. they were embedded into each other)
* PIXI.defaultRenderer is now set to `null` in Game.destroy, allowing it to be reset if a new Game instance is created on the same page (thanks @xtforgame ##2474)
* BitmapData.drawGroupProxy is now capable of iterating through Sprites that have children, and also now uses the world positions for drawing instead. This change updates the functionality of BitmapData.drawGroup.
* Text.setStyle has a new argument `update` which will optionally automatically call `updateText` after setting the new style (thanks @staff0rd  #2478)

### Bug Fixes

* Fixed an issue in the Arcade Physics overlap method where it would only detect overlaps up to the max bias threshold and no further (thanks @rgk #2441)
* InputHandler.checkPointerDown and checkPointerOver will now test the worldTransform scale property of a Sprite. If zero it will fast return, where-as before it would incorrectly report an up event (thanks @jaapaurelio #2466)
* Fixed a bug in Arcade Physics Body.preUpdate which would incorrectly apply the position of an offset Body (one which has had Body.setSize used on it) when combined with a Sprite with a non-zero anchor (thanks @SBCGames #2470)
* If you set Game.renderType to `Phaser.HEADLESS` it will no longer render the output to the canvas. The canvas is still created (although not added to the DOM), as it's required internally, but no rendering now takes place on it (thanks @ForgeableSum #2464)
* Sounds played using the Audio tag, that were paused and then resumed again (either directly in code, or via a game pause event) would not resume from the point at which they paused (thanks @rroylance #2473)
* Sounds played using the Audio tag, set to loop, would get caught in an endless pause-play loop cycle (thanks @rroylance #2473)

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* Sprites that had a tint on them, that then had their frame changed via either `Sprite.frame` or `Sprite.frameName` wouldn't re-tint the new frame, and would become stuck on the old frame in Canvas mode (thanks @spayton #2453)

## Version 2.4.7 - "Hinderstap" - 22nd April 2016

### New Features

* Added P2.Body.thrustLeft which will move the Body to the left by the speed given (thanks James Pryor)
* Added P2.Body.thrustRight which will move the Body to the right by the speed given (thanks James Pryor)
* Polygon now takes an array of arrays as a new type when constructing it: `[[x1, y1], [x2, y2]]` (thanks @ShimShamSam #2360)
* Text has a new property `maxLines` which is the maximum number of lines to be shown for wrapped text. If set to 0 (the default) there is limit. This prevents wrapped text from overflowing on a fixed layout (thanks @slashman #2410)
* `outOfCameraBoundsKill` is a new boolean property that all Game Objects with the `InWorld` component has. If `autoCull` and this property are both `true` then the Object will be automatically killed if it leaves the camera bounds (thanks @jakewilson #2402)
* Group.getByName searches the Group for the first instance of a child with the `name` property matching the given argument. Should more than one child have the same name only the first instance is returned.
* BitmapData has a new property `frameData` which is a Phaser.FrameData container instance. It contains a single Frame by default, matching the dimensions of the entire BitmapData, but can be populated with additional frames should you wish to create animations from dynamic BitmapData textures.
* FrameData.destroy will nullify the local arrays used to contain Frame instances.
* SoundManager.muteOnPause is a new boolean that allows you to control if the Sound system gets muted automatically when a Phaser game pauses, such as when it loses focus. You may need to set this to `false` if you wish to control the audio system from outside of your Phaser game, i.e. from DOM buttons or similar (#2382)
* You can now pass a TilemapLayer as a Texture to a TileSprite. A limitation of this is that if you pass it to a TileSprite it will make a fill pattern from the TilemapLayer at that instant it's passed, and it won't keep track of the layer in future should it update (thanks @jdnichollsc #1989)
* Camera has a new property: `lerp`. This is a Point object, that allows you to control the amount of horizontal and vertical smoothing to be applied to the camera when it tracks a Sprite. It works both with and without deadzones, and is turned off by default. Set it to low values such as 0.1 for really smooth motion tracking (thanks to @WombatTurkey for the idea of adding this)
* Camera.shake is a new function that creates a camera shake effect. You can specify the intensity, duration and direction of the effect. You can also set if it should shake the camera out of bounds or not.
* Camera.flash is a new function that makes the camera 'flash' over the top of your game. It works by filling the game with the solid fill color specified, and then fading it away to alpha 0 over the duration given. This is great for things like hit effects. You can listen for the Camera.onflashComplete Signal.
* Camera.fade is a new function that makes the camera fade to the color given, over the course of the duration specified. This is great for things like transitioning from one State to another. You can listen for the Camera.onFadeComplete Signal.
* Camera.resetFX resets any active FX, such as a fade or flash and immediately clears it. Useful for calling after a fade in order to remove the fade from the Stage.
* Phaser.Camera.ENABLE_FX is a const that controls if the Camera FX are available or not. It's `true` by default, but if you set it to `false` before boot then it won't create the Graphics object required to process the effects.
* The Arcade Physics Body has two new properties: `left` and `top`. These are the same as `Body.x` and `Body.y` but allow you to pass the Body to geometry level functions such as Circle.contains.
* World.separate has been optimized to cut down on the number of calls to `intersect` from 3 calls per Game Object collision check, to 2. So if you were colliding 50 sprites it will reduce the call count from 150 to 100 per frame. It also reduces the calls made to `separateX` and `separateY` by the same factor.
* Two immovable bodies would never set their overlap data, even if an overlap only check was being made. As this is useful data to have this has been changed. Two immovable bodies will still never separate from each other, but they _will_ have their `overlapX` and `overlapY` properties calculated now.
* P2.Body.offset is now used and applied to the Sprite position during rendering. The values given are normal pixel values, and offset the P2 Body from the center of the Sprite (thanks @Mourtz #2430)

### Updates

* TypeScript definitions fixes and updates (thanks @jamesgroat @kiswa)
* Docs typo fixes (thanks @thiagojobson @hayesmaker @EJanuszewski)
* Removed a `console.log` from the TilingSprite generator.
* Sound.position can no longer become negative, meaning calls to AudioContextNode.start with negative position offsets will no longer throw errors (thanks @Weedshaker #2351 #2368)
* The default state of the internal property `_boundDispatch` in Phaser.Signal is now `false`, which allows for use of boundDispatches (thanks @alvinlao #2346)
* The Tiled parser only supports uncompressed layer data. Previously it would silently fail, now it detects if layer compression is used and displays a console warning instead (thanks @MannyC #2413)
* The Tiled parser now removes the `encoding` parameter so that a subsequent process doesn't try to decode the data again (thanks @MannyC #2412)
* Ensure a parent container is a Group before removing from its hash (thanks @rblopes #2397)
* The Game Object Input Handler now checks to see if the Object was destroyed during the `onInputDown` phase, and bails out early if so (thanks @zeterain #2394)
* The Destroy component will now call TweenManager.removeFrom, removing any active tweens from the TweenManager upon the Game Objects destructions (thanks @PokemonAshLovesMyTurkeyAndILikeYouTwo #2408)
* Tween.update will now return `false` (flagging the Tween for destruction) should the Tween.target property every become falsy. This can happen if the object the Tween was tracking is destroyed, nulled or generally removed.
* TweenData.repeatTotal is a new property that keeps track of the total number of times the Tween should repeat. If TweenData.start is called, as a result of the Tween repeatCount being > 0 then the child tween resets its total before re-starting.
* The Debug canvas now listens for the ScaleManager.onSizeChange signal and resizes itself accordingly when running under WebGL. This means if your game size changes the Debug canvas won't be clipped off (thanks @francisberesford #1919)
* Camera.follow now uses the Targets `world` property to seed the camera coordinates from, rather than its local position. This means Sprites that are members of offset Groups, or transformed display lists, should now be followed more accurately (thanks @rbozan #2106)
* PluginManager.destroy is now called by Game.destroy.
* Game.forceSingleUpdate is now `true` by default.
* Video now uses MediaStreamTrack.stop() instead of MediaStream.stop() where possible, as the later is now deprecated in some browsers (thanks @stoneman1 #2371)
* The Physics Manager will now throw a console warning if you try to enable a physics body using an unknown physics engine type (thanks @jakewilson #2415)
* The Tileset class will tell you the name of the tileset image throwing the uneven size error (thanks @jakewilson #2415)
* Emitter.start when used with a false `explode` parameter would cumulatively add particles to the current total. With quantity 10 the first call would emit 10 particles, the next 20, and so on. Calls to start will now reset the quantity each time. This is a behavior change from earlier versions, so if you relied on the old way please account for it in your code (thanks @BdR76 #2187)
* You can now pass in your own Canvas element to Phaser and it will use that instead of creating one itself. To do so you must pass a Game Configuration object to Phaser when you instantiate it, and set the `canvas` property of the config object to be the DOM element you wish to use, i.e.: `{ canvas: document.getElementById('yourCanvas') }` (thanks @Friksel #2311)
* When loading Video with the `asBlob` argument set it now uses a 'blob' type for the XHR loader, and doesn't cast the resulting file as a Blob upon load. This fixes loading videos as blobs on Chrome for Android (thanks @JuCarr #2433)
* When the Loader loads audio via the Audio tag, instead of Web Audio, it used to use `Phaser.GAMES[_this.game.id].load` as the callback handler, which would stop it from working if you had multiple Loaders set-up within Phaser. It now uses a local reference to `_this` instead (thanks @SBCGames #2435)

### Bug Fixes

* The `mouseoutglobal` event listener wasn't removed when the game was destroyed (thanks @stoneman1 #2345 #2344 #2342)
* Fixed issue with IE crashing on this.context.close in the Sound Manager (thanks @stoneman1 #2349)
* Phaser.World.centerX and Phaser.World.centerY only worked if the bounds had an origin of 0, 0. They now take into account the actual origin (thanks @fillmoreb #2353)
* SoundManager.destroy now validates that context.close is a valid function before calling it (thanks @brianbunch #2355)
* SoundManager.destroy doesn't close the context if it's being stored in PhaserGlobal (thanks @brianbunch #2356)
* Fix typo in p2 BodyDebug.componentToHex that made most debug bodies appear reddish in color (thanks @englercj #2381)
* Previously when a sprite was tinted and a new texture was loaded then the tint did not apply to the texture and the old tinted texture was used (thanks @CptSelewin #2383)
* Negative lineSpacing in Text objects will no longer crop the bottom pixels off lines of text (thanks @gaelenh #2379 #2374)
* BitmapData.copy, and by extension draw, drawFull, drawGroup, etc, would incorrectly handle drawing a tinted Sprite if it was using a frame from a texture atlas (thanks @PhaserDebugger #2405)
* Text that used fonts which had numbers in their names wouldn't be correctly rendered unless you explicitly set the font property after creation. You can now pass font names with numbers in them as the font style object correctly (thanks @And-0 #2390)
* Tween.update wouldn't dispatch an `onLoop` signal for Tweens with just one child, such as those created via Tween.to with -1 as the repeat value (thanks @ForgeableSum #2407)
* Arcade.Body's speed property was only set when the body moved, it now updates regardless (thanks @mark-henry #2417)
* Camera.position would return the view rectangles centerX/Y coordinates, instead of view.x/y (which is what Camera.x/y returns), so it has been updated to return view.x/y instead (thanks @kamparR #2120)
* Passing a BitmapData to a TileSprite as a texture would fail if the BitmapData had not been previously added to the cache. It now uses the new frameData property (thanks @mzamateo @lucap86 #2380)
* When setting a global volume for the SoundManager it would previously incorrectly calculate the volumes of AudioTag based Sound objects that were not played at volume 1. The new approach uses Sound.updateGlobalVolume which adjusts the Sound volume to be a percentage of the global volume. So if the global volume is 0.5 and the Sound volume is 0.5, the Sound will play with an actual volume of 0.25 (thanks @VitaZheltyakov #2325)
* Sound.play when using an AudioTag would ignore the muted state of the SoundManager and play regardless. It now checks the SoundManager.mute state on play, and sets the volume accordingly (thanks @brianbunch #2139)
* Graphics objects can now have a Physics Body directly attached to them, where-as before it would throw an error due to a lack of anchor property (thanks @NLilley #2400)
* A Game Object with `fixedToCamera = true` that was then set for Input, and enabled for dragging from its center (`input.enableDrag(true)`) would throw an error upon being dragged (thanks @solusipse #2367)
* P2.World.updateBoundsCollisionGroup wouldn't use the `boundsCollisionGroup` mask if you passed `true` as the argument, only if it was left undefined.
* P2.World.updateBoundsCollisionGroup didn't set the `_boundsOwnGroup` private var, meaning the `World.setBounds` method wasn't able to restore previously set collision masks automatically (thanks @jmp909 #2183)
* P2.World.setBounds has been re-written completely. If the World is resized it no longer removes the P2 body instances and re-creates them. Instead it checks to see which walls are required and then just moves the position of the shapes instead, or updates them, or creates or destroys them as required. This is far more efficient, especially in a game which sees a lot of world bounds changes (i.e. resizes responsively in browser)
* BitmapText would throw an error if you passed in a number as the text property to the constructor. It worked if you used the text accessor directly because it cast the value to a string, but the constructor missed out this step (thanks @lewispollard #2429)
* Dragging a Sprite while the camera was moving would slowly cause the Sprite position to become out of sync the further the camera moved. A Sprite being dragged now tracks the camera position during the drag update and adjusts accordingly (thanks @jeroenverfallie #1044)

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* DisplayObjectContainer.getLocalBounds destroys the worldTransforms on children until the next `stage.updateTransform()` call. This can make a number of things break including mouse input if width, height or getLocalBounds methods are called inside of an update or preUpdate method. This is now fixed in our Pixi build (thanks @st0nerhat #2357)
* PIXI.CanvasRenderer.resize now applies the `renderSession.smoothProperty` to the Canvas context when it resizes. This should help with unwanted canvas smoothing (thanks @sergey7c4 #2395 #2317)

## Version 2.4.6 - "Baerlon" - 18th February 2016

2.4.6 is a point release that addresses 2 severe bugs, and should be used in place of 2.4.5 in all instances. The 2.4.5 change log appears after this one.

### New Features

* Added RandomDataGenerator.sign, which returns a -1 or 1 (thanks @taylankasap #2328)

### Updates

* StateManager.destroy now sets `clearCache` and `clearWorld` internally before clearing the current state, as otherwise they would have been left untouched, such as from Game.destroy (thanks @i-dimitrov #2138)

### Bug Fixes

* Groups now check for `child.parent` before calling `removeFromHash` (thanks @spayton #2323 #2338)
* BaseTexture.destroy wasn't correctly removing the texture from the BaseTextureCache if it was a cached CanvasPool entry (such as Text objects use), causing drawImage errors in Canvas mode, and just blank textures in WebGL (thanks @civet #2339)
* Loader.getAudioURL and Loader.getVideoURL were hardened to support query string file URLs and still work with uri pairs and data/blobs.

## Version 2.4.5 - "Sienda" - 17th February 2016

### New Features

* You can use the new const `Phaser.PENDING_ATLAS` as the texture key for any sprite. Doing this then sets the key to be the `frame` argument (the frame is set to zero). This allows you to create sprites using `load.image` during development, and then change them to use a Texture Atlas later in development by simply searching your code for 'PENDING_ATLAS' and swapping it to be the key of the atlas data.
* BitmapText.cleanText is a new method that will scan the given text and either remove or replace all characters that are not present in the font data.
* ArcadePhysics.Body.onCeiling is a new complementary method to go with onFloor (thanks @yigitozdemir #1610)
* Text.precalculateWordWrap allows you to run your text through the Text word wrap function, which is handy if you need to handle pagination on longer pieces of text (thanks @slashman #2277)
* Sprite (and all Game Objects) have a new argument in their destroy method: `destroyTexture`. This boolean (which is false by default) controls if the BaseTexture of the Game Object should be destroyed or not. This is extremely useful in situations where you've got a lot of dynamic assets you no longer need, such as textures created from BitmapDatas. You must set the `destroyTexture` argument yourself. This can be done in a custom Game Object destroy method or as part of your state shutdown (#2261)
* The Health Game Object component has a new method: `setHealth` which allows you to set the exact health amount. This is now used by the `revive` function.
* Text.useAdvancedWrap allows you to swap between the Basic and the Advanced word wrapping functions. In Advanced it will wrap long-words and condense and trim excess white space (thanks @soldoutactivist #1811)
* The Grunt script has been updated to enhance the intro / outro and Pixi defaults. Pixi has been split into intro / outro and main blocks, so you can exclude its intro cleanly. The excludes are now bound, so if you exclude the Phaser UMD it will do the same for Pixi as well (thanks @spayton #2192)
* ArcadePhysics.worldAngleToPointer will get the angle (in radians) between a display object and the pointer, taking all parent rotations into account (thanks @mattrick16 #2171)
* There is new documentation on building Phaser for Webpack and a new custom build grunt option (thanks @deiga #2331)
* Device.safariVersion now holds the major version of the Safari browser.
* Device.edge is a boolean that is set if running under the Microsoft Edge browser.
* Device.dolby is a boolean that is set if the browser can play EC-3 Dolby Digital Plus files
* The Loader and SoundManager can now play Dolby Digital Plus files on supported devices.

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @zimpy @iamfreee @milkey-mouse @juanmirod @danzel @staff0rd @sanchopancho13)
* Docs typo fixes (thanks @zeterain @staff0rd @milkey-mouse @dick-clark @nlotz @s4wny @jonjanisch @Alaxe @cdelstad @tsphillips @rblopes @vrecluse)
* Emitter methods `at`, `explode`, `flow`, `kill`, `revive`, `setAlpha`, `setRotation`, `setScale`, `setSize`, `setXSpeed`, `setYSpeed` and `start` now return the Emitter instance for better method chaining (thanks @samme #2308)
* Tilemap.hasTile will now return `false` if the Tile doesn't exist in the coordinates given (which can happen if the coordinates are out of bounds) (thanks @cy-ryo-fujiwara #2304)
* Update FrameData to check if both the numeric index was set and exists. Should fix Phaser Tiled integration as a result (thanks @Weedshaker #2298)
* Loader.loadUpdate now gets one final call when the loading is complete (before it would end and then call loadComplete, but if you had a callback bound to loadUpdate you'd never get that final 100% load event). (thanks @nexiuhm @McFarts #2297 #2296)
* The TypeScript definitions now have Phaser exported as a module in the header. This allows you to import / require the Phaser TypeScript defs (thanks @PixelWaffles #2255)
* BitmapData.setHSL now accepts 0 as a valid parameter (thanks @FracturedShader #2209)
* Force the usage of typescript 1.4.1 in the package.json so that the TypeScript defs with comments is rebuilt properly again (thanks @vulvulune #2198)
* A tiny logic update in the StateManager (thanks @jaminscript #2151)
* The Style object passed in to Phaser.Text is now cloned instead of referenced. This means you can adjust single Text instances without invalidating other Text objects using the same style object (thanks @asyncanup #2267)
* Added a typescript section to the bower and npm configs to support `tsd link` (thanks @mjohnsonengr #2189 #2180)
* SoundManager.destroy now calls AudioContext.close (thanks @stoneman1 #2237)
* Sound.onEndedHandler now sets Sound.currentTime to be Sound.durationMS (thanks @stoneman1 #2237)
* BitmapData would always create a private `_swapCanvas` which was a clone of its main canvas used for advanced movement operations. This no longer happens. The swap canvas is created only as needed, by those functions that use it (specifically `moveH` and `moveV`), meaning a BitmapData will now use half the amount of memory it used to, and you'll have half the amount of canvas DOM elements created (unless you make heavy use of the move functions).
* Tweens with 'yoyo' set on them couldn't be re-used again because the start and end properties were left in a reversed state. When a yoyo tween ends it now restores the reversed values (thanks @SBCGames  #2307)
* The width and height values passed to the Game constructor are now passed through Math.floor first. This ensures you can never create a game width non-integer dimensions, which has all kinds of implications - from browser performance to breaking things like TileSprite rendering (#2262)
* Tilemap.getObjectIndex has been removed as it didn't work correctly in most cases, and it's easier to just scan the Tilemap.objects object directly anyway (#2242)
* GameObject.revive will now set the health amount to 100 instead of 1, bringing it in-line with the `maxHealth` default value.
* Moved the Sound.disconnect after the Sound.stop call in Web Audio (#2280)
* BitmapData.drawGroup can now handle drawing Emitters and BitmapText objects that are part of the Group.
* SoundManager.setTouchLock is no longer set if `SoundManager.noAudio` is true, or if the PhaserGlobal setting `disableAudio` is true (thanks @bcjordan #2206)
* Loader.audiosprite is renamed to Loader.audioSprite (the old one still works for legacy reasons) (thanks @epaezrubio #2145)
* EarCut now replaces PolyK, which fixes advanced Graphics mask triangulation issues such as #1941
* Camera.checkBounds now takes the scale of the Camera into account (thanks @ForGorNorPor #2263)
* InputHandler.consumePointerEvent has been removed, as it was never used internally anyway, so was misleading (thanks @GregoryAveryWeir #2227)
* Events.onDragUpdate has a new 6th property `fromStart` which is a boolean. You can determine if the event was the result of the start of a drag movement or not by polling it (#2155)
* SinglePad.onDownCallback has been moved to the end of the method, so that DeviceButton.start is now called before the callback fires, meaning if you check the status of the button in the onDownCallback it will now be fully activated (thanks @suicidepills #2159)
* The `z` property assigned to children of a Group now starts from zero instead of 1, this is an internal change mostly but if you relied on the `z` property for some reason then please be aware of this (thanks pantoninho)

### Bug Fixes

* Buttons (or any Sprites) that don't have a texture, but have children, would incorrectly render the children under WebGL due to the baseTexture.skipRender property (thanks @puzzud #2141)
* TilemapParser accidentally redeclared `i` when parsing the ImageCollections which would cause an infinite loop (thanks DanHett)
* BitmapData.update causes a snowballing memory leak under WebGL due to a Context.getImageData call. BitmapData.clear used to call update automatically but no longer does. This resolves the issue of the Debug class causing excessive memory build-up in Chrome. Firefox and IE were unaffected (thanks @kingjerod #2208)
* Pausing a Sound that used a Marker for playback would fire the `onMarkerComplete` signal by mistake as well as stop the fadeTween. This Signal is now only dispatched if Sound.stop is called and the Sound isn't paused (thanks Corin)
* BitmapText.text would throw an undefined Texture error if you used a character in your text string that didn't exist in the font data.
* Animation.stop will now stop the named animation only if the `name` argument is passed and matches the currently running animation (thanks @samme #2299 #2301)
* TilemapParser accidentally redeclared `i` when parsing Tilemap Layers (thanks @ttencate and @aweber1  #2244 #2233 #2281)
* Added `removeAll` to TweenManagers stub, so the call from the StageManager doesn't throw an error in a custom build (thanks @RetrocadeNet #2284)
* Loader.binary would return a success even if the xhr'd file returned a 404 or similar (thanks @milkey-mouse @mhstar89 #2251 #2250)
* When loading audio or video from blob or data URIs, the local variable was replaced too soon, throwing errors in `getAudioURL` and `getVideoURL` (thanks @milkey-mouse @jackfreak #2236 #2234)
* Tween.hasStarted parameter was set to `false` when the tween was created, but not set again when the tween was stopped or ends. If `Tween.start` is used more than once the `onStart` callback is called only the first time (thanks @javivi91 #2199)
* During a WebGL context loss the Phaser Cache was referencing the wrong local object (thanks @allenevans #2285)
* The Video game object used an anonymous bound function for both the 'ended' and 'playing' event listeners, meaning that they were never removed properly (thanks @ramalhovfc #2303)
* BitmapData.shiftHSL incorrectly used Math.limitValue, now updated to use Math.clamp (thanks @FracturedShader #2222)
* The Loader was deleting the next waiting file from the queue if an asset pack was added after the load had started (thanks @tfelix #2203 #2204)
* Specifying Phaser.ScaleManager.EXACT_FIT as the scaleMode in a game config object would fail to use the scale mode (thanks @06wj #2248)
* BitmapText would crash if it tried to render a character that didn't exist in the font set. Any character that doesn't exist in the font set now renders a space character instead.
* BitmapText would load and parse the kerning data from the font, but would never use it when rendering. The kerning values are now applied on rendering as well (thanks @veu #2165)
* SinglePad.callbackContext is now set through addCallbacks method (thanks @puzzud #2161)
* Both `transparent` and `antialias` were ignored if set to `false` in a Game configuration object, as the `parseConfig` method didn't check for falsy values (thanks @amadeus #2302)
* GameObject.revive used to add the health amount given to the Game Object (via `heal`) instead of setting it as the new health amount. It now calls `setHealth` instead, giving it the exact amount (thanks @netgfx #2231)
* Group.add and Group.addAt would forget to remove the child from the hash of its previous Group if it had a physics body enabled, causing unbounded hash increase (thanks @strawlion @McIntozh #2232)
* Fixed a really nasty bug in Chrome OS X where a ctrl + click (i.e. simulated right-click) on a trackpad would lock up the Pointer leftButton, causing future clicks to fail. This is now handled by way of a mouseout listener on the window object, sadly the only way to force a mouseup in Chrome (thanks @KyleU #2286)
* ctrl + click is now only considered a right-click if event.buttons = 1, this should allow you to use ctrl as a key modifier on Windows (and any device with a multi-button mouse attached) and still use ctrl + click on OS X / trackpads for a right-click (thanks @yuvalsv #2167)
* If the Mouse was over a Sprite and you then clicked it, it would dispatch another Over event. This is now surpressed if the Over event has already been dispatched previously (thanks @McFarts #2133)
* InputHandler.pointerOver could fail to return anything in some instances, now always returns a boolean.
* Tween.onLoop would be fired when a Tween repeated and Tween.onRepeat would be fired when a Tween looped. These are now reversed to fire correctly (thanks @vladkens #2024)
* Text with lineSpacing set wouldn't apply the lineSpacing to the final line of text in the Text string, or to text with just single lines. This could lead to incorrect height calculations for further layout and unwanted padding at the bottom of Text objects (thanks @Lopdo #2137)
* SpriteBatch incorrectly applied the PIXI SpriteBatch prototype over the top of Phaser.Group meaning that Sprites with animations wouldn't render correctly (thanks @qdrj #1951)
* Color.updateColor would pass `color.a` to the `getColor32` method without first putting the value into the range 0 - 255 (thanks @mainpsyhos #2327)

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* BaseTexture.destroy no longer checks for the `_pixiId` property on the canvas before removing it from the CanvasPool, meaning it's now destroying a lot more canvas elements than it was in the past!
* TilingSprite would ignore the `renderable` property, and render it regardless. Now it skips render if `renderable` is false (thanks @Green92 #2214)
* We have replaced the PolyK Triangulation calls within Pixi with EarCut 2.0.8. This allows for faster polygon triangulation, and also deals with more complex polygons that PolyK would crash on.
* Graphics.arc has a new argument `segments` that allows you to control how many segments are created when the arc is drawn. The default is 40. Use a higher number for more fidelity, i.e. if you find that reversed arcs are not joining up fully (#2064)
* PIXI.WebGLMaskManager.pushMask and popMask are now more robust in checking that they have been given valid mask data (#2152)
* PIXI.WebGLGraphics.stencilBufferLimit is a new integer that allows you to define how many points exist in a Graphics object before Pixi swaps to using the Stencil Buffer to render it. The default is 6 but can be increased. This fixes issues with things like Quadratic curves not rendering as masks in WebGL.
* If a Display Object with a mask contained a child with a Filter, then the child would not render. The WebGLFilterManager now retains state and creates a new stencil buffer as required (thanks @hightopo #1842)
* The Filter Texture and GL Viewport are now properly resized, fixing issues with custom resolutions and filters (thanks @englercj @amadeus #2326 #2320)
* Graphics.generateTexture has a new argument `padding` which allows you to add extra spacing onto the generated texture. This is useful for small Graphics objects where you find a few pixels getting sliced off the edges due to rounding issues (#1933)
* DisplayObject._generateCachedSprite (which is called from `updateCache` or when `cacheAsBitmap` is enabled) would bitwise | 1 the bounds width and height. This would often lead to incorrect rounding (heights of 4 would become 5, while heights of 5 would remain 5). This has now been removed and the width and height are passed through Math.ceil and then checked to make sure they aren't less than 1 pixel in either direction (thanks @alesdotio #2078)

## Version 2.4.4 - "Amador" - 15th October 2015

### New Features

* Emitter.emitParticle now has 4 new optional arguments: `x`, `y`, `key` and `frame`. These allow you to override whatever the Emitter default values may be and emit the particle from the given coordinates and with a new texture.
* Group.resetChild is a new method that allows you to call both `child.reset` and/or `child.loadTexture` on the given child object. This is used internally by `getFirstDead` and similar, but is made public so you can use it as a group iteration callback. Note that the child must have public `reset` and `loadTexture` methods to be valid for the call.
* Group.getFirstDead, Group.getFirstAlive and Group.getFirstExists all have new optional arguments: `createIfNull`, `x`, `y`, `key` and `frame`. If the method you call cannot find a matching child (i.e. getFirstDead cannot find any dead children) then the optional `createIfNull` allows you to instantly create a new child in the group using the position and texture arguments to do so. This allows you to always get a child back from the Group and remove the need to do null checks and Group inserts from your game code. The same arguments can also be used in a different way: if `createIfNull` is false AND you provide the extra arguments AND a child is found then it will be passed to the new `Group.resetChild` method. This allows you to retrieve a child from the Group and have it reset and instantly ready for use in your game without any extra code.
* P2.Body.removeCollisionGroup allows you to remove the given CollisionGroup, or array of CollisionGroups, from the list of groups that a body will collide with and updates the collision masks (thanks @Garbanas #2047)
* Filter.addToWorld allows you to quickly create a Phaser.Image object at the given position and size, with the Filter ready applied to it. This can eliminate lots of duplicate code.
* Tiled 0.13.0 added support for layer data compression when exporting as JSON. This means that any .tmx stored using base64 encoding will start exporting layer data as a base64 encoded string rather than a native array. This update adds in automatic support for this as long as the data isn't compressed. For IE9 support you'll need to use the new polyfill found in the resources folder (thanks @noidexe #2084)
* You can now load single layer Pyxel Edit TileMaps as an atlas (thanks @joshpmcghee #2050)
* Canvas.getSmoothingPrefix will return the vendor prefixed smoothing enabled value from the context if set, otherwise null.
* The Random Number Generator can now get and set its state via rnd.state. This allows you to do things like saving the state of the generator to a string that can be part of a save-game file and load it back in again (thanks @luckylooke #2056 #1900)
* Device.iOSVersion now contains the major version number of iOS.
* The new `PointerMode` enumeration value has been added for better simple input discrimination in the future, between active pointers such as touch screens and passive pointers, such as mouse cursors (thanks @pnstickne #2062)
* Button.justReleasedPreventsOver controls if a just-release event
on a pointer prevents it from being able to trigger an over event.
* Button.forceOut expanded to accept a PointerMode value such that it
can be controlled per-input mode.
* Phaser.KeyCode is a new pseudo-type used by the Keyboard class (and your code) to allow for separation of all the Keyboard constants to their own file. This stops the JSDocs from becoming 'polluted' and allows for easier future expansion (thanks @pnstickne #2118 #2031)

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @milkey-mouse @timotei @qdrj @Garbanas @cloakedninjas)
* Docs typo fixes (thanks @rwrountree @yeluoqiuzhi @pnstickne @fonsecas72 @JackMorganNZ @caryanne)
* Math.average has been optimized (thanks @rwrountree #2025)
* When calling GameObject.revive the `heal` method is called to apply the health value, allowing it to take into consideration a `maxHealth` value if set (thanks @bsparks #2027)
* Change splice.call(arguments, ..) to use slice instead (thanks @pnstickne #2034 #2032)
* BitmapData.move, moveH and moveV have a new optional `wrap` argument allowing you to control if the contents of the BitmapData are wrapped around the edges (true) or simply scrolled off (false).
* Time.desiredFps has moved to a getter / setter.
* Time.physicsElapsed and Time.physicsElapsedMS are no longer calculated every frame, but only when the desiredFps is changed.
* Time.update has been streamlined and the `updateSetTimeout` and `updateRAF` methods merged and duplicate code removed.
* Time.desiredFpsMult is a pre-calculated multiplier used in Game.update.
* Time.refresh updates the `Time.time` and `Time.elapsedMS` values and is called automatically by Game.update.
* DeviceButton was setting a `duration` property on itself, which went against the read only getter of duration (thanks @winstonwolff)
* Added Node.js v4 stable to Travis config (thanks @phillipalexander #2070)
* Optimised Canvas.getSmoothingEnabled, Canvas.setSmoothingEnabled and Canvas.setImageRenderingCrisp.
* The Physics Editor Exporter (found in the resources folder of the repo) has had an option to prefix shape names and optimize JSON output added to it (thanks @Garbanas #2093)
* Touch.addTouchLockCallback has a new argument `onEnd` which allows the callback to fire either on a touchstart or a touchend event.
* The SoundManager now detects if the browser is running under iOS9 and uses a touchend callback to unlock the audio subsystem. Previous versions of iOS (and Android) still use touchstart. This fixes Apple's screw-up with regard to changing the way Web Audio should be triggered in Mobile Safari. Thanks Apple (thanks @MyCatCarlos for the heads-up #2095)
* InputHandler.validForInput now checks if the game object has `input.enabled` set to `false` and doesn't validate it for input if that's the case.
* The default Button.onOverMouseOnly value has changed from `false` to `true`. If you used this in your touch enabled games then please be aware of this change (#2083)
* BitmapData.clear now automatically calls BitmapData.update at the end of it.
* New Color stub added for the custom build process. Contains just the bare minimum of functions that Phaser needs to work. Cuts file size from 48.7KB to 7.4KB. Note: Do not stub this out if using BitmapData objects.
* New DOM stub added for the custom build process. Contains just the bare minimum of functions that Phaser needs to work. Cuts file size from 14.8KB to 2.4KB. Note: Do not stub this out if using the full Scale Manager.
* New Scale Manager stub added. Removes all Scale Manager handling from Phaser! But saves 75KB in the process. If you know you don't need to scale the Phaser canvas, or are handling that externally, then you can safely stub it out in a custom build.
* Added the PIXI.PolyK, PIXI.WebGLGraphics and PIXI.CanvasGraphics files to the Graphics custom build option. They weren't used anyway and this removes an extra 40.2KB from the build size.
* Phaser.Create no longer automatically creates a BitmapData object when it starts. It now only does it when you first make a texture or grid.
* New Create stub added for the custom build process. Cuts file size by 8KB.
* You can now exclude the FlexGrid from custom builds, saving 15KB.
* The ScaleManager no longer creates a Phaser.FlexGrid if the class isn't available (i.e. excluded via a custom build)
* Time.suggestedFps is now defaulted to `Time.desiredFps` for the first few frames until things have settled down (previously it was `null`) (thanks @noidexe #2130)
* Text with anchor 0.5 and word wrap would have an extra space added to its width calculations, this is now adjusted for (thanks @nickryall #2052 #1990)
* ScaleManager.getParentBounds now checks if `parentNode` has an `offsetParent` before calling `getBoundingClientRect` on it (thanks @McFarts #2134)

### Bug Fixes

* Loader.bitmapFont wouldn't automatically set the `atlasURL` value if just the key was given.
* The Loader would put the baseURL and/or path in front of `data:` and `blob` URLs (thanks @rblopes #2044)
* When the Text width was being calculated it would add the `strokeThickness` value twice, causing an alignment offset (thanks @nickryall #2039)
* Sound.onEndedHandler has a fix for AudioBufferSourceNode listener memory leak (thanks @Pappa #2069)
* Game.update could call `updateLogic` multiple times in a single frame when catching up with slow device frame rates. This would cause Tweens to advance at twice the speed they should have done (thanks @mkristo)
* Added useCapture flags to removeEventListener in MSPointer class (thanks @pmcmonagle #2055)
* Under setTimeOut (or when `forceSetTimeOut` was true) the Time was incorrectly setting `Time.timeExpected` causing game updates to lag (thanks @satan6 #2087)
* Fixes edge case when TilingSprite is removed before render (thanks @pnstickne #2097 #2092)
* Camera.setBoundsToWorld only adjusts the bounds if it exists (thanks @prudolfs #2099)
* Keyboard.addCallbacks didn't check to see if the arguments were `null`, only if they were `undefined` making the jsdocs misleading.
* ScaleManager.getParentBounds now takes any transforms into account to get the correct parent bounds (thanks @jdnichollsc #2111 #2098)
* Cache.addBitmapFont now applies a default value for the x and y spacing if the arguments are omitted (thanks @nlotz #2128)
* Removed use of the `tilePosition` property in the Phaser.Rope class as it isn't implemented and caused calls to `Rope.reset` to crash (thanks @spayton #2135)
* ScaleMin and ScaleMax stopped working in Phaser 2.3.0 due to an incorrect transform callback scope (thanks @brianbunch #2132)

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* CanvasRenderer.mapBlendModes optimised to cut down on file size.
* PIXI.WebGLRenderer.updateTexture now returns a boolean depending on if the texture was successfully bound to the gl context or not.
* PIXI.WebGLSpriteBatch.renderBatch would still try and render a texture even if `updateTexture` failed to bind it. It now checks the return value from `updateTexture` and ignores failed binds.
* WebGLRenderer.mapBlendModes optimised to cut down on file size.
* Sprite.getBounds would report an inaccurate value if the sprite was negatively scaled (causing things like generateTexture to be cut off) (thanks @DavidAPC #2108)
* Removed DisplayObject.transformCallback as it's a Game Object component.
* BaseTexture.skipRender is a new boolean that can be set to skip the rendering phase in the WebGL Sprite Batch. You may want to do this if you have a parent Sprite with no visible texture (i.e. uses the internal `__default` texture) that has children that you do want to render, without causing a batch flush in the process.

## Version 2.4.3 - "Coramen" - 24th August 2015

### New Features

* Loader.images is a new method that allows you to pass an array of image keys, and optionally the URLs to the Loader and have them all added to the load queue in one go.
* TweenManager.frameBased allows you to control if all newly created Tweens update based on the physics step (i.e. frame based) or the system clock (time based). A frame based tween will use the physics elapsed timer when updating. This means it will retain the same consistent frame rate, regardless of the speed of the device. The duration value given should be given in frames. If the Tween uses a time based update (which is the default) then the duration is given in milliseconds. In this situation a 2000ms tween will last exactly 2 seconds, regardless of the device and how many visual updates the tween has actually been through.
* Tween.frameBased does the same as TweenManager.frameBased but allows you to set the value on a per-tween basis.
* BitmapText.smoothed is a new boolean property that allows you to set texture smoothing on a bitmap font or not. By default smoothing is always on, but you can turn it off which helps for bitmap fonts created from pixel art style character sets.
* Text.addFontStyle and Text.addFontWeight allow you to apply font weights and styles to specific characters in a Text object. For example you can now include bold or italics within single Text objects (thanks @jdnichollsc #1950)
* PIXI.CanvasPool is a new static global created to deal with the issue of resource leaks and continuous DOM node build-up when creating lots of Text or BitmapData objects, or when calling `generateTexture` on any display object. The CanvasPool will do its best to re-use out dated canvas elements rather than filling up the DOM with new ones.
* Sprite.setTexture has a new `destroyBase` parameter - set this to `true` if you know the base used a generated texture that isn't being used by any other sprites. This will free-up the canvas for further re-use by other calls to `generateTexture` or Text objects.
* Line.midPoint will return a Point object where the `x` and `y` values correspond to the center (or midpoint) of the Line segment.
* Line.rotateAround allows you to rotate a Line around the given coordinates (in world space)
* Line.centerOn will position the Line so that its midpoint lays on the coordinates given.
* BitmapData.line draws a line to the BitmapData in the color and thickness specified.
* BitmapData.op is a handy short-code to get and set the canvas global composite operator.
* BitmapData.drawFull draws the given Game Object or Group to a BitmapData and then recursively iterates through all of its children, including children of Game Objects and Groups. It can draw Text, BitmapText, Sprites, Images, Emitters and Graphics objects. It's perfectly valid to pass in `game.world` as the parent object, and it will iterate through the entire display list.
* Phaser.TilemapParser.INSERT_NULL is a new boolean that controls what happens when the parser encounters an empty tile: When scanning the Tiled map data the TilemapParser can either insert a null value (true) or a `Phaser.Tile` instance with an index of -1 (false, the default). Depending on your game type depends how this should be configured. If you've a large sparsely populated map and the tile data doesn't need to change then setting this value to `true` will help with memory consumption. However if your map is small, or you need to update the tiles (perhaps the map dynamically changes during the game) then leave the default value set (thanks #1982)

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @vrecluse @yahiko00 @cloakedninjas @qdrj)
* JSDoc typo fixes (thanks @Cowa @yahiko00 @qdrj @STuFF)
* VideoStream.active = false is used if the browser supports it, otherwise it falls back to VideoStream.stop.
* Text can now accept `undefined` or `null` as the `text` argument in the constructor and will cast it as an empty string.
* Point.rotate uses a faster and simpler rotation function when no distance argument is specified.
* Setting a P2.Body from Static or Kinematic to Dynamic will now automatically adjust the Body.mass to be 1 (thanks @wayfu #2005)
* Pointer.withinGame is no longer automatically set to `false` in the `Pointer.stop` method. Instead it will check if the Pointer actually is within the stage bounds and only set `withinGame` to `false` if it's outside the bounds.
* MSPointer now has an `onPointerUpGlobal` handler for when the pointer is released outside of the canvas, but still within the browser window. This means that in IE11 a Sprites `onInputUp` event will now trigger even when outside the canvas (thanks @bvargish #2000)
* MSPointer now has handlers for the pointer being over and outside of the canvas element, which sets the `Pointer.withinGame` booleans accordingly. It also triggers the `Mouse.mouseOutCallback` and `Mouse.mouseOverCallback` callbacks respectively.
* The MSPointer event listeners have been renamed to all lower-case, i.e. 'pointerDown' is now 'pointerdown'.

### Bug Fixes

* Pointer.isDown was reset before the `Input.onUp` event, meaning you couldn't get the Pointer duration from within the event.
* Pointer.isDown was reset before the Input tap calculations, meaning `onTap` wouldn't dispatch (thanks @stovenator #1953)
* InputHandler.pointerOver would get stuck in an 'isOver' state if the Sprite changed its visibility during an `onUp` callback (thanks @Cristy94 #1955)
* If you override the P2 mpx functions, to define your own px to meters values, the P2 Debug Bodies would ignore it (thanks @vrecluse #1957)
* ArrayUtils.numberArrayStep would return an empty array if a single parameter was given, instead of a single step array (thanks @pooya72 #1958)
* Text with tints applied wouldn't update properly in Canvas mode.
* Removed use of the deprecated `enterFullScreen` and `leaveFullScreen` signals from the Scale Manager (thanks @mmanlod #1972)
* BitmapText with tints applied wouldn't update properly in Canvas mode (thanks @Pajamaman #1969)
* Group.cacheAsBitmap would be incorrectly offset in Canvas mode (thanks @mkristo #1925)
* Text.setTextBounds didn't add the x and y values to the width and height offsets.
* Line.rotate used a calculation method which resulted in the line growing (or shrinking) in length over time the more it was rotated. The new method never changes the lines length.
* BitmapText.font failed to pull the new font from the Phaser Cache, stopping it from updating properly (thanks @AbrahamAlcaina #2001)
* Video.stop now removes the 'playing' event listener, which stop Videos set to loop from throwing errors after being destroyed.
* Tilemap.createFromObjects has been strengthened so that will only create Sprites for matching gids/ids/names. It also only sets the Sprite width and height values if they are present in the Tiled data (thanks @pparke #2012)
* TilingSprite._renderCanvas wasn't correctly allowing for pixel rounding (thanks @ximop #2022)
* Cache.addSpriteSheet didn't include default values for the `frameMax`, `margin` and `spacing` arguments (thanks @vladkens #2017 #2018)
* Tilemap.shuffle was calling the deprecated Phaser.Utils.shuffle, which has now moved to Phaser.ArrayUtils.shuffle.
* Enabling a filter on a display object that had a multiply blend mode set would cause the object to become invisible. The two cannot be combined, so when you set a filter on a display object it now automatically resets the blend mode to `NORMAL`. The same does not happen in reverse however, so if you've got a filter set and then change the blend mode to multiply it will still break. Be careful to capture this yourself (thanks @wayfu #1994)

## Version 2.4.2 - "Altara" - 29th July 2015

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @shivinsky)
* JSDoc typo fixes (thanks @DrkSephy)
* TilemapLayer - Fixed unmatched `context.save` and `context.restore` calls (thanks @MortimerGoro #1934)
* Cache.getFrame has a new `cache` parameter (that defaults to the Image cache, but can be changed to any other)
* Cache.getFrameCount has a new `cache` parameter (that defaults to the Image cache, but can be changed to any other)
* Cache.getFrameData has a new `cache` parameter (that defaults to the Image cache, but can be changed to any other)
* Cache.hasFrameData has a new `cache` parameter (that defaults to the Image cache, but can be changed to any other)
* Cache.getFrameByIndex has a new `cache` parameter (that defaults to the Image cache, but can be changed to any other)
* Cache.getFrameByName has a new `cache` parameter (that defaults to the Image cache, but can be changed to any other)
* Device.canPlayVideo now checks for `ogv` as a valid file extension for OGG video files (thanks @JB-Tellez #1928)
* Phaser.Sound will now automatically check the Cache to see if the audio file it is using is still there or not. If not then it will automatically called `Sound.destroy` on itself. If you do not desire this result then you should ensure that you undertake all house-keeping yourself, and properly destroy Sound objects _before_ calling `Cache.removeSound` (#1946)

### Bug Fixes

* DeviceButton would try to set `altKey`, `shiftKey` and `ctrlKey` even for Joypads (thanks @zatch #1939)
* Pointer.move would accidentally reset the `isDown` status of the Pointer on touch devices, which broke things like Sprite input events when built to native apps or run locally (#1932 #1943)
* Pointer.onDown (and input enabled items like Buttons) would fail on FireFox / Linux and CocoonJS (#1944 #1945)

## Version 2.4.1 - "Ionin Spring" - 24th July 2015

This is a small point release that updates the Creature runtimes and fixes a couple of small cache issues.

It also modifies the Grunt build scripts so that all third party libs (such as Creature, P2, gl-matrix and PIXI) are now kept well and truly outside of Phaser. They are defined and placed first in the build files. So no more PIXI hiding within the Phaser namespace or UMD patching for Phaser required.

### Updates

* The Creature Runtimes have been updated to the latest versions and the `Phaser.Creature` class updated to use them.
* GameObjectFactory.creature is a new method to help with quick Creature animation object creation.
* Cache.getPixiTexture will now search the image cache if it couldn't find a texture in the PIXI.TextureCache global array, if it finds a matching image in the image cache then it returns a new PIXI.Texture based on it.
* Cache.getPixiBaseTexture will now search the image cache if it couldn't find a BaseTexture in the PIXI.BaseTextureCache global array.

### Bug Fixes

* Fixed Cache.getKeys to use the `_cacheMap` (thanks @jamesgroat #1929)
* Safari on OSX wouldn't recognise button presses on trackpads (thanks JakeCake)
* Cache.removeImage now calls destroy on the image BaseTexture, removing it from the PIXI global caches without throwing a warning.

## Version 2.4 - "Katar" - 22nd July 2015

### API Changes

* RenderTexture.render now takes a Matrix as its second parameter, not a Point object. This brings it in line with Pixi and allows you to perform much more complex transformations on the object being rendered. If you need to replicate the old behavior please use RenderTexture.renderXY(sprite, point.x, point.y) instead.
* PIXI.DisplayObject.updateTransform has a new optional parameter `parent`. If the DisplayObject doesn't have a parent (i.e. it isn't on the display list yet) then in the past `updateTransform` would fail. This meant you couldn't do things like scale or rotate a Sprite and then draw it to a RenderTexture or BitmapData, as calls to updateTransform would be ignored. The new checks now look to see if the `parent` parameter is set. If so this takes priority over the actual parent and is used to modify the transform (note that it **doesn't** reparent the DisplayObject, it merely uses it for the transform.) If there is no parent (explicitly or via the parameter) then it falls back to use Phaser.World as the parent. If it can't reach that then no transform takes place.
* If Phaser.Sound.noAudio has been set then Phaser.Loader will not load any audio files. No errors are thrown, but all calls to Loader.audio and Loader.audiosprite are silently ignored. `noAudio` can be set either via the `PhaserGlobal` global var or is set if the device your game is running on has no audio playback support.
* Files can now be added to the Loader with an absolute URL even if you have a Loader.baseURL set. In previous versions the baseURL would still be prepended to the file URL, but the Loader now checks if the a file URL begins with `http` or `//` and skips prepending the baseURL to it.
* Phaser.StateManager would incorrectly call `loadUpdate` and `loadRender` while the game was paused or if the State didn't have an `update` or `render` method defined, even after the loader was completed. Although this is a bug fix it's still an API change should you have been using the `loadUpdate/Render` calls in the old way. Also the StateManager no longer calls `preRender` unless the State `create` method has *finished*. If the State doesn't have a `create` method then `preRender` runs immediately.
* Frame.uuid has been removed (was flagged as deprecated for several releases). This has a two-fold effect: First it means that the property no longer exists and secondly it means that the AnimationParser (the class responsible for loading sprite sheets and texture atlases) no longer has to call either RandomDataGenerator.uuid OR populates the PIXI.TextureCache. The first saves some CPU time and the second saves memory by not creating references to textures it doesn't ever use. The PIXI.TextureCache is now ignored by Phaser other than for the `__missing` and `__default` textures.
* Phaser.AnimationParser methods `JSONData`, `JSONDataHash` and `XMLData` have all had their `cacheKey` parameter removed as it's no longer used.
* Input.deleteMoveCallback no longer takes an integer as its parameter. Now you have to give it the original callback and context in order to remove it. This is to protect against index invalidation (see the fixed Bugs list)
* Group.add and Group.addAt will only create a Physics Body on the child if it doesn't already have one. This is a change from 2.3 where it would replace the physics body property with the new body, but this could lead to garbage build-up over time, so you should now properly destroy the body before changing it.
* Button game objects now have `Input.useHandCursor` set to `true` by default.
* Phaser.BitmapText no longer extends PIXI.BitmapText but replaces it entirely.
* Phaser.Text no longer extends PIXI.Text but replaces it entirely. Phaser.Text now natively extends a Phaser Sprite, meaning it can be enabled for physics, damaged, etc.
* Mouse.button and MSPointer.button have been deprecated and are no longer set (they remain at -1). They never supported complex button events such as holding down 2 buttons and releasing just one, or any buttons other than left and right. They have been replaced with the far more robust and accurate Pointer DeviceButton properties such as `Pointer.leftButton`, `Pointer.rightButton` and so on.
* Phaser.DeviceButton is a new class that handles a specific button on an input device, for example the middle button of a mouse, the eraser button of a stylus or a shoulder button on a Gamepad.
* Phaser.DeviceButton.shiftKey is a boolean that holds if the shift key was held down or not during the last button event.
* Phaser.DeviceButton.altKey is a boolean that holds if the alt key was held down or not during the last button event.
* Phaser.DeviceButton.ctrlKey is a boolean that holds if the control key was held down or not during the last button event.
* Phaser.GamepadButton has been removed and now uses DeviceButton instead. Three internal API changes took place: `processButtonDown` is renamed to `start`, `processButtonUp` is renamed to `stop` and `processButtonFloat` is renamed to `padFloat`. If you extended GamepadButton in your own code you need to replace it with DeviceButton.
* MSPointer now checks the `pointerType` property of the DOM event and if it matches 'mouse' it will update `Input.mousePointer`, rather than `Input.pointer1` (or whatever the next free Pointer was).
* Time.suggestedFps is now only populated if `Time.advancedTiming` is enabled.

### p2.js Upgraded to version 0.7.0

Phaser has been upgraded internally to use the new release of p2 physics. All Phaser based API call signatures remain unchanged unless listed below.

For the full list of p2 additions please read [their change log](https://github.com/schteppe/p2.js/releases/tag/v0.7.0).

* The P2.Body.onBeginContact arguments have changed. It now sends 5 arguments: The Phaser.P2.Body, the p2.Body, the p2 Shape from Body A, the p2 Shape from Body B and the contact equations array. Note that the Phaser.P2.Body may be null if you collide with a 'native' p2 body (such as the world bounds). However the p2.Body argument will always be populated.
* The P2.Body.onEndContact arguments have changed. It now sends 4 arguments: The Phaser.P2.Body, the p2.Body, the p2 Shape from Body A and the p2 Shape from Body B. Note that the Phaser.P2.Body may be null if this is the end of a contact with a 'native' p2 body (such as the world bounds). However the p2.Body argument will always be populated.
* P2.Body.applyImpulse allows you to apply an impulse to a Body. An impulse is a force added to a body during a short period of time.
* P2.Body.applyImpulseLocal allows you to apply an impulse to a point local to the Body. An impulse is a force added to a body during a short period of time.
* P2.Body.getVelocityAtPoint gets the velocity of a point in the body.

### Build Updates

* The Grunt build script now lets you exclude four new modules: rope, tilesprite, creature and video.
* Rope removes the ability to create Rope sprites and also removes the PIXI.Rope and PIXI.Strip classes.
* TileSprite removes the ability to create Tile Sprites and also removes the PIXI.TilingSprite class.
* Creature is not enabled by default, but allows you to control support for Creature bone based animations.
* Video removes the ability to render Videos and video streams to textures.
* Pixi is no longer an optional module. Phaser no longer uses any main stream branch of Pixi and has multiple fixes and tweaks internally through-out it. Therefore it's now no longer possible to replace the version of Pixi that Phaser uses with any other version, so we removed the option from the custom list. Over time we will do away with the Pixi globals and merge it fully into Phaser to avoid conflicts with any other version of Pixi present.

### New Features

* All calls to Loader methods that add files to the queue, such as `Loader.image` or `Loader.atlas`, now have the URL as an optional parameter. If not set Loader will assume the URL to be based on the key given. For example the following: `game.load.image("boom", "boom.png")` can now be expressed as just `game.load.image("boom")`, or `game.load.atlas("player", "player.png", "player.json")` can now be shortened to `game.load.atlas("player")`. Please see the freshly updated jsdocs for full details.
* Loader.atlas and `Cache.addTextureAtlas` will now automatically determine the format of the JSON data (array or hash) when added to the Cache. You no longer need to specify it explicitly if JSON, only if XML.
* Added support for the [Creature Automated Animation Tool](http://www.kestrelmoon.com/creature/). You can now create a Phaser.Creature object which uses json data and a texture atlas for the animations. Creature is a powerful animation tool, similar to Spriter or Spine. It is currently limited to WebGL games only, but the new libs should prove a solid starting point for anyone wanting to incorporate Creature animations into their games.
* Tilemap.getTileWorldXY has a new optional parameter: `nonNull` which if set makes it behave in the same way as `getTile` does (thanks @GGAlanSmithee #1722)
* Group.hash is an array (previously available as `Group._hash`, but protected) into which you can add any of its children via `Group.addToHash` and `Group.removeFromHash`. Only children of the Group can be added to and removed from the hash. The hash is used automatically by Arcade Physics in order to perform non z-index based destructive sorting. However if you don't use Arcade Physics, or it isn't a physics enabled Group, then you can use the hash to perform your own sorting and filtering of Group children without touching their z-index (and therefore display draw order).
* Group.physicsSortDirection is a new property allowing you to set a custom sort direction for Arcade Physics Sprites within the Group hash. Previously Arcade Physics used one single sort direction (defined on `Phaser.Physics.Arcade.sortDirection`) but this change allows you to specifically control how each and every Group is sorted, so you can now combine tall and wide Groups with narrow and thin in a single system.
* Cache.getPixiTexture will return a PIXI.Texture from the cache based on the given key. A PIXI Texture is created automatically for all images loaded and added to the cache.
* Cache.getPixiBaseTexture will return a PIXI.BaseTexture from the cache based on the given key. A PIXI BaseTexture is created automatically for all images loaded and added to the cache.
* Phaser.Matrix.clone allows you to clone the Matrix to a new object, or copy its values into the given Matrix.
* Phaser.Matrix.copyFrom and copyTo allow you to copy Matrix values from and to other Matrix  objects.
* Phaser.Matrix.setTo allows you to set all properties of a Matrix in a single call.
* The Phaser.Matrix constructor now allows you to optionally set all Matrix properties on instantiation.
* Text.setShadow has two new optional parameters: `shadowStroke` and `shadowFill`. These allow you to set if the drop shadow is applied to the Text stroke, the Text fill or both of them (thanks @qdrj #1766)
* Text.shadowStroke and Text.shadowFill allow you to toggle if the drop shadow is applied to the Text stroke or fill independently.
* ArcadePhysics.Body.syncBounds is a new property that if true forces the Body to check itself against the Sprite.getBounds() dimensions and adjust its width and height accordingly. If false it will compare its dimensions against the Sprite scale instead, and adjust its width height if the scale has changed. Typically you would need to enable `syncBounds` if your sprite is the child of a responsive display object such as a FlexLayer, or in any situation where the sprite scale doesn't change, but its parents scale is effecting the dimensions regardless.
* Rectangle.ceil runs Math.ceil() on both the x and y values of the Rectangle.
* Rectangle.ceilAll runs Math.ceil() on the x, y, width and height values of the Rectangle.
* The Net and Debug classes have been stubbed out, so they can be properly excluded during a custom build (thanks @soldoutactivist #1772)
* Device.oggVideo indicates if the browser can play back ogg video files.
* Device.h264Video indicates if the browser can play back H264 (mp4) video files.
* Device.mp4Video indicates if the browser can play back H264 (mp4) video files.
* Device.webmVideo indicates if the browser can play back webm video files with the vp8 codec.
* Device.vp9Video indicates if the browser can play back webm video files with the vp9 codec.
* Device.hlsVideo indicates if the browser can play back mpeg video files.
* PIXI.DisplayObject.worldPosition contains the position of the DisplayObject (and therefore any object that inherits from it, such as Phaser.Sprite) taking into account all transforms in the display list. It is updated at the end of `DisplayObject.updateTransform`. DisplayObject.position reflects only the position applied to the object directly, whereas worldPosition includes the positions that may have been applied to its ancestors.
* PIXI.DisplayObject.worldScale contains the scale of the DisplayObject (and therefore any object that inherits from it, such as Phaser.Sprite) taking into account all transforms in the display list. It is updated at the end of `DisplayObject.updateTransform`. DisplayObject.scale reflects only the scale applied to the object directly, whereas worldScale includes any scales that may have been applied to its ancestors.
* PIXI.DisplayObject.worldRotation contains the rotation of the DisplayObject (and therefore any object that inherits from it, such as Phaser.Sprite) taking into account all transforms in the display list. It is updated at the end of `DisplayObject.updateTransform`. DisplayObject.rotation reflects only the rotation applied to the object directly, whereas worldRotation includes any rotations that may have been applied to its ancestors.
* Loader.video allows you to load a video file into Phaser. It works in the same way as Loader.audio, allowing you to pass an array of video files - and it will load the first one the device is capable of playing back. You can optionally load the video via xhr where the video data is converted to a Blob upon successful load.
* Cache.addVideo allows you to add a loaded video into the Phaser Cache. This is called automatically by the Phaser Loader, but may be invoked directly as well.
* Cache.checkVideoKey allows you to check if a video is stored in the cache based on the given key.
* Cache.getVideo allows you to extract a video from the Cache based on its key. The video element itself (or the Blob is loaded with asBlob true) will be found in the `data` property of the returned object.
* Cache.removeVideo will remove a video from the Cache based on the given key.
* SoundManager.onVolumeChange is a new signal that is dispatched whenever the global volume changes. The new volume is passed as the only parameter to your callback.
* SoundManager.onMute is a new signal that is dispatched when the SoundManager is globally muted, either directly via game code or as a result of the game pausing.
* SoundManager.onUnMute is a new signal that is dispatched when the SoundManager is globally un-muted, either directly via game code or as a result of the game resuming from a pause.
* Input.Touch.addTouchLockCallback allows you to add a callback that will be invoked automatically upon a touchstart event. This is used internally by the SoundManager and Video objects to handle mobile device unlocking, but is exposed publicly as well.
* Frame.resize allows you to change the dimensions of a Frame object and recalculate all of its internal properties (such as `bottom` and `distance`).
* LoadTexture.resizeFrame lets you resize the Frame dimensions that the Game Object uses for rendering. You shouldn't normally need to ever call this, but in the case of special texture types such as Video or BitmapData it can be useful to adjust the dimensions directly in this way.
* Rectangle.bottomLeft has been added (thanks @mattmogford #1788)
* Device.firefoxVersion is a new property that contains the major Firefox version number if running within Firefox, otherwise zero.
* Math.distanceSq will return the euclidean distance squared between the two given set of coordinates (thanks @jeremyosborne #1761 #1770)
* StateManager.onStateChange is a new signal which is dispatched whenever the State changes from one to another. The callback you specify is sent two parameters: the string based key of the new state, and the second parameter is the string based key of the old / previous state.
* onDragUpdate is a new signal that is dispatched whenever a Game object enabled for input and drag is moved by a pointer (i.e. during a drag event). See the `Phaser.InputHandler.enableDrag` docs for parameter details and the new Phaser Example.
* Rectangle.resize allows you to resize a Rectangle to the new given dimensions without altering its position.
* Cache.getJSON has a new parameter: `clone`. If set it will return a clone of the object stored in the Cache rather than a reference to it.
* Circle.random will return a uniformly distributed random point from anywhere within the circle.
* Line.random will return a random point from anywhere on the Line segment.
* Ellipse.random will return a uniformly distributed random point from anywhere within the ellipse.
* Rectangle.random will return a uniformly distributed random point from anywhere within the rectangle.
* Line.rotate allows you to rotate a line by the given amount around its center point.
* Device.chromeVersion will return the major version number of Chrome.
* TilingSprite.textureDebug is a new boolean that allows you to visually debug the generated texture a TilingSprite creates.
* Device.electron will return true if running under GitHub Electron (thanks @rblopes #1851)
* When loading a BitmapText you can now specify either an XML file or a JSON file for the font data. This is useful in environments such as Cocoon where you don't have a native XML parser. If you wish to use JSON the formatting should be equal to the result of running a valid XML file through X2JS (thanks @Feenposhleen #1837)
* Game Objects that have the Health component (such as Sprites) now have a new method: `heal` which adds the given amount to the health property, i.e. is the opposite of `damage` (thanks @stephandesouza #1794)
* maxHealth is a new property that Game Objects with the Health component receive and works in combination with the `heal` method to ensure a health limit cap.
* Text.setTextBounds is a rectangular region that allows you to align your text within it, regardless of the number of lines of text or position within the world. For example in an 800x600 sized game if you set the textBounds to be 0,0,800,600 and text alignment to 'left' and vertical alignment to 'bottom' then the text will render in the bottom-right hand corner of the game, regardless of the size of font you're using or the number of lines in the text itself (thanks @boostermedia for the idea #1824)
* Text.autoRound allows you to control if the text is allowed to render at sub-pixel coordinates or not. Set to `true` to round the coordinates, often eliminating anti-aliasing from certain font types (#1867)
* Tiled Image Collection support is now available and has been added to the TilemapParser and Tilemap classes (thanks @asyed94 #1879)
* Keyboard.addKeys is a practical way to create an object containing user selected hotkeys. For example: `addKeys( { 'up': Phaser.Keyboard.W, 'down': Phaser.Keyboard.S, 'left': Phaser.Keyboard.A, 'right': Phaser.Keyboard.D } );` would return an object containing the properties `up`, `down`, `left` and `right` that you could poll just like a Phaser.Key object. (thanks @Mourtz #1857)
* TilemapLayer.resize allows you to resize a TilemapLayer. It will update the internal canvas object and corresponding texture dimensions (#1881)
* Pointer button handling has been given an overhaul. It has the following new DeviceButton properties: `leftButton`, `rightButton`, `middleButton`, `backButton`, `forwardButton` and `eraserButton`. So you can now easily check which buttons are active and build right or middle click support into your games. The Pointer object normalises these properties for you, regardless if they came from a MouseEvent or PointerEvent (thanks @youssefdetovernickr for the idea #1848)
* Text has a new style property: tabs. This allows you to specify a pixel value (or values) that allows you to space out text that contains tab characters within it. `Text.tabs` can be either an integer, in which case all tabs share the same spacing, or an array of pixel values corresponding exactly to the number of tabs per line of text. This allows you to easily align columns of data in a single Text object.
* BitmapData.move(x, y) allows you to shift the contents of the BitmapData horizontally and vertically by the given amounts. The image wraps-around the edges of the BitmapData.
* BitmapData.moveH(distance) allows you to horizontally shift the BitmapData with wrap-around the edges.
* BitmapData.moveV(distance) allows you to vertically shift the BitmapData with wrap-around the edges.
* Text.addStrokeColor works in the same way as `Text.addColor` but allows you to define a color stop for the stroke color instead of the fill color.
* All Game Objects and Groups have a new boolean property called `pendingDestroy`. If you set this to `true` then the object will automatically destroy itself in the *next* logic update, rather than immediately. This is useful for cases when you wish to destroy an object from within one of its own callbacks, such as with buttons or other input events (thanks @alamboley #1748)
* BitmapData.generateTexture will take a snapshot of the BitmapDatas canvas at that moment in time and convert it into an Image, which is then stored in the Phaser image Cache based on the key given. You can then use the new texture for any future sprites or texture based objects.
* All Signals now have the ability to carry extra custom arguments with them, which are passed on to the callback you define after any internal arguments. For example a Phaser.Key has an onDown signal. When dispatched onDown sends a reference to the Key as the first and only argument. But you can now set the callback like this: `fireKey.onDown.add(shoot, this, 0, 'lazer', 64)`. So when the onDown signal is dispatched internally the callback (`shoot` in this case) will receive 3 arguments: the Key reference that is raised internally and the string 'lazer' and value 64, which were the custom arguments provided when setting-up the callback.
* Group.moveAll allows you to move all of the children of a Group into another Group.
* Loader.path is a string and if set it is placed before any _relative_ file path given to the Loader. For example: `load.path = "images/sprites/";` followed by `load.image("ball", "ball.png");` and `load.image("tree", "level1/oaktree.png");` would load the `ball` file from `images/sprites/ball.png` and the tree from `images/sprites/level1/oaktree.png`. The path is added before the filename but *after* the `Loader.baseURL`. The path _must_ end with a "/". Set it to nothing to disable the path.
* Loader.shader allows you to load a fragment shader from an external file.
* Cache.addShader adds a fragment shader into the cache.
* Cache.getShader gets a fragment shader from the cache.
* The Cache has been internally refactored considerably. Image data is now all stored in the same object, rather than being split across the PIXI global caches (such as PIXI.TextureCache and PIXI.BaseTextureCache), which are no longer used by Phaser.
* Internally the Cache now uses a single _cache object, which is partitioned to store the various different object types. Before the cache used lots of private objects, one per data type, but it's now a lot cleaner and we've managed to cut out hundreds of lines of duplicate code in the process.
* Cache.getImage has a new argument which lets you return either just the HTML Image element or the entire image cache object, which includes the baseTexture and frame data.
* Cache.getImage will return a __default image if the key isn't given, or a __missing image if the key is given but not found in the cache. This means it will always return a valid image and no longer cause Phaser to throw runtime errors deeper down with invalid image objects.
* AABB vs. AABB collisions now work in Ninja Physics. `reportCollisionVsWorld` already worked, and contained all of the logic required to resolve a collision once the appropriate vectors had been established. `reportCollisionVsBody` was refactored to use that function (now generically named `reportCollision`), and now AABBs can collide properly, including bouncing and friction. reportCollisionVsWorld is now just a wrapper around reportCollision to maintain compatibility (thanks @standardgaussian #1905)
* Phaser.Create is a new class that allows you to dynamically generate sprite textures from an array of pixel data, without needing any external files. We'll continue to improve this over the coming releases, but for now please see the new examples showing how to use it.

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @isuda @ggarek @jamesgroat)
* JSDoc typo fixes (thanks @robertpenner @luckylooke @asyncanup @muzuiget @danxexe @rgk @matugm)
* Added missing `resumed` method to Phaser.State class template.
* Color.webToColor and Color.updateColor now updates the `out.color` and `out.color32` properties (thanks @cuixiping #1728)
* Tilemap.createFromObjects has been updated for Tiled 0.11 and can now look-up object layers based on id, uid or name. It will also now copy over Sprite scaling properties if set (thanks @mandarinx #1738)
* Graphics.drawPolygon can now accept a Phaser.Polygon or PIXI.Polygon object, as well as a points array (#1712)
* Phaser.Physics hooks added in for MatterJS support (coming soon)
* Body.destroy now automatically calls `Group.removeFromHash`.
* Physics.Arcade.sort has a new property 'sortDirection'. If not specified it will use World.sortDirection. If the Group given as the first parameter has its `physicsSortDirection` property set that will override any other setting.
* Physics.Arcade.sort now calls one of four functions: sortLeftRight, sortRightLeft, sortTopBottom and sortBottomTop. Each of which takes 2 Sprites as arguments.
* Physics.Arcade.sort now doesn't bail out if the Group contains a mixture of physics and non-physics enabled objects, as the Group hash is now only ever populated with physics enabled objects. Also the sort comparison functions no longer return -1 if the bodies are invalid, but zero instead (#1721)
* Phaser.Group would automatically add a child into the _hash array as soon as the child was created (or moved into the Group). This no longer happens. Instead the child is only added to `Group.hash` if it is enabled for Arcade Physics. However `Group.addToHash` and the hash array have been exposed as public in case you were taking advantage of the _hash even though it was a previously marked as private.
* Cache.getTexture has now been removed (it was deprecated several versions ago). Use Cache.getRenderTexture instead.
* Removed duplicate methods from PIXI.Text such as wordWrap and updateText as Phaser overrides them, so it was wasting bytes.
* Phaser.StateManager no longer calls `preRender` unless the State `create` method has finished. If the State doesn't have a `create` method then `preRender` runs immediately.
* Phaser.StateManager.created is a new read-only boolean that tells you if the State has finished running its `create` method. If it doesn't have one it's always true.
* RenderTexture.render and `renderXY` would ignore the Sprites rotation or scale. The full Sprite transform is now used correctly when the Sprite is drawn to the texture. If you wish to replicate the old behavior please use `RenderTexture.renderRawXY` instead.
* Pixi.Sprite.renderCanvas and renderWebGL now has a new optional matrix parameter. You can use this to render the Sprite with an alternative transform matrix without actually adjusting the Sprite matrix at all.
* RenderTexture.matrix has been removed as it's no longer used.
* SoundManager.pauseAll, resumeAll and stopAll now checks if the SoundManager.noAudio is set and ignores the calls.
* SoundManager.usingWebAudio is set to `false` by default (used to be `true`) and is only explicitly set if Web Audio is available and hasn't been disabled in the PhaserGlobal object.
* SoundManager.touchLocked is now set to `false` should the device be using legacy Audio, avoiding the unlock call running without need.
* Added `type` parameter to `VideoTexture.fromUrl` allowing you to define the mime-type of the video file, which is required for Firefox and Safari in most cases.
* PIXI.BaseTexture.forceLoaded allows you to set a BaseTexture as loaded, with the given width and height. It then calls `BaseTexture.dirty`. This is important for when you don't want to modify the shape of the source object by forcing in `complete` or dimension properties it may not naturally have, but still wish to use it as a base texture.
* SoundManager.volume now has its input value clamped to ensure it's between 0 and 1 (inclusive)
* Removed `Input.moveCallback` and `Input.moveCallbackContext` as neither are used any longer. Use `Input.addMoveCallback`.
* SoundManager now uses the new `Touch.addTouchLockCallback` methods to handle mobile device audio unlocking.
* If a BitmapData is created with a width or height set to zero then the width and/or height are set to a default value (256) instead to avoid getContext errors.
* RetroFont has been updated to use RenderTexture.renderXY, removing the need for creating a Point object each update.
* RetroFont no longer puts any entries into the TextureCache or generates any UUIDs on instantiation, speeding up creation and lowering memory use.
* BitmapData.update now validates the `width` and `height` values to ensure they aren't lower than 1, which would previously cause a context error.
* Texture.requiresReTint is a new property that controls if a texture requires the display object to be re-tinted having been updated internally. The LoadTexture component now sets this.
* PIXI.Sprite.tintedTexture contains a canvas object that holds the tinted version of the Sprite. This is only populated in Canvas, not in WebGL.
* ScaleManager.scaleSprite will no longer try and scale a display object that doesn't have a scale property.
* The LoadTexture component has a new property `customRender` which is checked for in the Core postUpdate to know when to render custom elements like Videos.
* BitmapText line spacing and word wrapping has been vastly improved and bought in-line with how Pixi 3 handles it, but with additional anchor support.
* P2.Body.loadPolygon now allows the `key` parameter to be passed as `null` - when this happens the `object` parameter can be the actual physics object data instead of a string pointing to the cache, allowing you to take advantage of adding multiple convex shapes with automatic adjustments for center of mass #1801
* Tilemap.addTilesetImage can now accept a BitmapData as the `key` parameter and will use the BitmapData to render the tileset with instead of an image from the cache (thanks to @unstoppablecarl for the idea #1838)
* Device now uses a new way to detect when Phaser is running under a NW.js (formerly Node-WebKit) environment, using feature detection, instead of relying on a guarded require statement. The former way was the source of a known incompatibility with browserify and similar tools (thanks @rblopes #1851)
* Sprite vs. Tilemap collision can now check if the sprite overlaps the tilemap without trying to separate it (thanks @Preece #1810)
* The Asset Pack JSON Format example has been updated to include new and missing file formats (thanks @rblopes #1808)
* RenderTexture now takes the display objects alpha into consideration when rendering it, before it would always reset worldAlpha to 1 before rendering, thus ignoring any alpha that may be set.
* P2.enableBody now checks if an anchor exists on target object before attempting to set its value (thanks @standardgaussian  #1885)
* Debug.currentAlpha wasn't being used to set the alpha of the Debug context at all (was always set to 1) but now updates the alpha of the Debug context before anything is rendered to it (thanks @wayfu #1888)
* If the device is detected as a Windows Phone the renderer is automatically set to use Canvas, even if WebGL or AUTO was requested (thanks @ramarro123 #1706)
* RandomDataGenerator.weightedPick has been tweaked slightly to allow for a more even distribution of weights. It still favors the earlier array elements, but will accurately include 'distance' elements as well (thanks @gingerbeardman #1751)
* BitmapData.clear has 4 new optional parameters: x, y, width and height, that define the area to be cleared. If left undefined it works exactly the same as before and clears the entire canvas.
* Added Phaser.Keyboard.COMMA and Phaser.Keyboard.PERIOD to the consts list.
* Canvas.setSmoothingEnabled only applies the value of the property exists, which avoids the Chrome webkit prefix deprecation warnings.
* PIXI._CompileShader can now take an array or a string for the fragment src.
* AnimationParser.spriteSheet can now accept either a string-based key or an HTML Image object as the key argument.
* LoaderParser.bitmapFont, xmlBitmapFont and jsonBitmapFont all now return the font data rather than write it to the now deprecated PIXI.BitmapText.fonts global array.
* PIXI.BitmapText has been removed as a global array, as it is no longer used.
* PIXI has been made available for Phaser when using requireJS (thanks @mkristo #1923)
* Internally the Time class has been updated to split out the RAF and SetTimeout implementations. This cuts down the update loop workload significantly, which was causing a performance optimization bottleneck in V8.
* TweenData.update now uses the `Time.elapsedMS` value for its delta calculation, instead of the physicsStep - this is because tweens are inherently time duration based and on a lagging system they were not properly completing when they should do (also addresses #1819)
* World.stateChange is a new method that is called whenever the state changes or restarts. It resets the world x/y coordinates back to zero and then resets the Camera.
* All undefined argument checks were changed from `if (typeof x === 'undefined')` to `if (x === undefined)` removing the typeof check and saving some bytes across the codebase in the process.
* Text.updateText will now check the width and height values of the Text canvas and if either are zero it sets `Text.renderable = false` to avoid throwing WebGL texture binding errors.
* WebGL context loss and restoration is now handled directly by Phaser.
* Cache.clearGLTextures empties out all of the GL Textures from Images stored in the cache. This is called automatically when the WebGL context is lost and then restored.

### Bug Fixes

* The LoadTexture component has had a redundant `dirty` call removed from it that was causing textures to be re-uploaded to the GPU even though they may already have been on it.
* TileSprites were missing a `physicsType` property, causing them to not collide with anything (thanks @numbofathma #1702)
* Sprite was missing the Health and InCamera components.
* A Tween could be incorrectly set to never end if it was given a duration of zero (thanks @hardalias #1710)
* Added guards around `context.getImageData` calls in BitmapData, Text and Canvas Tinting classes to avoid crashing restricted browsers like Epic Browser. Please understand that several Phaser features won't work correctly with this browser (thanks @Erik3000 #1714)
* P2 Body.destroy now checks for the existence of a `sprite` property on the body before nulling it (thanks @englercj #1736)
* The version of p2.js being used in 2.3.0 wasn't correctly declaring itself as a global for browserify / requireJS. This update resolves that (thanks @dgoemans #1723)
* AnimationManager.frameName setter wasn't checking if `_frameData` existed before accessing it (thanks @nesukun #1727)
* P2.getConstraints would return an array of null objects. It now returns the raw p2 constraint objects (thanks @valueerrorx #1726)
* TilemapLayer docs incorrectly reported it as extending Phaser.Image, but it doesn't share the same components so has been updated.
* TilemapLayer was missing the Input component (thanks @uhe1231 #1700)
* PIXI.Graphics in Canvas mode wouldn't respect the objects visible or alpha zero properties, rendering it regardless (thanks @TimvdEijnden #1720)
* Enabling Arcade Physics would add the deltaCap property onto Phaser.Time, even though the property doesn't exist any more, changing the class shape in the process.
* Phaser.StateManager would incorrectly call `loadUpdate` while the game was paused or if the State didn't have an `update` method defined even after the loader was completed.
* Phaser.StateManager would incorrectly call `loadRender` while the game was paused or if the State didn't have an `render` method defined even after the loader was completed.
* Added the missing `preRender` function to the Phaser.State class template.
* Fixed bug in Pixi where RenderTexture.render would ignore the given matrix.
* Fixed a bug in Pixi where drawing a Sprite to a RenderTexture would reset the Sprites transform to an identity Matrix.
* The SoundManager didn't accurately detect devices or browser environments with no sound card present and would try to carry on using a null Web Audio context (thanks @englercj #1746)
* The Tween.onStart signal wasn't dispatched if the Tween had a delay set. It's now dispatched immediately if no delay, or after the delay if set. It also respects the `autoStart` parameter and will still dispatch even if `autoStart` is true.
* Input.addMoveCallback used to return the index of the callback entry in the internal `moveCallbacks` array. However as callbacks were removed the indexes became invalid, potentially causing a future `Input.deleteMoveCallback` to remove the wrong callback entirely or error. Input.deleteMoveCallback now takes the original callback and context as its parameters to ensure deletion safety.
* Graphics constructor now sets x/y parameters to zero if undefined. Before it would set them to undefined as the type check wasn't strict.
* Math.isOdd now returns an actual boolean value instead of 1 (thanks @formigone #1792)
* Rope constructor was fixed enabling it again (thanks @gionatan7 #1799)
* FrameData.getFrameIndexes when called with a partial array (such as creating an animation out of a set of frames) would return the indexes array padded out with 'undefined' entries, causing short animations to never fully play through.
* AnimationManager.add no longer sets the `currentFrame` property when just adding an Animation to a Sprite. The `currentFrame` property is now only set when the animation begins playing. This avoids the Sprite.frame and Sprite.frameName properties from returning incorrect results after adding (but not playing) an Animation. It also allows very short animations (2 frames) to play correctly without needing to loop.
* PIXI.Graphics was calling Polygon.flatten in its drawShape call, causing the original Polygon object to internally change. It now takes a clone of the polygon and only flattens that (#1779)
* Tween.generateData didn't set a default value for the `frameRate` parameter if undefined, causing an infinite loop (thanks @rblopes #1782 #1785)
* Fixed the Pixelate filter, changing the `dimensions` uniform to a 2f and removing un-needed vecs from the fragment src. Also fixed the size getter and added sizeX and sizeY getters/setters (#1780)
* Tween.to and Tween.from can now accept `null` as the ease parameter value. If `null` it will use the default tween, as per the documentation (thanks @nkovacs #1817)
* TilemapParser.parseTiledJSON would ignore 'falsy' properties set on Objects in Tiled JSON tilemaps, such as `x: 0` or `visible: false`. These properties are now accurately copied over to the destination map data (thanks @MaksJS #1818)
* Removed un-necessary PIXI.TextureCache pollution in Phaser.LoaderParser.bitmapFont.
* Sound.resume wouldn't properly restart looped sounds in Chrome after being paused. Phaser now specifically handles the Chrome 42 bug and later fix (thanks @nkovacs #1820)
* Setting the BitmapText.maxWidth property would throw an error (thanks @drhayes #1807)
* If running under Cordova and iOS the Game.lockRender boolean will be set to `true` when the game pauses and `false` when it resumes. This avoids the `gpus_ReturnNotPermittedKillClient` app crash on iOS (thanks @cncolder #1800)
* Sound.restart and Sound.stop now properly disconnect the sound from the gainNode (or external node) before stopping it, allowing restart to work correctly (thanks @eofs #1796)
* When loading an Audio Sprite from an Asset Pack the wrong Loader method was being used (thanks @boniatillo-com #1777)
* Due to a Pixi 2 issue TileSprite when running under WebGL didn't respect the world alpha setting and would only work with its own alpha (thanks @hanenbro #1774)
* TileSprite now fully supports animation again, having been broken for several versions due to a Pixi upgrade. We've updated the way TileSprites generate their textures internally considerably and animation support is back across both Canvas and WebGL as a result (#1653)
* Setting mute to false on Sound that was never muted caused its volume to be set to zero (thanks @brianbunch #1870)
* P2.Body.createGroupCallback incorrectly referenced the `_groupCallbackContext` when deleting it (thanks @Langerz82 #1886)
* When reusing a Tween created with an array of properties the values would get exponentially added to the TweenData internal array each time the tween was re-run (thanks @SBCGames #1747)
* Reading the dimensions of a Text object would reset its resolution property (thanks @joelika #1717)
* Text.addColor would incorrectly color the text stroke if set (thanks @llevkin #1893)
* Setting the scaleMode property of a Game configuration object would cause a ScaleManager TypeError in the resize method. It now stores the scale mode locally and applies it after boot (thanks @Mickawesomesque #1534)
* Device.windowsPhone should now correctly identify Windows Phone 8.1 devices, which also think they are iOS and Androids. If you find a device that gets around this check please send us its ua string! (thanks @jounii #1496)
* Rope.segments used the wrong vertices property, causing a runtime error.
* Debug.ropeSegments didn't take the scale of the Rope object into consideration, causing incorrect debug rendering.
* If a Sound was muted, or had its volume changed while it was still decoding (i.e. before it started playback) then the mute and/or volume were ignored and the sound would play anyway (thanks @brianbunch #1872)
* Group.addMultiple if given a Group.children array as the first parameter would fail as the original group length was decreased out of line with the children being added. Group.addMultiple now checks if the children argument is a Phaser.Group instance, and if so it uses Group.moveAll instead on it (thanks @AnderbergE #1898)
* PIXI.DisplayObject.updateTransform now nulls the _currentBounds property (thanks @gaufqwi #1906)
* Improved the JSON BitmapText implementation (thanks @Feenposhleen #1912 #1837)
* game.make.group did not setup parent correctly (thanks @mthurlin #1911)
* Fix reference error for process in the Device class (thanks @mkristo #1922)
* Sprites with Arcade Physics bodies that had `collideWorldBounds` enabled would be moved to the wrong position if you restarted a State (or swapped to a new State) that reset the world bounds (thanks @vulvulune #1775)
* PIXI.BaseTexture.fromCanvas now checks the canvas dimensions and if either face is zero it sets them to 1px to avoid WebGL texture binding errors.

### Deprecated

All of the following have been removed from Phaser 2.4.
They were flagged as deprecated in Phaser 2.2 or earlier.

* Camera.screenView
* ScaleManager.maxIterations
* ScaleManager.enterPortrait (see onOrientationChange)
* ScaleManager.enterLandscape (see onOrientationChange)
* ScaleManager.enterFullScreen (see onFullScreenChange)
* ScaleManager.leaveFullScreen (see onFullScreenChange)
* ScaleManager.fullScreenFailed (see onFullScreenError)
* ScaleManager.checkResize
* ScaleManager.checkOrientation
* ScaleManager.setScreenSize (see updateLayout)
* ScaleManager.setSize (see reflowCanvas)
* ScaleManager.checkOrientationState (see reflowCanvas)
* ScaleManager.orientation (see screenOrientation)
* Gamepad.disabled (see enabled)
* Input.currentPointers (see totalActivePointers)
* Input.disabled (see enabled)
* Keyboard.disabled (see enabled)
* Mouse.disabled (see enabled)
* Mouse.mouseMoveCallback (see Input.addMoveCallback)
* MSPointer.disabled (see enabled)
* Touch.disabled (see enabled)
* Cache.getUrl (see getURL)
* Math.truncate (see Math.trunc)
* Math.snapToInArray (see Phaser.ArrayUtils.findClosest)
* Math.interpolateFloat (see Math.linear)
* Math.normalizeLatitude (use Phaser.Math.clamp(lat, -90, 90))
* Math.normalizeLongitude (use Phaser.Math.wrap(lng, -180, 180))
* Math.chanceRoll (use Phaser.Utils.chanceRoll)
* Math.numberArray (use Phaser.ArrayUtils.numberArray)
* Math.numberArrayStep (use Phaser.ArrayUtils.numberArrayStep)
* Math.limitValue (use Phaser.Math.clamp)
* Math.randomSign (use Phaser.Utils.randomChoice(-1, 1))
* Math.angleLimit (use Phaser.Math.clamp)
* Math.getRandom (use Phaser.ArrayUtils.getRandomItem)
* Math.removeRandom (use Phaser.ArrayUtils.removeRandomItem)
* Math.floor (use Math.trunc)
* Math.ceil (use Phaser.Math.roundAwayFromZero)
* Math.shift (use Phaser.ArrayUtils.rotate)
* Math.shuffleArray (use Phaser.ArrayUtils.shuffle)
* Math.distanceRounded (do the rounding locally)
* Canvas.getOffset (see Phaser.DOM.getOffset)
* Canvas.getAspectRatio (see Phaser.DOM.getAspectRatio)
* TilemapLayer.tileColor (use TilemapLayer.debugSettings.missingImageFill)
* Phaser.ArrayList alias removed, now use Phaser.ArraySet
* Utils.transposeArray (see Phaser.ArrayUtils.transposeMatrix)
* Utils.rotateArray (see Phaser.ArrayUtils.rotateMatrix)
* Utils.shuffle (see Phaser.ArrayUtils.shuffle)

## Version 2.3.0 - "Tarabon" - 26th March 2015

### Significant Updates

#### Game Objects and Components

All of the core Game Objects have received an important internal restructuring. We have moved all of the common functions to a new set of Component classes. They cover functionality such as 'Crop', 'Physics Body', 'InCamera' and more. You can find the source code to each component in the `src/gameobjects/components` folder of the repo.

All of the Game Object classes have been restructured to use the new component approach. This puts an end to the "God classes" structure we had before and removes literally hundreds of lines of duplicate code. It also allowed us to add features to Game Objects; for example Bitmap Text objects are now full-class citizens with regard to physics capabilities.

Although this was a big internal shift from an API point of view not much changed - you still access the same methods and properties in the same way as before. Phaser is just a lot leaner under the hood now.

It's worth mentioning that from a JavaScript perspective components are  mixins applied to the core game objects when Phaser is instantiated. They are not added at run-time or are dynamic (they never get removed from an object once added for example). Please understand that this is by design.

You can create your own custom Phaser classes, with your own set of active components by copying any of the pre-existing Game Objects and modifying them.

#### Custom Builds

As a result of the shift to components we went through the entire source base and optimised everything we could. Redundant paths were removed, debug flags removed and new stub classes and hooks were created. What this means is that it's now easier than ever to "disable" parts of Phaser and build your own custom version.

We have always included a couple of extra custom builds with Phaser. For example a build without P2 Physics included. But now you can strip out lots of additional features you may not require, saving hundreds of KB from your build file in the process. Don't use any Sound in your game? Then you can now exclude the entire sound system. Don't need Keyboard support? That can be stripped out too.

As a result of this work the minimum build size of Phaser is now just 83KB (minified and gzipped).

Please see the README instructions on how to create custom builds.

#### Arcade Physics

We've updated the core of Arcade Physics in a number of significant ways.

First we've dropped lots of internal private vars and moved to using non-cached local vars. Array lengths are no longer cached and we've implemented `physicsType` properties on Game Objects to speed-up the core World collideHandler. All of these small changes have lead to a nice improvement in speed as a result, and also allows us to now offer things like physics enabled BitmapText objects.

More importantly we're now using a spacial pre-sort for all Sprite vs. Group and Group vs. Group collisions. You can define the direction the sort will prioritize via the new `sortDirection` property. By default it is set to `Phaser.Physics.Arcade.LEFT_RIGHT`. For example if you are making a horizontally scrolling game, where the player starts on the left of the world and moves to the right, then this sort order will allow the physics system to quickly eliminate any objects to the right of the player bounds. This cuts down on the sheer volume of actual collision checks needing to be made. In a densely populated level it can improve the fps rate *dramatically*.

There are 3 other directions available (`RIGHT_LEFT`, `TOP_BOTTOM` and `BOTTOM_TOP`) and which one you need will depend on your game type. If you were making a vertically scrolling shoot-em-up then you'd pick `BOTTOM_TOP` so it sorts all objects above and can bail out quickly. There is also `SORT_NONE` if you would like to pre-sort the Groups yourself or disable this feature.

Another handy feature is that you can switch the `sortDirection` at run-time with no loss of performance. Just make sure you do it *before* running any collision checks. So if you had a large 8-way scrolling world you could set the `sortDirection` to match the direction the player was moving in and adjust it in real-time, getting the benefits as you go. My thanks to Aaron Lahman for inspiring this update.

#### Phaser.Loader

The Phaser.Loader has been updated to support parallel downloads which is now enabled by default (you can toggle it via the `Loader.enableParallel` flag) as well as adding future extensibility points with a pack/file unified filelist and an inflight queue.

There are no *known* incompatibilities with the previous Loader. Be aware that with parallel downloading enabled the order of the Loader events may vary (as can be seen in the "Load Events" example).

The parallel file concurrency limit is available in `Loader.maxParallelDownloads` and is set to 4 by default. Under simulated slower network connections parallel loading was a good bit faster than sequential loading. Even under a direct localhost connection parallel loading was never slower, but benefited most when loading many small assets (large assets are more limited by bandwidth); both results are fairly expected.

The Loader now supports synchronization points. An asset marked as a synchronization point must be loaded (or fail to load) before any *subsequent* assets can be loaded. This is enabled by using the `withSyncPoint` and `addSyncPoint` methods. Packs ('packfile' files) and Scripts ('script' files) are treated as synchronization points by default. This allows parallel downloads in general while allowing synchronization of select resources if required (packs, and potentially other assets in the future, can load-around synchronization points if they are written to delay final 'loading').

Additional error handling / guards have been added, and the reported error message has been made more consistent. Invalid XML (when loading) no longer throws an exception but fails the particular file/asset that was being loaded.

Some public methods/properties have been marked as protected, but no (except in case of a should-have-been-private-method) public-facing interfaces have been removed. Some private methods have been renamed and/or removed.

A new XHR object is created for each relevant asset (as there must be a different XHR for each asset loaded in parallel). Online searches indicated that there was no relevant benefit of XHR (as a particular use-case) re-use; and time will be dominated with the resource fetch. With the new flight queue an XHR cache could be re-added, at the cost of some complexity.

The URL is always transformed through transformUrl, which can make adding some one-off special cases like #1355 easier to deal with.

This also incorporates the fast-cache path for Images tags that can greatly speed up the responsiveness of image loading.

Loader.resetLocked is a boolean that allows you to control what happens when the loader is reset, *which happens automatically on a State change*. If you set `resetLocked` to `true` it allows you to populate the loader queue in one State, then swap to another State without having the queue erased, and start the load going from there. After the load has completed you could then disable the lock again as needed.

Thanks to @pnstickne for vast majority of this update.

#### Pixi v2

We are now using our own custom build of Pixi v2. The Pixi project has moved all development resources over to Pixi v3, but it wasn't ready in time for the release of Phaser 2.3 so we've started applying our own fixes to the version of Pixi that Phaser uses.

As a result we have removed all files from the `src/pixi` folder that Phaser doesn't use, in order to make this distinction clearer. This includes `EventTarget`, so if you were relying on that in your game you'll need to add it back in to your local build.

We've also removed functions and properties from Pixi classes that Phaser doesn't require: such as the Interaction Manager, Stage.dirty, etc. This has helped us cut down the source code size and make the docs less confusing, as they no longer show properties for things that weren't even enabled.

We've rolled our own fixes into our version of Pixi, ensuring we keep it as bug-free as possible.

### New Features

* `Physics.Arcade.isPaused` allows you to toggle Arcade Physics processing on and off. If `true` the `Body.preUpdate` method will be skipped, halting all motion for all bodies. Note that other methods such as `collide` will still work, so be careful not to call them on paused bodies.
* `Arcade.Body.friction` allows you to have more fine-grained control over the amount of velocity passed between bodies on collision.
* BitmapData.text will render the given string to the BitmapData, with optional font, color and shadow settings.
* MSPointer.capture allows you to optionally event.preventDefault the pointer events (was previously always on)
* MSPointer.event now stores the most recent pointer event.
* MSPointer.pointerDownCallback, pointerMoveCallback and pointerUpCallback all allow you to set your own event based callbacks.
* MSPointer.button now records which button was pressed down (if any)
* Phaser now supports rotated and flipped tiles in tilemaps, as exported from the Tiled map editor (thanks @nkholski #1608)
* TilemapParser now supports Tiled 0.11 version maps which includes the `rotation` property on all Object types.
* Tilemap.createFromObjects now checks for a `rotation` property on the Object and if present will set it as the Sprite.angle (#1433)
* If for whatever reason you wish to hide the Phaser banner in the console.log you can set `window.PhaserGlobal.hideBanner` to `true` and it will skip the output. Honestly I'd rather if you didn't, but the option is now there.
* TilemapLayer.setScale will allow you to apply scaling to a specific Tilemap layer, i.e. `layer.setScale(2)` would double the size of the layer. The way the Camera responds to the layer is adjusted accordingly based on the scale, as is Arcade collision (thanks @mickez #1605)
* SoundManager.setDecodedCallback lets you specify a list of Sound files, or keys, and a callback. Once all of the Sound files have finished decoding the callback will be invoked. The amount of time spent decoding depends on the codec used and file size. If all of the files given have already decoded the callback is triggered immediately.
* Sound.loopFull is a new method that will start playback of the Sound and set it to loop in its entirety.
* left, right, top and bottom are new properties that contain the totals of the Game Objects position and dimensions, adjusted for the anchor. These are available on any Game Object with the Bounds Component.
* Sprite.offsetX and Sprite.offsetY contain the offsets from the Sprite.x/y coordinates to the top-left of the Sprite, taking anchor into consideration.
* Emitter.flow now works in a slightly different (and more useful!) way. You can now specify a `quantity` and a `total`. The `quantity` controls how many particles are emitted every time the flow frequency is met. The `total` controls how many particles will be emitted in total. You can set `total` to be -1 and it will carry on emitting at the given frequency forever (also fixes #1598 thanks @brianbunch)
* ArraySet.removeAll allows you to remove all members of an ArraySet and optionally call `destroy` on them as well.
* GameObject.input.dragStartPoint now stores the coordinates the object was at when the drag started. This value is populated when the drag starts. It can be used to return an object to its pre-drag position, for example if it was dropped in an invalid place in-game.
* Text.padding specifies a padding value which is added to the line width and height when calculating the Text size. Allows you to add extra spacing if Phaser is unable to accurately determine the true font dimensions (#1561 #1518)
* P2 Capsule Shapes now support BodyDebug drawing (thanks @englercj #1686)
* Game Objects now have a new `physicsType` property. This maps to a Phaser const such as `SPRITE` or `GROUP` and allows Phaser to sort out pairings for collision checks in the core World collide handler much quicker than before.
* BitmapText objects can now have physics enabled on them. When the physics body is first created it will use the dimensions of the BitmapText at the time you enable it. If you update the text it will adjust the body width and height as well, however any applied offset will be retained.
* BitmapText objects now have an `anchor` property. This works in a similar way to Sprite.anchor except that it offsets the position of each letter of the BitmapText by the given amount, based on the overall BitmapText width - whereas Sprite.anchor offsets the position the texture is drawn at.

### Updates

* TypeScript definitions fixes and updates (thanks @Phaiax @Bilge @clark-stevenson @TimvdEijnden @belohlavek @ivw @vulvulune @zeh @englercj)
* There is a new TypeScript defs file (phaser.comments.d.ts) which now has all of the jsdocs included! (thanks @vulvulune #1559)
* Sound.fadeTween is now used for Sound.fadeIn and Sound.fadeOut audio tweens.
* Sound.stop and Sound.destroy now halt a fade tween if in effect.
* Arcade Physics `computeVelocity` now allows a max velocity of 0 allowing movement to be constrained to a single axis (thanks @zekoff #1594)
* Added missing properties to the InputHandler prototype, reducing hidden class modifications.
* Updated docstrap-master toc.js to fix nav scrolling (thanks @abderrahmane-tj @vulvulune #1589)
* Added missing plugins member in Phaser.Game class (thanks @Bilge #1568)
* Lots of JSDocs fixes (thanks @vulvulune @micahjohnston @Marchys @JesseAldridge)
* TilemapLayer.getTiles now returns a copy of the Tiles found by the method, rather than references to the original Tile objects, so you're free to modify them without corrupting the source (thanks @Leekao #1585)
* Sprite.events.onDragStart has 2 new parameters `x` and `y` which is the position of the Sprite *before* the drag was started. The full list of parameters is: `(sprite, pointer, x, y)`. This allows you to retain the position of the Sprite prior to dragging should `dragFromCenter` have been enabled (thanks @vulvulune #1583)
* Body.reset now resets the Body.speed value to zero.
* Device.touch checks if `window.navigator.maxTouchPoints` is `>= 1` rather than `> 1`, which allows touch events to work properly in Chrome mobile emulation.
* Loader.XDomainRequest wasn't used for atlas json loading. It has now been moved to the `xhrLoad` method to ensure it's used for all request if required (thanks @draconisNoctis #1601)
* Loader.reset has a new optional 2nd parameter `clearEvents` which if set to `true` (the default is false) will reset all event listeners bound to the Loader.
* If `Body.customSeparateX` or `customSeparateY` is `true` then the Body will no longer be automatically separated from a **Tilemap** collision or exchange any velocity. The amount of pixels that the Body has intersected the tile is available in `Body.overlapX` and `overlapY`, so you can use these values to perform your own separation in your collision callback (#992)
* TilemapParser will now set the `.type` property for ObjectLayer Objects (thanks @mikaturunen #1609)
* The Loader now directly calls StateManager.loadComplete rather than the StateManager listening for the loadComplete event, because Loader.reset unbinds this event (and it's easy to accidentally remove it too)
* Loader.onLoadComplete is dispatched *before* the Loader is reset. If you have a `create` method in your State please note that the Loader will have been reset before this method is called. This allows you to immediately re-use the Loader without having to first reset it manually.
* World.setBounds will now adjust the World.x/y values to match those given (#1555)
* ArcadePhysics.distanceToPointer now calculates the distance in world space values.
* Sound.fadeIn now supports fading from a marker, as well as the entire audio clip, so now works with audio sprites (thanks @vorrin #1413)
* Text font components can now be specified as part of "style". There is a breaking change in that the `fontWeight` now only handles the CSS font-weight component. The `fontStyle` property handles 'italic', 'oblique', values from font-style. This makes the overall consistency cleaner but some code may need to be updated. This does not affect font-weight/font-style as with setStyle({font:..}). Also fixes overwrite font/size/weight oddities - which may result in different behavior for code that was relying on such. All of the text examples appear to work and modification using the new features (while respecting the change in previous behavior) work better (thanks @pnstickne #1375 #1370)
* Loader.audiosprite has a new `jsonData` parameter. It allows you to pass a pre-existing JSON object (or a string which will be parsed as JSON) to use as the audiosprite data, instead of specifying a URL to a JSON file on the server (thanks @jounii #1447)
* Loader.audiosprite has a new `autoDecode` parameter. If `true` the audio file will be decoded immediately upon load.
* Tile.properties is now unique to that specific Tile, and not a reference to the Tileset index bound properties object. Tile.properties can now be modified freely without impacting other tiles sharing the same id (#1254)
* PIXI.TextureSilentFail is a boolean that defaults to `false`. If `true` then `PIXI.Texture.setFrame` will no longer throw an error if the texture dimensions are incorrect. Instead `Texture.valid` will be set to `false` (#1556)
* InputHandler.enableDrag with a boundsRect set now takes into account the Sprites anchor when limiting the drag (thanks @unindented #1593)
* InputHandler.enableDrag with a boundsSprite set now takes into account both the Sprites anchor and the boundsSprite anchor when limiting the drag.
* Sound in Web Audio now uses AudioContext.onended to trigger when it will stop playing instead of using a time based value. This is only used if the sound doesn't loop and isn't an audio sprite, but will give a much more accurate `Sound.onStop` event. It also prevents short audio files from being cut off during playback (#1471) and accounts for time spent decoding.
* If you load an image and provide a key that was already in-use in the Cache, then the old image is now destroyed (via `Cache.removeImage`) and the new image takes its place.
* BitmapText has a new `maxWidth` property that will attempt to wrap the text if it exceeds the width specified.
* Group.cursorIndex is the index of the item the Group cursor points to. This replaces Group._cache[8].
* Tween.updateTweenData allows you to set a property to the given value across one or all of the current tweens. All of the Tween methods like Tween.delay and Tween.repeat have been updated to use this.
* Tween.repeat has a new parameter `repeatDelay` which allows you to set the delay (in ms) before a tween will repeat itself.
* Tween.yoyo has a new parameter `yoyoDelay` which allows you to set the delay (in ms) before a tween will start a yoyo.
* Tween.interpolation has a new parameter `context` which allows you to define the context in which the interpolation function will run.
* ArraySet.getByKey gets an item from the set based on the property strictly equaling the value given.
* A State swap now sets the Loader.reset `hard` parameter to `true` by default. This will null any Loader.preloadSprite that may have been set.
* You can now set a `resolution` property in your Game Configuration object. This will be read when the Pixi renderer instance is created and used to set the resolution within that (#1621)
* Text style has a new optional property: `backgroundColor` which is a Canvas fill style that is set behind all Text in the Text object. It allows you to set a background color without having to use an additional Graphics object.
* The Physics Manager now has a new `reset` method which will reset the active physics systems. This is called automatically on a State swap (thanks @englercj #1691)
* When a State is started and linked to Phaser it has a new property created on it: `key`, which is the string identifier used by the State.
* When the Game first boots it will now call `window.focus()`. This allows keyboard events to work properly in IE when the game is running inside an iframe. You can stop this from happening by setting `window.PhaserGlobal.stopFocus = true` (thanks @webholics #1681)
* When an Animation completes playback and isn't set to loop it would change the `currentFrame` property to be the first frame in the set after the `onComplete` callback had fired. This meant if you set a Sprite to a new frame within an Animation onComplete callback then your change would have been overwritten by the animation itself. This is now no longer the case.
* When an Emitter is destroyed via Emitter.destroy it now removes itself from the Phaser Particle Manager, freeing it up for garbage collection and stopping it from being processed.

### Bug Fixes

* SoundManager.unlock checks for audio `start` support and falls back to `noteOn` if not found.
* Sprite.frame and AnimationManager.frame wouldn't return the correct index if a sprite sheet was being used unless it had first been set via the setter.
* Error in diffX and diffY calculation in Tilemap.paste (thanks @amelia410 #1446)
* Fixed issue in PIXI.canUseNewCanvasBlendModes which would create false positives in browsers that supported `multiply` in Canvas path/fill ops, but not for `drawImage` (Samsung S5 for example). Now uses more accurate magenta / yellow mix test.
* Fixed FrameData.getFrame index out of bound error (thanks @jromer94 #1581 #1547)
* In P2.Body calling adjust mass would desync the debug graphics from the real position of the body (thanks @tomlarkworthy #1549)
* Fix CORS loading of BitmapFonts with IE9 (thanks @jeppester #1565)
* TileSprites were not detecting Pointer up events correctly because of a branching condition (thanks @integricho #1580 #1551)
* TileSprites weren't destroying WebGL textures, leading to eventual out of memory errors (thanks @chacal #1563)
* P2.Body.clearCollision default values were incorrectly set to `false` if no parameters were provided, even though the docs said they were `true` (thanks @brianbunch #1597)
* BitmapText.font wouldn't update an internal Pixi property (fontName) causing the text to fail to change font (thanks @starnut #1602)
* Fixed issue in PIXI.Text where it was using the wrong string for descender text measurements.
* Sprite.loadTexture and Image.loadTexture now no longer call `updateTexture` if the texture given is a RenderTexture. This fixes issues with RetroFonts in IE11 WebGL as well as other RenderTexture related IE11 problems (#1310 #1381 #1523)
* You can now tint animated Sprites in Canvas mode. Or change the texture atlas frame of a tinted Sprite or Image. Please note that this is pretty expensive (depending in the browser), as the tint is re-applied every time the *frame changes*. The Pixi tint cache has also been removed to allow for subtle tint color shifts and to avoid blowing up memory. So use this feature sparingly! But at least it does now work (#1070)
* ArcadePhysics.moveToPointer no longer goes crazy if the maxTime parameter is given and the Sprite is positioned in a larger game world (thanks @AnderbergE #1472)
* Sound.loop even when set for WebAudio wouldn't use the AudioContext loop property because Sound.start was being invoked with an offset and duration. Now if `loop` is true and no marker is being used it will use the native Web Audio loop support (#1431)
* Timer.update was calling the TimerEvent callback even if `TimerEvent.pendingDelete` was already set to `true`, causing timer events to stack-up in cases where a new TimerEvent was generated in the callback (thanks @clowerweb  #838)
* Pointer.stop would call `event.preventDefault` if `Pointer._stateReset` was `true`, which is always `true` after a State has changed and before Pointer.start has been called. However this broken interacting with DOM elements in the case where the State changes and you immediately try to use the DOM element without first having clicked on the Phaser game. An additional guard was added so `preventDefault` will now only be called if both `_stateReste` and `Pointer.withinGame` are true (thanks @satan6 #1509)
* Group.forEach (and many other Group methods) now uses the `children.length` value directly instead of caching it, which both helps performance and stops the loop from breaking should you remove a Group child in the invoked callback.
* Phaser.Ellipse.contains is now working again (thanks @spayton #1524)
* PIXI.WebGLRenderer.destroy has been fixed to decrement the `glContextId` and remove it from the PIXI.instances global. `Game.destroy` now hooks into this. This now means that you can now delete and create your Phaser game over and over without it crashing WebGL after the 4th attempt (#1260)
* World.setBounds if called after you had already started P2 Physics would incorrectly create a new collision group for the wall objects. P2.World now remembers the settings you provide for each wall and the collision group, and re-applies these settings should the world dimensions ever change (thanks @nextht #1455)
* InputHandler was using the wrong property in `checkBoundsSprite` when fixedToCamera (thanks @yig #1613)
* Tween.to now correctly accepts arrays are destination values, which makes the Tween interpolate through each value specified in the array using the defined Tween.interpolation method (see new example, thanks @FridayMarch26th #1619)
* Tween.interpolationFunction was using the incorrect context to invoke the function. This is now defined in `TweenData.interpolationContext` and defaults to `Phaser.Math`. If you provide your own interpolation function then please adjust the context accordingly (thanks @FridayMarch26th #1618)
* Graphics.drawEllipse method was missing (thanks @jackrugile #1574)
* A TweenData wouldn't take into account the `repeatDelay` property when repeating the tween, but now does. A TweenData also has a new property `yoyoDelay` which controls the delay before the yoyo will start, allowing you to set both independently (thanks @DreadKnight #1469)
* Animation.update skips ahead frames when the system is lagging, however it failed to set the animation to the final frame in the sequence if the animation skipped ahead too far (thanks @richpixel #1628)
* Loader.preloadSprite had an extra guard added to ensure it didn't try to updateCrop a non-existent sprite (thanks @noidexe #1636)
* The `TilemapParser` has had its row / column calculations updated to account for margins and and spacing on all sides of the tileset (thanks @zekoff #1642)
* Any Tile set with alpha !== 1 would cause the whole layer to render incorrectly (thanks @nkholski #1666)
* P2 Debug Body class: The shape check in draw() needed to check for Convex last, since other shapes (like Rectangle) inherit from Convex (thanks @englercj #1674)
* P2 Debug Body class: The updateSpriteTransform() function needed to be called from the ctor. Otherwise bodies with no sprite (so no postUpdate call) would never be moved to draw in the correct position (thanks @englercj #1674)
* Animations are now guarded allowing Sprites with animations to be destroyed from within onUpdate, onLoop or onComplete events (thanks @pnstickne #1685 #1679)
* Text.lineSpacing can now accept negative values without cutting the bottom of the Text object off. The value can never be less than the height of a single line of text (thanks @anthonysapp #1690)
* Text.lineSpacing is no longer applied to the first line of Text, which prevents text from being cut off further down the Text object.
* If you paused a Sound object that is using audio markers and then resumed it, it wouldn't correctly calculate the resume duration - causing the sound to sometimes play into the marker that followed it (thanks @AnderbergE #1669)
* Animation.play wouldn't correctly set the play state on the Game Objects AnimationManager causing the animation to fail to start (calling AnimationManager.play did work however), now they're both consistently working.
* Graphics.drawArc would fail to draw any subsequent arcs if you set `beginFill` on it after drawing the first arc.
* Graphics.drawArc would only move to the center position of the first arc created and ignore any subsequent arcs.
* Graphics.drawArc now correctly renders multiple arcs across both WebGL and Canvas. You no longer need to specifically call moveTo to move into the correct place to draw the arc.
* Graphics.drawArc now bails out if the startAngle = the endAngle and/or the sweep is invalid *before* adjusting any points.
* Graphics.drawArc now correctly handles the fill on the CanvasRenderer if the arc is a subsequent arc and no line style is set.

### Pixi 2.2.8 Bug Fixes

* SpriteBatch added fix to handle batch context loss on change.
* RenderTexture resolution fix.
* WebGL Filter Resolution fix.
* TilingSprite fixes when masked in canvas mode.
* TilingSprite.destroy fixed if TilingSprite hasn't ever been rendered.

## Version 2.2.2 - "Alkindar" - 6th January 2015

### New Features

* Phaser.Loader now supports BLOB urls for audio files (thanks @aressler38 #1462)
* Line.reflect will calculate the reflected, or outgoing angle of two lines. This can be used for Body vs. Line collision responses and rebounds.
* Line.normalAngle gets the angle of the line normal in radians.
* Line.normalX and Line.normalY contain the x and y components of the left-hand normal of the line.
* Line.fromAngle will sets this line to start at the given `x` and `y` coordinates and for the segment to extend at `angle` for the given `length`.
* BitmapData.drawGroup draws the immediate children of a Phaser.Group to a BitmapData. Children are only drawn if they have their `exists` property set to `true`. The children will be drawn at their `x` and `y` world space coordinates. When drawing it will take into account the child's rotation, scale and alpha values. No iteration takes place. Groups nested inside other Groups will not be iterated through.

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @Schmavery)
* DOM.visualBounds now includes scroll bars (#1429)
* The new fixed time-step code has been more carefully linked to Pixi transform updates. This should finally put a stop to the tunneling issues that were being reported.
* Tween.stop fired a different set of onComplete parameters to Tween.update. Both now dispatch `onComplete(target, tween)`` as the parameters in that order (thanks @P0rnflake #1450)
* Removed redundant `tolerance` parameter from Rectangle.intersects (thanks @toolness #1463)
* Phaser.Graphics.drawCircle now overrides PIXI.drawCircle which means the docs are now correct re: diameter not radius (thanks @ethankaminski #1454)
* Device.webAudio check inversed to avoid throwing a warning in Chrome.
* Mouse.mouseMoveCallback is flagged as deprecated.
* Remove `tw` and `th` init from TilemapLayer (thanks @nextht #1474)
* Particles.Arcade.Emitter.makeParticles now checks the given `quantity` value against `Emitter.maxParticles`. If `quantity` is more than `maxParticles` then the `maxParticles` value is reset to the new `quantity` given (as this is how most devs seem to use it).
* Particles.Arcade.Emitter.emitParticle now returns a boolean depending if a particle was emitted or not.
* Particles.Arcade.Emitter.update only updates `_counter` if a particle was successfully emitted.
* Phaser.Point.angleSq removed. It didn't work so any code relying on it would be broken, and it's unclear what it was meant for (thanks @nextht #1396)
* BitmapData.copy `tx` parameter if `null` and `source` is a Display Object, it will default to `source.x`.
* BitmapData.copy `ty` parameter if `null` and `source` is a Display Object, it will default to `source.y`.

### Bug Fixes

* Fix / double-copy for Safari tilemap bug when rendering with delta scrolling. This fixes tilemaps not appearing to update on Safari OS X and iOS specifically (thanks @pnstickne @neurofuzzy @lastnightsparty #1439 #1498)
* Simplified call to `updateTransform`. This is the unified and verified fix for #1424 #1479 #1490 #1502 and solves issues with physics tunneling and visual glitches under the new time step code.
* Tween.delay, Tween.repeat and Tween.yoyo will no longer throw an error if called before a TweenData object has been created (via Tween.to or Tween.from) (thanks @SomMeri #1419)
* The click trampoline added for IE prevented Chrome for Android from being
able to launch Full Screen mode with the default parameters for
ScaleManager#startFullScreen (the desktop version of Chrome was not
affected.). This is now fixed and additional compatibility settings (clickTrampoline) that can be used to configure when such is used. By default the 'when-not-mouse' mode is only enabled for Desktop browsers, where the
primary input is ubiquitously a mouse. There are no known breaking compatibility changes - the Full Screen should be initiatable in Chrome for Android as it was in 2.1.x. The default Android browser does not support Full Screen (thanks @pnstickne)
* TilemapParser now checks for image collections, avoiding crashes. These would arise with maps exported from the new release of Tiled (thanks @paul-reilly #1440)
* Group.replace could still access `newChild.parent` after it was set to `undefined`. This unifies the approach (thanks @pnstickne #1410 #1417)
* P2.postBroadphaserHandler updated to avoid skipping final 2 pairs.
* The P2 World constructor wouldn't let you use your own config unless you specified both the gravity *and* broadphase. Now allows one or both (thanks @englercj #1412)
* The RandomDataGenerator could be seeded with an array of values. However if the array contained a zero it would stop seeding from that point (thanks @jpcloud @pnstickne #1456)
* Added extra checks to Sound.play to stop it throwing DOM Exception Error 11 if the `sound.readyState` wasn't set or the sound was invalid. Also wrapped `stop()`` call in a `try catch`.
* Time.reset would incorrectly reset the `_started` property, now maps it to `Time.time` (thanks @XekeDeath #1467)
* Fix floating point inaccuracy in Tween easing edge cases (thanks @jounii #1492)
* Phaser.Signal was causing a CSP script-src violations in Cordova and Google Chrome Apps (thanks @elennaro #1494)
* Added Events.onEnterBounds to the destroy method (thanks @legendary-mich #1497)
* AnimationManager.destroy is now more careful about clearing up deep references (thanks @Arturszott #1449)
* Ellipse.right and Ellipse.bottom setters fixed (thanks @nextht #1397)
* Fixed double Ellipse.getBounds definition (thanks @nextht #1397)
* TileSprite.loadTexture crashed when textures were updated in WebGL (thanks @pandavigoureux29 #1495)

### Pixi.js 2.2.0 Updates

* The strip class has now three extra properties, canvasPadding, paddingX, and paddingY : @darionco
* Added mipmap option to to textures.
* Added the ability to use GL_TRIANGLES when rendering Strips @darionco
* Added the ability to tint the Graphics.
* Fixed Y-flipped mask issue on render texture.
* Fixed the issue where you could an alpha that is more than one and it would.
* Fixed text issues when using accents.
* Fixed sprite caching not clearing the previous cached texture : @kambing86
* Fixed arcTo issues.
* Vertex buffer and and vertex shader optimisation and reduced memory footprint on the tint and alpha : @bchevalier
* Applied the new generic updateTransform to spritebatch : @kambing86

## Version 2.2.1 - "Danabar" - 4th December 2014

### Bug Fixes

* Fixed Pixi.js issue with `alpha` not working on any display object.
* Fixed TweenManager.isTweening() and .removeFrom() (thanks @jotson #1408)
* Added Game.debug reset method for when the debug manager is disabled (thanks @DanielSitarz #1407)
* Custom Particle classes that used a BitmapData wouldn't work (thanks @hardalias #1402)

## Version 2.2.0 - "Bethal" - 3rd December 2014

### New Features

* Updated to Pixi v2.2.0 - see separate change log entry below.
* Cache.getRenderTexture will retrieve a RenderTexture that is stored in the Phaser Cache. This method replaces Cache.getTexture which is now deprecated.
* Cache.autoResolveURL is a new boolean (default `false`) that automatically builds a cached map of all loaded assets vs. their absolute URLs, for use with Cache.getURL and Cache.checkURL. Note that in 2.1.3 and earlier this was enabled by default, but has since been moved behind this property which needs to be set to `true` *before* you load any assets to enable.
* You can now call Tween.to again on a Tween that has already completed. This will re-use the same tween, on the original object, without having to recreate the Tween again. This allows a single tween instance to be re-used multiple times, providing they are linked to the same object (thanks InsaneHero)
* Phaser.Color.valueToColor converts a value: a "hex" string, a "CSS 'web' string", or a number - into red, green, blue, and alpha components (thanks @pnstickne #1264)
* Stage.backgroundColor now supports CSS 'rgba' values, as well as hex strings and hex numbers (thanks @pnstickne #1234)
* Pointer.addClickTrampoline now adds in support for click trampolines. These  raise pointer events into click events, which are required internally for a few edge cases like IE11 full screen mode support, but are also useful if you know you specifically need a DOM click event from a pointer (thanks @pnstickne #1282)
* Point.floor will Math.floor both the `x` and `y` values of the Point.
* Point.ceil will Math.ceil both the `x` and `y` values of the Point.
* ScaleManager.scaleSprite takes a Sprite or Image object and scales it to fit the given dimensions. Scaling happens proportionally without distortion to the sprites texture. The letterBox parameter controls if scaling will produce a letter-box effect or zoom the sprite until it fills the given values.
* Phaser.DOM.getBounds is a cross-browser element.getBoundingClientRect method with optional cushion.
* Phaser.DOM.calibrate is a private method that calibrates element coordinates for viewport checks.
* Phaser.DOM.aspect gets the viewport aspect ratio (or the aspect ratio of an object or element)
* Phaser.DOM.inViewport tests if the given DOM element is within the viewport, with an optional cushion parameter that allows you to specify a distance.
* Phaser.DOM.viewportWidth returns the viewport width in pixels.
* Phaser.DOM.viewportHeight returns the viewport height in pixels.
* Phaser.DOM.documentWidth returns the document width in pixels.
* Phaser.DOM.documentHeight returns the document height in pixels.
* TilemapLayers have been given a decent performance boost on canvas with map shifting edge-redraw (thanks @pnstickne #1250)
* A large refactor to how the internal game timers and physics calculations has been made. We've now swapped to using a fixed time step internally across Phaser, instead of the variable one we had before that caused glitches on low-fps systems. Thanks to pjbaron for his help with all of these related changes.
* We have separated the logic and render updates to permit slow motion and time slicing effects. We've fixed time calling to fix physics problems caused by variable time updates (i.e. collisions sometimes missing, objects tunneling, etc)
* Once per frame calling for rendering and tweening to keep things as smooth as possible
* Calculates a `suggestedFps` value (in multiples of 5 fps) based on a 2 second average of actual elapsed time values in the `Time.update` method.  This is recalculated every 2 seconds so it could be used on a level-by-level basis if a game varies dramatically. I.e. if the fps rate consistently drops, you can adjust your game effects accordingly.
* Game loop now tries to "catch up" frames if it is falling behind by iterating the logic update. This will help if the logic is occasionally causing things to run too slow, or if the renderer occasionally pushes the combined frame time over the FPS time. It's not a band-aid for a game that floods a low powered device however, so you still need to code accordingly. But it should help capture issues such as gc spikes or temporarily overloaded CPUs.
* It now detects 'spiraling' which happens if a lot of frames are pushed out in succession meaning the CPU can never "catch up". It skips frames instead of trying to catch them up in this case. Note: the time value passed to the logic update functions is always constant regardless of these shenanigans.
* Signals to the game program if there is a problem which might be fixed by lowering the desiredFps
* Time.desiredFps is the new desired frame rate for your game.
* Time.suggestedFps is the suggested frame rate for the game based on system load.
* Time.slowMotion allows you to push the game into a slow motion mode. The default value is 1.0. 2.0 would be half speed, and so on.
* Time.timeCap is no longer used and now deprecated. All timing is now handled by the fixed time-step code we've introduced.
* Time.now can no longer be relied upon to contain a timestamp value. If the browser supports requestAnimationFrame then `Time.now` will contain the high resolution timer value that rAf generates. Otherwise it will contain the value of Date.now. If you require the actual time value (in milliseconds) then please use `Time.time` instead. Note that all Phaser sub-systems that used to rely on `Time.now` have been updated, so if you have any code that extends these please be sure to check it.
* Game.forceSingleUpdate will force just a single logic update, regardless of the delta timer values. You can use this in extremely heavy CPU situations where you know you're about to flood the CPU but don't want Phaser to get stuck in a spiral.
* Tilemap.createFromTiles will convert all tiles matching the given tile index (or an array of indexes) into Sprites. You can optionally then replace these tiles if you wish. This is perfect for games when you want to turn specific tiles into Sprites for extra control. The Sprites have an optional properties object which they can be populated with.
* Added support for the Wheel Event, which is the DOM3 spec (thanks @pnstickne #1318)
* Wheel Scroll Event (old non-FF) and DOM Mouse Wheel (old FF) are
supported via a non-exported reused wrapper object; WheelEventProxy.
The proxy methods are generated one-time dynamically but only when needed.
* Key.justDown allows you to test if a Key has just been pressed down or not. You can only call justDown once per key press. It will only return `true` once, until the Key is released and pressed down again. This allows you to use it in situations where you want to check if this key is down without using a Signal, such as in a core game loop (thanks @pjbaron #1321)
* Key.justUp allows you to test if a Key has just been released or not. You can only call justUp once per key press. It will only return `true` once, until the Key is pressed down and released again. This allows you to use it in situations where you want to check if this key is up without using a Signal, such as in a core game loop (thanks @pjbaron #1321)
* Device.whenReady is a new signal that you can use to tell when the device is initialized.
* Device.onInitialized is dispatched after device initialization occurs but before any of the ready callbacks have been invoked. Local "patching" for a particular device can/should be done in this event.
* TweenManager.removeFrom method allows you to remove a tween from a game object such as a Sprite (thanks @lewster32 #1279)
* Tweens have been completely rewritten. They're now much more flexible and  efficient than before:
* When specifying the ease in `Tween.to` or `Tween.from` you can now use a string instead of the Function. This makes your code less verbose. For example instead of `Phaser.Easing.Sinusoidal.Out` and you can now just use the string "Sine".The string names match those used by TweenMax and includes: "Linear", "Quad", "Cubic", "Quart", "Quint", "Sine", "Expo", "Circ", "Elastic", "Back", "Bounce", "Power0", "Power1", "Power2", "Power3" and "Power4". You can append ".easeIn", ".easeOut" and "easeInOut" variants. All are supported for each ease types.
* Tweens now create a TweenData object. The Tween object itself acts like more of a timeline, managing multiple TweenData objects. You can now call `Tween.to` and each call will create a new child tween that is added to the timeline, which are played through in sequence.
* Tweens are now bound to the new Time.desiredFps value and update based on the new Game core loop, rather than being bound to time calculations. This means that tweens are now running with the same update logic as physics and the core loop.
* Tween.timeScale allows you to scale the duration of a tween (and any child tweens it may have). A value of 1.0 means it should play at the desiredFps rate. A value of 0.5 will run at half the frame rate, 2 at double and so on. You can even tween the timeScale value for interesting effects!
* Tween.reverse allows you to instantly reverse an active tween. If the Tween has children then it will smoothly reverse through all child tweens as well.
* Tween.repeatAll allows you to control how many times all child tweens will repeat before firing the Tween.onComplete event. You can set the value to -1 to repeat forever.
* Tween.loop now controls the looping of all child tweens.
* Tween.onRepeat is a new signal that is dispatched whenever a Tween repeats. If a Tween has many child tweens its dispatched once the sequence has repeated.
* Tween.onChildComplete is a new signal that is dispatched whenever any child tweens have completed. If a Tween consists of 4 sections you will get 3 onChildComplete events followed by 1 onComplete event as the final tween finishes.
* Chained tweens are now more intelligently handled. Because you can easily create child tweens (by simply calling Tween.to multiple times) chained tweens are now used to kick-off longer sequences. You can pass as many Tween objects to `Tween.chain` as you like as they'll all be played in sequence. As one Tween completes it passes on to the next until the entire chain is finished.
* Tween.stop has a new `complete` parameter that if set will still fire the onComplete event and start the next chained tween, if there is one.
* Tween.delay, Tween.repeat, Tween.yoyo, Tween.easing and Tween.interpolation all have a new `index` parameter. This allows you to target specific child tweens, or if set to -1 it will update all children at once.
* Tween.totalDuration reports the total duration of all child tweens in ms.
* There are new easing aliases:
* * Phaser.Easing.Power0 = Phaser.Easing.Linear.None
* * Phaser.Easing.Power1 = Phaser.Easing.Quadratic.Out
* * Phaser.Easing.Power2 = Phaser.Easing.Cubic.Out
* * Phaser.Easing.Power3 = Phaser.Easing.Quartic.Out
* * Phaser.Easing.Power4 = Phaser.Easing.Quintic.Out
* ScaleManager.windowContraints now allows specifying 'visual' or 'layout' as
the constraint. Using the 'layout' constraint should prevent a mobile
device from trying to resize the game when zooming.

    Including the the new changes the defaults have been changed to

    windowContraints = { right: 'layout', bottom: '' }

    This changes the current scaling behavior as seen in "Game Scaling" (as it
will only scale for the right edge) but also prevents such scaling from
going bonkers in some mobile environments like the newer Android browser.
(Automatic scroll-to-top, albeit configurable, enabled for non-desktop by
default is not a fun situation here.)

    To obtain the current semantics on a desktop the bottom should be changed
to 'layout'; although this will result in different behavior depending on
mobile device. To make the sizing also follow mobile zooming they should
be changed to 'visual'.

    Also added temp Rectangle re-used for various internal calculations.

* Phaser.DOM now also special-cases desktops to align the layout bounds
correctly (this may disagree with CSS breakpoints but it aligns the with
actual CSS width), without applying a window height/width expansion as
required on mobile browsers.
* Signals have been heavily restructured to cut down on the number that are generated in-game. New signal proxies manage the setting and creation as required, cutting down on the volume of run-time object creation significantly. No user code needs to change, however if you did override Phaser.Signal or Sprite.Events then please be aware of the changes by inspecting the source (and commit #1389 by @pnstickne).
* Game.lockRender is a new property. If `false` Phaser will automatically render the display list every update. If `true` the render loop will be skipped. You can toggle this value at run-time to gain exact control over when Phaser renders. This can be useful in certain types of game or application. Please note that if you don't render the display list then none of the game object transforms will be updated, so use this value carefully.

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @draconisNoctis)
* The TypeScript definitions have moved to the `typescript` folder in the root of the repository.
* Cache._resolveUrl has been renamed to Cache._resolveURL internally and gained a new parameter. This method is a private internal one.
* Cache.getUrl is deprecated. The same method is now available as Cache.getURL.
* Loader.useXDomainRequest used to be enabled automatically for IE9 but is now always set to `false`. Please enable it only if you know your server set-up / CDN requires it, as some most certainly do, but we're finding them to be less and less used these days, so we feel it's safe to now disable this by default (#1248)
* Game.destroy now destroys either the WebGLRenderer or CanvasRenderer, whichever Pixi was using.
* Particle.Emitter will now automatically set `particle.body.skipQuadTree` to `true` to help with collision speeds within Arcade Physics.
* Particle.Emitter.explode (or `Emitter.start` with the `explode` parameter set to `true`) will immediately emit the required quantity of particles and not delay until the next frame to do so. This means you can re-use a single emitter across multiple places in your game that require explode-style emissions, just by adjusting the `emitter.x` and `emitter.y` properties before calling explode (thanks Insanehero)
* Phaser.Polygon has been refactored to address some Pixi v2 migration issues (thanks @pnstickne for the original implementation #1267)
* Polygon.area is now only calculated when the Polygon points list is modified, rather than on every call.
* Phaser.Polygon can now accept the points list in a variety of formats: Arrays of Points, numbers, objects with public x/y properties or any combination of, or as a parameter list (thanks @pnstickne for the original implementation #1267)
* All of the Input classes now use the more consistent `enabled` property instead of `disabled`. I.e. you can now check `if (input.mouse.enabled)` rather than `if (!input.mouse.disabled)`. The disabled property has been moved to a getter for backwards compatibility but is deprecated and will be removed in a future version (thanks @pnstickne #1257)
* The Input class has been given a minor refactor to tidy things up. Specifically:
    * pointerN are aliases to backed pointers[N-1] array. This simplifies (and increases the efficiency of) looping through all the pointers when applicable; also eliminates pointer-existence checks Removes various hard-coded limits (added MAX_POINTERS); changed maxPointers default
    * Removed some special-casing from cases where it did not matter
    * Removed === false/true, == usage for consistency, changed missing value check to typeof, etc.
    * Updated documentation for specificity; added @public\@protected
    * @deprecated currentPointers due to odd set pattern; totalCurrentPointers is more appropriate.
(thanks @pnstickne #1283)
* Various ScaleManager fixes and updates (thanks @pnstickne):
    * Scale modes can now be set independently
    * Switching between fullscreen and normal correctly restores modes
    * Alignment does not incorrectly offset in fullscreen mode (#1255)
    * Changing scale/alignment promptly refreshes layout
    * `isFullScreen` returns a boolean, as it should
    * Faster parent checks (if required)
    * NO_SCALE should not not scale (vs previous behavior of having no behavior)
    * Correct usage of scaleMode depending on mode
    * Fullscreen Mode always scaling to fill screen in Firefox (#1256)
* AudioSprite - removed an unnecessary if-statement (thanks @DaanHaaz #1312)
* ArcadePhysics.skipQuadTree is now set to `true` by default. A QuadTree is a wonderful thing if the objects in your game are well spaced out. But in tightly packed games, especially those with tilemaps or single-screen games, they are a considerable performance drain and eat up CPU. We've taken the decision to disable the Arcade Physics QuadTree by default. It's all still in there and can be re-enabled via `game.physics.arcade.skipQuadTree = false`, but please only do so if you're sure your game benefits from this.
* Phaser.DOM now houses new DOM functions. Some have been moved over from ScaleManager as appropriate.
* Key.justPressed has been renamed to Key.downDuration which is a much clearer name for what the method actually does. See Key.justDown for a nice clean alternative.
* Key.justReleased has been renamed to Key.upDuration which is a much clearer name for what the method actually does. See Key.justUp for a nice clean alternative.
* Keyboard.justPressed has been renamed to Keyboard.downDuration which is a much clearer name for what the method actually does.
* Keyboard.justReleased has been renamed to Keyboard.upDuration which is a much clearer name for what the method actually does.
* Keyboard.downDuration, Keyboard.upDuration and Keyboard.isDown now all return `null` if the Key wasn't found in the local keys array.
* The Phaser.Device class has been made into a singleton and removed it's dependency on Phaser.Game (thanks @pnstickne #1328)
* ArrayList has been renamed to `ArraySet` (as it's actually a data set implementation) and moved from the `core` folder to the `utils` folder (thanks @pnstickne)
* If you are reloading a Phaser Game on a page that never properly refreshes (such as in an AngularJS project) then you will quickly run out of AudioContext nodes. If this is the case create a global var called `PhaserGlobal` on the window object before creating the game. The active AudioContext will then be saved to `window.PhaserGlobal.audioContext` when the Phaser game is destroyed, and re-used when it starts again (#1233)
* Camera.screenView is now deprecated. All Camera culling checks are made against Camera.view now instead.
* Various CocoonJS related hacks removed thanks to fixes from Ludei directly in CocoonJS! Woohoo :)
* Phaser.HEADLESS check removed from the core game loop. If you need to disable rendering you can now override the Phaser.Game.updateRender method instead with your own.
* Group.forEach fixed against browser de-optimization (thanks @pnstickne #1357)
* Phaser.Signals have been taken on a diet. They have been updated such that there is significantly less penalty for having many unused signals. The changes include:
* * Changing it so there is no dispatch *closure* created. This is a
potentially breaking change for third party code.
* * In the rare case that code needs to obtain a dispatch-closure, the
`boundDispatch` property can be used to trivially obtain a cached
closure.
* * The properties and default values are moved into the prototype; and the
_bindings array creation is deferred. This change, coupled with the
removal of the automatic closure, results in a very lightweight
~24bytes/object (in Chrome) for unbound signals.
* With this change in place Signals now consume less than 50KB / 50KB (shallow / retained memory) for 200 sprites, where-as before they used 300KB / 600KB (thanks @pnstickne #1359)
* Time.elapsedMS holds the number of milliseconds since the last Game loop, regardless of raF or setTimeout being used.
* Incorrectly prepared tilemap images (with dimensions not evenly divisible by the tile dimensions) would render incorrectly when compared to the display seen in Tiled. The Phaser tilemap code has been adjusted to match the way Tiled deals with this, which should help if you're using tileset images that contain extra padding/margin pixels. Additional console warnings have been added. However the fact remains that you should carefully prepare your tilesets before using them. Crop off extra padding, make sure they are the right dimensions (thanks @SoulBeaver for the report and @pnstickne for the fix #1371)
* Text.setShadow has had the default `color` value changed from `rgba(0,0,0,0)` to `rgba(0,0,0,1)` so it appears as a black shadow by default - before the alpha channel made it invisible.
* Math.getRandom will now return `null` if random selection is missing, or array has no entries (thanks @pnstickne #1395)
* Array.transposeArray has had a small off-by-one error fixed. It didn't effect the results but meant returned arrays were 1 element bigger than needed (thanks @nextht #1394)
* State.preRender is now sent two parameters: a reference to the Phaser.Game instance and a new parameter: `elapsedTime` which is the time elapsed since the last update.

### Bug Fixes

* Tilemaps in WebGL wouldn't update after the first frame due to a subtle change in how Pixi uploads new textures to the GPU.
* XML files weren't being added to the URL map.
* Cache._resolveURL was causing a Sound double-load in Firefox and causing errors (thanks @domonyiv #1253)
* Loader.json was using the wrong context in IE9 with XDomainRequest calls (thanks @pnstickne #1258)
* Text.updateText was incorrectly increasing the size of the texture each time it was called (thanks @spayton #1261)
* Polygon.contains now correctly calculates the result  (thanks @pnstickne @BurnedToast #1267)
* Setting Key.enabled = false while it is down did not reset the isDown state (thanks @pnstickne #1190 #1271)
* The Gamepad.addCallbacks context parameter was never actually remembered, causing the callbacks to run in the wrong context (thanks @englercj #1285)
* Animation.setFrame used the wrong frames array if `useLocalFrameIndex` was `false` and a numeric frame ID was given (thanks @Skeptron #1284)
* Fullscreen mode in IE11 now works (thanks @pnstickne)
* Cache.addBitmapData now auto-creates a FrameData (thanks @pnstickne #1294 #1300)
* P2.BodyDebug circles were drawing at half widths (thanks @enriqueto #1288)
* FrameData.clone fixed when cloning data using frame names rather than indexes (thanks pjbaron)
* Lots of the Cache getters (such as `Cache.getbitmapData`) would return `undefined` if the asset couldn't be found. They now all consistently return `null` for missing entries (thanks @Matoking #1305)
* Phaser games should now work again from the CocoonJS Launcher.
* Only one of the mouse wheel events is listened to, newest standard first.
This fixes a bug in FF where it would use the default DOMMouseWheel (thanks @pnstickne #1313)
* Stage.smoothed needed to modify the value of PIXI.scaleMode.DEFAULT instead of PIXI.scaleMode.LINEAR (thanks @pixelpicosean #1322)
* Newly created Groups always had zero z index (thanks @spayton #1291)
* Sprite.autoCull now properly works if the camera moves around the world.
* Sprite.inCamera uses a much faster check if auto culling or world bounds checks are enabled and properly adjusts for camera position.
* Camera.totalInView is a new property that contains the total number of Sprites rendered that have `autoCull` set to true and are within the Cameras view.
* Emitter.setScale fixed minX minY order precedence (thanks spayton)
* Group.iterate can now accept undefined/null as the arguments (thanks @pnstickne #1353 @tasos-ch #1352)
* When you change State the P2 Physics world is no longer fully cleared. All of the bodies, springs, fixtures, materials and constraints are removed - but config settings such as gravity, restitution, the contact solver, etc are all retained. The P2.World object is only created the very first time you call Physics.startSystem. Every subsequent call hits P2.World.reset instead. This fixes "P2.World gravity broken after switching states" (and other related issues) (#1292 #1289 #1176)
* Text.lineSpacing works correctly again. Before no space was added between the lines (thanks @intimidate #1367 and @brejep #1366)
* P2.BodyDebug always lagged behind the position of the Body it was tracking by one frame, which became visible at high speeds. It now syncs its position in the Body.postUpdate which prevents this from happening (thanks @valueerror)
* A State.preRender callback wasn't removed correctly when switching States.

### Pixi 2.1.0 New Features

* unloadFromGPU added to PIXI.BaseTexture
* PIXI.VideoTexture added
* PIXI.RoundedRectangle added
* Ensured all float32arrays use PIXI.Float32Array
* Removed the use of call in updateTransform (as its 10x faster to run the function directly)
* autoResize option added to renderer options (default is false). Pixi no longer automatically changes the style of the canvas.
* PIXI.RenderTexture.getCanvas optimized

### Pixi 2.1.0 Bug Fixes

* Fix destroy method of PIXI.WebGLRenderer
* Fixed Graphics.drawRoundedRectangle
* Fixed Graphics.arcTo issue
* Fixed Graphics.arc issue
* Fixed Graphics.cacheAsBitmap alpha issue
* Fixed PIXI.Strip alpha issue
* Fixed PIXI.DisplayObject.cacheAsBitmap alpha issue
* Fixed PIXI.RenderTexture Canvas Clear bug
* Fixed PIXI.DisplayObject.updateTransform issue
* Fixed webGL Shader textures issue
* Fixed PIXI.DisplayObject.getLocalPosition()
* Fixed CocoonJS crashing, when loading destroyed texture
* Fix eventTarget emit bug

## Version 2.1.3 - "Ravinda" - 23rd October 2014

### New Features

* Updated to Pixi v2.0.0 (see change list below)
* Happily removed the IE11 WebGL lock as Pixi now fully supports it :)
* Time.prevTime is a new property that contains the raw value of the game timer from the previous update.
* Sound.fadeTo allows you to fade the Sound to the given volume over the duration specified (thanks @nickryall #1225)
* BitmapData.getFirstPixel will scan the BitmapData and return the color and location of the first non-transparent pixel encountered. You can specify one of 4 scan directions: top to bottom, bottom to top, left to right and right to left.
* BitmapData.getBounds will return a `Rectangle` object that encompasses the full extent of the non-transparent pixels in the BitmapData. This can be useful if you wish to trim away transparent pixels from the sides of a BitmapData down to size before saving.
* Rectangle.scale allows you to scale the width and height of a Rectangle.
* RenderTexture has a new optional parameter: `resolution`

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson)
* Changed the Animation constructor parameter `delay` to `frameRate` as it's a more accurate term of what it should be. Internally nothing changed.
* Circle.getBounds added.
* Ellipse.getBounds added.
* Device.canPlayAudio now supports `opus` files directly, as well as `opus` encoded audio stored in ogg containers (#1232)
* PIXI.AbstractFilter is now bundled by default to support the new `sprite.shader` feature in Pixi v2.
* Changed all typeof comparisons from == to === (thanks @bobbywilson0 #1230)
* JSDoc fixes in the Rope class (thanks @Rovanion)
* Filter.update now caches the previous pointer position to avoid flooding the uniform. Also the mouse uniform is now a value between 0 and 1 depending on the position within the game view.

### Bug Fixes

* Fixed a reference error to the Loader.baseURL in Cache._resolveUrl method. This stops the error where Safari would show lots of file load errors but then still load the files (thanks @neurofuzzy #1235)
* Fixed the Filter mouse uniform value population.
* Fixed an issue where audio files with query strings after them would fail the `canPlayAudio` checks (thanks Vithar)
* Input.hitTest now accurately detects hits on the extreme edges of a display object (thanks InsaneHero)
* Button.setSounds now works if given an AudioSprite as the sound source.

### Pixi v2 Specific New Features

* Sprites can now have a custom shader applied to them. Much better performance than filters.
* Renderers now have a resolution. Ideal for working with different pixel density.
* Big refactor of the webGLRenderer and WebGLSpriteBatch renderer.
* Refactor of CanvasRenderer.
* DisplayObject.updateTransform function rewritten with for better performance.
* New Events Class.
* New Constructor for all renderers (including autoDetect)
* Massive Refactor of Graphics (WebGL and Canvas)
* Graphics objects can now be interactive.
* Made removeChild no longer returns error.
* Lots of new functions added to the Matrix class.
* RenderTexture refactored. Now accepts Matrix in the render function.
* AsciiFilter, NoiseFilter and TiltShiftFilter.
* added getChildIndex and setChildIndex methods to DisplayObjectContainer.
* Bug Fixes.

### Pixi v2 Specific Bug Fixes

* iOS8 alpha bug fixed.
* set default padding to 0 for graphics objects.
* PIXI.Graphics initial width and height is 0.
* Fixed Graphics getBounds.
* fix cacheAsBitmap alpha issue for canvas.
* Fixed minY calculation in updateBounds.
* Fixed Bezier issue on Graphics.
* Added 0 width check to DisplayObjectContainer.

## Version 2.1.2 - "Whitebridge" - 9th October 2014

### New Features

* StateManager.unlink will null all State-level Phaser properties, such as `game`, `add`, etc. Useful if you never need to return to the State again.
* Cache.removeImage has a new parameter: `removeFromPixi` which is `true` by default. It will remove the image from the Pixi BaseTextureCache as well as from the Phaser Cache. Set to false if you don't want the Pixi cache touched.
* Group.ignoreDestroy boolean will bail out early from any call to `Group.destroy`. Handy if you need to create a global Group that persists across States.
* Loader can now natively load XML files via `load.xml`. Once the XML file has loaded it is parsed via either DOMParser or ActiveXObject and then added to the Cache, where it can be retrieved via `cache.getXML(key)`.
* Cache now has support for XML files stored in their own container. You can add them with `cache.addXML` (typically this is done from the Loader automatically for you) and get them with `cache.getXML(key)`. There is also `cache.checkXMLKey(key)`, `cache.checkKeys` and `cache.removeXML(key)`.
* Rectangle.aabb is a new method that will take an array of Points and return a Rectangle that matches the AABB (bounding area) of the Points (thanks @codevinsky #1199)
* AudioSprite support is now built into the Loader and SoundManager. AudioSprites are like sprite sheets, only they consist of a selection of audio files and markers in a json configuration. You can find more details at https://github.com/tonistiigi/audiosprite (thanks @codevinsky #1205)
* Point.parse will return a new Point object based on the x and y properties of the object given to Point.parse (thanks @codevinsky #1198)
* Sound.fadeOut(duration) will fade the Sound to a volume of zero over the duration given. At the end of the fade the Sound will be stopped and Sound.onFadeComplete dispatched.
* Sound.fadeIn(duration, loop) will start the Sound playing, or restart it if already playing, set its volume to zero and then increase the volume over the duration given until it reaches 1. At the end of the fade the Sound.onFadeComplete event is dispatched.
* Text.addColor allows you to set specific colors within the Text. It works by taking a color value, which is a typical HTML string such as `#ff0000` or `rgb(255,0,0)` and a position. The position value is the index of the character in the Text string to start applying this color to. Once set the color remains in use until either another color or the end of the string is encountered. For example if the Text was `Photon Storm` and you did `Text.addColor('#ffff00', 6)` it would color in the word `Storm` in yellow.
* Text.clearColors resets any previously set colors from `Text.addColor`.
* If you pass a tinted Sprite to `BitmapData.draw` or `BitmapData.copy` it will now draw the tinted version of the Sprite to the BitmapData and not the original texture.
* BitmapData.shadow(color, blur, x, y) provides a quick way to set all the relevant shadow settings, which are then be used in future draw calls.
* Cache.addBitmapData has a new parameter: `frameData` allowing you to pass a `Phaser.FrameData` object along with the BitmapData.
* Cache.getFrameData has a new parameter: `map` which allows you to specify which cache to get the FrameData from, i.e. `Phaser.Cache.IMAGE` or `Phaser.Cache.BITMAPDATA`.
* Sprite.loadTexture if given a BitmapData as the texture will now query the cache to see if it has any associated FrameData, and if so it will load that into the AnimationManager.
* BitmapData.textureLine takes a Phaser.Line object and an image in the image cache. It then accurately draws the image as a repeating texture for the full length of the line.
* AnimationManager.name will now return the `name` property of the currently playing animation, if any.
* Group.filter takes a predicate function and passes child, index, and the entire child array to it. It then returns an ArrayList containing all children that the predicate returns true for (thanks @codevinsky #1187)
* Cache.checkUrl allows you to check if a resource is in the cache based on an absolute URL (thanks @englercj #1221)
* Cache.getUrl gets a resource from the cache based on the absolute URL it was loaded from (thanks @englercj #1221)
* Sound.allowMultiple allows you to have multiple instances of a single Sound playing at once. This is only useful when running under Web Audio, and we recommend you implement a local pooling system to not flood the sound channels. But it allows for one Sound object to play overlapping times, useful for gun effects and similar (#1220)

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @englercj @benjamindulau)
* Added the `sourceRect` and `maskRect` parameters back into `BitmapData.alphaMask` as they were accidentally removed in 2.1 (thanks seejay92)
* jsdoc fixes (thanks @danxexe #1209)
* AnimationParser is now using `value` instead of `nodeValue` when parsing atlas XML files, avoiding Chrome deprecation warnings (thanks @valtterip #1189)
* Color.webToColor restored. Converts a CSS rgba color into a native color value.
* Color.createColor now populates the `color` property of the returned object with the results of `Phaser.Color.getColor`.
* Color.createColor now has a `color32` property with the results of `Phaser.Color.getColor32`.
* Color.hexToColor has been optimised to inline the regex and has moved the createColor call so it now populates the color object fully, not just setting the r,g,b properties.
* Keyboard.PLUS and Keyboard.MINUS have been added to the list of key codes (thanks @VictorBjelkholm #1281)

### Bug Fixes

* If Game Objects change their frame, such as with an animated Sprite, and the change goes from a previously trimmed frame to a non-trimmed (full size) one, then the previous trim values were still left active, causing it to glitch (thanks stupot)
* If you called StateManager.start from within a states `init` method which also had a `preload` method it would fail to start the next State.
* StateManager.boot would call start on a State twice if it was added to the game and started before the DOM load had completed. This didn't cause an error but was duplicating function calls needlessly.
* Changing any of the Text properties such as font, lineSpacing and fontSize on a Text object that wasn't already on the display list would cause an updateTransform error. Parent is now checked first in all setters.
* A Timer with a delay value that was a float and not an integer would not loop correctly. Timer delay values are now passed through Math.round to avoid this (thanks @osmanzeki #1196)
* The Loader would incorrectly call `fileComplete` for legacy audio files instead of setting it as a callback, throwing up errors if the audio file failed to load (thanks @spayton #1212)
* The Uint32Array check used in Utils was incorrectly replacing Uint32Array on Safari, causing errors like BitmapData.getPixel32 to fail and other related issues (fixes #1043 and #1197)
* Camera.follow would break if the parent of the Sprite being followed was scaled in any way (thanks @englercj #1222)
* Fixed the 4fv uniform in the Pixelate filter.

## Version 2.1.1 - "Eianrod" - 11th September 2014

Version 2.1.1. of Phaser is an emergency point release. It addresses a potential race condition that could happen in States that tried to change state from the create method but had an empty preloader or pre-cached assets.

## Version 2.1.0 - "Cairhien" - 9th September 2014

### New Features

* Updated to [p2.js 0.6.0](https://github.com/schteppe/p2.js/commit/d1c7a340c42e4d5d1d939fba5fd13c5e49d6abd2) - this was an API breaking change, so please see the p2.js section of this change log specifically if you're using p2 in your game.
* If you are using CocoonJS, please set your game render type to CANVAS and not WEBGL or AUTO. You should also disable any of the ScaleManager screen resizing or margin setting code. By default in this mode CocoonJS will now set 'screencanvas=true' which helps with performance significantly.
* Ninja Physics is no longer included in the build files by default. Not enough people were using it, and not enough contributions were coming in to help polish it up, so we've saved the space and removed it. It's still available in the grunt build files if you require it, but we're deprecating it from the core library at this time. It will make a return in Phaser3 when we move to a modular class system.
* ScaleManager has a new scaleMode called `RESIZE` which will tell Phaser to track the size of the parent container (either a dom element or the browser window if none given) and set the canvas size to match it. If the parent changes size the canvas will resize as well, keeping a 1:1 pixel ratio. There is also a new ScaleManager.setResizeCallback method which will let you define your own function to handle resize events from the game, such as re-positioning sprites for a fluid responsive layout (#642)
* The width and height given to the Phaser.Game constructor can now be numbers or strings in which case the value is treated as a percentage. For example a value of "100%" for the width and height will tell Phaser to size the game to match the parent container dimensions exactly (or the browser window if no parent is given). Equally a size of "50%" would tell it to be half the size of the parent. The values are retained even through resize events, allowing it to maintain a percentage size based on the parent even as it updates.
* Device will now detect for Kindle and PS Vita (thanks @lucbloom)
* Device will now detect for Cordova (thanks @videlais #1102)
* Arcade Physics Body.skipQuadTree is a new boolean that if set to `true` when you collide the Sprite against a Group it will tell Phaser to skip using a QuadTree for that collision. This is handy if this Body is especially large.
* Arcade Physics World.skipQuadTree will disable the use of all QuadTrees in collision methods, which can help performance in tightly packed scenes.
* Cordova 'deviceready' event check added (thanks @videlais #1120)
* Loader.useXDomainRequest boolean added. If `true` (the default is `false`, unless the browser is detected as being IE9 specifically) it will use XDomainRequest when loading JSON files instead of xhr. In rare IE edge-cases this may be required. You'll know if you need it (#1131 #1116)
* Added support for Tiled objects type field (thanks @rex64 #1111)
* Tile properties are now copied from the Tiled JSON data to the Phaser.Tile objects when parsed (thanks @beeglebug #1126)
* All Images now have a frameData value, even if it's only one frame. This removes lots of engine code needed to check if images are sprite sheets or not, and simplifies game code too (thanks @lucbloom #1059)
* Added a new Phaser.Rope object. This allows for a series of 'chained' Sprites and extends the Rope support built into Pixi. Access it via game.add.rope (thanks @codevinsky #1030)
* Phaser.Device.isAndroidStockBrowser will inform you if your game is running in a stock Android browser (rather than Chrome) where you may wish to scale down effects, disable WebGL, etc (thanks @lucbloom #989)
* Phaser.Camera has a new property `position` which is a Point object that allows you to get or set the camera position without having to read both the x and y values (thanks @Zielak #1015)
* TileSprite now has the `alive` property, which should help with some Group operations (thanks @jonkelling #1085)
* Events.onDestroy is a new signal that is dispatched whenever the parent is being destroyed. It's dispatched at the start of the destroy process, allowing you to perform any additional house cleaning needed (thanks @jonkelling #1084)
* Group.onDestroy is a new signal that is dispatched whenever the Group is being destroyed. It's dispatched at the start of the destroy process, allowing you to perform any additional house cleaning needed (thanks @jonkelling #1084)
* ScaleManager.destroy now removes the window and document event listeners, which are no longer created anonymously (thanks @eguneys #1092)
* Input.Gamepad.destroy now destroys all connected SinglePads and clears event listeners.
* SinglePad.destroy now clears all associated GamepadButton objects and signals.
* Device.node and Device.nodeWebKit are two new properties (thanks @videlais #1129)
* P2.PointProxy.mx and my values are get and set in meters with no pixel conversion taking place.
* P2.InversePointProxy.mx and my values are get and set in meters with no pixel conversion taking place.
* Pointer.dirty is a new boolean that is set by the InputHandler. It tells the Pointer to re-check all interactive objects it may be over on the next update, regardless if it has moved position or not. This helps solve issues where you may have a Button that on click generates a pop-up window that now obscures the Button (thanks @jflowers45 #882)
* SoundManager.destroy is a new method that will destroy all current sounds and reset any callbacks.
* StateManager.clearCurrentState now handles the process of clearing down the current state and is now called if the Game is destroyed.
* Game.destroy now clears the current state, activating its shutdown callback if it had one. It also now destroys the SoundManager, stopping any currently running sounds (#1092)
* Animation.onUpdate is a new event that is dispatched each time the animation frame changes. Due to its intensive nature it is disabled by default. Enable it with `Animation.enableUpdate = true` (#902)
* Device now has new features to support detection of running inside a  CocoonJS.App (thanks @videlais #1150)
* Support for CocoonJS.App's 'onSuspended' and 'onActivated' events, making it so that the timers and sounds are stopped/started and muted/unmuted when the user swaps an app from the background to the fore or the reverse (thanks @videlais #1152)
* Canvas.removeFromDOM(canvas) will remove a canvas element from the DOM.
* Game.destroy now removes the games canvas element from the DOM.
* ScaleManager.setMinMax(minWidth, minHeight, maxWidth, maxHeight) is a handy function to allow you to set all the min/max dimensions in one call.
* ArcadePhysics.collide and overlap can now accept 2 Arrays of objects to be used in the collision checks (thanks @ctmartinez1992 #1158)
* RetroFont has a new property called frameData which contains the Frame objects for each of the letters in the font, which can be used by Sprites.
* Phaser.Canvas.setImageRenderingCrisp now sets `image-rendering: pixelated`, perfect for pixel art, which is now supported in Chrome 38.
* Phaser.Mouse will now add a listener to the `window` to detect `mouseup` events. This is used to detect if the player releases the mouse while outside of the game canvas. Previously Pointer objects incorrectly thought they were still pressed when you returned the mouse over the canvas (#1167)
* Rectangle.centerOn(x,y) allows you to quickly center a Rectangle on the given coordinates.
* Group.addMultiple allows you to pass an array of game objects and they'll all be added to the Group in turn.
* The StateManager will now check if a State has a method called `resize`. If it does, and if the game is running in the RESIZE Scale Mode then this method will be called whenever the game resizes. It will be passed two parameters: `width` and `height` that will match the games new dimensions. Resizing can happen as a result of either the parent container changing shape, or the browser window resizing.
* Rectangle.topRight returns a Point object that represents the top-right coordinate of the Rectangle.
* The grunt script now builds a new version of Phaser without any physics (including Arcade Physics), Tilemaps or Particles. This build is called `phaser-no-physics.js` and works stand-alone. Please note that things like the GameObjectFactory aren't changed, so they will still try and create a Tilemap for example should you ask them to (thanks @eguneys #1172)
* Camera.roundPx is a new boolean. If set to `true` it will call `view.floor` as part of its update loop, keeping its boundary to integer values. Set to `false` to disable this from happening (#1141)
* Phaser.Easing.Default is a new property that is used when a specific type of ease isn't given. It defaults to Linear.None but can be overridden to anything (thanks @alvinsight)

### Updates

* TypeScript definition updates to help fix for the `noimplicitany` option (thanks @Waog #1088)
* TypeScript definitions fixes and updates (thanks @clark-stevenson @englercj @saikobee and @rhmoller)
* All of the Pixi geom classes have been removed from the build file as they aren't needed (the Phaser.Geom classes overwrite them), saving some space in the process.
* Improved consistency of clone methods on geometry classes (thanks @beeglebug #1130)
* Removed Cache.isSpriteSheet method as no longer required (see #1059)
* Added Cache.getFrameCount to return the number of frames in a FrameData.
* Input.setMoveCallback has been removed due to deprecation.
* BitmapData.refreshBuffer has been removed and replaced with BitmapData.update.
* BitmapData.drawSprite has been removed due to deprecation. Use BitmapData.draw instead.
* Pointer.moveCallback has been removed due to deprecation.
* SinglePad.addButton has been removed due to deprecation.
* P2.Body.loadData has been removed due to deprecation.
* P2.World.defaultFriction and defaultRestitution have been removed due to deprecation.
* Canvas.create noCocoon parameter has been removed due to deprecation.
* Color.getColorInfo, RGBtoHexstring, RGBtoWebstring and colorToHexstring has been removed due to deprecation.
* P2.PointProxy.x and y values are now returned in pixels (previously they were returned in meters). See PointProxy.mx/my for meter values.
* P2.InversePointProxy.x and y values are now returned in pixels (previously they were returned in meters). See PointProxy.mx/my for meter values.
* Arcade.overlap and collide are now more consistent about allowing a Group vs. Group or Group vs. Array of Groups set (thanks @pyromanfo #877 #1147)
* The Pointer move callbacks are now sent an extra parameter: `fromClick` allowing your callbacks to distinguish between the Pointer just moving, or moving as a result of being pressed down (thanks @iforce2d #1055)
* GamePad and SinglePad onAxisCallback parameters have changed. You are now sent: this (a reference to the SinglePad that caused the callback), the axis index and the axis value in that order.
* If Time.elapsed was > Time.timeCap it would reset the elapsed value to be 1 / 60. It's now set to Time.timeCap and Time.timeCap defaults to `1 / 60 * 1000` as it's a ms value (thanks @casensiom #899)
* Tiled polylines are now imported into the map objects property as well as map collision (#1117)
* Tile.setCollision now adjusts the tiles interesting faces list as well, this allows you to create one-way jump tiles without using custom callbacks on a specific tile basis (thanks @RafaelOliveira #886)
* Stage.offset has been moved to ScaleManager.offset
* Stage.bounds has been removed, you can access it via Stage.getBounds.
* Stage.checkOffsetInterval has been moved to ScaleManager.trackParentInterval
* ScaleManager.hasResized signal has been removed. Use ScaleManager.setResizeCallback instead.
* The World bounds can now be set to any size, including smaller than the game dimensions. Before it was locked to a minimum size of the game canvas, but it can now be anything.
* ScaleManager.orientationSprite has been removed because it never displayed correctly anyway (it would be distorted by the game scale), it will be bought back in a future version by way of a custom orientation state.
* ArcadePhysics.overlap has been updated so that the Body.overlapX/Y properties are set to the amount the two bodies overlapped by. Previously they were zero and only populated during the separation phase, but now the data is available for just overlap checks as well. You can then use these values in your ovrelap callback as required - note that they are changed for every check, so a Sprite overlap tested against 10 other sprites will have the overlapX/Y values updated 10 times in a single collision pass, so you can only safely use the values in the callback (#641)
* Cache.getImage now returns `null` if the requested image wasn't found.
* BitmapData now returns a reference to itself from all of its drawing related methods, allowing for easy function chaining.
* The default size of a BitmapData if no width/height is given has been changed from 100x100 to 256x256.
* Phaser.Text.destroy will now destroy the base texture by default (#1162)
* BitmapData.copyPixels is now called BitmapData.copyRect and the method signature has changed.
* BitmapData.draw method signature has changed significantly.
* Phaser.Canvas.getSmoothingEnabled will return `true` if the given context has image smoothing enabled, otherwise `false`.
* Math.numberArrayStep is a new method that allows you to return an array of numbers from `min` to `max` including an optional `step` parameter (thanks @codevinsky #1170)
* Removed redundant `if` check from StateManager.preUpdate (thanks @FedeOmoto #1173)

### Bug Fixes

* Remove escaping backslashes from RetroFont text set documentation (thanks @jackrugile #1051)
* Phaser.Loader was incorrectly getting the responseText from _xhr instead of _ajax on IE9 xDomainRequests (thanks @lardratboy #1050)
* Phaser.Physics.P2.addPolygon now takes a nested array again (thanks @wayfu #1060)
* Fix for previous PR #1028 where the P2.setBoundsToWorld call was overriding setBoundsToWorld in the P2 constructor (thanks @Dumtard #1028)
* Fix for scale issues in CocoonJS using webgl renderer and screencanvas (thanks @txusinho #1064)
* Resolves issue with pixel perfect click / over detection on Sprites that used trimmed image atlases for animations or frames > 0.
* Group.swap() updates the Z index values properly (thanks @Blank101 #1090)
* Device now recognises ChromeOS as a desktop (thanks @alvinsight @hilts-vaughan #1091)
* Fixed Point.rotate bug (thanks @gamedolphin #1107)
* InputHandler.checkBoundsRect was incorrectly assigning a property in Sprites fixed to the camera being dragged left (thanks @CraigBeswetherick #1093)
* Swapped argument order of Rectangle.containsRect (thanks @beeglebug #1095 #1125)
* The Game configuration object "renderer" property was being wrongly assigned to Game.renderer instead of renderType (thanks @FedeOmoto #1127)
* Fixed Group.removeBetweens default endIndex (thanks @darfux #1142)
* Debug.cameraInfo no longer crashes if the camera bounds are nulled (thanks @wayfu #1143)
* Camera.setBoundsToWorld no longer crashes if the camera bounds are nulled (thanks @wayfu #1143)
* Fixed the resolution uniform type in the SampleFilter (thanks @VictoryRice #1137)
* Calling P2.Body.destroy or ArcadePhysics.Body.destroy wouldn't null the parent sprite body, causing it to error in the next update (thanks @jonathanhooker #1077)
* BitmapFonts are now correctly added to the Cache._bitmapFont array and returned via Cache.getBitmapFont (thanks @prudolfs #1076)
* InputHandler docs updated to avoid Pointer data-type confusion (#1097)
* If you used a single Game configuration object and didn't specify the enableDebug property it would crash on Debug.preUpdate (thanks @luizbills #1053)
* The P2.World.postBroadphaseHandler now checks if the returned pairs array is empty or not before processing it (thanks @wayfu #934)
* Tilemap.hasTile now checks the Tile.index value and will return false if the index is -1 (i.e. a non-active tile) (thanks @elgansayer #859)
* Sound.restart used to cause the Sound to double-up if it was already playing when called. Now correctly stops the sound before restarting it (thanks @wombatbuddy #1136)
* GamePad axis detection now works again properly in Firefox (#1035)
* GamepadButton.justPressed and justReleased now correctly report if the button has just been pressed or released (thanks @padpadpad #1019)
* TilemapParser.getEmptyData now correct adds an empty bodies array into layers. This fixes an issue where p2 couldn't convert a csv map into collision tiles (thanks @sru #845)
* CocoonJS doesn't support mouse wheel events so they've been moved into a conditional check (thanks @videlais #1151)
* ScaleManager window.resize handler would constantly dispatch enterPortrait and enterLandscape events on window resizing, regardless if it actually entered that orientation or not.
* Added Sound._muteVolume which stops Firefox and IE9 crashing if you try to unmute a sound that hasn't yet been muted, which can also happen as a result of a game visibility change (thanks @osmanzeki #1108 #1123)
* P2.World.getSprings used to return an empty array, but now returns all the Springs in the world (#1134)
* Tween.generateData would skip the end values in the data array. They are now included as the object in the final array element.
* Rectangle.bottom setter swapped the order of the calculation (thanks @JakeCoxon #1165)
* Phaser.Text wouldn't render the text to its local canvas if you passed the text on the constructor and didn't add it to the display list. If a string is given it now updates the local canvas on creation.
* Signal.removeAll would ignore the context parameter and remove all bindings regardless (thanks @alect #1168)
* P2.Body.addCapsule didn't use to pass the radius value through pxm, but now does so you have to specify it in pixels, not meters.

### p2.js 0.6.0 Changes and New Features

* DistanceConstraint signature changed to take the new localAnchors.
* World.createDistanceConstraint signature changed to include new local anchors (thanks @rhmoller #1169)
* RevoluteConstraint signature changed to include worldPivot.
* P2.Body now uses the new Body.type value instead of Body.motionState, however as P2.Body already have a property called `type` we have left the `motionState` getter/setter in for now.
* World.enableBodySleeping has been removed and replaced with World.sleepMode.
* Phaser P2.Springs are now LinearSprings by default.
* World.createRotationalSpring will now let you create rotational springs.

#### Breaking changes

* Renamed property .motionState to .type in class Body.
* Changed constructor of RevoluteConstraint. Now the local pivots are passed as options instead of direct arguments. See the constraints demo.
* Removed World.prototype.toJSON and .fromJSON.
* Removed properties .enableBodySleeping and .enableIslandSleeping from World instances. The enum .sleepMode can be used instead. See the sleep demo.
* Converted Spring to a base class for the new LinearSpring and RotationalSpring classes. LinearSpring can be used as the old Spring.
* Utils.ARRAY_TYPE can now be overridden by injecting a global called P2_ARRAY_TYPE. Support for GLMAT_ARRAY_TYPE has been removed.

#### Other changes

* Added flag .enableFrictionReduction to Narrowphase.
* Added RevoluteConstraint.prototype.setLimits.
* Added PrismaticConstraint.prototype.setLimits.
* LockConstraint, DistanceConstraint, and GearConstraint can now be constructed from current body transforms.
* RevoluteConstraint can now be constructed from the current body transforms and a world point.
* Material id can now be passed via constructor.
* ContactMaterial instances now have a property .contactSkinSize.
* Added method Body.prototype.getAABB.
* Limits for DistanceConstraint. See the DistanceConstraint demo.
* Added Body.prototype.overlaps.
* Added class OverlapKeeper.
* If substepping is used in World.prototype.step, the substeps are aborted if slower than real time.
* Added Heightfield/Convex and Heightfield/Circle collision support.
* Added property .overlapKeeper to World.
* EventEmitter.prototype.has can now check if any listeners were added to a given topic.
* Added Utils.defaults.

## Version 2.0.7 - "Amadicia" - 18th July 2014

### Updates

* Updated to Pixi.js 1.6.1 which fixes various issues such as IE9 Float32 defs and RenderTexture resizing and rendering.
* TypeScript definitions fixes and updates (thanks @clark-stevenson and @alvinsight)
* GameObjectFactory.spriteBatch now lets you specify `null` as a parameter for the parent and automatically adds the batch to `game.world` as a result. Also fixed jsdocs issues (@petarov #1000)
* Rebuilt the way items are polled for Pointer events (drag, click, move). Now faster and more efficient, especially when some items in the stack require pixel perfect checks.
* InputHandler.checkPointerOver now has a new `fastTest` parameter that forces a skips a pixel perfect check even if enabled.
* InputHandler.checkPointerDown now has a new `fastTest` parameter that forces a skips a pixel perfect check even if enabled.
* The key is now reported when failing to parse a Sprite Sheet (thanks @lucbloom #1026)
* An editorconfig has been added to the core repo. See http://editorconfig.org (thanks @codevinksy #1027)
* Keyboard.processKeyPress now checks if the Keyboard Input handler is disabled or not before processing the key callbacks.
* Physics.bounds now correctly matches World.bounds on system start (thanks @Dumtard #1028)
* Game._codePaused is now set if the Game is manually paused. See discussion: http://www.html5gamedevs.com/topic/6719-codepaused-property/ (thanks @devinb83 #1017)

### New Features

* ArrayList.setAll - sets the property to the given value on all members of the list.
* Sprite.loadTexture has a new optional `stopAnimation` boolean parameter which will halt the currently running animation (if any) after changing the texture (based on #1029).
* Animation.updateFrameData allows you to load a new FrameData object into an existing animation, even if currently running (based on #1029)
* AnimationManager.loadFrameData will now update all existing Animations to use the newly loaded FrameData (based on #1029)
* Sprite.loadTexture will store the `smoothed` property of the Sprite and re-apply it once the new texture is loaded.
* Group.checkAll allows you to check if the same property exists across all children of the Group and is set to the given value (thanks @codevinsky #1013)
* Group.checkProperty allows you to check if the property exists on the given child of the Group and is set to the value specified (thanks @codevinsky #1013)
* Phaser.Utils.setProperty will set an Objects property regardless of depth (thanks @codevinsky #1013)
* Phaser.Utils.setProperty will set an Objects property regardless of depth (thanks @codevinsky #1013)
* Phaser.Utils.getProperty will get an Objects property regardless of depth (thanks @codevinsky #1013)

### Bug Fixes

* Fixed pixel perfect dragging (thanks @jeroenverfallie #996)
* Debug.preUpdate was still being called in the Game Loop even if enableDebug was set to false (thanks @qdrj #995)
* Phaser.Physics.P2.Body.addPolygon didn't work with a flat array of numbers for the coordinates (thanks @petarov, fix #883)
* Added missing Loader.onPackComplete Signal (thanks @mjeffery #1007)
* QuadTree leveling - Rather than level++ which changes the current nodes level, the subnodes should get the current nodes level+1 (thanks @devinb83 #1018)
* Prevented objects with pixel perfect checks from over-riding other higher priority ID items (#983)
* Group.create was not creating with p2 debug flag (thanks @Dumtard #1014)
* World.wrap when using the bounds of the object wouldn't adjust the bounds correctly, meaning wrapping outside the camera failed (thanks @jackrugile #1020)
* Pixi updated worldTransform from an Array to an Object and Phaser Image, BitmapText, Text and Graphics were still using array access to populate the world property, giving it incorrect results (thanks @alvinsight)
* If you add a Tween to the TweenManager and then immediately stop it, it will still exist in the TweenManager (thanks @gilangcp #1032)
* AnimationManager does not update currentFrame on play until second frame (thanks @Dumtard #1041)
* Animation now guards against _frameData being null (thanks @lucbloom #1033)
* Tilemap.swap now accurately swaps from A to B and from B to A (thanks @noidexe #1034)
* BitmapData.resize fixed to update the crop property too, resolves issues with images getting cut off with BitmapData.load.
* OrientationSprite fix as it's not using PIXI.TextureCache anymore (thanks @DarkDev- #1036)

## Version 2.0.6 - "Jornhill" - 10th July 2014

### Significant Internal Changes

* The PIXI.TextureCache global array is no longer used internally for storing Pixi Texture files. It's not actually a requirement of Pixi to use this and we were running into various issues with texture conflicts in DragonBones tests and issues with shared texture frames between Sprites. It meant we couldn't crop a sprite without cropping all instances unless we created a new texture frame at run-time, which as you can imagine is a huge overhead if you then want to crop an animated Sprite.

After talking with Mat at GoodBoyDigital about the issue it was his idea to just not use the TextureCache at all, and let each Sprite have its own frame. So this is the direction we've taken. We didn't save this for the 2.1 release as it doesn't actually alter the Phaser API at all, but it does change how things are working internally. So if you've got game code hooked directly into the `TextureCache` you need to be aware of this change before updating to 2.0.6.

* The way in which Sprite.crop works has been changed. It will now adjust the dimensions of the sprite itself, remaining at the sprites previous x/y coordinates. Please be aware of this if you use cropped sprites in your game. The change was worth it though as it's significantly more powerful as a result.

### Updates

* Merged Pixi 1.6.0 with Phaser - all of the lovely new Pixi features are in, like complex Graphics objects and masking.
* TypeScript definitions fixes and updates (thanks @clark-stevenson and @Phaiax)
* Documentation fixes (thanks @kay-is #941)
* BitmapData.draw can now also take a Phaser.Sprite, Phaser.Image or BitmapData object as a source type. As a result BitmapData.drawSprite is now deprecated.
* BitmapData.alphaMask can now also take a Phaser.Sprite, Phaser.Image or BitmapData object as a source type.
* BitmapData.alphaMask has 2 new optional parameters: sourceRect and maskRect to give more fine-grained control over where the source and mask are drawn and their size
* BitmapData.alphaMask 'mask' parameter is now optional, if not given it will use itself as the mask.
* BitmapData.alphaMask now calls BitmapData.update after running.
* BitmapData.draw now has two optional parameters: width and height, to let you stretch the image being drawn if needed.
* Group.destroy now removes any set filters (thanks @Jmaharman fix #844)
* RetroFont charsPerRow parameters is now optional. If not given it will take the image width and divide it by the characterWidth value.
* RetroFont now uses Phaser.scaleModes.NEAREST by default for its RenderTexture to preserve scaling.
* Loader.tilemap has renamed the `mapURL` parameter to `url` and `mapData` to `data` to keep it consistent with the other Loader methods.
* Loader.physics has renamed the `dataURL` parameter to `url` and `jsonData` to `data` to keep it consistent with the other Loader methods.
* Stage no longer creates the Phaser.Canvas object, but Game itself does in the setupRenderer method.
* Canvas.create has deprecated the noCocoon parameter as it's no longer required. The parameter is still in the signature, but no longer used in the method.
* Time.add allows you to add an existing Phaser.Timer to the timer pool (request #864)
* Emitter.start has a new parameter: forceQuantity which will force the quantity of a flow of particles to be the given value (request #853)
* Sound.pause will no longer fire a Sound.onStop signal, and the pause values are set before the onPause signal is dispatched (thanks @AnderbergE, fix #868)
* Swapped to using escaped Unicode characters for the console output.
* Frame.setTrim no longer modifies the Frame width and height values.
* AnimationParser doesn't populate the Pixi.TextureCache for every frame any longer. Each display object has its own texture property instead.
* Removed the cacheKey parameters from the AnimationParser methods as they're no longer used.
* Loader.isLoading is set to false if the filelist size is zero.
* Sound.externalNode has had the `input` property dropped from it, bringing it back in line with the AudioNode spec (thanks @villetou, #840)
* The StateManager has a preRenderCallback option, which checks for a preRender function existing on the State, but it was never called. Have decided to add this in, so the core Game loop now calls state.preRender right before the renderer runs (thanks @AnderbergE #869)
* Game.onBlur and Game.onFocus events are now dispatched regardless if Stage.disableVisibilityChange is true or false, so you can respond to these events without your game automatically pausing or resuming (#911)
* Image has been heavily refactored to make use of common code in Phaser.Sprite, cutting the file size down significantly.
* When using the non-minified version of Phaser it will throw a console.warn if you give an invalid texture key to a Sprite, Image or TileSprite (thanks @lucbloom, #990)

### CocoonJS Specific Updates

* Wrapped all touch, keyboard, mouse and fullscreen events that CocoonJS doesn't support in conditional checks to avoid Warnings.
* The SoundManager no longer requires a touch to unlock it, defaults to unlocked.
* Resolved issue where Cocoon won't render a scene in Canvas mode if there is only one Sprite/Image on it.

### New Features

* BitmapData.extract has a new parameter that lets you control if the destination BitmapData is resized before the pixels are copied.
* BitmapData.extract has 4 new parameters: r2, g2, b2, a2 which let you re-color the extract pixels as they are drawn to the new BitmapData.
* BitmapData.load will take a game object or string and resize the BitmapData to match it and then draw the pixels in.
* Keyboard.addCallbacks now has a new parameter for keypress event capture.
* Keyboard.pressEvent stores the most recent DOM keypress event.
* Keyboard.processKeyDown now runs the callback after all the objects have been created and/or updated.
* Keyboard.processKeyUp now runs the callback after all the objects have been created and/or updated.
* Phaser.Keyboard.lastChar will return the string value of the last key pressed.
* Phaser.Keyboard.lastKey will return the most recently pressed Key object.
* RetroFont.updateOffset allows you to modify the offsetX/Y values used by the font during rendering.
* ArcadePhysics.Body has a new boolean property `enable`. If `false` the body won't be checked for any collision or overlaps, or have its pre or post update methods called. Use this for easy toggling of physics bodies without having to destroy or re-create the Body object itself.
* BitmapData.addToWorld will create a new Phaser.Image object, assign the BitmapData to be its texture, add it to the world then return it.
* BitmapData.copyPixels now accepts a Sprite, Image, BitmapData, HTMLImage or string as its source.
* Loader.pack will allow you to load in a new Phaser Asset Pack JSON file. An Asset Pack is a specially structured file that allows you to define all assets for your game in an external file. The file can be split into sections, allowing you to control loading a specific set of files from it. An example JSON file can be found in the `resources\Asset Pack JSON Format` folder and examples of use in the Phaser Examples repository.
* Loader.totalQueuedPacks returns the number of Asset Packs in the queue.
* Loader.totalLoadedPacks returns the number of Asset Packs already loaded.
* Emitter.explode is a new short-cut for exploding a fixed quantity of particles at once.
* Emitter.flow is a new short-cut for creating a flow of particles based on the given frequency.
* Sprite.crop (and Image.crop) has been completely overhauled. You can now crop animated sprites (sprite sheet and texture atlas), you can define the x/y crop offset and the crop rectangle is exposed in the Sprite.cropRect property.
* Sprite.updateCrop is available if you wish to update an externally referenced crop rectangle.
* Sprites and Images now have their own textures objects, they are no longer references to those stored in the global Pixi.TextureCache. This allows you to redefine the texture frame dynamically without messing up any other Sprites in your game, such as via cropping. They still share global Base Textures, so image references are kept to a minimum.
* Sprite.resetFrame will revert the Sprites texture frame back to its defaults dimensions. This is called when you call Sprite.crop with no rectangle, to reset the crop effect, but can be useful in other situations so we've left it as a public method.
* TilemapLayers can now be used with an unbounded camera (a camera that can move beyond the world boundaries). Currently, when an unbounded camera moves outside of the world, tilemaps start acting weird because they only render themselves strictly within the world limits. With this change, the tilemap will continue scrolling and show empty space beyond its edge (thanks @jotson #851)
* TilemapLayer.wrap property - if true the map is rendered as if it is on the surface of a toroid (donut) instead of a plane. This allows for games that seamlessly scroll from one edge to the opposite edge of the world without noticing the transition. Note that the World size must match the Map size (thanks @jotson #851)
* Added PlayStation 3 controller button mappings to Phaser.Gamepad (thanks @wayfu)
* GamepadButton.destroy method added. Called automatically by SinglePad when a controller is disconnected.
* Added Math.factorial (thanks @alvinsight, #940)
* Full Mouse Wheel support added, with new constants and callbacks for mouse wheel movement (thanks @woutercommandeur, #959)
* A Phaser version of the Pixi PixelateFilter was added by @paperkettle #939)
* TileMap.setPreventRecalculate allows you to turn on / off the recalculation of tile faces for tile collision, which is handy when modifying large portions of a map to avoid slow-down (thanks @sivael, #951)
* Group.add has a new optional boolean parameter: `silent`. If set to `true` the child will not dispatch its `onAddedToGroup` event.
* Group.addAt has a new optional boolean parameter: `silent`. If set to `true` the child will not dispatch its `onAddedToGroup` event.
* Group.remove has a new optional boolean parameter: `silent`. If set to `true` the child will not dispatch its `onRemovedFromGroup` event.
* Group.removeBetween has a new optional boolean parameter: `silent`. If set to `true` the children will not dispatch their `onRemovedFromGroup` events.
* Group.removeAll has a new optional boolean parameter: `silent`. If set to `true` the children will not dispatch their `onRemovedFromGroup` events.
* Internal child movements in Group (such as bringToTop) now uses the new `silent` parameter to avoid the child emitting incorrect Group addition and deletion events.
* Camera.updateTarget has had a make-over and now is a lot smoother under certain conditions (thanks @tjkopena, fix #966)
* Signal.removeAll now has a new `context` parameter. If specified only listeners matching the given context are removed (thanks @lucbloom for the idea, #880)
* Animation.next will advance to the next frame in the animation, even if it's not currently playing. You can optionally define the number of frames to advance, but the default is 1. This is also aliased from the AnimationManager, so you can do `Sprite.animations.next()`.
* Animation.previous will rewind to the previous frame in the animation, even if it's not currently playing. You can optionally define the number of frames to rewind, but the default is 1. This is also aliased from the AnimationManager, so you can do `Sprite.animations.previous()`.
* You can now debug render Ninja Physics AABB and Circle objects (thanks @psalaets, #972)
* Phaser.Utils.mixin will mix the source object into the destination object, returning the newly modified destination object.
* You can now use `game.add.plugin` from the GameObjectFactory (thanks @alvinsight, #978)
* Color.getWebRGB will now accept either an Object or numeric color value.
* Rectangle.randomX will return a random value located within the horizontal bounds of the Rectangle.
* Rectangle.randomY will return a random value located within the vertical bounds of the Rectangle.
* Using a Game configuration object you can now specify the value of the  `preserveDrawingBuffer` flag for the WebGL renderer. By default this is disabled for performance reasons. But if you need to be able to take screen shots of your WebGL games using toDataUrl on the game canvas then you'll need to set this to `true` (#987)
* Added options to disable horizontal and vertical world wrapping individually (thanks @jackrugile, #988)
* You can now prevent the Debug class from being created or booted by using the Game configuration setting: `enableDebug`. By default it is `true`, set to `false` to prevent the class from being created. Please note you are responsible for checking if this class exists before calling it, but you can do that via `if (game.debug) { ... }` (request #984)

### Bug Fixes

* Sprite.alive property now explicitly defined on the Sprite prototype (thanks @lewster32, #841)
* BitmapData.resize now properly updates the baseTexture and texture dimensions.
* Fixed Gamepad issue that incorrectly checked non-webkit prefix gamepads.
* Phaser.RenderTexture incorrectly passed the scaleMode to Pixi.RenderTexture, causing the renderer to error.
* Sprite animation data wasn't reset when going from a sprite sheet to a single frame in Sprite.loadTexture (thanks @lucbloom, fix #850)
* Timer.ms would report the game time ms value if the Timer hadn't yet been started, instead of 0.
* Timer.seconds would report the game time value if the Timer hadn't yet been started, instead of 0.
* A Canvas style set from a game config object used an incorrect property (thanks @TatumCreative, fix #861)
* Phaser.Line.intersectsPoints fixed for floating point inaccuracy (thanks @woutercommandeur, fix #865 and #937)
* Sound.destroy(true) would call remove on the SoundManager, which in turn would throw a TypeError as it tried to remove the sound events twice (thanks @AnderbergE, fix #874)
* When creating a Sprite or Image using a texture atlas it would set the frame twice, once in loadTexture and once when the initial frame is set. This has been reduced down to just a single setting now.
* BitmapData.getPixel fix for pixels with zero red value (thanks @lstor fix #894)
* If you call ArcadePhysics.collide on a Sprite vs. a Tilemap and provide a custom processCallback, the result was being ignored and the sprite was being separated regardless (thanks @aivins fix #891 #890)
* ArcadePhysics.Body.setSize if you set offset x/y values previously and then passed zero values they would be ignored (thanks @casensiom fix #889)
* InputHandler.checkPointerDown checks and docs updated (thanks @lewster32, fix method #936)
* Body.enable only exists in Arcade physics, so moved conditions concerning checking that into the Body (thanks @Phaiax, fix #961)
* Forces packPixel result into a uint32 (thanks @Phaiax, fix #960)
* The Bottom Wall in non 0,0 aligned P2 world was incorrectly set (thanks @Phaiax, fix #952)
* AnimationManager could sometimes return null (thanks @TatumCreative, #910)
* P2.Body.removeShape didn't call shapeChanged (thanks @TatumCreative, #910)
* Sound.onDecoded signal was never dispatched (thanks @j0hnskot, #906)
* stopFullScreen has been changed to run against document instead of the canvas since the cancelFullScreen method is created on the document (thanks @j0hnskot, #863)
* Calling reset on Sprite with a P2 body can result in body.data.world == null.
Calling addToWorld() would previously not check the _toRemove array, which could, if the timing were right, result in a Sprite being revived but then removed from the P2 World -- the result of this being the Sprites data would be in a mixed state causing it to appear visually but not function in the world (thanks @jonkelling, fix #917 #925)
* Input.SinglePad was fixed so that the rawpad button array supports Windows and Linux (thank @renatodarrigo, fix #958)
* Key.duration wasn't set to zero after a Key.reset (thanks @DrHackenstein, #932)
* Device.mobileSafari was no longer detecting Mobile Safari, now fixed (thanks @Zammy, #927)
* Rectangle.right when set would set the new width to be Rectangle.x + the value given. However the value given should be a new Right coordinate, so the width calculation has been adjusted to compensate (thanks @cryptonomicon, #849)
* Calling Tween.stop from inside a Tween update callback would still cause the tween onComplete event to fire (thanks @eguneys, #924)
* Group.bringToTop (and consequently Sprite.bringToTop) no longer removes the child from the InputManager if enabled (thanks @BinaryMoon, fix #928)
* Group.sendToBack (and consequently Sprite.sendToBack) no longer removes the child from the InputManager if enabled.
* When adding a new Animation to a Sprite it would incorrectly reset the current Sprite frame to the first frame of the animation sequence, it is now left un-touched until you call `play` on the animation.
* Tween.from now returns a reference to the tweened object in the same way that Tween.to does (thanks @b-ely, fix #976)
* Re-ordered the parameters of Phaser.Physics.Arcade.Body.render which is used by Debug.body so it matches correctly (thanks @psalaets, #971 #970)
* Removed hasOwnProperty check from Tween.from because it breaks on extended or inherited Game Objects.

## Pixi 1.6.0

The following changes were part of the Pixi 1.6.0 release:

### New features

* Big graphics update!
* Complex polys now supported in Pixi in webGL.
* Nested masking and complex poly masking supported in webGL.
* quadraticCurveTo added to PIXI.Graphics.
* bezierCurveTo added to PIXI.Graphics.
* arcTo added to PIXI.Graphics.
* arc added to PIXI.Graphics.
* drawPath added to PIXI.Graphics.
* roundedRectangle added to PIXI.Graphics.
* PIXI.Strip and PIXI.Rope added to library along with a new example.
* addChild / addChildAt functions now return the child.
* Add scaleMode params to PIXI.FilterTexture and PIXI.RenderTexture.
* fromFrames and fromImages static helper methods added to PIXI.MovieClip.
* updateSourceImage added to PIXI.BaseTexture.
* Added multitouch support.
* new valid property added to PIXI.Texture.
* Option to control premultiplied alpha on textures.
* Pixi logs current version in the console.
* webp image support.
* clear function added to PIXI.RenderTexture

### Bug Fixes

* Fix to roundPixels property in PIXI.CanvasRenderer.
* Fixed interactive bug when mousemove being called on removed objects.
* Fix bug touch move event handling.
* Various CocoonJS fixes.
* Masks now work when used in PIXI.RenderTextures / cacheAsBitmap and PIXI.Filters.
* Fixed bug where stroked PIXI.Text sometimes got clipped.
* Removed the trailing whitespace when wordwrapping a PIXI.Text.
* Fixed texture loading on IE11.
* Fixed Data URI loading.
* Fixed issue so now loader only uses XDomainRequest in IE, if a crossorigin request is needed.
* Fixed issue where alpha not being respected if cacheAsBitmap is true
* Fixed PIXI.RenderTexture resize bug.
* Fixed PIXI.TilingSprite not render children on canvas.
* Fixes issue where if both mask and filter are applied to one object the object did not render.
* If the texture is destroyed, it should be removed from PIXI.TextureCache too.
* PIXI.Graphics blendMode property now works in webGL.
* Trimmed sprites now behave the same as non trimmed sprites.

### Misc

* Doc tweaks / typo corrections.
* Added Spine license to src.
* Removed this.local in InteractionData.
* Shader manager Simplified.
* Sprite._renderCanvas streamlined and optimized.
* WebGL drawCalls optimized.

## Version 2.0.5 - "Tanchico" - 20th May 2014

### Updates

* TypeScript definitions fixes and updates (thanks @luispedrofonseca @clark-stevenson @Anahkiasen @adamholdenyall @luispedrofonseca @WillHuxtable)
* Input.getPointerFromIdentifier docs update to reflect where the identifier comes from. Pointer properties now set to give it fixed defaults (thanks @JirkaDellOro, #793)
* Pointer.pointerId added which is set by the DOM event (if present in the browser). Note that browsers can and do recycle pointer IDs.
* Pointer.type and Pointer.exists properties added.
* QuadTree.retrieve can now accept either a Sprite with a physics body or a Phaser.Rectangle as its parameter.
* PluginManager.add now accepts additional parameters and if given a function it will pass them all to the Plugin constructor.
* Tilemap.getTile has a new nonNull parameter. If true it won't return `null` for empty tiles, but will return the actual Tile in that location.
* Math.interpolateAngles and Math.nearestAngleBetween have been removed for the time being. They threw run-time errors previously.
* PIXI.InteractionManager is no longer over-written if the object already exists (thanks @georgiee, #818)
* Key.justPressed and justReleased incorrectly set the delay value to 2500ms. Now defaults to 50ms (thanks @draklaw, fix #797)
* Stage.backgroundColor can now accept short-code hex values: `#222`, `#334`, etc.
* Pointer.withinGame is now accurate based on game scale and updated as the Pointer moves.
* Stage.bounds is now updated if the game canvas offset changes position. Note that it contains the un-scaled game dimensions.

### New Features

* New `force` parameter added to Group.set, setAll, setAllChildren, setProperty which controls if a property is created even if it doesn't exist.
* Group.hasProperty will check a child for the given property and return true if it exists, otherwise false.
* Phaser.Tween.from allows you to set tween properties that will end up where the current object is (thanks @codevinsky, #792)
* Input.getPointerFromId will return a pointer with a matching pointerId value, if any. pointerId is a value set by the browser in the DOM event.
* ArcadePhysics.getObjectsUnderPointer will return all children from a Group that overlap with the given Pointer.
* InputManager.minPriorityID lets you set the minimum priority level an object needs to be to be checked by a Pointer. Useful for UI layer stacking.
* New consts: Phaser.Tilemap.NORTH, SOUTH, EAST and WEST to use with plugins and generally just handy to have.
* BitmapData.processPixelRGB added undefined check (thanks @muclemente, fix #808)
* Phaser.Utils.transposeArray will transpose the given array and return it.
* Phaser.Utils.rotateArray will rotate the given array by 90 or 180 degrees in either direction and return it.
* BitmapData.rect provides a quick way to draw a Rectangle to a BitmapData.
* Button.onOverMouseOnly is a boolean that causes onOver events to fire only if the pointer was a mouse (i.e. stops onOver sounds triggering on touch)
* Tilemap.setCollision has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Tilemap.setCollisionBetween has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Tilemap.setCollisionByExclusion has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Tilemap.setCollisionByIndex has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Graphics.drawTriangles will draw an array of vertices to the Graphics object (thanks @codevinsky, #795)
* Polygon.area will calculate the area of the Polygon (thanks @codevinsky, #795)
* The Tiled JSON parser will now include Tiled polygons, ellipse and rectangle geometry objects in the resulting map data (thanks @tigermonkey, #791)
* Input.addMoveCallback allows you to bind as many callbacks as you like to the DOM move events (Input.setMoveCallback is now flagged as deprecated)
* Input.deleteMoveCallback will remove a previously set movement event callback.
* Mouse will now check if it's over the game canvas or not and set Pointer.withinGame accordingly.
* Mouse.mouseOutCallback callback added for when the mouse is no longer over the game canvas.
* Mouse.stopOnGameOut boolean controls if Pointer.stop will be called if the mouse leaves the game canvas (defaults to false)
* Tilemap.searchTileIndex allows you to search for the first tile matching the given index, with optional skip and reverse parameters.
* Tilemap.layer is a getter/setter to the current layer object (which can be changed with Tilemap.setLayer)
* Cache.checkKey added - allows you to pass in a Cache type and a key and return a boolean.
* Cache.checkCanvasKey(key) - Check if a Canvas key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkTextureKey(key) - Check if a Texture key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkSoundKey(key) - Check if a Sound key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkTextKey(key) - Check if a Text key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkPhysicsKey(key) - Check if a Physics key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkTilemapKey(key) - Check if a Tilemap key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkBinaryKey(key) - Check if a Binary key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkBitmapDataKey(key) - Check if a BitmapData key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkBitmapFontKey(key) - Check if a BitmapFont key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkJSONKey(key) - Check if a JSON key exists in the cache (thanks to @delta11 for the proposal)
* New movement data added for a Pointer Locked mouse (Pointer.movementX/Y) (thanks @woutercommandeur, #831)
* ScaleManager.bounds is a Rectangle object that holds the exact size of the game canvas, taking DOM offset and game scale into account.

### Plugins

The Plugins have now all moved to [their own repository](https://github.com/photonstorm/phaser-plugins)

### Bug Fixes

* Line.pointOnLine corrected algorithm (thanks @woutercommandeur, fix #784)
* Line segment collision fails under certain cicumstances (thanks @woutercommandeur, fix #760)
* The P2 DistanceConstraint method signature has changed. Updated Phaser so maxForce is now passed as object (fix #788)
* Moved the this._reversed flag outside of the property loop in Tween (as per tween.js issue 115)
* Emitter.makeParticles updated to use Array.isArray() check on the key/frame values, so non-string objects can be passed in (thanks @AnderbergE, fix #786)
* Tilemap.createFromObjects will now force the creation of the property again even if it doesn't exist (regression fix from 2.0.4)
* Phaser.Line.intersectsPoints fixed by properly checking the boundaries (thanks @woutercommandeur, fix #790)
* Group.set and setAll were changed in 2.0.4 to not create the property unless it existed. This broke backwards compatibility, so has been fixed.
* Sound.play now returns the Sound object (thanks @AnderbergE, fix #802)
* Device Silk UA test updated to avoid Safari conflict (thanks @jflowers45, fix #810)
* Sound.stop on Samsung S4 would randomly throw a DOM error. Wrapped the audio stop in a try/catch (thanks FSDaniel)
* RandomDataGenerator.integerInRange would return a non-integer value if you passed in a float.
* Timer class updated so that code-resumed pauses don't mess up the internal _pausedTotal value (thanks @joelrobichaud, fix #814)
* Timer class when paused by code after a game-level pause wouldn't set the codepaused flag (thanks @joelrobichaud, fix #814)
* Stage.backgroundColor now properly accepts hex #RRGGBB and color values 0xRRGGBB again (fix #785)
* Color.getRGB would return incorrect color components if a color value without alpha was given, now works with both 0xRRGGBB and 0xAARRGGBB.
* Color.getWebRGB now works regardless if you give an 0xRRGGBB or 0xAARRGGBB color value.
* If an object was drag enabled with bringToTop, the onDragStop event wouldn't fire until the mouse was next moved (thanks @alpera, fix #813)
* RetroFont.text would throw WebGL errors due to an issue with Pixi.RenderTexture. Fixed in Phaser and submitted code to Pixi.
* RenderTexture.resize would throw WebGL errors due to an issue with Pixi.RenderTexture. Fixed in Phaser and submitted code to Pixi.
* Group.hasProperty fixed to not use hasOwnProperty, but a series of `in` checks (thanks @mgiuffrida for the idea, #829)
* Tilemap.removeTile sets tiles to null but should set to index of -1 (thanks @draklaw, fix #835)

## Version 2.0.4 - "Mos Shirare" - 29th April 2014

### Updates

* Updated to [Pixi.js 1.5.3](https://github.com/GoodBoyDigital/pixi.js/releases/tag/1.5.3)
* Updated to latest [p2.js](https://github.com/schteppe/p2.js/commits/master) - all commits from 0.5.0 to Apr 27th 2014.
* TypeScript definitions fixes and updates (thanks @clark-stevenson @metrofun @killalau)
* Timer has removed all use of local temporary vars in the core update loop.
* The Input.reset `hard` reset parameter is now passed down to the Keyboard and Key reset methods.
* AnimationManager.destroy now iterates through child animations calling destroy on all of them, avoiding a memory leak (thanks stauzs)
* AnimationManager.play will now call Animation.stop on the current animation before switching to the new one (thanks @nihakue, #713)
* ArcadePhysics.Body.phase is checked in postUpdate to prevent it from being called multiple times in a single frame.
* Group.setProperty will now check if the property exists before setting it, this applies to Group.setAll and anything else using setProperty internally.
* QuadTree.retrieve now checks to see if the given Sprite has a body before carrying on.
* ArcadePhysics.collideSpriteVsGroup checks if Sprite has a body before carrying on, now safely skips sub-groups or other non-Sprite group children.
* Group.remove now checks the child to see if it's a member of the root Group before removing it, otherwise Pixi throws an Error.
* The Emitter no longer checks if minParticleScale = maxParticleScale for the scale check, allowing for fixed scale particles again.
* The PIXI.AbstractFilter is now included in the Phaser Pixi build by default, allowing for easier use of external Pixi Filters.
* All Game Objects have a new property: destroyPhase (boolean) which is true if the object is in the process of being destroyed, otherwise false.
* If Tween.yoyo was true but repeat was 0 then it wouldn't yoyo. Now if yoyo is set, but not repeat, the repeat count gets set to 1 (thanks @hilts-vaughan, fix #744)
* RandomDataGenerator.integerInRange uses a new method of rounding the value to an integer to avoid distribution probability issues (thanks PhaserFan)
* Updated the Device little / big endianess check.
* Time has been updated so that physicsElapsed can never be zero (falls back to 1/60), also fixes p2 elapsed time bug (thanks @georgiee, fix #758)
* Input and Pointer now use the new ArrayList instead of a LinkedList, which resolve list item removable during callback issues.
* Input.reset no longer resets every interactive item it knows of, because they are removed during the destroy phase and can now persist between States if needed.
* Blank Tilemaps no longer create `null` tiles, but instead create Tile objects with an index of -1 which can be replaced and updated like any other tile.
* Tilemap.addTilesetImage will now raise a console.warn if you specify an invalid tileset key and not create the tileset rather than pick the default set.
* Math.smoothstep and Math.smootherstep have been updated to work regardless if a is > or < b (thanks @gre, fix #772)
* Text.updateText now sets the lineCap to `round` to avoid occasional font glitching issues in Chrome.
* Loader now uses XDomainRequest in IE9 to load JSON data to help with CORS issues.

### New Features

* New Phaser Project Template specifically for requireJS in the `resources/Project Templates` folder (many thanks @ashatch)
* Loader now has an onFileStart event you can listen for (thanks @codevinsky, #705)
* Group.classType allows you to change the type of object that Group.create or createMultiple makes from Phaser.Sprite to your own custom class.
* Timer.clearPendingEvents will purge any events marked for deletion, this is run automatically at the start of the update loop.
* Device.crosswalk detects if your game is running under Intels Crosswalk XDK.
* Keyboard.reset has a new `hard` parameter which controls the severity of the reset. A soft reset doesn't remove any callbacks or event listeners.
* Key.reset has a new `hard` parameter which controls the severity of the reset. A soft reset doesn't remove any callbacks or event listeners.
* InputManager.resetLocked - If the Input Manager has been reset locked then all calls made to InputManager.reset, such as from a State change, are ignored.
* Group.resetCursor will reset the Group cursor back to the start of the group, or to the given index value.
* World.wrap will take a game object and if its x/y coordinates fall outside of the world bounds it will be repositioned on the opposite side, for a wrap-around effect.
* Device.support32bit is a new boolean that sets if the context supports 32bit pixel manipulation using array buffer views or not.
* P2.World now has its own pause and resume methods, so you can pause the physics simulation independent of your game (thanks @georgiee)
* Phaser.ArrayList is a new iterative object, similar in principal to a set data structure, but operating on a single array without modifying the object structure.
* Add scaleMode params to FilterTexture and RenderTexture (pixi.js update by @giraluna)
* Your State can now have a pauseUpdate method, which is called constantly when the game is paused.
* Timer.timeCap is a new setting allowing your Timers to protect against unexpectedly large delta timers (such as raf de-vis or CPU grind).
* Camera.unfollow allows you to easily unfollow a tracked object (thanks @alvinsight, #755)
* Animation.setFrame allows you to set the animation to a specific frame (thanks @adamholdenyall, #706)
* Point.dot - get the dot product of two Point objects.
* Point.cross - get the cross product of two Point objects.
* Point.cross - get the cross product of two Point objects.
* Point.perp - make the Point perpendicular (90 degrees rotation)
* Point.rperp - make the Point perpendicular (-90 degrees rotation)
* Point.normalRightHand - Right-hand normalize (make unit length) a Point.
* Point.angle - Returns the angle between this Point object and another object with public x and y properties.
* Point.angleSq - Returns the angle squared between this Point object and another object with public x and y properties.
* Point.getMagnitudeSq - Calculates the length squared of the Point object.
* Point.project - Project two Points onto another Point.
* Point.projectUnit - Project two Points onto a Point of unit length.
* Point.multiplyAdd - Adds two 2D Points together and multiplies the result by the given scalar.
* Point.negative - Creates a negative Point.
* Point.interpolate - Interpolates the two given Points, based on the `f` value (between 0 and 1) and returns a new Point.
* Color.packPixel packs an rgb component into a single integer.
* Color.unpackPixel unpacks an integer into a color object.
* Color.fromRGBA converts an integer in 0xRRGGBBAA format to a color object.
* Color.toRGBA converts rgba components into a 32-bit integer.
* Color.RGBtoHSL converts an rgb color into hsl (hue, saturation, lightness)
* Color.HSLtoRGB converts hsl values into an rgb color object.
* Color.RGBtoHSV converts an rgb color into hsv (hue, saturation, value)
* Color.HSVtoRGB converts an hsv value into an rgb color object.
* Color.createColor - creates the new light-weight color object used by most Color conversion methods.
* Color.updateColor - updates an existing color object to update the rgba property.
* Color.RGBtoString converts an rgba color into a # or 0x color string.
* Color.HSVColorWheel will return an array with 360 color objects for each segment of an HSV color wheel, you can optionally set the saturation and value amounts.
* Color.HSLColorWheel will return an array with 360 color objects for each segment of an HSL color wheel, you can optionally set the saturation and lightness amounts.
* BitmapData.cls clears the current context.
* BitmapData.fill fills the context with the given color.
* BitmapData.processPixelRGB lets you perform a custom callback on every pixel in the BitmapData by passing the pixels color object to your callback.
* BitmapData.processPixel lets you perform a custom callback on every pixel in the BitmapData by passing the pixels color value to your callback.
* BitmapData.replaceRGB will scan the bitmap for a specific color and replace it with the new given one.
* BitmapData.setHSL sets the hue, saturation and lightness values on every pixel in the given region, or the whole BitmapData if no region was specified.
* BitmapData.shiftHSL shifts the hue, saturation and lightness values on every pixel in the given region, or the whole BitmapData if no region was specified.
* BitmapData.extract scans this BitmapData for all pixels matching the given r,g,b values and then draws them into the given destination BitmapData.
* BitmapData.circle draws a filled Circle to the BitmapData at the given x, y coordinates and radius in size.

### Bug Fixes

* The main Timer loop could incorrectly remove a TimerEvent if a new one was added specifically during an event callback (thanks @garyyeap, fix #710)
* Fixed the use of the destroy parameter in Group.removeAll and related functions (thanks @AnderbergE, fix #717)
* P2.World.convertTilemap now correctly checks the collides parameter of the tiles as it converts them.
* Animation.destroy didn't correctly clear the onStart, onLoop and onComplete signals.
* StateManager.restart incorrectly skipped the first additional parameter after clearCache (thanks @mariusbrn, fix #722)
* Line.angle and Math.angleBetween used Math.atan2 arguments in the wrong order (thanks @jotson, fix #724)
* Group.destroy checks parent before removing (thanks @clark-stevenson, fix #733)
* Fixed typo in P2.World.setMaterial (thanks @OpherV, fix #739)
* InputHandler._setHandCursor private var wasn't properly set, meaning the hand cursor could sometimes remain (during destroy sequence for example)
* Destroying an object with an input handler during its onDown event would throw Signals dispatch errors (thanks @jflowers45, fix #746)
* Circle.distance used an incorrect Math call if you wanted a rounded distance value (thanks @OpherV, fix #745)
* Point.distance used an incorrect Math call if you wanted a rounded distance value (thanks @OpherV, fix #745)
* P2.Body.loadPolygon has been updated to correct center of mass issues (thanks @georgiee, fix #749)
* Game checks if window.console exists before using it (should fix IE9 issues when dev tools are closed), however it is still used deeper in Pixi.
* Masks now work when used in RenderTextures / CacheAsBitmap and Filters (pixi.js update)
* Stroked text sometimes got clipped (pixi.js update)
* Polygon.contains now works for coordinates to the left of the polygon (thanks @vilcans, fix #766)
* Game pause/resume could incorrectly increment paused Timers (thanks @georgiee, fix #759)
* Animations resuming from a pause no longer skip frames (thanks @merixstudio, fix #730)
* Tilemap.fill would throw an error if called on a blank tilemap full of null values (thanks @DrHackenstein, fix #761)
* LoaderParser.bitmapFont updated so xml parsing works properly on IE9 (thanks @georgiee)
* Sounds that had been paused via game code would un-mute if the game paused and resumed.
* CSV Tilemap tiles would incorrectly set the Tile layer reference, causing collision to fail (thanks @Chapelin, fix #692)

### 2.0.4 - zero hour updates

The following issues were fixed in 2.0.4 approx. 1 hour after official release:

* ScaleManager seeds _check private var with null to avoid later comparison check (thanks @jflowers45, fix #782)
* P2.Body.applyForce should have used pxmi instead of pxm (thanks @Trufi, fix #776)
* P2 fixed creation of RevoluteConstraint by passing maxForce in the options (thanks @woutercommandeur, fix #783)
* Tilemap.getTile and getTileXY used to return `null` in 2.0.3 but returned a Tile object in 2.0.4 (with an index of -1), they now return `null` again.

## Version 2.0.3 - "Allorallen" - 11th April 2014

### Updates

* Updated to [Pixi.js 1.5.2](https://github.com/GoodBoyDigital/pixi.js/releases/tag/v1.5.2)
* Updated to [p2.js 0.5.0](https://github.com/schteppe/p2.js/releases/tag/v0.5.0)
* Return the result of P2.Body.setCircle for further chaining and manipulation (fix #659)
* Updated the PhysicsEditor plugin to maintain position, radius, mask bits, category bits and sensor flags (thanks @georgiee, #674)
* Further TypeScript defs tweaks (thanks @clark-stevenson)
* Lowered the default size of SpriteBatch from 10000 to 2000 as this yields faster results on mobile (pixi.js update)
* Fix for 'jagged' strokes on custom fonts (thanks @nickryall, #677)
* The State.update function (and thus the update of any sub-classed Sprites or other objects) is now called before Stage, Tweens, Sound, Input, etc (#662)
* The Phaser jshint process is now running on Travis (thanks @xtian, #656)
* The Phaser Gruntfile is now split up into option tasks (thanks @xtian, #638)
* Key.reset now clears any callbacks associated with the onDown and onUp events and nulls the onHoldCallback if set. Key.reset is called by Keyboard.reset when changing state.
* If you pass `null` to Tilemap.putTile as the tile parameter it will pass the call over to Tilemap.removeTile.
* TypeScript definitions updated for latest changes (thanks @clark-stevenson)
* Keyboard.stop nulls the function references after removing the event listeners (thanks @bmceldowney, #691)
* Tilemap.hasTile allows for multi-layer type parameter (thanks @Raeven0, #680)
* Grunt update to dev dependencies (thanks @xtian, #695)
* Emitter now emits Phaser.Particle objects instead of Phaser.Sprites, which can be extended as required.
* Emitter has had various local properties removed that were already declared in Phaser.Group which it extends.
* PluginManager parent parameter removed as it's redundant. Also most core functions tidied up and jsdocs fixed.
* p2.World.defaultRestitution has been deprecated and is now p2.World.restitution.
* p2.World.defaultFriction has been deprecated and is now p2.World.friction.
* p2.World now uses 4 bodies for the world boundaries, rather than 1 body with 4 shapes. This stops the bounds triggering narrowphase with every single body in the world.
* p2.World bounds are now included in the callback events such as beginContact and impact events.
* Thanks to @STuFF the Classes drop-down list in the API docs now indents the sub-classes.

### New Features

* Added ability to retrieve a single p2 fixture from the cache (thanks @georgiee, #674)
* Timers can now have a start delay value (thanks @georgiee, #660)
* CacheAsBitmap added to Display Object, so works for Sprite, Image, Button. Allows you to cache complex display hierarchies for speed.
* CacheAsBitmap added to Graphics Object. Allows you to cache complex graphics structures hierarchies for speed.
* Added generateTexture function to display objects. Create a texture from the current object display hierarchy for use as a texture elsewhere.
* Added optional FilterArea to display object (for optimisation)
* Graphics chaining functions.
* Added Pointer.positionUp which records the last point at which the pointer left the screen (thanks @Cryszon, #676)
* Phaser.Point.centroid static function added to calculate the centroid or midpoint of an array of points (thanks @lewster32, #675)
* SoundManager.remove(sound) now lets you remove a sound from the SoundManager, destroying it in the process.
* Sound.destroy will remove a sound and all local references it holds, optionally removing itself from the SoundManager as well.
* SoundManager.removeByKey(key) will remove all sounds from the SoundManager that have a key matching the given value.
* ArcadePhysics.Body.hitTest(x, y) will return a boolean based on if the given world coordinate are within the Body or not.
* StateManager.restart allows you to quickly restart the *current* state, optionally clearing the world and cache.
* Tilemap.removeTile(x, y, layer) lets you remove the tile at the given coordinates and updates the collision data.
* Tilemap.removeTileWorldXY lets you remove the tile at the given pixel value coordinates and updates the collision data.
* Key.enabled boolean allows you to toggle if a Key processes its update method or dispatches any events without deleting and re-creating it.
* Emitter now has minParticleAlpha and maxParticleAlpha values for setting a random alpha on emitted particles.
* Emitter.particleAnchor allows you to control the anchor of emitted Particles. Defaults to 0.5 (same as before) but now under your control.
* Emitter.setAlpha allows you to quickly set the min and max alpha values.
* Emitter.setScale allows you to quickly set the min and max scale values.
* Emitter.blendMode lets you set the blendMode of any emitted Particle (needs a browser that supports canvas blend modes)
* Group.customSort allows you to sort the Group children based on your own sort function.
* Emitter.setScale has a new 'rate' parameter which allows particles to change in scale over time, using any Easing value or timescale.
* Emitter.setScale now allows you to scale the x and y axis of the particles independently.
* Emitter.setAlpha has a new 'rate' parameter which allows particles to change alpha over time, using any Easing value or timescale.
* Emitter.bringToTop and Emitter.sendToBack are booleans that let you optionally set the display order of the Particle when emitted.
* Emitter now calls the Phaser.Particle.onEmit function, which is left empty for you to override and add in custom behaviours.
* p2.World has a new contactMaterial property, which can be configured like a normal P2 Contact Material and is applied when two bodies hit that don't have defined materials.
* Group.remove has a new 'destroy' parameter (false by default), which will optionally call destroy on the item removed from the Group.
* Group.removeAll has a new 'destroy' parameter (false by default), which will optionally call destroy on the items removed from the Group.
* Group.removeBetween has a new 'destroy' parameter (false by default), which will optionally call destroy on the items removed from the Group.
* @georgiee created a new P2.FixtureList class to allow easy access the fixtures of a created P2 Body:

This is especially useful in combination with PhysicsEditor and P2.Body#addPhaserPolygon.

You can configure your whole collision grouping in PhysicsEditor and then you can later change the mask bits easily with this class. You can also access parts (groups) and named fixtures by a group index or a fixture key - both properties can be set in PhysicsEditor with the custom phaser exporter.

Use cases:

* Configure collision bits in PhysicsEditor and you want to change them later.
* Place a sensor in your fixture and access this single fixture later (to disable temporarily)
* Create a small body with threes fixtures (circle, circle + polygon/convex). Now you want that the polygon part to behave like rubber and assign a bouncing (restitution > 1) material. Assign a fixture key in PhysicsEditor and access the fixture like this. (see the image for the fixture I described)

### Bug Fixes

* If you inputEnable = false a gameobject you couldn't re-enable it again using inputEnable = true, only directly via the handler (thanks @nickrall, fix #673)
* Fixed setTexture bug with TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed anchor point bug in canvas with TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed positionOffset not begin correct in TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed issue where filters were not being applied to TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed SpriteBatch canvas transform bug (pixi.js 1.5.2 bug fix)
* Fixed Cached textures issue when using base64 encoded images (@cacheflowe) (pixi.js 1.5.2 bug fix)
* Fixed issue where visibility was not being respected in sprite batch (pixi.js 1.5.2 bug fix)
* Fixed bug in gl.bindTexture which tried to use an undefined private var. (@photonstorm) (pixi.js 1.5.2 bug fix)
* Fixed the 'short cut' version of Math.floor in setTransform if roundPixels is true. (@photonstorm) (pixi.js 1.5.2 bug fix)
* SoundManager.boot will check to see if the AudioContext was created before carrying on (thanks @keyle, fix #669)
* Fixed bug where move up and move down method in groups did not work (thanks @jonthulu, fix #684)
* Fixed bug in Group.next when cursor is at the last child (thanks @jonthulu, fix #688)
* Emitter.minParticleScale and maxParticleScale wasn't resetting the Body size correctly.
* Group.removeBetween now properly iterates through the children.
* P2.World had a type in the restitution method title. Now fixed.
* Objects with an InputHandler now deactivate it when the object is removed from a Group but not destroyed (fix #672)
* Fixed the vectors used in the BlurX and BlurY filters (thanks @nickryall, fix #668)

### p2.js v0.5.0

* Added property .enableIslandSleeping to World.
* Added property .useFrictionGravityOnZeroGravity to World.
* Renamed .useWorldGravityForFrictionApproximation in World to .useWorldGravityAsFrictionGravity to keep things more uniform.
* Sleep improvements.
* Added property .frictionIterations to GSSolver, and removed .skipFrictionIterations.
* Upgraded to gl-matrix 2.1.0.
* Removed QuadTree.
* Removed mat2.
* Added Utils.extend.
* Added methods .setStiffness and .setRelaxation methods to Constraint.
* Removed properties .stiffness, .relaxation and .useGlobalEquationParameters from GSSolver.
* Added methods .setGlobalStiffness, .setGlobalRelaxation, .setGlobalEquationParameters to World.
* Renamed property .eps to .epsilon for Equation.
* Removed property .useBoundingBoxes from NaiveBroadphase in favor of the new property .boundingVolumeType in Broadphase.
* Added methods .getMaxForce and .setMaxForce to LockConstraint.
* Changed property names .bi, .bj, .ni, .ri, .rj to .bodyA, .bodyB, .normalA, .contactPointA, .contactPointB in Equation, ContactEquation and FrictionEquation classes.
* Removed IslandSolver in favor of the new property World.islandSplit.
* Changed constructors of the Constraints so they all take an options object as last parameter.
* Added property .collideConnected to Constraint.
* Added property .islandSplit to World.
* Added methods .disableBodyCollision and .enableBodyCollision to World.
* Added properties .useWorldGravityForFrictionApproximation and .frictionGravity to World.
* Added Heightfield class.
* Removed properties .defaultFriction and .defaultRestitution from World, in favor of .defaultContactMaterial.
* Added property .enabled to Equation.
* Added property .surfaceVelocity to ContactMaterial.
* Added property .sensor to Shape.
* World now emits events 'beginContact', 'endContact' and 'preSolve'.
* Added property .gravityScale to Body.
* Renamed class SAP1DBroadphase to SAPBroadphase.
* Added property .interpolatedPosition to Body`.
* Added method .internalStep to World.
* Added property .applyGravity to World.
* Renamed method .computeC to .computeInvC in Equation, and made it compute the inverse.
* Added static method Utils.splice.
* Added property .world to Body.
* Added property .fixedRotation to Body.
* Added class AABB.
* Added properties .aabb and .aabbNeedsUpdate to Body, as well as a method .updateAABB.
* Added property .useBoundingBoxes to NaiveBroadphase.
* Added static method Broadphase.aabbCheck.
* Added method .computeAABB to Shape.
* Added static method Broadphase.canCollide.
* Body now inherits from EventEmitter, and dispatches events 'sleep','sleepy' and 'wakeup'.
* Added properties .allowSleep, .sleepState, .sleepSpeedLimit, .sleepTimeLimit, .lastTimeSleepy as well as methods .sleep, .wakeUp and .sleepTick to Body.
* Added enums Body.AWAKE, Body.SLEEPY, Body.SLEEPING.
* Added property .enableBodySleeping to World.
* Added options .disableRotationalLock, .lowerLimit, .upperLimit to PrismaticConstraint constructor.
* Added methods .enableMotor, .disableMotor to PrismaticConstraint as well as properties .motorEnabled, .motorSpeed, .motorEquation.



## Version 2.0.2 - "Ghealdan" - 28th March 2014

### Bug Fixes

* Sprite would glitch if it had an ArcadePhysics Body that was re-positioned out of loop.
* Sprite would "fly off" if it had an ArcadePhysics Body that was re-positioned during an input handler.
* Tween.generateData would enter an eternal loop if the total resulted in a float. Now wrapped in Math.floor.
* ArcadePhysics.Body preUpdate has been modified to stop Sprites with non-1 scaling from gaining delta and moving off the screen (fix #644).
* ArcadePhysics.Body deltaMaxY wasn't being correctly applied.
* P2.World - Removing tilemap layer retrieval for object layers in convertCollisionObjects() (thanks bmceldowney, fix #653)
* Calling Keyboard.stop() wouldn't let you call Keyboard.start() later on in the same game

### Updated

* The "Build your First Phaser Game" Tutorial has been updated for Phaser 2
* Line.fromSprite now sets "fromCenter" to false by default as Sprite.center is deprecated in 2.x. Documentation and Examples updated to reflect this.
* All the documentation has been re-published for 2.0.2.
* Lots of ArcadePhysics.World methods have been marked as private where they shouldn't be called directly (separateX, etc)
* xtian jshint fixed nearly every single file in the repository!

### New Features

* Sprite.overlap lets you quickly check to see if the bounds of two display objects are intersecting or not, without having to use a physics system.
* Keyboard.destroy will now clear all event listeners and any custom set callbacks or Keys.



## Version 2.0.1 - "Lyrelle" - 24th March 2014

### Bug Fixes

* The Static, Kinematic and Dynamic consts that P2.Body uses were incorrect (fixes #563)
* Sprite.destroy would fail if it had an Arcade Physics body, now added.
* Group.getAt comparison updated (fixes #578)
* Fixed the IE11 version check (fixes #579)
* Ninja world collision to check right and bottom bounds (thanks dreadhorse, fix #571)
* Group enableBody parameter was incorrectly assigned to the debug var (thanks BurnedToast, fix #565)
* Fixed Tile callback check in Arcade Physics (fix #562)
* Removed the examples build script from the Gruntfile (fix #592)
* The P2 World wouldn't clear down fully on a State change, now properly clears out contacts, resets the bitmask, etc.
* Button.onInputUpHandler wouldn't set an upFrame for a frame ID of zero, made the check more strict.
* Fixed the Loader.preloadSprite crop effect on WebGL.
* Fixed Grunt script that stopped the P2 constraint classes from building properly.
* World.destroy incorrectly clashed with the Group.destroy method it over-rode, renamed to World.shutdown and updated StateManager accordingly.
* World.shutdown now removes all children iteratively, calling destroy on each one, ultimately performing a soft reset of the World.
* Objects with a scale.x or y of 0 are no longer considered valid for input (fix #602)
* InputHandler will set the browser pointer back to default if destroyed while over (fix #602)
* ArcadePhysics.separate doesn't pass over to separateX/Y if overlapOnly is true (fix #604)
* ArcadePhysics.collideSpriteVsSprite checks if both objects have bodies before processing.
* Debug.spriteBounds will now take the position of the camera into consideration when rendering the bounds (fix #603)
* InputHandler.dragFromCenter will now work regardless of the anchor point of the Sprite (fix #600)
* Emitter.friction property removed and replaced with Emitter.particleDrag, which is now correctly applied.
* ArcadePhysics.Body.reset incorrectly set the Body.rotation to Sprite.rotation instead of angle.
* Emitter.emitParticle resets the rotation on the particle to zero before emitting it.
* If no seed was given in the Game config object, the RandomDataGenerator wouldn't be started (thank tylerjhutchison fix #619)
* p2 revolute pivots were wrongly signed (thanks georgiee, fix #621)
* P2.Body.loadPolygon no longer modifies the Cache array (fix #613)
* The volume given in Sound.play now over-rides that set in Sound.addMarker if specified (fix #623)
* BitmapDatas when used as Game Object textures in WebGL now update themselves properly.
* Timer.ms now correctly reports the ms time even if the Timer has been paused (thanks Nambew, fix #624)
* If you added a Tileset to an empty map it would eventually throw an out of memory error.
* Timer objects incorrectly set the first tick value on events if you added the events prior to starting them.

### Updated

* Updated Device.isConsoleOpen as it no longer works in Chrome. Revised code and documentation accordingly (fix #593)
* Removed State.destroy empty method and replaced with State.shutdown, as that is what the StateManager expects (fix #586)
* P2.removeBody will check if the body is part of the world before removing, this avoids a TypeError from the p2 layer.
* Tilemap.createFromObjects has a new parameter: adjustY, which is true by default. Because Tiled uses a bottom-left coordinate system Phaser used to set the Sprite anchor to 0,1 to compensate. If adjustY is true it now reduces the y value by the object height instead.
* Swapped the order of the _pollGamepads gamepads check, to stop the Chrome 'webkitGamepads is deprecated' error in the console.
* Lots of TypeScript definitions updates (thanks as always to clark for these)
* Removed Device.patchAndroidClearRectBug as it's no longer used internally.
* Math.wrapAngle now supports radians (thanks Cryszon, #597)
* Group.replace will now return the old child, the one that was replaced in the Group.
* Group.destroy has a new parameter: `soft`. A soft destruction won't remove the Group from its parent or null game references. Default is `false`.
* InputHandler.validForInput is a new method that checks if the handler and its owner should be considered for Pointer input handling or not.
* ArcadePhysics.Body now checks the ArcadePhysics.World bounds, not the game bounds.
* ArcadePhysics.Body has reverted to the 1.1.3 method of preUpdate, so you can now position sprites with x/y, drag them, etc, regardless of the Body.moves flag (issue #606)
* ArcadePhysics.World now has setBounds and setBoundsToWorld methods, which are called automatically on world resizing.
* ArcadePhysics.Body no longer sets the offset to match the anchor.
* The StateManager is now responsible for clearing down input, timers, tweens, physics, camera and the World display list.
* Removed the use of Int16Array from all Game Objects, swapped for standard Array. Phaser now runs on Android 2.x and IE9 again (fix #590)
* When creating a Sprite (via Group.create or directly) with exists = false and a P2 body, the body is not added to the world.
* Every Input class now checks to see if it has already been started. If so it doesn't add the listeners again unless they have been nulled.
* Lots of fixes to the TypeScript definitions file (thanks as always to clark-stevenson for his tireless work on these)
* Emitters now bring the particle they are about to emit to the top of the Group before doing so. Avoids particles hidden behind others.
* ArcadePhysics.Body.setSize corrected to take the parameters as positive, not negative values.
* ArcadePhysics.World.separate will now check gravity totals to determine separation order. You can set World.forceX to true to always separate on X first and skip this check.
* TileSprites now emit outOfBounds and enterBounds events accordingly.
* You can now create multiple blank layers in a Tilemap.

### New Features

* Device.getUserMedia boolean added, useful if you need access to the webcam or microphone.
* Math.removeRandom allows you to remove (and return) a random object from an array.
* ArcadePhysics.World now has a checkCollision object which can be used to toggle collision against the 4 walls of its bounds.
* Sprite.events.onEnterBounds added. This is dispatched if the Sprite leaves the bounds but then returns. The opposite of onOutOfBounds.
* Timer.removeAll will remove and clear down all events, but keeps the Timer running.
* Group.setAllChildren recursively checks if its children are Groups, and if so recursively applies the value to their children as well (feature #589)
* Time.deltaCap lets you set a cap for the delta timer. It defaults to zero (which is disabled). If you use ArcadePhysics it gets set to 0.2, but you can modify as needed.
* ArcadePhysics.Body has a deltaMax object, which allows you to cap the delta applied to the position to +- this value.
* ArcadePhysics.Body now checks the Sprite scale automatically and adjusts the body size accordingly (fix #608)
* Emitter.particleClass can now be set to any object that extends Phaser.Sprite, which will be emitted instead of a regular Sprite.
* There is a brand new PhysicsEditor export script specifically for Phaser (in the resources folder), and new p2 polygon parsing functions thanks to georgiee.

## Version 2.0.0 - "Aes Sedai" - March 13th 2014

There is an extensive [Migration Guide](https://github.com/photonstorm/phaser/blob/master/resources/Migration%20Guide.md) available for those converting from Phaser 1.x to 2.x. In the guide we detail the API breaking changes and approach to our new physics system.

### New Features

* Phaser.Image is a brand new display object perfect for logos, backgrounds, etc. You can scale, rotate, tint, blend an get input events from an Image, but it has no animation or physics body.
* You can now use the hitArea property on Sprites and Image objects. hitArea can be a geometry object (Rectangle, Circle, Polygon, Ellipse) and is used in pointerOver checks.
* InputManager.getLocalPosition(displayObject, pointer, output) will return the local coordinates of the specified displayObject and pointer.
* InputManager.hitTest will test for pointer hits against a Sprite/Image, its hitArea (if set) or any of its children.
* Text has lots of new methods to help style it: Text.fill, Text.align, Text.stroke, etc.
* Text now works happily with font names with spaces in them.
* Text.setShadow applies a drop shadow to the Text being rendered. Control the x, y, color and blur.
* Text.lineSpacing allows you to set additional spacing between each line that is rendered.
* Text.inputEnabled allows you to enable all input events over Text objects: dragging, clicking, etc - anything that works on a Sprite works on Text now too.
* Phaser.Ellipse added. A fully compatible port of the PIXI.Ellipse class, can be used in Sprite/Image hitArea tests.
* Phaser.Polygon added. A fully compatible port of the PIXI.Polygon class, can be used in Sprite/Image hitArea tests.
* InputHandler.pixelPerfectOver - performs a pixel perfect check to see if any pointer is over the current object (warning: very expensive!)
* InputHandler.pixelPerfectClick - performs a pixel perfect check but only when the pointer touches/clicks on the current object.
* TileSprite can now use a frame from a texture atlas or a sprite sheet.
* TileSprites can now be animated. See new example :)
* TileSprites have a new method: autoScroll(x, y) which sets an automatic scroll running (until stopped with TileSprite.stopScroll).
* BitmapText now uses the new XML parser which should work under CocoonJS without clashes.
* BitmapText signature changed so you can support fonts with spaces in their names.
* Loader.bitmapFont now has 2 extra parameters: xSpacing and ySpacing. These allow you to add extra spacing to each letter or line of the font.
* Added the new RetroFont class. This is for rendering fixed-width bitmap fonts into an Image object. It's a texture you can apply to a Sprite/Image.
* Added Cache.updateFrameData which is really useful for swapping FrameData blocks in the cache.
* Loader.physics now lets you load Lime + Corona JSON Physics data, which can be used with Body.loadPolygon and Body.loadData.
* Cache.addPhysicsData and Cache.getPhysicsData allow you to store parsed JSON physics data in the cache, for sharing between Bodies.
* fixedToCamera now works across all display objects. When enabled it will fix at its current x/y coordinate, but can be changed via cameraOffset.
* fixedToCamera now works for Groups as well :) You can fix a Group to the camera and it will influence its children.
* Tilemap.createCollisionObjects will parse Tiled data for objectgroups and convert polyline instances into physics objects you can collide with in the world.
* Loader can now load JSON files specifically (game.load.json) and they are parsed and stored in the Game.Cache. Retrieve with game.cache.getJSON(key).
* TileSprites can now receive full Input events, dragging, etc and be positioned in-world and fixed to cameras.
* The StateManager now looks for a function called 'resumed' which is called when a game un-pauses.
* Key.onHold added. This event is dispatched every time the browser sends a keydown event and the key is already being held down.
* Stage.smoothed allows you to set if sprites will be smoothed when rendered. Set to false if you're using pixel art in your game. Default is true. Works in Canvas and WebGL.
* Sprite.smoothed and Image.smoothed allows you to set per-Sprite smoothing, perfect if you just want to keep a few sprites smoothed (or not)
* StateManager.start can now have as many parameters as you like. The order is: start(key, clearWorld, clearCache, ...) - they are passed to State.init() (NOT create!)
* Loader.script now has callback (and callbackContext) parameters, so you can specify a function to run once the JS has been injected into the body.
* Phaser.Timer.stop has a new parameter: clearEvents (default true), if true all the events in Timer will be cleared, otherwise they will remain (fixes #383)
* All GameObjects now have a 'destroyChildren' boolean as a parameter to their destroy method. It's default is true and the value propagates down its children.
* Pixi GrayFilter ported over (thanks nickryall #404)
* Animation.speed added. You can now change the animation speed on the fly, without re-starting the animation (feature request #458)
* Brand new Grunt task - creates each core library as its own file and a combined phaser.js.
* New build script now cleanly splits Phaser, Pixi and p2 so they are each UMD wrapped and each available in the global scope (now more requireJS friendly!).
* phaser-no-libs.js allows you to use your own version of p2.js or pixi.js with Phaser. Warning: This is totally unsupported. If you hit bugs, you fix them yourself.
* Group.sendToBottom(child) is the handy opposite of Group.bringToTop()
* Group.moveUp(child) will move a child up the display list, swapping with the child above it.
* Group.moveDown(child) will move a child down the display list, swapping with the child below it.
* Device.windowsPhone is now tested for.
* The Debug panel now works in WebGL mode. Pay attention to the warning at the top of the Debug docs (feature request #499)
* You can now create blank Tilemaps and then populate them with data later.
* A single Animation object now has 3 new events: onStart, onLoop and onComplete.
* Animation.loopCount holds the number of times the animation has looped since it last started.
* Tween.generateData(frameRate) allows you to generate tween data into an array, which can then be used however you wish (see new examples)
* Group.xy(index, x, y) allows you to set the x and y coordinates of a Group child at the given index.
* Group.reverse() reverses the display order of all children in the Group.
* Tweens are now bound to their own TweenManager, not always the global game one. So you can create your own managers now (for you clark :)
* ScaleManager.fullScreenTarget allows you to change the DOM element that the fullscreen API is called on (feature request #526)
* Merged Georges p2 BodyDebug and reformatted for jshint pass. Looks awesome :)
* ArcadePhysics.Body has a new gravityScale property, which is a modifier multiplied against the world gravity value on a Body.
* Line.coordinatesOnLine will return all coordinates on the line using Bresenhams line algorithm.
* Line now has x, y, width, height, top, bottom, left and right properties, so you can effectively get its bounds.
* TilemapLayer.getRayCastTiles will let you get all tiles that hit the given line for further processing.

### Updates

* Massive thanks to clark-stevenson for doing an amazing job update the TypeScript definitions file.
* Debug.renderRectangle has a new parameter: filled. If true it renders as with fillRect, if false strokeRect.
* Phaser.AnimationParser now sets the trimmed data directly for Pixi Texture frames. Tested across JSON Hash, JSON Data, Sprite Sheet and XML.
* Game.add.renderTexture now has the addToCache parameter. If set the texture will be stored in Game.Cache and can be retrieved with Cache.getTexture(key).
* Game.add.bitmapData now has the addToCache parameter. If set the texture will be stored in Game.Cache and can be retrieved with Cache.getBitmapData(key).
* The InputManager now sets the canvas style cursor to 'inherit' instead of 'default'.
* World.reset now calls Camera.reset which sends the camera back to 0,0 and un-follows any object it may have been tracking.
* Added hostname: '*' to the grunt-connect in Gruntfile.js (fixes #426)
* Device, Canvas and GamePad classes all updated for better CocoonJS support (thanks Videlais)
* BitmapData.alphaMask will draw the given image onto a BitmapData using an image as an alpha mask.
* The new GameObjectCreator (which you access via game.make or State.make) lets you easily create an object but NOT add it to the display list.
* TilemapParser will now throw a warning if the tileset image isn't the right size for the tile dimensions.
* We now force IE11 into Canvas mode to avoid a Pixi bug with pre-multiplied alpha. Will remove once that is fixed, sorry, but it's better than no game at all, right? :(
* Loader.setPreloadSprite() will now set sprite.visible = true once the crop has been applied. Should help avoid issues (#430) on super-slow connections.
* Updated the way the page visibility is checked, should now be more compatible across more browsers.
* Phaser.Input.Key.isUp now defaults to 'true', as does GamepadButton.isUp (#474)
* Vastly improved visibility API support + pageshow/pagehide + focus/blur. Working across Chrome, IE, Firefox, iOS, Android (also fixes #161)
* Pausing the game will now mute audio and resuming will un-mute, unless it was muted via the game (fixes #439)
* ScaleManager has 2 new events: ScaleManager.enterFullScreen and ScaleManager.leaveFullScreen, so you can respond to fullscreen changes directly.
* RandomDataGenerator.integerInRange(min, max) now includes both `min` and `max` within its range (#501)
* Tween no longer copies all the object properties into the `_valuesStart` object on creation.
* Completely empty Tilemaps can now be created. This allows for dynamic map generation at runtime.
* Keyboard.event now stores the most recent DOM keyboard event.
* Animation.stop has a new parameter: dispatchComplete. If true it'll dispatch an Animation.onComplete event.
* TileSprites now have a physics body property and call it in the pre and post updates. As with all physics bodies it's null by default.
* json is now the default tilemap format when not defined (thanks RyanDansie, #528)
* The Particle Emitter now remembers the frames given to it and resets it when a new particle is emitted.
* Game.focusLoss and focusGain methods and onBlur and onFocus Signals added, allowing for more fine-grained control over game pause vs. focus loss.
* Keyboard.removeKey method added (thanks qdrj, #550)
* Key.event now stores the most recent DOM event that triggered it.

### Bug Fixes

* Explicitly paused Timer continues if you un-focus and focus the browser window (thanks georgiee)
* Added TimerEvent.pendingDelete and checks in Timer.update, so that removing an event in a callback no longer throws an exception (thanks georgiee)
* Fixed TypeScript defs on lines 1741-1748 (thanks wombatbuddy)
* Previously if you used Sprite.crop() it would crop all Sprites that shared the same base image. It now takes a local copy of the texture data and crops just that.
* Tilemap had the wrong @method signatures so most were missing from the docs.
* Fixed bug where changing State would cause the camera to not reset if it was following an object.
* Tile had 2 properties (callback and callbackContext) that were never assigned, updated to use the proper names (thanks ratkingsimon)
* Fixed an error that would occur if you used InputHandler.onInputUp and the Sprite destroys itself during the event.
* IE11 didn't populate the Device.ie## Version value. Now extracted from Trident revision, but still use Device.trident instead for IE11+ checks.
* Fixed bug in Math.angleBetween where it was using the coordinates in the wrong order.
* Previously using a Pixel Perfect check didn't work if the Sprite was rotated or had a non-zero anchor point, now works under all conditions + atlas frames.
* If pixelPerfect Input Sprites overlapped each other the pixel check wasn't taken into consideration in the Pointer move method.
* Updated Input.Mouse to use event.button not event.which, so the const reference from input.mouse.button is correct (thanks grimor)
* Text that was fixedToCamera would 'jitter' if the world scrolled. Now works as expected across all fixed objects.
* Fixed a bug where Sound.play wouldn't pick-up the local loop setting if not specified in the parameter.
* Active animations now monitor if the game pauses, and resume normally when the game un-pauses (fixes #179)
* Swapping between tabs will now pause the game correctly on mobile browsers (iOS7+)
* Swapping between tabs will pause and resume tweens correctly, allowing their onComplete events to still fire (fixes #292)
* Fullscreen mode now uses window.outerWidth/Height when using EXACT_FIT as the scale mode, which fixes input coordinate errors (fixes #232)
* Fullscreen mode now works in Internet Explorer and uses the new fullscreen non-prefix call.
* Fixed TilemapParser - would spit out a tileset warning if margin/spacing were set (fix #485, thanks Cybolic)
* AnimationParser.spriteSheet wasn't taking the margin or spacing into account when calculating the numbers of sprites per row/column, nor was it allowing for extra power-of-two padding at the end (fix #482, thanks yig)
* AnimationManager.add documentation said that 'frames' could be null, but the code couldn't handle this so it defaults to an empty array if none given (thanks yig)
* Fixed issue stopping SoundManager.volume from working correctly on a global volume basis (fixes #488)
* Phaser.Timer will no longer create negative ticks during game boot, no matter how small the Timer delay is (fixes #366)
* Phaser.Timer will no longer resume if it was previously paused and the game loses focus and then resumes (fixes #383)
* Tweens now resume correctly if the game pauses (focus loss) while they are paused.
* Tweens don't double pause if they were already paused and the game pauses.
* Buttons are now cleanly destroyed if part of a Group without leaving their InputHandler running.
* You can now safely destroy a Group and the 'destroyChildren' boolean will propagate fully down the display list.
* Calling destroy on an already destroyed object would throw a run-time error. Now checked for and aborted.
* Calling destroy while in an Input Event callback now works for either the parent Group or the calling object itself.
* Loader.replaceInFileList wouldn't over-write the previous entry correctly, which caused the Loader.image overwrite parameter to fail (thanks basoko, fixes #493)
* If the game was set to NO_SCALE and you swapped orientation, it would pause and resize, then fail to resize when you swapped back (thanks starnut, fixes #258)
* Device no longer things a Windows Phone or Windows Tablet are desktop devices (thanks wombatbuddy, fixes #506)
* Sound.onMarkerComplete event is now dispatched when a marker stops. See Sound.onLoop for a looping marker event (thanks registered99, fixes #500)
* Events.onInputUp would be dispatched twice if the Sprite had drag enabled, now only dispatched once (thanks Overbryd, fixes #502)
* You can now load in CSV Tilemaps again and they get created properly (fixes #391)
* Tilemap.putTile can now insert a tile into a null/blank area of the map (before it could only replace existing tiles)
* Tilemap.putTile now correctly re-calculates the collision data based on the new collideIndexes array (fixes #371)
* Circle.circumferencePoint using the asDegrees parameter would apply degToRad instead of radToDeg (thanks Ziriax, fixes #509)
* InputHandler.enableSnap now correctly assigns the snap offset parameters (fixes #515)
* Objects that are 'fixedToCamera' are now still correctly placed even if the camera is scaled (#512)
* Changed the define function calls to use named modules, allows pixi, phaser and p2 to reside in 1 file and still be located by requirejs (thanks brejep, #531)
* Cache.destroy fixed to clear up properly (thanks Dumtard, #537)



## Version 1.1.6 - "Shienar" - 24th February 2014

### New Examples

* Added lovely new little mini golf game by jpcloud.

### Updates

* Loader can now load JSON files natively (thanks lucas)
* TilemapParser now errors if the tileset isn't the right size

### Bug Fixes

* Updated Physics.Body.applyDamping so that velocity is reduced down to zero properly (thanks caezs)
* ArcadePhysics.collideSpriteVsTilemapLayer wouldn't call the process or collide callbacks if only 1 tile was involved in the check (thanks mandarinx)
* Lots of documentation fixes (thanks nhowell)
* Fix for PixiPatch so it renders masks again (thanks georgios)
* Modified ArcadePhysics.intersects so it returns a value as well as assigns (thanks bunnyhero)
* Lots of TypeScript defs fixes (thanks clark)



## Version 1.1.5 - "Saldaea" - 12th February 2014

### Bug Fixes

* Explicitly paused Timer continues if you un-focus and focus the browser window (thanks georgiee)
* Added TimerEvent.pendingDelete and checks in Timer.update, so that removing an event in a callback no longer throws an exception (thanks georgiee)
* Fixed TypeScript defs on lines 1741-1748 (thanks wombatbuddy)
* Added SAT.js to TypeScript definition. Now compiles properly.
* Added missing Line.js to the Grunt file.
* Tilemap#paste diffX and diffY equations changed, fixed issue #393 (thanks brejep)
* Added missing return value in Body.hitLeft and hitRight, fixes issue #398 (thanks ram64).
* Fixed easing tween example case. Issue #379 (thanks wesleywerner)
* Removed SAT.js UMD wrapped, fixes issue #361 (thanks luizbills)
* Removed inContact check from Body.separate.
* Fixed Tilemap docs (wrongly pointed to Tileset methods)



## Version 1.1.4 - "Kandor" - February 5th 2014

### Significant API changes

* Loader.tileset has been removed as it's no longer required, this was as part of the Tilemap system overhaul.
* TilemapLayers are now created via the Tilemap object itself: map.createLayer(x, y, width, height, tileset, layer, group) and no longer via the GameObjectFactory.
* Tilemap.createFromObjects can now turn a bunch of Tiled objects into Sprites in one single call, and copies across all properties as well.
* Tween.onStartCallback and onCompleteCallback have been removed to avoid confusion. You should use the onStart, onLoop and onComplete events instead.
* Button.forceOut default value has changed from true to false, so Buttons will revert to an Up state (if set) when pressed and released.
* The way the collision process callback works has changed significantly and now works as originally intended.
* The World level quadtree is no longer created, they are now built and ripped down each time you collide a Group, this helps collision accuracy.
* A SAT system has been integrated for Body collision and separation.
* Bodies are no longer added to a world quadtree, so have had all of their quadtree properties removed such as skipQuadtree, quadTreeIndex, etc.
* Body.drag has been removed. Please use the new Body.linearDamping value instead (which is a number value, not a Point object)
* Body.embedded and Body.wasTouching have been removed as they are no longer required.
* Body.customSeparateX/Y have been removed as you should now use Body.customSeparateCallback.
* Body.maxVelocity defaults have been removed from 10,000 to 2000.
* Body.customSeparateCallback allows you to set your own callback when two Bodies need to separate rather than using the built-in method.
* Body.collideCallback allows you to set a callback that is fired whenever the Body is hit on any of its active faces.
* Body.allowCollision has been renamed to Body.checkCollision.
* Body.rebound is a boolean that controls if a body will exchange velocity on collision. Set to false to allow it to be 'pushed' (see new examples).
* Removed Body.deltaAbsX and deltaAbsY as they are no longer used internally.
* Body.screenX and screenY moved to getters, no longer calculated every frame.
* ArcadePhysics now has setBounds and setBoundsToWorld, and you can specify which walls are created or not (left, right, up, down)
* Removed: Debug.renderSpriteTouching, Debug.renderLocalTransformInfo, Debug.renderWorldTransformInfo, Debug.renderSpriteCollision and Debug.dumpLinkedList.
* Body.setSize has been removed. Please use Body.setCircle, setRectangle or setPolygon instead.

### New Features

* Phaser.Timer is now feature complete and fully documented. You can create Phaser.TimerEvents on a Timer and lots of new examples have been provided.
* Gamepad API support has been added with lots of new examples (thanks Karl Macklin)
* Phaser.Game constructor can now be passed a single object containing all of your game settings + Stage settings. Useful for advanced configurations.
* The width/height given to Phaser.Game can now be percentages, i.e. "100%" will set the width to the maximum window innerWidth.
* Added a stage.fullScreenScaleMode property to determine scaling when fullscreen (thanks oysterCrusher)
* Added support for margin and spacing around a frame in Loader.spritesheet.
* Added Device.vibration to check if the Vibration API is available or not.
* Added Device.trident and Device.trident## Version for testing IE11.
* Added Device.silk for detecting a Kindle Fire and updated desktop OS check to exclude Kindles (thanks LuckieLordie)
* TilemapLayers now have debug and debugAlpha values, this turns on the drawing of the collision edges (very handy for debugging, as the name implies!)
* Tweens have a new event: onLoop.
* You can now load any binary file via the Loader: game.load.binary(key, url, callback) - the optional callback allows for post-load processing before entering the Cache.
* Group.set will let you deep set a new property on a single child of the Group.
* Stage.display property added. A direct reference to the root Pixi Stage object (very useful for RenderTexture manipulation)
* Added Ejecta detection to Device (thanks endel)
* Tweens can now work with relative + and - values. You can do: `tween(sprite).to( { x: '+400' })` and it will add 400 to the current sprite.x value.
* Buttons now properly use their upFrame if set.
* InputHandler now has snapOffsetX and snapOffsetY properties so your snap grid doesn't have to be 0,0 aligned (thanks srmeier)
* Loader.progressFloat contains the actual non-rounded progress value, where-as Loader.progress contains a rounded value. Use progressFloat if you've > 100 files to load.
* Groups can now be added to other Groups as children via group.add() and group.addAt()
* Groups now have an 'alive' property, which can be useful when iterating through child groups with functions like forEachAlive.
* Added a new Project Template "Full Screen Mobile" which you can find in the resources folder. Contains html / css / layout needed for a deployed Phaser game.
* Body.speed - the current speed of the body.
* Body.angle - the current angle the Body is facing based on its velocity. This is not the same as the Sprite angle that may own the body.
* Body.linearDamping - This now replaces Body.drag and provides for a much smoother damping (friction) experience.
* Body.minBounceVelocity - If a Body has bounce set, this threshold controls if it should rebound or not. Use it to stop 'jittering' on bounds/tiles with super-low velocities.
* QuadTree.populate - you can pass it a Group and it'll automatically insert all of the children ready for inspection.
* Input.setMoveCallback allows you to set a callback that will be fired each time the activePointer receives a DOM move event.
* Math.distancePow(x1,y1,x2,y2,power) returns the distance between two coordinates at the given power.
* Physics.collide now supports the 2nd parameter as an array, for when you want to collide an object against a number of sprites that aren't all in the same Group.
* Physics.overlap now supports the 2nd parameter as an array, for when you want to overlap test an object against a number of sprites that aren't all in the same Group.
* Math.reverseAngle - reverses an angle (in radians).
* Math.normalizeAngle - normalises an angle, now in radians only.
* Math.normalizeLatitude - Normalizes a latitude to the [-90,90] range.
* Math.normalizeLongitude - Normalizes a longitude to the [-180,180] range.
* Phaser.Line added to the geometry classes, with full point on line/segment and intersection tests (see new examples)
* Phaser.CANVAS_PX_ROUND is a boolean. If 'true' the Canvas renderer will Math.floor() all coordinates before drawImage, stopping pixel interpolation. Defaults to false.
* Phaser.CANVAS_CLEAR_RECT is a boolean. If 'true' (the default) it will context.clearRect() every frame. If false this is skipped (useful if you know you don't need it)
* Collision now works between Sprites positioned via sprite.x/y, sprite.body.x/y or sprite.body.velocity.
* If you are tweening a sprite and still want physics collision, set `sprite.body.moves = false` otherwise it will fight against the tween motion.
* Game.enableStep will enable core game loop stepping. When enabled you must call game.step() directly (perhaps via a DOM button?), very useful for debugging!
* Game.disableStep turns core update loop stepping off.
* Debug.renderPhysicsBody(body, color) is extremely useful for debugging the new physics bodies. Will draw the outline + points in the color given.
* Debug.renderBodyInfo(sprite, x, y, color) will display lots of Sprite body data.
* Sprite.events.onBeginContact will be fired when a Body makes contact with another Body. Once contact is over an onEndContact event will be dispatched.

### New Examples

* Physics - Bounce by Patrick OReilly.
* Physics - Bounce with gravity by Patrick OReilly.
* Physics - Bounce accelerator (use the keyboard) by Patrick OReilly.
* Physics - Bounce knock (use the keyboard) by Patrick OReilly.
* Physics - Snake (use the keyboard to control the snake like creature) by Patrick OReilly and Richard Davey.
* Physics - Launcher - Angry Birds style ball launcher demo by Patrick OReilly.
* Physics - Launcher Follow - throw the sprite anywhere in the world by Patrick OReilly.
* Physics - Launcher Follow World - an advanced version of the Launcher Follow example by Patrick OReilly.
* Input - Touch Joystick example showing how to use the clay.io virtual game controller (thanks gabehollombe)
* Games - Matching Pairs by Patrick OReilly.
* Games - Simon Says by Patrick OReilly.
* Tweens - Example showing how to use the tween events, onStart, onLoop and onComplete.
* Display - Pixi Render Texture. A Phaser conversion of the Pixi.js Render Texture example.
* Input - 5 new examples showing how to use the Gamepad API (thanks Karl Macklin)
* Animation - Group Creation, showing how to create animations across all Group children in one call.
* Particles - Rain by Jens Anders Bakke.
* Particles - Snow by Jens Anders Bakke.
* Groups - Nested Groups - showing how to embed one Group into another Group.
* Time - Lots of new examples showing how to use the updated Phaser.Timer class.

### Updates

* Updated to latest Pixi.js dev branch build (pre 1.4 release)
* When a Sprite is destroyed any active filters are removed at the same time.
* Updated Pixi.js so that removing filters now works correctly without breaking the display list.
* Phaser.Canvas.create updated so it can be given an ID as the 3rd parameter (can also be set via new Game configuration object).
* Updated display/fullscreen example to reflect new full screen change.
* Loads of updates to the TypeScript definitions files - games fully compile now and lots of missing classes added :) (thanks Niondir)
* Removed 'null parent' check from Group constructor. Will parent to game.world only if parent value is undefined.
* The tutorials have now been translated into Spanish - thanks feiss :)
* separateY updated to re-implement the 'riding platforms' special condition (thanks cocoademon)
* SoundManager.onSoundDecode now dispatches the key followed by the sound object, also now dispatched by the Cache when doing an auto-decode on load.
* Switch method of using trimmed sprites to support scaling and rotation (thanks cocoademon)
* Most of the GameObjectFactory functions now have a group parameter, so you can do: game.add.sprite(x, y, frame, frameName, group) rather than defaulting to the World group.
* Group.countLiving and countDead used to return -1 if the Group was empty, but now return 0.
* Text can now be fixedToCamera, updated world/fixed to camera example to show this.
* ArcadePhysics.overlap and collide now recognise TileSprites in the collision checks.
* Lots of documentation fixes in the Tween class.
* Tweens fire an onLoop event if they are set to repeat. onComplete is now only fired for the final repeat (or never if the repeat is infinite)
* Pointer used to un-pause a paused game every time it was clicked/touched (this avoided some rogue browser plugins). Now only happens if Stage.disableVisibilityChange is true.
* Input doesn't set the cursor to default if it's already set to none.
* You can now collide a group against itself. This will check all children against each other, but not themselves (thanks cocoademon)
* RenderTexture.render / renderXY has a new parameter: renderHidden, a boolean which will allow you to render Sprites even if their visible is set to false.
* Added in prototype.constructor definitions to every class (thanks darkoverlordofdata)
* Group.destroy has a new parameter: destroyChildren (boolean) which will optionally call the destroy method of all Group children.
* Button.clearFrames method has been added.
* Device.quirksMode is a boolean that informs you if the page is in strict (false) or quirks (true) mode.
* Canvas.getOffset now runs a strict/quirks check and uses document.documentElement when calculating scrollTop and scrollLeft to avoid Chrome console warnings.
* The Time class now has its own Phaser.Timer which you can access through game.time.events. See the new Timer examples to show how to use them.
* Added StateManager.getCurrentState to return the currently running State object (thanks Niondir)
* Removed the console.log redirect from Utils as it was messing with Firefox.
* Body.acceleration is now much smoother and less erratic at high speeds.
* Removed ArcadePhysics binding to the QuadTree, so it can now be used independently of the physics system.
* Removed ArcadePhysics.preUpdate and postUpdate as neither are needed any more.
* Body.bottom and Body.right are no longer rounded, so will give accurate sub-pixel values.
* Fixed lots of documentation in the Emitter class.
* The delta timer value used for physics calculations has had its cap limit modified from 1.0 to 0.05 in line with the core updates.
* Phaser.Math.min enhanced so you can now pass in either an array of numbers or lots of numbers as parameters to get the lowest.
* Phaser.Math.max added as the opposite of Math.min.
* Phaser.Math.minProperty and maxProperty added. Like Math.min/max but can be given a property an an array or list of objects to inspect.
* Added 'full' parameter to Body.reset, allowing you to control if motion or all data is reset or not.
* Exposed Group.pivot and Sprite.pivot to allow you to directly set the pivot points for rotation.
* Swapped to using the native and faster Array.isArray check.
* Added callback context parameter to Tween.onUpdateCallback(callback, context) to avoid having to bind or create anonymous functions.
* Updated TweenManager.removeAll so it flags all tweens as pendingDelete rather than nuking the array, to avoid tween callback array size errors (thanks DarkDev)

### Bug Fixes

* Cache.getImageKeys returned __missing in the array, now excluded.
* Fixed Group.scale so you can now scale a Group directly.
* Removed World.scale as it was preventing Group.scale from working - you can still scale the world, but you'll need to factor in Input changes yourself.
* Moved 'dirty' flag for Tilemap to a per-layer flag. Fixes #242
* Group.length now returns the number of children in the Group regardless of their exists/alive state, or 0 if the Group has no children.
* Switch Camera.setBoundsToWorld to match world.bounds instead of world (thanks cocoademon)
* Fixed an issue where passing null as the Group parent wouldn't set it to game.world as it should have (thanks tito100)
* Fixed Pixi bug (#425) incorrect width property for multi-line BitmapText (thanks jcd-as)
* Tween.onStart is now called when the tween starts AFTER the delay value, if given (thanks stevenbouma)
* Sprites that are fixedToCamera can now be input dragged regardless of world position (thanks RafaelOliveira)
* RenderTexture now displays correctly in Canvas games.
* Canvas.addToDOM is now more robust when applying the overflowHidden style.
* Fixed Pixi.StripShader which should stop the weird TileSprite GPU issues some were reporting (thanks GoodboyDigital)
* Patched desyrel.xml so it doesn't contain any zero width/height characters, as they broke Firefox 25.
* Cache.addSound now implements a locked attribute (thanks haden)
* Sound now checks for CocoonJS during playback to avoid readyState clash (thanks haden)
* Buttons now clear previously set frames correctly if you call setFrames.
* Sounds will now loop correctly if they are paused and resumed (thanks haden)
* InputHandler.checkBoundsRect and checkBoundsSprite now take into account if the Sprite is fixedToCamera or not.
* Removed the frame property from TileSprites as it cannot use them, it tiles the whole image only, not just a section of it.
* Fixed WebGLRenderer updateGraphics bug (thanks theadam)
* Removed duplicate Timer.create line (thanks hstolte)
* Fixed issue with the camera being slightly out of sync with 'fixedToCamera' sprites.
* 1px camera jitter issue fixed where map is same size, or smaller than the game size.



## Version 1.1.3 - "Arafel" - November 29th 2013

### New Features

* Phaser.Filter. A new way to use the new WebGL shaders/filters that the new version of Pixi supports.
* Phaser.BitmapData object. A Canvas you can freely draw to with lots of functions. Can be used as a texture for Sprites. See the new examples and docs for details.
* The entire Phaser library has been updated to match the new JSHint configuration.
* Added a .jshintrc so contributions can be run through JSHint to help retain formatting across the library (thanks kevinthompson)
* Added a new in-built texture. Sprites now use __default if no texture was provided (a 32x32 transparent PNG) or __missing if one was given but not found (a 32x32 black box with a green cross through it)
* Loader can now load JavaScript files. Just use game.load.script('key', 'url') - the file will be turned into a script tag in the document head on successful load.
* RenderTexture.render now takes a Phaser.Group. Also added renderXY for when you don't want to make a new Point object.
* Physics.overlap now supports Sprites, Groups or Emitters and can perform group vs. group (etc) overlap checks with a custom callback and process handler.
* Added Sound.externalNode which allows you to connect a Sound to an external node input rather than the SoundManager gain node.
* Added SoundManager.connectToMaster boolean. Used in conjunction with Sound.externalNode you can easily configure audio nodes to connect together for special effects.
* PluginManager.remove, added PluginManager.removeAll (thanks crazysam)
* scrollFactorX/scrollFactorY have been added to TilemapLayers (thanks jcd-as)
* Phaser.Game parent can now be an HTMLElement or a string (thanks beeglebug)
* Now using the latest version of Pixi.js. Which means you can use all the sexy new WebGL filters :)
* Sprite.animations.getAnimation will return an animation instance which was added by name.
* Added Mouse.button which is set to the button that was pressed: Phaser.Mouse.LEFT_BUTTON, MIDDLE_BUTTON or RIGHT_BUTTON (thanks wKLV)
* Added Mouse.pointerLock signal which you can listen to whenever the browser enters or leaves pointer lock mode.
* StageScaleMode.forceOrientation allows you to lock your game to one orientation and display a Sprite (i.e. a "please rotate" screen) when incorrect.
* World.visible boolean added, toggles rendering of the world on/off entirely.
* Polygon class & drawPolygon method added to Graphics (thanks rjimenezda)
* Added Group.iterate, a powerful way to count or return children that match a certain criteria. Refactored Group to use iterate, lots of repeated code cut.
* Added Group.sort. You can now sort the Group based on any given numeric property (x, y, health), finally you can do depth-sorting :) Example created to show.
* Enhanced renderTexture so it can accept a Phaser.Group object and improved documentation and examples.
* Device.littleEndian boolean added. Only safe to use if the browser supports TypedArrays (which IE9 doesn't, but nearly all others do)
* You can now call game.sound.play() and simply pass it a key. The sound will play if the audio system is unlocked and optionally destroy itself on complete.
* Mouse.capture is a boolean. If set to true then DOM mouse events will have event.preventDefault() applied, if false they will propagate fully.
* The object returned by Math.sinCosGenerator now contains a length property.

### Updates

* Lots of documentation fixes and updates across nearly all files. Tilemap now documented for example and lots of instances of 'Description' filled out.
* ArcadePhysics.updateMotion applies the dt to the velocity calculations as well as position now (thanks jcs)
* RequestAnimationFrame now retains the callbackID which is passed to cancelRequestAnimationFrame.
* Button now goes back to over state when setFrames used in action (thanks beeglebug)
* plugins now have a postUpdate callback (thanks cocoademon)
* Tidied up the Graphics object (thanks BorisKozo)
* If running in Canvas mode and you have a render function it will save the context and reset the transform before running your render function.
* Sprite will now check the exists property of the Group it is in, if the Group.exists = false the Sprite won't update.
* If you specify 'null' as a Group parent it will now revert to using the World as the parent (before only 'undefined' worked)
* Skip preupdate/update for PIXI hierarchies in which an ancestor doesn't exist (thanks cocoademon)
* Loader.audio can now accept either an array of URL strings or a single URL string (thanks crazysam + kevinthompson)
* MSPointer updated to support IE11 by dropping the prefix from the event listeners.
* Device.cocoonJS added to detect if the game is running under Cocoon or a native browser.
* Loader now uses a new queue system internally, meaning you can have assets with the same key spread across different types.

### Bug Fixes

* Lots of fixes to the TypeScript definitions file (many thanks gltovar)
* Tilemap commands use specified layer when one given (thanks Izzimach)
* Mouse.stop now uses the true useCapture, which means the event listeners stop listening correctly (thanks beeglebug)
* Input Keyboard example fix (thanks Atrodilla)
* BitmapText.destroy now checks if it has a canvas before calling parentNode on it.
* Group.swap had a hellish to find bug that only manifested when B-A upward swaps occurred. Hours of debugging later = bug crushed.
* Point.rotate asDegrees fixed (thanks BorisKozo)
* ArcadePhysics.separateTile wasn't returning the value, so the custom process callback wasn't getting called (thanks flameiguana)
* StageScaleMode.forceOrientation now correctly stores the forcePortrait value (thanks haden)
* Fixes to Math and Loader (thanks theJare)
* Tween - isRunning not reset when non-looped tween completes (thanks crazysam + kevinthompson)
* Math.normalizeAngle and Math.wrapAngle (thanks theJare)
* Device.isTouch modified to test maxTouchPointers instead of MSPointer.
* InputHandler.checkPointerOver now checks the visible status of the Sprite Group before processing.
* The Sprite hulls (used for tile collision) were not being updated in sprite->sprite separations (thanks jcs)
* Plugins that had a postUpdate but no Update weren't being marked as active (thanks crazysam)
* StateManager.onPausedCallback function is not called when the game is paused (thanks haden)
* Fix for 'jitter' in scrolling where tilemaps & sprites are one frame off (thanks jcs)



## Version 1.1.2 - November 1st 2013

* New: You'll now find a complete Basic project Template in the resources/Project Templates folder. Will add more complex ones soon.
* New: Phaser.Button now has the ability to set over/out/up/down sound effects so they play automatically based on those events.
* New: Added init method to plugins, to be called as they are added to the PluginManager (thanks beeglebug)
* New: Physics.Body now has a center property (issue 142, thanks MikeMnD)
* New: Lots of fixes across Full Screen Mode support. Input now works, scaling restores properly, world scale is correct and anti-alias support added.
* New: Added Group.cursor. This points to the first item added to a Group. You can move the cursor with Group.next() and Group.previous().
* New: Added Tween.isTweening(object) to check if an object is currently being tweened or not (thanks mikehamil10)
* New: Added getMagnitude, setMagnitude, normalize and isZero methods to Point (thanks beeglebug)
* New/Change: Group.callAll now supports nested functions and a context, making it really powerful!
* Updated: Fixed a few final bugs in the Sprite body and bounds calculations, in turn this resolved the Tilemap collision issues in the 1.1 release.
* Updated: Finished documentation for the Phaser.Button class.
* Updated: Fixed the Invaders game sample and enhanced it.
* Updated: Fixed the Star Struck game sample and enhanced it.
* Updated: If you pause an Animation, when you next play it it'll resume (un-pause itself).
* Updated: hexToRGB now accepts short hex codes (#EEE) (thanks beeglebug)
* Updated: State functions (preload, update, render, etc) are now passed the current game as a parameter (thanks beeglebug)
* Updated: If your game is running in Canvas (not WebGL) you can now set Stage.backgroundColor to rgba style CSS strings, allowing for semi-transparent game backgrounds.
* Updated: event.preventDefault() has been added to all Mouse event handlers.
* Updated: Sprite.deltaX/Y removed due to non-use. prevX/Y values moved to Sprite._cache.prevX/Y.
* Updated: Due to missing extends parameter the Sprite prototype was picking up functions from classes it never meant to (Button, TilemapLayer), now fully isolated.
* Fixed issue 135 - Added typeof checks into most ArcadePhysics functions to avoid errors with zero values.
* Fixed issue 136 - distanceTo using worldX/Y instead of x/y.
* Fixed lots of examples where the cursor keys / space bar were not locked from moving the browser page (if you find any more, please tell us!)
* Fixed issue 149 - Starling XML files now load properly again, also created an Example to show use of them (thanks haden)
* Fixed an issue where if the Starling XML file didn't contain a frameX/Y value it would crash on import.
* Fixed the Multiple Animations Example - it's now a lovely underwater scene :)
* Fixed issue 141 - If a Sprite is dragged and you release the Pointer while not over the Sprite, it will think it's still over it (thanks Paratron)
* Fixed issue 88 - Incorrect game.input.x/y values on click with scaled stage (thanks DrHackenstein)
* Fixed issue 143 - Entering full screen mode made the Input x/y coordinates go wrong.



## Version 1.1.1 - October 26th 2013

* Quick patch to get Phaser.AUTO working again on Firefox / Android.
* Any key added via addKey now automatically adds it to the capture list.



## Version 1.1 - October 25th 2013

### What's New

* JSDoc is go! We've added jsdoc3 blocks to every property and function, in every file and published the API docs to the docs folder.
* Brand new Example system (no more php!) and over 150 examples to learn from too.
* New TypeScript definitions file generated (in the build folder - thanks to TomTom1229 for manually enhancing this).
* New Grunt based build system added (thanks to Florent Cailhol)
* New: Phaser.Animation.generateFrameNames - really useful when creating animation data from texture atlases using file names, not indexes.
* Added Sprite.play as a handy short-cut to play an animation already loaded onto a Sprite.
* Added Canvas.setUserSelect() to disable touchCallouts and user selections within the canvas.
* Added Keyboard.addKey() which creates a new Phaser.Key object that can be polled for updates, pressed states, etc. See the 2 new examples showing use.
* Added Button.freezeFrames boolean. Stops the frames being set on mouse events if true.
* Extended the Loader 404 error to display the url of the file that didn't load as well as the key.
* New: Direction constants have been added to Sprites and adjust based on body motion.
* Brand new Sprite.update loop handler. Combined with the transform cache fix and further optimisations this is now much quicker to execute.
* Added Keyboard.createCursorKeys() which creates an object with 4 Key objects inside it mapped to up, down, left and right. See the new example in the input folder.
* Added Body.skipQuadTree boolean for more fine-grained control over when a body is added to the World QuadTree.
* Re-implemented Angular Velocity and Angular Acceleration on the Sprite.body and created 2 new examples to show use.
* Added Sprite.fixedToCamera boolean. A Sprite that is fixed to the camera doesn't move with the world, but has its x/y coordinates relative to the top-left of the camera.
* Added Group.createMultiple - useful when you need to create a Group of identical sprites for pooling, such as bullets.
* Added Group.total. Same as Group.length, but more in line with the rest of the Group naming.
* Added Sprite.outOfBoundsKill boolean flag. Will automatically kill a sprite that leaves the game World bounds (off by default).
* Lots of changes and fixes in ArcadePhysics, including:
* Functions with "mouse" in the title have been updated to "pointer" to more accurately reflect what they do.
* New velocity functions: moveToObject, moveToPointer, moveToXY
* New acceleration functions: accelerateToObject, accelerateToPointer, accelerateToXY
* New distance functions: distanceBetween, distanceToXY, distanceToPointer
* New angle functions: angleBetween, angleToXY, angleToPointer
* velocityFromAngle and velocityFromRotation added with examples created.
* Added killOnComplete parameter to Animation.play. Really useful in situations where you want a Sprite to animate once then kill itself on complete, like an explosion effect.
* Added Sprite.loadTexture(key, frame) which allows you to load a new texture set into an existing sprite rather than having to create a new sprite.
* Added Sprite.destroy back in again and made it a lot more robust at cleaning up child objects.
* Added 'return this' to all the core Loader functions so you can chain load calls if you so wish.
* Added Text.destroy() and BitmapText.destroy(), also updated Group.remove to make it more bullet-proof when an element doesn't have any events.
* Added Phaser.Utils.shuffle to shuffle an array.
* Added Graphics.destroy, x, y and updated angle functions.
* Added AnimationManager.refreshFrame - will reset the texture being used for a Sprite (useful after a crop rect clear)
* Added Physics.overlap(sprite1, sprite2) for quick body vs. body overlap tests with no separation performed.
* On a busy page it's possible for the game to boot with an incorrect stage offset x/y which can cause input events to be calculated wrong. A new property has been added to Stage to combat this issue: Stage.checkOffsetInterval. By default it will check the canvas offset every 2500ms and adjust it accordingly. You can set the value to 'false' to disable the check entirely, or set a higher or lower value. We recommend that you get the value quite low during your games preloader, but once the game has fully loaded hopefully the containing page will have settled down, so it's probably safe to disable the check entirely.
* Added Rectangle.floorAll to floor all values in a Rectangle (x, y, width and height).

### What's changed

* Renamed Phaser.Text.text to Phaser.Text.content to avoid conflict and overwrite from Pixi local var.
* Renamed Phaser.Text.style to Phaser.Text.font to avoid conflict and overwrite from Pixi local var.
* Phaser.Button now sets useHandCursor to true by default.
* Change: When you start a new State all active tweens are now purged.
* When the game boots it will now by default disable user-select and touch action events on the game canvas.
* Moved LinkedList.dump to Debug.dumpLinkedList(list)
* Phaser.Animation.Frame is now Phaser.Frame
* Phaser.Animation.FrameData is now Phaser.FrameData
* Phaser.Animation.Parser is now Phaser.AnimationParser (also the file has renamed from Parser.js to AnimationParser.js)
* Phaser.Loader.Parser is now Phaser.LoaderParser (also the file has renamed from Parser.js to LoaderParser.js)
* Change: We've removed the scrollFactor property from all Game Objects. Sorry, but the new Camera system doesn't work with it and it caused all kinds of issues anyway. We will sort out a replacement for it at a later date.
* Change: World now extends Phaser.Group. As a result we've updated GameObjectFactory and other classes that linked to it. If you have anywhere in your code that used to reference world.group you can just remove 'group' from that. So before, world.group.add() is now just world.add().
* Change: The Camera has been completely revamped. Rather than adjusting the position of all display objects (bad) it now just shifts the position of the single world container (good!), this is much quicker and also stops the game objects positions from self-adjusting all the time, allowing for them to be properly nested with other containers.
* Made Sprite.body optional and added in checks, so you can safely null the Sprite body object if using your own physics system and not impact rendering.
* Moved the Camera update checks to World.postUpdate, so all the sprites get the correct adjusted camera position.
* The default Game.antialias value is now 'true', so graphics will be smoothed automatically in canvas. Disable it via the Game constructor or Canvas utils.
* Phaser.Group now automatically calls updateTransform on any child added to it (avoids temp. frame glitches when new objects are rendered on their first frame).

### What has been updated:

* Complete overhaul of Physics.Arcade.Body - now significantly more stable and faster too.
* Updated ArcadePhysics.separateX/Y to use new body system - much better results now.
* Added World.postUpdate - all sprite position changes, as a result of physics, happen here before the render.
* Added Animation.paused - can be set to true/false.
* Added support for Body.maxVelocity (thanks cocoademon)
* InputHandler now creates the _pointerData array on creation and populates with one empty set of values, so pointerOver etc all work before a start call.
* Removed the callbackContext parameter from Group.callAll because it's no longer needed.
* Updated Group.forEach, forEachAlive and forEachDead so you can now pass as many parameters as you want, which will all be given to the callback after the child.
* Updated build script so it can be run from the command-line and includes UMD wrappers (thanks iaincarsberg)
* World.randomX/Y now returns values anywhere in the world.bounds range (if set, otherwise 0), including negative values.
* Updated InputHandler to use Math.round rather than Math.floor when snapping an object during drag.
* If you didn't provide the useNumericIndex parameter then AnimationManager.add will set the value by looking at the datatype of the first element in the frames array.
* Group.create now sets the visible and alive properties of the Sprite to the same value as the 'exists' parameter.
* World.randomX/Y now works with negative World.bounds values.
* Tweens .to will now always return the parent (thanks powerfear)
* You can now pass a PIXI.Texture to Sprite (you also need to pass a Phaser.Frame as the frame parameter) but this is useful for Sprites sharing joint canvases.
* Group.alpha is now exposed publically and changes the Group container object (not the children directly, who can still have their own alpha values)
* Device.webGL uses new inspection code to accurately catch more webGL capable devices.
* Debug.renderSpriteBody updated to use a the new Sprite.Body.screenX/Y properties.
* Additional checks added to AnimationManager.frame/frameName on the given values.
* You can now null a Sprite.crop and it will clear down the crop rect area correctly.
* Phaser.Time physicsElapsed delta timer clamp added. Stops rogue iOS / slow mobile timer errors causing crazy high deltas.
* Animation.generateFrameNames can now work in reverse, so the start/stop values can create frames that increment or decrement respectively.
* Loader updated to use xhr.responseText when loading json, csv or text files. xhr.response is still used for Web Audio binary files (thanks bubba)
* Input.onDown and onUp events now dispatch the original event that triggered them (i.e. a MouseEvent or TouchEvent) as the 2nd parameter, after the Pointer (thanks rezoner)
* Updated Sprite.crop significantly. Values are now cached, stopping constant Texture frame updates and you can do sprite.crop.width++ for example (thanks haden)
* Change: Sprite.crop needs to be enabled with sprite.cropEnabled = true.
* Sprite.loadTexture now works correctly with static images, RenderTextures and Animations.
* Lots of fixes within Sprite.bounds. The bounds is now correct regardless of rotation, anchor or scale of the Sprite or any of its parent objects.

### What has been fixed:

* QuadTree bug found in 1.0.5 now fixed. The QuadTree is updated properly now using localTransform values.
* Fixed the Bounce.In and Bounce.InOut tweens (thanks XekeDeath)
* Fixed an issue in Animation.update where if the game was paused it would get an insane delta timer throwing a uuid error.
* Added PixiPatch.js to patch in a few essential features until Pixi is updated.
* Fixed issue in Animation.play where the given frameRate and loop values wouldn't overwrite those set on construction.
* Fixed small bug stopping Tween.pause / resume from resuming correctly when called directly.
* Fixed an issue where Tweens.removeAll wasn't clearing tweens in the addition queue.
* Fixed Particle Emitters when using Emitter width/height (thanks XekeDeath)
* Made animation looping more robust when skipping frames (thanks XekeDeath)
* Fix for incorrect new particle positioning (issue #73) (thanks cottonflop)
* Fixed issue in Sound.play where if you gave a missing marker it would play the whole sound sprite instead.
* Button.setFrames will set the current frame based on the button state immediately.
* Loaded.setPreloadSprite now rounds the width/height values and starts from 1. This fixes canvas draw errors in IE9/10 and Firefox.
* Fixed issue causing Keyboard.justPressed to always fire (thanks stemkoski)
* Fixed bug in LinkedList#remove that could cause first to point to a dead node (thanks onedayitwillmake)
* Fixed Cache.addDefaultImage so the default image works in Canvas as well as WebGL. Updated to a new image (32x32 black square with green outline)
* Fixed a bug in the Sprite transform cache check that caused the skew/scale cache to get constantly invalidated - now only updates as needed, significant performance increase!
* Fixed typo in StageScaleMode so it's not pageAlignVeritcally any longer, but pageAlignVertically.
* Fixed issue in Group.countLiving / countDead where the value was off by one (thanks mjablonski)
* Fixed issue with a jittery Camera if you moved a Sprite via velocity instead of x/y placement.
* Fixed the RandomDataGenerator.sow method so if you give in the same seed you'll now get the same results (thanks Hsaka)
* Fixed Issue #101 (Mouse Button 0 is not recognised, thanks rezoner)
* Fixed an issue where creating an animation with just one frame with an index of zero would cause a UUID error (thanks SYNYST3R1)
* Fixed Rectangle.union (thanks andron77)
* Fixed Sound.resume so it now correctly resumes playback from the point it was paused (fixes issue 51, thanks Yora).
* Fixed issue 105 where a dragged object that was destroyed would cause an Input error (thanks onedayitwillmake)
* Fixed Issue 111 - calling Kill on a Phaser.Graphics instance causes error on undefined events.
* Game.destroy will now stop the raf from running as well as close down all input related event listeners (issue 92, thanks astrism)
* Pixel Perfect click detection now works even if the Sprite is part of a texture atlas.



## Version 1.0.6 - September 24th 2013

* Added check into Pointer.move to always consider a Sprite that has pixelPerfect enabled, regardless of render ID.
* BUG: The pixel perfect click check doesn't work if the sprite is part of a texture atlas yet.
* Fixed issue with anti-alias in the Game constructor not being set correctly (thanks luizbills)
* Added support for the Graphics game object back in and two examples (thanks earok for spotting)
* New: Tweens can now be chained via multiple to() calls + example created (thanks to powerfear for adding)
* Fixed Math.wrap (thanks TheJare)
* New: When loading a Sprite Sheet you can now pass negative values for the frame sizes which specifies the number of rows/columns to load instead (thanks TheJare)
* New: BitmapText now supports anchor and has fixed box dimensions (thanks TheJare)
* Fixed bug where if a State contains an empty Preloader the Update will not be called (thanks TheJare)
* Several new examples added (cameras, tweens, etc)
* Added in extra checks to halt collision if it involves an empty Group (thanks cang)
* Added time smoothing to Animation update to help frames hopefully not get too out of sync during long animations with high frame rates.
* Added frame skip to Animation.update. If it gets too far behind it will now skip frames to try and catch up.



## Version 1.0.5 - September 20th 2013

* Fixed issue in FrameData.getFrameIndexes where the input array was being ignored.
* Added Math.numberArray - Returns an Array containing the numbers from min to max (inclusive), useful for animation frame construction.
* Fixed a horrendously sneaky bug: If a new tween was created in the onComplete callback of a tween about to be deleted, it would get automatically spliced.
* Added a pendingDelete property to Tween to stop tweens that were removed during a callback from causing update errors during the TweenManager loop.
* Added Group.length property.
* Added explicit x/y attributes to Phaser.Text to make it work with the camera system (thanks cocoademon).
* Fixed issue stopping multiple animations from playing, only the most recent would play (frames array was being overwritten, thanks Legrandk)
* Updated Debug.renderSpriteBounds() so it doesn't use the deprecated Sprite.worldView any more (thanks MikeMnD)
* Added 2 new properties to the Text object: Text.text and Text.style, both are getter/setters and don't flag dirty unless changed, so safe for core loop use.
* Removed the exists check from Group.callAll, it now runs on all children (as the name implies)
* Added Group.callAllExists - you can now call a function on all children who have exists = the provided boolean.
* Finished off the Breakout example game - now fully playable, proper rebound, scoring, lives, etc.
* Removed Group.sort dummy entry until it's working.
* Removed ArcadePhysics.postUpdate.
* Updated Sprite.update to set renderable to false when the object goes out of Camera, not 'visible' false, otherwise it stops the transform being updated by Pixi.
* BUG: There is a known issue where the wrong rect coordinates are given to the QuadTree if the Sprite is a child of a Group or another Sprite which has an x/y offset.



## Version 1.0.4 - September 18th 2013

* Small fix to Phaser.Canvas to stop it from setting overflow hidden if the parent DOM element doesn't exist.
* Added Loader.setPreloadSprite(sprite, direction) - this will automatically apply a crop rect to the Sprite which is updated in line with the load progress.
* A lot of changes inside the StateManager. State functions are now passed through link() which automatically creates the key Game properties (load, input, etc)
* Fixed a bug in getFrameByName that wouldn't return the first frame in the array.
* Updated Phaser.Rectangle.intersects to use x and y instead of left and top so it can be used to check Physics bodies overlapping.
* Fixed issue in Cache where the Frame index wasn't being set correctly (thanks Cameron)
* Fixed issue in Sprite where boundsY wasn't set (thanks Cameron)
* For some reason there were 2 copies of the Canvas class in the build file - fixed, a few KB saved :)



## Version 1.0.3 - September 17th 2013

* FrameData.getFrameIndexes and getFrameIndexesByName refactored into a more versatile getFrames function.
* Various fixes to looping parameters in the Sound system.
* Documentation started across most classes. Keep track of progress in the Docs folder.
* Optimised AnimationManager.add so it will only get the required frames rather than all of them and is now faster at parsing the frame data.
* Fixed Phaser.Text and Phaser.BitmapText so they now render correctly and added several Text examples.



## Version 1.0.2 - September 16th 2013

* Added optional parameter to Animation.stop: resetFrame. If true the animation will be stopped and then the current frame reset to the first frame in the animation.
* Fixed an issue causing 'explode' particle bursts to ignore the quantity parameter.
* Added 'collideWorldBounds' to Emitter.makeParticles function.
* Added Emitter.angularDrag
* Changed Emitter.bounce from a number to a Point, so now set its x/y properties to control different amounts of bounce per axis.
* Fixed a bug in the AnimationManager where useNumericIndex was always set to true
* Added in lots of Particle examples
* Added in the start of a Breakout game
* Added in the start of a Platformer game



## Version 1.0.1 - September 15th 2013

* Added checks into every Group function to ensure that the Group has children before running them.
* Added optional flag to Group.create which allows you to set the default exists state of the Sprites.
* Sprite.animation.stop no longer needs an animation name parameter, will default to stopping the current animation.
* Fixed the license in package.json
* Fixed a logic bug in the separateTileX function that would sometimes cause tunneling of big sprites through small tiles.



## Version 1.0 - September 13th 2013

* Massive refactoring across the entire codebase.
* Removed Basic and GameObject and put Sprite on a diet. 127 properties and methods cut down to 32.
* Added a new headless renderer for non-display related performance testing.
* Added camera type to the CameraManager for future non-orthographic cameras.
* Added Camera.destroy - now clears down the FX and unregisters itself from the CameraManager.
* Added Camera.hide/show to hide Sprites or Groups from rendering (and removed corresponding hideFromCamera methods from Sprites/Groups)
* Heavily optimised Group so it no longer creates any temporary variables in any methods.
* Added Game.renderer which can be HEADLESS, CANVAS or WEBGL (coming soon)
* Added Sprite.render which is a reference to IRenderer.renderSprite, but can be overridden for custom handling.
* Refactored QuadTree so it no longer creates any temporary variables in any methods.
* The Sprite Renderer now uses a single setTransform for scale, rotation and translation that respects the Sprite.origin value in all cases.
* Sprite.modified is set to true if scale, rotation, skew or flip have been used.
* Added Tween.loop property so they can now re-run themselves indefinitely.
* Added Tween.yoyo property so they can reverse themselves after completing.
* Added Gravity to the Physics component.
* Removed Sprite.angle - use Sprite.rotation instead
* Optimised separateX/Y and overlap so they don't use any temporary vars any more.
* Added the new Physics.Body object to all Sprites. Used for all physics calculations in-game. Will be extended for Fixtures/Joints in future.
* Added SpriteUtils.setOriginToCenter to quickly set the origin of a sprite based on either frameBounds or body.bounds
* Added Sprite.Input component for tracking Input events over a Sprite
* Added Sprite.Input.useHandCursor (for desktop)
* Added Sprite.Input.justOver and justOut with a configurable ms delay
* Added Sprite.Events component for a global easy to access area to listen to events from
* Added Group.ID, each Group has a unique ID. Added Sprite.group (and Group.group) which is a reference to the Group it was added to.
* Added Group.addNewSprite(x,y,key) for quick addition of new Sprites to a Group
* Fixed Group.sort so the sortHandler is called correctly
* Added Group.swap(a,b) to swap the z-index of 2 objects with optional rendering update boolean
* Sprites dispatch new events for: killed, revived, added to Group and removed from Group.
* Added Input drag, bounds, sprite bounds and snapping support.
* Added the new ColorUtils class full of lots of handy color manipulation functions.
* Fixed issue in Camera.inCamera check where it wouldn't take into consideration the Sprites scrollFactor.
* Fixed issue with JSON Atlas loader incorrectly parsing the frames array.
* Fixed bug in FrameData.getFrameByName where the first frame of the array would always be skipped.
* Fixed bug where the Stage.backgroundColor property wasn't being saved correctly.
* Made Stage.bootScreen and Stage.pauseScreen public so you can override them with your own States now.
* Added the new OrientationScreen and Stage.enableOrientationCheck to allow for easy 'portrait/landscape only' game handling.
* Added fix to StageScaleMode for 180 degree portrait orientation on iPad.
* Added fix to orientation check so that it updates the input offsets correctly on rotation.
* Added support for minWidth and minHeight to game scale size, so it can never go below those values when scaling.
* Vastly improved orientation detection and response speed.
* Added custom callback support for all Touch and Mouse Events so you can easily hook events to custom APIs.
* Updated Game.loader and its methods. You now load images by: game.load.image() and also: game.load.atlas, game.load.audio, game.load.spritesheet, game.load.text. And you start it with game.load.start().
* Added optional frame parameter to Phaser.Sprite (and game.add.sprite) so you can set a frame ID or frame name on construction.
* Fixed bug where passing a texture atlas string would incorrectly skip the frames array.
* Added AnimationManager.autoUpdateBounds to control if a new frame should change the physics bounds of a sprite body or not.
* Added StageScaleMode.pageAlignHorizontally and pageAlignVertically booleans. When true Phaser will set the margin-left and top of the canvas element so that it is positioned in the middle of the page (based only on window.innerWidth).
* Added support for globalCompositeOperation, opaque and backgroundColor to the Sprite.Texture and Camera.Texture components.
* Added ability for a Camera to skew and rotate around an origin.
* Moved the Camera rendering into CanvasRenderer to keep things consistent.
* Added Stage.setImageRenderingCrisp to quickly set the canvas image-rendering to crisp-edges (note: poor browser support atm)
* Sprite.width / height now report the scaled width height, setting them adjusts the scale as it does so.
* Created a Transform component containing scale, skew, rotation, scrollFactor, origin and rotationOffset. Added to Sprite, Camera, Group.
* Created a Texture component containing image data, alpha, flippedX, flippedY, etc. Added to Sprite, Camera, Group.
* Added CameraManager.swap and CameraManager.sort methods and added a z-index property to Camera to control render order.
* Added World.postUpdate loop + Group and Camera postUpdate methods.
* Fixed issue stopping Pointer from working in world coordinates and fixed the world drag example.
* For consistency renamed input.scaledX/Y to input.scale.
* Added input.activePointer which contains a reference to the most recently active pointer.
* Sprite.Transform now has upperLeft, upperRight, bottomLeft and bottomRight Point properties and lots of useful coordinate related methods.
* Camera.inCamera check now uses the Sprite.worldView which finally accurately updates regardless of scale, rotation or rotation origin.
* Added Math.Mat3 for Matrix3 operations (which Sprite.Transform uses) and Math.Mat3Utils for lots of use Mat3 related methods.
* Added SpriteUtils.overlapsXY and overlapsPoint to check if a point is within a sprite, taking scale and rotation into account.
* Added Cache.getImageKeys (and similar) to return an array of all the keys for all currently cached objects.
* Added Group.bringToTop feature. Will sort the Group, move the given sprites z-index to the top and shift the rest down by one.
* Brand new Advanced Physics system added and working! Woohoo :)
* Fixed issue in Tilemap.parseTiledJSON where it would accidentally think image and object layers were map data.
* Fixed bug in Group.bringToTop if the child didn't have a group property yet.
* Fixed bug in FrameData.checkFrameName where the first index of the _frameNames array would be skipped.
* Added isRunning boolean property to Phaser.Tween
* Moved 'facing' property from Sprite.body to Sprite.texture (may move to Sprite core)
* Added Sprite.events.onDragStart and onDragStop
* A tilemap can now be loaded without a tile sheet, should you just want to get the tile data from it and not render.
* Added new Sprite.events: onAnimationStart, onAnimationComplete, onAnimationLoop
* Added in support for the Input component PriorityID value and refactored Input.Pointer to respect it. Rollovers are perfect now :)
* Added 2 new State functions: loadRender and loadUpdate, are called the same as render and update but only during the load process
* Fixed Input.stopDrag so it fires an onInputUp event as well from the sprite.
* Added support for a preRender state - very useful for certain types of special effects.
* Cameras are now limited so they can never be larger than the Game.Stage size.
* Added a new Button Game Object for easily creating in-game UI and menu systems.
* Fixed bug where Sprite.alpha wasn't properly reflecting Sprite.texture.alpha.
* Fixed bug where the hand cursor would be reset on input up, even if the mouse was still over the sprite.
* Fixed bug where pressing down then moving out of the sprite area wouldn't properly reset the input state next time you moved over the sprite.
* Added the Sprite.tween property, really useful to avoid creating new tween vars in your local scope if you don't need them.
* Added support for pagehide and pageshow events to Stage, hooked in to the pause/resume game methods.
* Extended Device audio checks to include opus and webm.
* Updated Loader and Cache so they now support loading of Audio() tags as well as Web Audio.
* Set Input.recordPointerHistory to false, you now need to enable the pointer tracking if you wish to use it.
* SoundManager will now automatically handle iOS touch unlocking.
* Added TilemapLayer.putTileWorldXY to place a tile based on pixel values, and putTile based on tile map coordinates.
* Dropped the StageScaleMode.setScreenSize iterations count from 40 down to 10 and document min body height to 2000px.
* Added Phaser.Net for browser and network specific functions, currently includes query string parsing and updating methods.
* Added a new CSS3 Filters component. Apply blur, grayscale, sepia, brightness, contrast, hue rotation, invert, opacity and saturate filters to the games stage.
* Fixed the CircleUtils.contains and containsPoint methods.
* Fixed issue with Input.speed values being too high on new touch events.
* Added Sprite.bringToTop()
* Added Stage.disableVisibilityChange to stop the auto pause/resume from ever firing.
* Added crop support to the Texture component, so you can do Sprite.crop to restrict rendering to a specified Rectangle without distortion.
* Added references to all the event listener functions so they can be cleanly destroyed.
* Fixed interesting Firefox issue when an audio track ended it fired another 'canplaythrough' event, confusing the Loader.
* Added the new PluginManager. Moved all the Camera FX over to plugins. Everything will be a plugin from now on.
* Added Sprite.transform.centerOn(x,y) to quickly center a sprite on a coordinate without messing with the sprite origin and regardless of rotation.
* Added Input.pollRate - this lets you limit how often Pointer events are handled (0 = every frame, 1 = every other frame, etc)
* Renamed the 'init' function to 'preload'. It now calls load.start automatically.
* Added CanvasUtils class, including ability to set image rendering, add a canvas to the dom and other handy things.



## Version 0.9.6 - 24th May 2013

* Virtually every class now has documentation - if you spot a typo or something missing please shout (thanks pixelpicosean).
* Grunt file updated to produce the new Special FX JS file (thanks HackManiac).
* Fixed issue stopping Phaser working on iOS 5 (iPad 1).
* Created new mobile test folder, updated index.php to use mobile CSS and made some mobile specific tests.
* Fixed a few speed issues on Android 2.x stock browser.
* Moved Camera context save/restore back inside parameter checks (sped-up Samsung S3 stock browser).
* Fixed bug with StageScaleMode.checkOrientation not respecting the NO_SCALE value.
* Added MSPointer support (thanks Diego Bezerra).
* Added Camera.clear to perform a clearRect instead of a fillRect if needed (default is false).
* Swapped Camera.opaque default from true to false re: performance.
* Updated Stage.visibilityChange to avoid pause screen locking in certain situations.
* Added StageScaleMode.enterLandscape and enterPortrait signals for easier device orientation change checks.
* Added StageScaleMode.isPortrait.
* Updated StageScaleMode to check both window.orientationchange and window.resize events.
* Updated RequestAnimationFrame to use performance.now for sub-millisecond precision and to drive the Game.time.update loop.
* Updated RequestAnimationFrame setTimeout to use fixed timestep and re-ordered callback sequence. Android 2/iOS5 performance much better now.
* Removed Stage.ORIENTATION_LANDSCAPE statics because the values should be taken from Stage.scale.isPortrait / isLandscape.
* Removed Stage.maxScaleX/Y and moved them into StageScaleMode.minWidth, minHeight, maxWidth and maxHeight.
* Fixed Stage.scale so that it resizes without needing an orientation change first.
* Added StageScaleMode.startFullscreen(), stopFullScreen() and isFullScreen for making use of the FullScreen API on desktop browsers.
* Swapped Stage.offset from Point to MicroPoint.
* Swapped Stage.bounds from Rectangle to Quad.
* Added State.destroy support. A states destroy function is called when you switch to a new state (thanks JesseFreeman).
* Added Sprite.fillColor, used in the Sprite render if no image is loaded (set via the property or Sprite.makeGraphic) (thanks JesseFreeman).
* Renamed Phaser.Finger to Phaser.Pointer.
* Updated all of the Input classes so they now use Input.pointers 1 through 10.
* Updated Touch and MSPointer to allow multi-touch support (when the hardware supports it) and created new tests to show this.
* Added Input.getPointer, Input.getPointerFromIdentifier, Input.totalActivePointers and Input.totalInactivePointers.
* Added Input.startPointer, Input.updatePointer and Input.stopPointer.
* Phaser Input now confirmed working on Windows Phone 8 (Nokia Lumia 920).
* Added Input.maxPointers to allow you to limit the number of fingers your game will listen for on multi-touch systems.
* Added Input.addPointer. By default Input will create 5 pointers (+1 for the mouse). Use addPointer() to add up to a maximum of 10.
* Added Input.position - a Vector2 object containing the most recent position of the most recently active Pointer.
* Added Input.getDistance. Find the distance between the two given Pointer objects.
* Added Input.getAngle. Find the angle between the two given Pointer objects.
* Pointer.totalTouches value keeps a running total of the number of times the Pointer has been pressed.
* Added Pointer.position and positionDown. positionDown is placed on touch and position is update on move, useful for tracking distance/direction/gestures.
* Added Game.state - now contains a reference to the current state object (if any was given).
* Moved the Input start events from the constructors to a single Input.start method.
* Added Input.disabled boolean to globally turn off all input event processing.
* Added Input.Mouse.disabled, Input.Touch.disabled, Input.MSPointer.disabled and Input.Keyboard.disabled.
* Added Device.mspointer boolean. true if MSPointer is available on the device.
* Added Input.onDown, onUp, onTap, onDoubleTap and onHold signals - all fired by the mouse or touch.
* Added Input.recordPointerHistory to record the x/y coordinates a Pointer tracks through. Also Input.recordRate and Input.recordLimit for fine control.
* Added Input.multiInputOverride which can be MOUSE_OVERRIDES_TOUCH, TOUCH_OVERRIDES_MOUSE or MOUSE_TOUCH_COMBINE.
* Added GameObject.setBoundsFromWorld to quickly set the bounds of a game object to match those of the current game world.
* Added GameObject.canvas and GameObject.context. By default they reference Stage.canvas but can be changed to anything, i.e. a DynamicTexture
* The new canvas and context references are applied to Sprite, GeomSprite and TilemapLayer
* Added DynamicTexture.assignCanvasToGameObjects() to allow you to redirect GameObject rendering en-mass to a DynamicTexture
* Added DynamicTexture.render(x,y) to render the texture to the Stage canvas
* Added Basic.ignoreGlobalUpdate - stops the object being updated as part of the main game loop, you'll need to call update on it yourself
* Added Basic.ignoreGlobalRender - stops the object being rendered as part of the main game loop, you'll need to call render on it yourself
* Added forceUpdate and forceRender parameters to Group.update and Group.render respectively. Combined with ignoreGlobal you can create custom rendering set-ups
* Fixed Loader.progress calculation so it now accurately passes a value between 0 and 100 to your loader callback
* Added a 'hard reset' parameter to Input.reset. A hard reset clears Input signals (such as on a state swap), a soft (such as on game pause) doesn't
* Added Device.isConsoleOpen() to check if the browser console is open. Tested on Firefox with Firebug and Chrome with DevTools
* Added delay parameter to Tween.to()
* Fixed bug where GeomSprite.renderOutline was being ignored for Circle objects
* Fixed bug with GeomSprite circles rendering at twice the size they should have been and offset from actual x/y values
* Added Sprite.cacheKey which stores the key of the item from the cache that was used for its texture (if any)
* Added GameMath.shuffleArray
* Updated Animation.frame to return the index of the currentFrame if set
* Added Quad.copyTo and Quad.copyFrom
* Removed the bakedRotations parameter from Emitter.makeParticles - update your code accordingly!
* Updated various classes to remove the Flixel left-over CamelCase parameters
* Updated QuadTree to use the new CollisionMask values and significantly optimised and reduced overall class size
* Updated Collision.separate to use the new CollisionMask
* Added a callback context parameter to Game.collide, Collision.overlap and the QuadTree class
* Stage.canvas now calls preventDefault() when the context menu is activated (oncontextmenu)
* Added Point.rotate to allow you to rotate a point around another point, with optional distance clamping. Also created test cases.
* Added Group.alpha to apply a globalAlpha before the groups children are rendered. Useful to save on alpha calls.
* Added Group.globalCompositeOperation to apply a composite operation before all of the groups children are rendered.
* Added Camera black list support to Sprite and Group along with Camera.show, Camera.hide and Camera.isHidden methods to populate them.
* Added GameMath.rotatePoint to allow for point rotation at any angle around a given anchor and distance
* Updated World.setSize() to optionally update the VerletManager dimensions as well
* Added GameObject.setPosition(x, y)
* Added Quad.intersectsRaw(left, right, top, bottom, tolerance)
* Updated Sprite.inCamera to correctly apply the scrollFactor to the camera bounds check
* Added Loader.crossOrigin property which is applied to loaded Images
* Added AnimationManager.destroy() to clear out all local references and objects
* Added the clearAnimations parameter to Sprite.loadGraphic(). Allows you to change animation textures but retain the frame data.
* Added the GameObjectFactory to Game. You now make Sprites like this: game.add.sprite(). Much better separation of game object creation methods now. But you'll have to update ALL code, sorry! (blame JesseFreeman for breaking your code and coming up with the idea :)
* Added GameObjectFactory methods to add existing objects to the game world, such as existingSprite(), existingTween(), etc.
* Added the GameObjectFactory to Phaser.State
* Added new format parameter to Loader.addTextureAtlas defining the format. Currently supported: JSON Array and Starling/Sparrow XML.



## Version 0.9.5 - 28th April 2013

* Moved the BootScreen and PauseScreen out of Stage into their own classes (system/screens/BootScreen and PauseScreen).
* Updated the PauseScreen to show a subtle animation effect, making it easier to create your own interesting pause screens.
* Modified Game so it splits into 3 loops - bootLoop, pauseLoop and loop (the core loop).
* Updated the BootScreen with the new logo and new color cycle effect.
* Added Game.isRunning - set to true once the Game.boot process is over IF you gave some functions to the constructor or a state.
* Fixed small bug in Signal.removeAll where it could try to shorten the _bindings even if undefined.
* Added the new FXManager which is used for handling all special effects on Cameras (and soon other game objects).
* Removed Flash, Fade and Shake from the Camera class and moved to the new SpecialFX project.
* SpecialFX compiles to phaser-fx.js in the build folder, which is copied over to Tests. If you don't need the FX, don't include the .js file.
* The project is now generating TypeScript declaration files and all Tests were updated to use them in their references.
* Fixed a bug in Flash, Fade and Shake where the duration would fail on anything above 3 seconds.
* Fixed a bug in Camera Shake that made it go a bit haywire, now shakes correctly.
* Added new Scanlines Camera FX.
* Fixed offset values being ignored in GeomSprite.renderPoint (thanks bapuna).
* Added new Mirror Camera FX. Can mirror the camera image horizontally, vertically or both with an optional fill color overlay.
* Added Camera.disableClipping for when you don't care about things being drawn outside the edge (useful for some FX).
* Updated TilemapLayer so that collision data is now stored in _tempTileBlock to avoid constant array creation during game loop.
* TilemapLayer.getTileOverlaps() now returns all tiles the object overlapped with rather than just a boolean.
* Tilemap.collide now optionally takes callback and context parameters which are used if collision occurs.
* Added Tilemap.collisionCallback and Tilemap.collisionCallbackContext so you can set them once and not re-set them on every call to collide.
* Collision.separateTile now has 2 extra parameters: separateX and separateY. If true the object will be separated on overlap, otherwise just the overlap boolean result is returned.
* Added Tile.separateX and Tile.separateY (both true by default). Set to false if you don't want a tile to stop an object from moving, you just want it to return collision data to your callback.
* Added Tilemap.getTileByIndex(value) to access a specific type of tile, rather than by its map index.
* Added TilemapLayer.putTile(x,y,index) - allows you to insert new tile data into the map layer (create your own tile editor!).
* TilemapLayer.getTileBlock now returns a unique Array of map data, not just a reference to the temporary block array
* Added TilemapLayer.swapTile - scans the given region of the map for all instances of tileA and swaps them for tileB, and vice versa.
* Added TilemapLayer.replaceTile - scans the given region of the map and replaces all instances of tileA with tileB. tileB is left unaffected.
* Added TilemapLayer.fillTiles - fills the given region of the map with the tile specified.
* Added TilemapLayer.randomiseTiles - fills the given region of the map with a random tile from the list specified.
* Added fun new "map draw" test - rebound those carrots! :)
* Changed SoundManager class to respect volume on first play (thanks initials and hackmaniac)



## Version 0.9.4 - 28th April 2013

* Added Tilemap.getTile, getTileFromWorldXY, getTileFromInputXY
* Added Tilemap.setCollisionByIndex and setCollisionByRange
* Added GameObject.renderRotation boolean to control if the sprite will visually rotate or not (useful when angle needs to change but graphics don't)
* Added additional check to Camera.width/height so you cannot set them larger than the Stage size
* Added Collision.separateTile and Tilemap.collide
* Fixed Tilemap bounds check if map was smaller than game dimensions
* Fixed: Made World._cameras public, World.cameras and turned Game.camera into a getter for it (thanks Hackmaniac)
* Fixed: Circle.isEmpty properly checks diameter (thanks bapuna)
* Updated Gruntfile to export new version of phaser.js wrapped in a UMD block for require.js/commonJS (thanks Hackmaniac)



## Version 0.9.3 - 24th April 2013

* Added the new ScrollZone game object. Endlessly useful but especially for scrolling backdrops. Created 6 example tests.
* Added GameObject.hideFromCamera(cameraID) to stop an object rendering to specific cameras (also showToCamera and clearCameraList)
* Added GameObject.setBounds() to confine a game object to a specific area within the world (useful for stopping them going off the edges)
* Added GameObject.outOfBoundsAction, can be either OUT OF BOUNDS STOP which stops the object moving, or OUT OF BOUNDS KILL which kills it.
* Added GameObject.rotationOffset. Useful if your graphics need to rotate but weren't drawn facing zero degrees (to the right).
* Added shiftSinTable and shiftCosTable to the GameMath class to allow for quick iteration through the data tables.
* Added more robust frame checking into AnimationManager
* Re-built Tilemap handling from scratch to allow for proper layered maps (as exported from Tiled / Mappy)
* Tilemap no longer requires a buffer per Camera (in prep for WebGL support)
* Fixed issues with Group not adding reference to Game to newly created objects (thanks JesseFreeman)
* Fixed a potential race condition issue in Game.boot (thanks Hackmaniac)
* Fixed issue with showing frame zero of a texture atlas before the animation started playing (thanks JesseFreeman)
* Fixed a bug where Camera.visible = false would still render
* Removed the need for DynamicTextures to require a key property and updated test cases.
* You can now pass an array or a single value to Input.Keyboard.addKeyCapture().



## Version 0.9.2 - 20th April 2013

* Fixed issue with create not being called if there was an empty init method.
* Added ability to flip a sprite (Sprite.flipped = true) + a test case for it.
* Added ability to restart a sprite animation.
* Sprite animations don't restart if you call play on them when they are already running.
* Added Stage.disablePauseScreen. Set to true to stop your game pausing when the tab loses focus.



## Version 0.9.1 - 19th April 2013

* Added the new align property to GameObjects that controls placement when rendering.
* Added an align example to the Sprites test group (click the mouse to change alignment position)
* Added a new MicroPoint class. Same as Point but much smaller / less functions, updated GameObject to use it.
* Completely rebuilt the Rectangle class to use MicroPoints and store the values of the 9 points around the edges, to be used
for new collision system.
* Game.Input now has 2 signals you can subscribe to for down/up events, see the Sprite align example for use.
* Updated the States examples to bring in-line with 0.9 release.



## Version 0.9 - 18th April 2013

* Large refactoring. Everything now lives inside the Phaser module, so all code and all tests have been updated to reflect this. Makes coding a tiny bit more verbose but stops the framework from globbing up the global namespace. Also should make code-insight work in WebStorm and similar editors.
* Added the new GeomSprite object. This is a sprite that uses a geometry class for display (Circle, Rectangle, Point, Line). It's extremely flexible!
* Added Geometry intersection results objects.
* Added new Collision class and moved some functions there. Contains all the Game Object and Geometry Intersection methods.
* Can now create a sprite animation based on frame names rather than indexes. Useful when you've an animation inside a texture atlas. Added test to show.
* Added addKeyCapture(), removeKeyCapture() and clearCaptures() to Input.Keyboard. Calls event.preventDefault() on any keycode set to capture, allowing you to avoid page scrolling when using the cursor keys in a game for example.
* Added new Motion class which contains lots of handy functions like 'moveTowardsObject', 'velocityFromAngle' and more.
* Tween Manager added. You can now create tweens via Game.createTween (or for more control game.tweens). All the usual suspects are here: Bounce, * Elastic, Quintic, etc and it's hooked into the core game clock, so if your game pauses and resumes your tweens adjust accordingly.



## Version 0.8 - 15th April 2013

* Added ability to set Sprite frame by name (sprite.frameName), useful when you've loaded a Texture Atlas with filename values set rather than using frame indexes.
* Updated texture atlas 4 demo to show this.
* Fixed a bug that would cause a run-time error if you tried to create a sprite using an invalid texture key.
* Added in DynamicTexture support and a test case for it.



## Version 0.7 - 14th April 2013

* Renamed FullScreen to StageScaleMode as it's much more fitting. Tested across Android and iOS with the various scale modes.
* Added in world x/y coordinates to the input class, and the ability to get world x/y input coordinates from any Camera.
* Added the RandomDataGenerator for seeded random number generation.
* Setting the game world size now resizes the default camera (optional bool flag)



## Version 0.6 - 13th April 2013

* Added in Touch support for mobile devices (and desktops that enable it) and populated x/y coords in Input with common values from touch and mouse.
* Added new Circle geometry class (used by Touch) and moved them into a Geom folder.
* Added in Device class for device inspection.
* Added FullScreen class to enable full-screen support on mobile devices (scrolls URL bar out of the way on iOS and Android)



## Version 0.5 - 12th April 2013

* Initial release
