
# Phaser CE (Community Edition)

[Phaser CE](https://github.com/photonstorm/phaser-ce) is the Community Edition of [Phaser](https://github.com/photonstorm/phaser). It was started with the 2.7.0 release and since then the community has worked to continue updating it, fixing bugs and adding new features.

<div class="alert alert-info">See [README](https://github.com/photonstorm/phaser-ce/blob/master/README.md) for a guide to getting started with Phaser CE.</div>

# API

**Via:** If a class has an entry in the _Via_ column it means you can quickly access it through a local reference: e.g., you can control the camera via `this.camera` from any state, or `game.camera` if game has been globally defined.

| Class | Via | Description |
| ----- | --- | ----------- |
| [Game](./Phaser.Game.html) | `game` | Manages booting, creating subsystems and running the logic and render loop. |
| [World](./Phaser.World.html) | `world` | The Game World in which all Game Objects live. |
| [Camera](./Phaser.Camera.html) | `camera` | The Camera is your view into the Game World. |
| [Stage](./Phaser.Stage.html) | `stage` | The Stage is the root display object. |

<a name="gamestates"></a>

### Game States

| Class | Via | Description |
| --- | --- | --- |
| [StateManager](./Phaser.StateManager.html) | `state` | Creates, manages and swaps your Game States. |
| [State](./Phaser.State.html) | - | A base Game State object you can extend. |

<a name="loader"></a>

### Loader

| Class | Via | Description |
| --- | --- | --- |
| [Cache](./Phaser.Cache.html) | `cache` | The Cache is where all loaded assets are stored and retrieved from. |
| [Loader](./Phaser.Loader.html) | `load` | Loads all external asset types (images, audio, json, xml, txt) and adds them to the Cache. Automatically invoked by a States `preload` method. |
| [LoaderParser](./Phaser.LoaderParser.html) | - | A Static Class used by the Loader to handle parsing of complex asset types. |

<a name="gamescaling"></a>

### Game Scaling

| Class | Via | Description |
| --- | --- | --- |
| [ScaleManager](./Phaser.ScaleManager.html) | `scale` | Manages the sizing and scaling of your game across devices. |
| [FlexGrid](./Phaser.FlexGrid.html) | `scale.grid` | A responsive layout grid (still in testing) |
| [FlexLayer](./Phaser.FlexLayer.html) | - | A responsive grid layer (still in testing) |

<a name="signals"></a>

### Signals

| Class | Description |
| ----- | ----------- |
| [Signal](./Phaser.Signal.html) | Signals are Phasers internal Event system. |
| [SignalBinding](./Phaser.SignalBinding.html) | Manages which callbacks are bound to a Signal. |

<a name="plugins"></a>

### Plugins

| Class | Via | Description |
| --- | --- | --- |
| [PluginManager](./Phaser.PluginManager.html) | `plugins` | Installs, updates and destroys Plugins. |
| [Plugin](./Phaser.Plugin.html) | - | A base Plugin object you can extend. |

<a name="gameobjects"></a>

## Game Objects

| Class | Via | Description |
| --- | --- | --- |
| [GameObjectFactory](./Phaser.GameObjectFactory.html) | `add` | A helper class that can create any of the Phaser Game Objects and adds them to the Game World. |
| [GameObjectCreator](./Phaser.GameObjectCreator.html) | `make` | A helper class that can creates and returns any Phaser Game Object. |
| [Group](./Phaser.Group.html) | `add.group` | Groups can contain multiple Game Objects and have the ability to search, sort, call, update and filter them. |
| [InputHandler](./Phaser.InputHandler.html) | `<object>.input` | If a Game Object is enabled for input this class controls all input related events, including clicks and drag. |
| [Events](./Phaser.Events.html) | `<object>.events` | All of the Game Object level events. |
| [Create](./Phaser.Create.html) | `create` | Dynamic Sprite and Texture generation methods. |

<a name="display"></a>

### Display

| Class | Description |
| --- | --- |
| [Sprite](./Phaser.Sprite.html) | A Game Object with a texture, capable of running animation, input events and physics. |
| [Image](./Phaser.Image.html) | A lighter Game Object with a texture and input, but no physics or animation handlers. |
| [TileSprite](./Phaser.TileSprite.html) | A Game Object with a repeating texture that can be scrolled and scaled. |
| [Button](./Phaser.Button.html) | An Image Game Object with helper methods and events to turn it into a UI Button. |
| [SpriteBatch](./Phaser.SpriteBatch.html) | A custom Sprite Batch. Can render multiple Sprites significantly faster if they share the same texture. |
| [Rope](./Phaser.Rope.html) | A jointed Game Object with a strip-based texture. |

<a name="graphics"></a>

### Graphics

| Class | Description |
| --- | --- |
| [Graphics](./Phaser.Graphics.html) | Allows you to draw primitive shapes (lines, rects, circles), setting color, stroke and fills. |
| [BitmapData](./Phaser.BitmapData.html) | Provides a powerful interface to a blank Canvas object. Can be used as a Sprite texture. |
| [RenderTexture](./Phaser.RenderTexture.html) | A special kind of texture you can draw Sprites to extremely quickly. |

<a name="text"></a>

### Text

| Class | Description |
| --- | --- |
| [Text](./Phaser.Text.html) | Displays text using system fonts or Web Fonts, with optional fills, shadows and strokes. |
| [BitmapText](./Phaser.BitmapText.html) | A texture based text object that uses a Bitmap Font file. |
| [RetroFont](./Phaser.RetroFont.html) | Similar to a BitmapText object but uses a classic sprite sheet. Each character is a fixed-width. |

<a name="animation"></a>

### Animation

| Class | Via | Description |
| --- | --- | --- |
| [AnimationManager](./Phaser.AnimationManager.html) | `sprite.animations` | Adds, plays and updates animations on Sprite Game Objects. |
| [Animation](./Phaser.Animation.html) | - | The base Animation object that the Animation Manager creates. |
| [AnimationParser](./Phaser.AnimationParser.html) | - | Used internally by the Phaser Loader to parse animation data from external files. |
| [FrameData](./Phaser.FrameData.html) | - | A collection of Frame objects that comprise an animation. |
| [Frame](./Phaser.Frame.html) | - | A single Frame of an Animation. Stored inside of a FrameData object. |

<a name="geometry"></a>

## Geometry

| Class | Description |
| --- | --- |
| [Circle](./Phaser.Circle.html) | A Circle object consisting of a position and diameter. |
| [Ellipse](./Phaser.Ellipse.html) | An Ellipse object consisting of a position, width and height. |
| [Line](./Phaser.Line.html) | A Line object consisting of two points at the start and end of the Line. |
| [Point](./Phaser.Point.html) | A Point object consisting of an x and y position. |
| [Polygon](./Phaser.Polygon.html) | A Polygon object consisting of a series of Points. |
| [Rectangle](./Phaser.Rectangle.html) | A Rectangle object consisting of an x, y, width and height. |
| [RoundedRectangle](./Phaser.RoundedRectangle.html) | A Rectangle object consisting of an x, y, width, height and corner radius. |

<a name="time"></a>

## Time

| Class | Via | Description |
| --- | --- | --- |
| [Time](./Phaser.Time.html) | `time` | The core internal clock on which all Phaser time related operations rely. |
| [Timer](./Phaser.Timer.html) | `time.create` | A custom Timer that contains one or more TimerEvents. Can be used either once or be set to repeat. |
| [TimerEvent](./Phaser.TimerEvent.html) | `time.add` | A single time related event object. Belongs to a Phaser.Timer. |

<a name="tilemaps"></a>

## Tilemaps

| Class | Description |
| --- | --- |
| [Tilemap](./Phaser.Tilemap.html) | A Tilemap consists of one or more TilemapLayers and associated tile data. Contains methods for tile data manipulation and TilemapLayer generation. |
| [TilemapLayer](./Phaser.TilemapLayer.html) | A single layer within a Tilemap. Extends from Phaser.Sprite and is responsible for rendering itself. |
| [Tileset](./Phaser.Tileset.html) | An object containing a texture and data used for rendering tiles by a TilemapLayer. |
| [Tile](./Phaser.Tile.html) | A single Tile object with related properties. One of these exists for every tile in a map. |
| [TilemapParser](./Phaser.TilemapParser.html) | A Static class used to parse externally loaded map data. Typically called directly by Phaser.Loader. |

<a name="math"></a>

## Math

| Class | Via | Description |
| --- | --- | --- |
| [Math](./Phaser.Math.html) | `math` | Contains lots of math related helper methods including fuzzy logic and interpolation. |
| [QuadTree](./Phaser.QuadTree.html) | - | A stand-alone QuadTree implementation. Used by Arcade Physics but can also be used directly. |
| [RandomDataGenerator](./Phaser.RandomDataGenerator.html) | `rnd` | A seedable repeatable random data generator. |

<a name="network"></a>

## Network

| Class | Via | Description |
| --- | --- | --- |
| [Net](./Phaser.Net.html) | `net` | Browser URL and query string related methods. |

<a name="particles"></a>

## Particles

| Class | Via | Description |
| --- | --- | --- |
| [Particles](./Phaser.Particles.html) | `particles` | The Phaser Particle Manager. Called during the game loop and updates any associated Particle Emitters. |
| [Emitter](./Phaser.Particles.Arcade.Emitter.html) | `add.emitter` | An Arcade Physics based Particle Emitter. |
| [Particle](./Phaser.Particle.html) | - | A single Particle object as emitted by the Emitter. Extends Phaser.Sprite. |

<a name="physics"></a>

## Physics

| Class | Via | Description |
| --- | --- | --- |
| [Physics](./Phaser.Physics.html) | `physics` | The core Physics Manager. Provides access to all of the physics sub-systems. |

<a name="arcadephysics"></a>

### Arcade Physics

| Class | Via | Description |
| --- | --- | --- |
| [Arcade](./Phaser.Physics.Arcade.html) | `physics.arcade` | The Arcade Physics handler. Contains collision, overlap and movement related methods. |
| [Body](./Phaser.Physics.Arcade.Body.html) | `sprite.body` | An Arcade Physics Body. Contains velocity, acceleration, drag and other related properties. |
| [Weapon](./Phaser.Weapon.html) | `game.add.weapon` | An Arcade Physics powered Weapon plugin, for easy bullet pool management. |

<a name="ninjaphysics"></a>

### Ninja Physics

Ninja Physics is not bundled in Phaser by default. Please see the README custom build details section.

| Class | Via | Description |
| --- | --- | --- |
| [Ninja](./Phaser.Physics.Ninja.html) | `physics.ninja` | The Ninja Physics handler. Contains collision, overlap and movement related methods. |
| [Body](./Phaser.Physics.Ninja.Body.html) | `sprite.body` | A Ninja Physics Body. Contains velocity, acceleration, drag and other related properties. |
| [AABB](./Phaser.Physics.Ninja.AABB.html) | - | An AABB Ninja Physics Body type. |
| [Circle](./Phaser.Physics.Ninja.Circle.html) | - | A Circle Ninja Physics Body type. |
| [Tile](./Phaser.Physics.Ninja.Tile.html) | - | A Tile Ninja Physics Body type. |

<a name="p2physics"></a>

### P2 Physics

| Class | Via | Description |
| --- | --- | --- |
| [P2](./Phaser.Physics.P2.html) | `physics.p2` | The P2 Physics World. Contains collision, overlap and movement related methods. |
| [Body](./Phaser.Physics.P2.Body.html) | `sprite.body` | A P2 Physics Body. Contains velocity, acceleration, drag and other related properties. |
| [BodyDebug](./Phaser.Physics.P2.BodyDebug.html) | - | A Debug specific version of a P2 Body object. Renders out its shape for visual debugging. |
| [Material](./Phaser.Physics.P2.Material.html) | - | A P2 Material used for world responses, such as friction and restitution. |
| [ContactMaterial](./Phaser.Physics.P2.ContactMaterial.html) | - | A P2 Contact Material used for contact responses. |
| [CollisionGroup](./Phaser.Physics.P2.CollisionGroup.html) | - | A P2 Collision Group. |
| [FixtureList](./Phaser.Physics.P2.FixtureList.html) | - | The P2 Fixture List handler. |
| **Constraints:** | - | [Distance Constraint](./Phaser.Physics.P2.DistanceConstraint.html), [GearConstraint](./Phaser.Physics.P2.GearConstraint.html), [LockConstraint](./Phaser.Physics.P2.LockConstraint.html), [PrismaticConstraint](./Phaser.Physics.P2.PrismaticConstraint.html), [RevoluteConstraint](./Phaser.Physics.P2.RevoluteConstraint.html) |
| [PointProxy](./Phaser.Physics.P2.PointProxy.html) | - | Responsible for proxing Phaser Game World to P2 Physics values. |
| [InversePointProxy](./Phaser.Physics.P2.InversePointProxy.html) | - | Responsible for proxing Phaser Game World to inversed P2 Physics values. |
| [Spring](./Phaser.Physics.P2.Spring.html) | - | A P2 Spring object. |
| [RotationalSpring](./Phaser.Physics.P2.RotationalSpring.html) | - | A P2 Rotational Spring object. |

<a name="input"></a>

## Input

| Class | Via | Description |
| --- | --- | --- |
| [Input](./Phaser.Input.html) | `input` | The Input Manager. Responsible for handling all Input sub-systems. Also looks after Input enabled Game Objects. |
| [Pointer](./Phaser.Pointer.html) | `input.pointer` | Pointers encapsulate all mouse or touch related input, regardless of how it was generated. On multi-touch systems more than one Pointer can be active at any one time. In Input related events a reference to the corresponding Pointer is passed. |
| [DeviceButton](./Phaser.DeviceButton.html) | `pointer.leftButton`, … | Represents a button on a mouse or pen/stylus. |
| [Keyboard](./Phaser.Keyboard.html) | `input.keyboard` | The Keyboard input handler. Listens for device related events. Can also create Key objects. |
| [Key](./Phaser.Key.html) | - | A Key object is responsible for listening to a specific Key. Created by the Keyboard class. |
| [KeyCode](./Phaser.KeyCode.html) | - | The KeyCode consts are used when creating new Key objects. |
| [Mouse](./Phaser.Mouse.html) | `input.mouse` | A Mouse event handler. Listens for device related events and passes them on to the active Pointer. |
| [MSPointer](./Phaser.MSPointer.html) | `input.mspointer` | An MSPointer event handler. Listens for device related events and passes them on to the active Pointer. |
| [Touch](./Phaser.Touch.html) | `input.touch` | A Touch event handler. Listens for device related events and passes them on to the active Pointer. |

<a name="gamepads"></a>

### Gamepads

| Class | Via | Description |
| --- | --- | --- |
| [Gamepad](./Phaser.Gamepad.html) | `input.gamepad` | The Gamepad Manager looks after all connected Gamepads to the device. Creates SinglePad instances. |
| [SinglePad](./Phaser.SinglePad.html) | `input.gamepad.pad<1,4>` | Represents a single connected gamepad. |
| [DeviceButton](./Phaser.DeviceButton.html) | - | Represents a button on a SinglePad instance. |

<a name="tweens"></a>

## Tweens

| Class | Via | Description |
| --- | --- | --- |
| [TweenManager](./Phaser.TweenManager.html) | `tweens` | The Tween Manager creates, updates and destroys all active tweens. |
| [Tween](./Phaser.Tween.html) | `add.tween` | A Tween object. Consists of TweenData objects that represent the tween and any child tweens. |
| [TweenData](./Phaser.TweenData.html) | - | A TweenData object contains all the information related to a tween. Created by and belongs to a Phaser.Tween object. |
| [Easing](./Phaser.Easing.html) | - | A static class containing all of the easing functions available to Tweens. |

<a name="sound"></a>

## Sound

| Class | Via | Description |
| --- | --- | --- |
| [SoundManager](./Phaser.SoundManager.html) | `sound` | The Sound Manager controls all Sound objects and can play, loop, fade and stop Sounds. |
| [Sound](./Phaser.Sound.html) | `add.audio`, `add.sound` | A Sound object. Can be played, paused and stopped directly, and have its volume adjusted. |
| [AudioSprite](./Phaser.AudioSprite.html) | `add.audioSprite` | An Audio Sprite is a Sound object with related marker data representing sections of the audio. |

<a name="system"></a>

## System

| Class | Via | Description |
| --- | --- | --- |
| [Canvas](./Phaser.Canvas.html) | - | A static class containing Canvas creation and manipulation methods. Such as adding to the dom, setting touch actions, smoothing and image rendering. |
| [Device](./Phaser.Device.html) | `game.device` | The Device class checks system capabilities and settings on boot and stores them for later access. |
| [DOM](./Phaser.DOM.html) | - | A static class containing DOM specific methods including offset handling, viewport calibration and bounds checks. |
| [RequestAnimationFrame](./Phaser.RequestAnimationFrame.html) | `game.raf` | Abstracts away the use of RAF or setTimeOut for the core game update loop. |

<a name="utils"></a>

## Utils

| Class | Via | Description |
| --- | --- | --- |
| [ArraySet](./Phaser.ArraySet.html) | - | ArraySet is a Set data structure (items must be unique within the set) that also maintains order. |
| [ArrayUtils](./Phaser.ArrayUtils.html) | - | Array specific methods such as getRandomItem, shuffle, transposeMatrix, rotate and numberArray. |
| [Color](./Phaser.Color.html) | - | Phaser.Color is a set of static methods that assist in color manipulation and conversion. |
| [Debug](./Phaser.Utils.Debug.html) | `game.debug` | A collection of methods for displaying debug information about game objects. |
| [LinkedList](./Phaser.LinkedList.html) | - | A basic Linked List data structure. |
| [Utils](./Phaser.Utils.html) | - | Utility methods for Object and String inspection and modification. Including getProperty, pad, isPlainObject, extend and mixin. |
