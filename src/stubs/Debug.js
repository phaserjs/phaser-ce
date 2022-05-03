/**
 * @author       Steven Rogers <soldoutactivist@gmail.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * This is a stub for the Phaser Debug Class.
 * It allows you to exclude the default Debug from your build, without making Game crash.
 */

/**
 * No-operation for Phaser Debug stub.
 */
var debugNoop = function () {};

Phaser.Utils.Debug = debugNoop;

Phaser.Utils.Debug.prototype = {
    isDisabled: true,

    body: debugNoop,
    bodyInfo: debugNoop,
    boot: debugNoop,
    box2dBody: debugNoop,
    box2dWorld: debugNoop,
    cameraInfo: debugNoop,
    destroy: debugNoop,
    geom: debugNoop,
    inputInfo: debugNoop,
    key: debugNoop,
    line: debugNoop,
    lineInfo: debugNoop,
    pixel: debugNoop,
    pointer: debugNoop,
    preUpdate: debugNoop,
    quadTree: debugNoop,
    rectangle: debugNoop,
    reset: debugNoop,
    ropeSegments: debugNoop,
    soundInfo: debugNoop,
    spriteBounds: debugNoop,
    spriteCoords: debugNoop,
    spriteInfo: debugNoop,
    spriteInputInfo: debugNoop,
    start: debugNoop,
    stop: debugNoop,
    text: debugNoop,
    timer: debugNoop
};

Phaser.Utils.Debug.prototype.constructor = Phaser.Utils.Debug;
