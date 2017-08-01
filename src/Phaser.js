/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @namespace Phaser
*/
var Phaser = Phaser || {    // jshint ignore:line

    /**
    * The Phaser version number.
    * @constant Phaser.VERSION
    * @type {string}
    */
    VERSION: '2.8.3',

    /**
    * An array of Phaser game instances.
    * @constant Phaser.GAMES
    * @type {array}
    */
    GAMES: [],

    /**
    * AUTO renderer - picks between WebGL or Canvas based on device.
    * @constant Phaser.AUTO
    * @type {integer}
    */
    AUTO: 0,

    /**
    * Canvas Renderer.
    * @constant Phaser.CANVAS
    * @type {integer}
    */
    CANVAS: 1,

    /**
    * WebGL Renderer.
    * @constant Phaser.WEBGL
    * @type {integer}
    */
    WEBGL: 2,

    /**
    * Headless renderer (not visual output)
    * @constant Phaser.HEADLESS
    * @type {integer}
    */
    HEADLESS: 3,

    /**
    * WebGL Renderer with MultiTexture support enabled.
    * @constant Phaser.WEBGL_MULTI
    * @type {integer}
    */
    WEBGL_MULTI: 4,

    /**
    * Direction constant.
    * @constant Phaser.NONE
    * @type {integer}
    */
    NONE: 0,

    /**
    * Direction constant.
    * @constant Phaser.LEFT
    * @type {integer}
    */
    LEFT: 1,

    /**
    * Direction constant.
    * @constant Phaser.RIGHT
    * @type {integer}
    */
    RIGHT: 2,

    /**
    * Direction constant.
    * @constant Phaser.UP
    * @type {integer}
    */
    UP: 3,

    /**
    * Direction constant.
    * @constant Phaser.DOWN
    * @type {integer}
    */
    DOWN: 4,

    /**
    * Game Object type.
    * @constant Phaser.SPRITE
    * @type {integer}
    */
    SPRITE: 0,

    /**
    * Game Object type.
    * @constant Phaser.BUTTON
    * @type {integer}
    */
    BUTTON: 1,

    /**
    * Game Object type.
    * @constant Phaser.IMAGE
    * @type {integer}
    */
    IMAGE: 2,

    /**
    * Game Object type.
    * @constant Phaser.GRAPHICS
    * @type {integer}
    */
    GRAPHICS: 3,

    /**
    * Game Object type.
    * @constant Phaser.TEXT
    * @type {integer}
    */
    TEXT: 4,

    /**
    * Game Object type.
    * @constant Phaser.TILESPRITE
    * @type {integer}
    */
    TILESPRITE: 5,

    /**
    * Game Object type.
    * @constant Phaser.BITMAPTEXT
    * @type {integer}
    */
    BITMAPTEXT: 6,

    /**
    * Game Object type.
    * @constant Phaser.GROUP
    * @type {integer}
    */
    GROUP: 7,

    /**
    * Game Object type.
    * @constant Phaser.RENDERTEXTURE
    * @type {integer}
    */
    RENDERTEXTURE: 8,

    /**
    * Game Object type.
    * @constant Phaser.TILEMAP
    * @type {integer}
    */
    TILEMAP: 9,

    /**
    * Game Object type.
    * @constant Phaser.TILEMAPLAYER
    * @type {integer}
    */
    TILEMAPLAYER: 10,

    /**
    * Game Object type.
    * @constant Phaser.EMITTER
    * @type {integer}
    */
    EMITTER: 11,

    /**
    * Game Object type.
    * @constant Phaser.POLYGON
    * @type {integer}
    */
    POLYGON: 12,

    /**
    * Game Object type.
    * @constant Phaser.BITMAPDATA
    * @type {integer}
    */
    BITMAPDATA: 13,

    /**
    * Game Object type.
    * @constant Phaser.CANVAS_FILTER
    * @type {integer}
    */
    CANVAS_FILTER: 14,

    /**
    * Game Object type.
    * @constant Phaser.WEBGL_FILTER
    * @type {integer}
    */
    WEBGL_FILTER: 15,

    /**
    * Game Object type.
    * @constant Phaser.ELLIPSE
    * @type {integer}
    */
    ELLIPSE: 16,

    /**
    * Game Object type.
    * @constant Phaser.SPRITEBATCH
    * @type {integer}
    */
    SPRITEBATCH: 17,

    /**
    * Game Object type.
    * @constant Phaser.RETROFONT
    * @type {integer}
    */
    RETROFONT: 18,

    /**
    * Game Object type.
    * @constant Phaser.POINTER
    * @type {integer}
    */
    POINTER: 19,

    /**
    * Game Object type.
    * @constant Phaser.ROPE
    * @type {integer}
    */
    ROPE: 20,

    /**
    * Game Object type.
    * @constant Phaser.CIRCLE
    * @type {integer}
    */
    CIRCLE: 21,

    /**
    * Game Object type.
    * @constant Phaser.RECTANGLE
    * @type {integer}
    */
    RECTANGLE: 22,

    /**
    * Game Object type.
    * @constant Phaser.LINE
    * @type {integer}
    */
    LINE: 23,

    /**
    * Game Object type.
    * @constant Phaser.MATRIX
    * @type {integer}
    */
    MATRIX: 24,

    /**
    * Game Object type.
    * @constant Phaser.POINT
    * @type {integer}
    */
    POINT: 25,

    /**
    * Game Object type.
    * @constant Phaser.ROUNDEDRECTANGLE
    * @type {integer}
    */
    ROUNDEDRECTANGLE: 26,

    /**
    * Game Object type.
    * @constant Phaser.CREATURE
    * @type {integer}
    */
    CREATURE: 27,

    /**
    * Game Object type.
    * @constant Phaser.VIDEO
    * @type {integer}
    */
    VIDEO: 28,

    /**
    * Game Object type.
    * @constant Phaser.PENDING_ATLAS
    * @type {integer}
    */
    PENDING_ATLAS: -1,

    /**
    * A horizontal orientation
    * @constant Phaser.HORIZONTAL
    * @type {integer}
    */
    HORIZONTAL: 0,

    /**
    * A vertical orientation
    * @constant Phaser.VERTICAL
    * @type {integer}
    */
    VERTICAL: 1,

    /**
    * A landscape orientation
    * @constant Phaser.LANDSCAPE
    * @type {integer}
    */
    LANDSCAPE: 0,

    /**
    * A portrait orientation
    * @constant Phaser.PORTRAIT
    * @type {integer}
    */
    PORTRAIT: 1,

    /**
    * The Angle (in degrees) a Game Object needs to be set to in order to face up.
    * @constant Phaser.ANGLE_UP
    * @type {integer}
    */
    ANGLE_UP: 270,

    /**
    * The Angle (in degrees) a Game Object needs to be set to in order to face down.
    * @constant Phaser.ANGLE_DOWN
    * @type {integer}
    */
    ANGLE_DOWN: 90,

    /**
    * The Angle (in degrees) a Game Object needs to be set to in order to face left.
    * @constant Phaser.ANGLE_LEFT
    * @type {integer}
    */
    ANGLE_LEFT: 180,

    /**
    * The Angle (in degrees) a Game Object needs to be set to in order to face right.
    * @constant Phaser.ANGLE_RIGHT
    * @type {integer}
    */
    ANGLE_RIGHT: 0,

    /**
    * The Angle (in degrees) a Game Object needs to be set to in order to face north east.
    * @constant Phaser.ANGLE_NORTH_EAST
    * @type {integer}
    */
    ANGLE_NORTH_EAST: 315,

    /**
    * The Angle (in degrees) a Game Object needs to be set to in order to face north west.
    * @constant Phaser.ANGLE_NORTH_WEST
    * @type {integer}
    */
    ANGLE_NORTH_WEST: 225,

    /**
    * The Angle (in degrees) a Game Object needs to be set to in order to face south east.
    * @constant Phaser.ANGLE_SOUTH_EAST
    * @type {integer}
    */
    ANGLE_SOUTH_EAST: 45,

    /**
    * The Angle (in degrees) a Game Object needs to be set to in order to face south west.
    * @constant Phaser.ANGLE_SOUTH_WEST
    * @type {integer}
    */
    ANGLE_SOUTH_WEST: 135,

    /**
    * A constant representing a top-left alignment or position.
    * @constant  Phaser.TOP_LEFT
    * @type {integer}
    */
    TOP_LEFT: 0,

    /**
    * A constant representing a top-center alignment or position.
    * @constant Phaser.TOP_CENTER
    * @type {integer}
    */
    TOP_CENTER: 1,

    /**
    * A constant representing a top-right alignment or position.
    * @constant Phaser.TOP_RIGHT
    * @type {integer}
    */
    TOP_RIGHT: 2,

    /**
    * A constant representing a left-top alignment or position.
    * @constant Phaser.Phaser.LEFT_TOP
    * @type {integer}
    */
    LEFT_TOP: 3,

    /**
    * A constant representing a left-center alignment or position.
    * @constant Phaser.LEFT_TOP
    * @type {integer}
    */
    LEFT_CENTER: 4,

    /**
    * A constant representing a left-bottom alignment or position.
    * @constant Phaser.LEFT_BOTTOM
    * @type {integer}
    */
    LEFT_BOTTOM: 5,

    /**
    * A constant representing a center alignment or position.
    * @constant Phaser.CENTER
    * @type {integer}
    */
    CENTER: 6,

    /**
    * A constant representing a right-top alignment or position.
    * @constant Phaser.RIGHT_TOP
    * @type {integer}
    */
    RIGHT_TOP: 7,

    /**
    * A constant representing a right-center alignment or position.
    * @constant Phaser.RIGHT_CENTER
    * @type {integer}
    */
    RIGHT_CENTER: 8,

    /**
    * A constant representing a right-bottom alignment or position.
    * @constant Phaser.RIGHT_BOTTOM
    * @type {integer}
    */
    RIGHT_BOTTOM: 9,

    /**
    * A constant representing a bottom-left alignment or position.
    * @constant Phaser.BOTTOM_LEFT
    * @type {integer}
    */
    BOTTOM_LEFT: 10,

    /**
    * A constant representing a bottom-center alignment or position.
    * @constant Phaser.BOTTOM_CENTER
    * @type {integer}
    */
    BOTTOM_CENTER: 11,

    /**
    * A constant representing a bottom-right alignment or position.
    * @constant Phaser.BOTTOM_RIGHT
    * @type {integer}
    */
    BOTTOM_RIGHT: 12,

    /**
    * Various blend modes supported by Pixi.
    *
    * IMPORTANT: The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
    *
    * @constant {Object} Phaser.blendModes
    * @property {Number} blendModes.NORMAL
    * @property {Number} blendModes.ADD
    * @property {Number} blendModes.MULTIPLY
    * @property {Number} blendModes.SCREEN
    * @property {Number} blendModes.OVERLAY
    * @property {Number} blendModes.DARKEN
    * @property {Number} blendModes.LIGHTEN
    * @property {Number} blendModes.COLOR_DODGE
    * @property {Number} blendModes.COLOR_BURN
    * @property {Number} blendModes.HARD_LIGHT
    * @property {Number} blendModes.SOFT_LIGHT
    * @property {Number} blendModes.DIFFERENCE
    * @property {Number} blendModes.EXCLUSION
    * @property {Number} blendModes.HUE
    * @property {Number} blendModes.SATURATION
    * @property {Number} blendModes.COLOR
    * @property {Number} blendModes.LUMINOSITY
    * @static
    */
    blendModes: {
        NORMAL: 0,
        ADD: 1,
        MULTIPLY: 2,
        SCREEN: 3,
        OVERLAY: 4,
        DARKEN: 5,
        LIGHTEN: 6,
        COLOR_DODGE: 7,
        COLOR_BURN: 8,
        HARD_LIGHT: 9,
        SOFT_LIGHT: 10,
        DIFFERENCE: 11,
        EXCLUSION: 12,
        HUE: 13,
        SATURATION: 14,
        COLOR: 15,
        LUMINOSITY: 16
    },

    /**
    * The scale modes that are supported by Pixi.
    *
    * The DEFAULT scale mode affects the default scaling mode of future operations.
    * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
    *
    * @constant {Object} Phaser.scaleModes
    * @property {Number} Phaser.scaleModes.DEFAULT=LINEAR
    * @property {Number} Phaser.scaleModes.LINEAR Smooth scaling
    * @property {Number} Phaser.scaleModes.NEAREST Pixelating scaling
    * @static
    */
    scaleModes: {
        DEFAULT: 0,
        LINEAR: 0,
        NEAREST: 1
    },

    PIXI: PIXI || {},

    //  Used to create IDs for various Pixi objects.
    _UID: 0

};
