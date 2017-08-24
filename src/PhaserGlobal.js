/**
 * You can create a `PhaserGlobal` object to recycle Phaser's {@link Phaser.SoundManager#context AudioContext} or change certain settings.
 *
 * ```javascript
 * window.PhaserGlobal = {}; // empty; Phaser will save Phaser.SoundManager#context here
 * // or
 * window.PhaserGlobal = {
 *   disableAudio: true,
 *   hideBanner: true,
 * };
 * ```
 *
 * @namespace PhaserGlobal
 * @property {AudioContext} [audioContext] - Phaser will save {@link Phaser.SoundManager#context the AudioContext being used for playback} here
 * @property {boolean} [disableAudio] - Disable {@link Phaser.SoundManager} ({@link Phaser.SoundManager#noAudio noAudio})
 * @property {boolean} [disableWebAudio] - Use {@link Phaser.SoundManager#usingAudioTag Audio Tags} instead of  {@link Phaser.SoundManager#usingWebAudio Web Audio}
 * @property {boolean} [fakeiOSTouchLock] - Force {@link Phaser.Device.needsTouchUnlock touch unlocking of media}
 * @property {boolean} [hideBanner] - Don't print the {@link Phaser.Game#showDebugHeader Phaser debug header} in the console
 * @property {boolean} [stopFocus] - Don't call `window.focus()` when booting the game
 */
// Documentation stub.
