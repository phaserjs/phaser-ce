/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Sound Manager is responsible for playing back audio via either the Legacy HTML Audio tag or via Web Audio if the browser supports it.
 * Note: On Firefox 25+ on Linux if you have media.gstreamer disabled in about:config then it cannot play back mp3 or m4a files.
 * The audio file type and the encoding of those files are extremely important. Not all browsers can play all audio formats.
 * There is a good guide to what's supported here: http://hpr.dogphilosophy.net/test/
 *
 * If you are reloading a Phaser Game on a page that never properly refreshes (such as in an AngularJS project) then you will quickly run out
 * of AudioContext nodes. If this is the case create a global var called {@link PhaserGlobal} on the window object before creating the game. The active
 * AudioContext will then be saved to `window.PhaserGlobal.audioContext` when the Phaser game is destroyed, and re-used when it starts again.
 *
 * Mobile warning: There are some mobile devices (certain iPad 2 and iPad Mini revisions) that cannot play 48000 Hz audio.
 * When they try to play the audio becomes extremely distorted and buzzes, eventually crashing the sound system.
 * The solution is to use a lower encoding rate such as 44100 Hz. Sometimes the audio context will
 * be created with a sampleRate of 48000. If this happens and audio distorts you should re-create the context.
 *
 * @class Phaser.SoundManager
 * @constructor
 * @param {Phaser.Game} game - Reference to the current game instance.
 */
Phaser.SoundManager = function (game)
{
    /**
     * @property {Phaser.Game} game - Local reference to game.
     */
    this.game = game;

    /**
     * @property {Phaser.Signal} onSoundDecode - The event dispatched when a sound decodes (typically only for mp3 files)
     */
    this.onSoundDecode = new Phaser.Signal();

    /**
     * This signal is dispatched whenever the global volume changes. The new volume is passed as the only parameter to your callback.
     * @property {Phaser.Signal} onVolumeChange
     */
    this.onVolumeChange = new Phaser.Signal();

    /**
     * This signal is dispatched when the SoundManager is globally muted, either directly via game code or as a result of the game pausing.
     * @property {Phaser.Signal} onMute
     */
    this.onMute = new Phaser.Signal();

    /**
     * This signal is dispatched when the SoundManager is globally un-muted, either directly via game code or as a result of the game resuming from a pause.
     * @property {Phaser.Signal} onUnMute
     */
    this.onUnMute = new Phaser.Signal();

    /**
     * This signal is dispatched when the SoundManager is touch-unlocked.
     * If the device doesn't {@link Phaser.Device.needsTouchUnlock need touch-unlocking}, the signal won't be dispatched.
     * @property {Phaser.Signal} onTouchUnlock
     */
    this.onTouchUnlock = new Phaser.Signal();

    /**
     * This signal is dispatched when the AudioContext state changes, only if using Web Audio.
     * @property {Phaser.Signal} onStateChange
     */
    this.onStateChange = new Phaser.Signal();

    /**
     * @property {AudioContext} context - The AudioContext being used for playback.
     * @default
     */
    this.context = null;

    /**
     * The AudioContext's processing latency (or an estimate thereof), in seconds.
     * This could be useful for scheduling playback very precisely.
     * If not using Web Audio, this will be null.
     * @property {number} baseLatency
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/baseLatency
     */
    this.baseLatency = null;

    /**
     * @property {boolean} usingWebAudio - True the SoundManager and device are both using Web Audio.
     * @readonly
     */
    this.usingWebAudio = false;

    /**
     * @property {boolean} usingAudioTag - True the SoundManager and device are both using the Audio tag instead of Web Audio.
     * @readonly
     */
    this.usingAudioTag = false;

    /**
     * @property {boolean} noAudio - True if audio been disabled via the PhaserGlobal (useful if you need to use a 3rd party audio library) or the device doesn't support any audio.
     * @default
     */
    this.noAudio = false;

    /**
     * @property {boolean} connectToMaster - Used in conjunction with Sound.externalNode this allows you to stop a Sound node being connected to the SoundManager master gain node.
     * @default
     */
    this.connectToMaster = true;

    /**
     * @property {boolean} touchLocked - true if the audio system is currently locked awaiting a touch event.
     * @default
     */
    this.touchLocked = false;

    /**
     * @property {number} channels - The number of audio channels to use in playback.
     * @default
     */
    this.channels = 32;

    /**
     * Set to true to have all sound muted when the Phaser game pauses (such as on loss of focus),
     * or set to false to keep audio playing, regardless of the game pause state. You may need to
     * do this should you wish to control audio muting via external DOM buttons or similar.
     * @property {boolean} muteOnPause
     * @default
     */
    this.muteOnPause = true;

    /**
     * @property {boolean} _codeMuted - Internal mute tracking var.
     * @private
     * @default
     */
    this._codeMuted = false;

    /**
     * @property {boolean} _muted - Internal mute tracking var.
     * @private
     * @default
     */
    this._muted = false;

    /**
     * @property {AudioContext} _unlockSource - Internal unlock tracking var.
     * @private
     * @default
     */
    this._unlockSource = null;

    /**
     * @property {number} _volume - The global audio volume. A value between 0 (silence) and 1 (full volume).
     * @private
     * @default
     */
    this._volume = 1;

    /**
     * @property {array} _sounds - An array containing all the sounds
     * @private
     */
    this._sounds = [];

    /**
     * @property {Phaser.ArraySet} _watchList - An array set containing all the sounds being monitored for decoding status.
     * @private
     */
    this._watchList = new Phaser.ArraySet();

    /**
     * @property {boolean} _watching - Is the SoundManager monitoring the watchList?
     * @private
     */
    this._watching = false;

    /**
     * @property {function} _watchCallback - The callback to invoke once the watchlist is clear.
     * @private
     */
    this._watchCallback = null;

    /**
     * @property {object} _watchContext - The context in which to call the watchlist callback.
     * @private
     */
    this._watchContext = null;

    /**
     * @property {function} _onClick - Bound handler for 'click' on the game canvas. Added in boot(), if necessary.
     * @private
     */
    this._onClick = this._onClick.bind(this);

    /**
     * @property {function} _onStateChange - Bound handler for 'onstatechange' on the AudioContext. Added in boot(), if necessary.
     * @private
     */
    this._onStateChange = this._onStateChange.bind(this);
};

Phaser.SoundManager.prototype = {

    /**
     * Initialises the sound manager.
     * @method Phaser.SoundManager#boot
     * @protected
     */
    boot: function ()
    {
        var device = this.game.device;
        var PhaserGlobal = window.PhaserGlobal;

        if (device.iOS && device.webAudio === false)
        {
            this.channels = 1;
        }

        //  PhaserGlobal overrides
        if (PhaserGlobal)
        {
            //  Check to see if all audio playback is disabled (i.e. handled by a 3rd party class)
            if (PhaserGlobal.disableAudio === true)
            {
                this.noAudio = true;
                this.touchLocked = false;
                return;
            }

            //  Check if the Web Audio API is disabled (for testing Audio Tag playback during development)
            if (PhaserGlobal.disableWebAudio === true)
            {
                this.usingAudioTag = true;
                this.touchLocked = false;
                return;
            }
        }

        if (PhaserGlobal && PhaserGlobal.audioContext)
        {
            this.context = PhaserGlobal.audioContext;
        }
        else
        {
            var AudioContext = window.AudioContext || window.webkitAudioContext;

            if (AudioContext)
            {
                try
                {
                    this.context = new AudioContext();
                }
                catch (error)
                {
                    this.context = null;
                    this.usingWebAudio = false;
                    this.touchLocked = false;

                    console.warn(error);
                }
            }
        }

        if (this.context === null)
        {
            //  No Web Audio support - how about legacy Audio?
            if (window.Audio === undefined)
            {
                this.noAudio = true;
                return;
            }
            else
            {
                this.usingAudioTag = true;
            }
        }
        else
        {
            this.usingWebAudio = true;

            this.baseLatency = this.context.baseLatency || (256 / (this.context.sampleRate || 44100));

            if (this.context.createGain === undefined)
            {
                this.masterGain = this.context.createGainNode();
            }
            else
            {
                this.masterGain = this.context.createGain();
            }

            this.masterGain.gain.value = 1;
            this.masterGain.connect(this.context.destination);

            // "A newly-created AudioContext will always begin in the suspended state, and a state change event will be fired whenever the state changes to a different state."

            this.context.onstatechange = this._onStateChange;

            if (this.context.state === 'suspended')
            {
                this.game.canvas.addEventListener('click', this._onClick);
            }
        }

        if (!this.noAudio)
        {
            //  On mobile we need a native touch event before we can play anything, so capture it here
            if (device.needsTouchUnlock())
            {
                this.setTouchLock();
            }
        }
    },

    /**
     * Sets the Input Manager touch callback to be SoundManager.unlock.
     * Required for iOS audio device unlocking. Mostly just used internally.
     *
     * @method Phaser.SoundManager#setTouchLock
     */
    setTouchLock: function ()
    {
        if (this.noAudio || (window.PhaserGlobal && window.PhaserGlobal.disableAudio === true))
        {
            return;
        }

        this.game.input.addTouchLockCallback(this.unlock, this, true);

        this.touchLocked = true;
    },

    /**
     * Turns off {@link #touchLocked} and dispatches {@link #onTouchUnlock}.
     *
     * @method Phaser.SoundManager#setTouchUnlock
     * @private
     */
    setTouchUnlock: function ()
    {
        this.touchLocked = false;
        this._unlockSource = null;
        this.onTouchUnlock.dispatch();
    },

    /**
     * Is the Web Audio context suspended?
     *
     * @return {boolean}
     */
    webAudioIsSuspended: function ()
    {
        return (this.usingWebAudio && this.context.state === 'suspended');
    },

    /**
     * Try to resume the Web Audio context, if using Web Audio.
     *
     * @return {?Promise} - A Promise, if resume was called. See {@link https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/resume}.
     */
    resumeWebAudio: function ()
    {
        if (this.usingWebAudio)
        {
            return this.context.resume();
        }
    },

    /**
     * Try to resume a suspended Web Audio context, if using Web Audio and the context is suspended.
     *
     * @return {?Promise} - A Promise, if resume was called. See {@link https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/resume}.
     */
    resumeWebAudioIfSuspended: function ()
    {
        if (this.webAudioIsSuspended())
        {
            return this.context.resume();
        }
    },

    /**
     * Enables the audio, usually after the first touch.
     *
     * @method Phaser.SoundManager#unlock
     * @return {boolean} True if the callback should be removed, otherwise false.
     */
    unlock: function ()
    {
        if (this.noAudio || !this.touchLocked || this._unlockSource !== null)
        {
            return true;
        }

        //  Global override (mostly for Audio Tag testing)
        if (this.usingAudioTag)
        {
            this.setTouchUnlock();
        }
        else if (this.usingWebAudio)
        {
            /*
             * Create empty buffer and play it
             * The onended handler will set touchLocked to false
             */

            var buffer = this.context.createBuffer(1, 1, 22050);
            this._unlockSource = this.context.createBufferSource();
            this._unlockSource.buffer = buffer;
            this._unlockSource.connect(this.context.destination);

            var _this = this;

            this._unlockSource.onended = function unlockSourceOnEndedHandler ()
            {
                _this.setTouchUnlock();
                _this.resumeWebAudioIfSuspended();
            };

            if (this._unlockSource.start === undefined)
            {
                this._unlockSource.noteOn(0);
            }
            else
            {
                this._unlockSource.start(0);
            }

            // This fixes locked audio in Chrome > 55 cross origin iframes?
            this.resumeWebAudioIfSuspended();
        }

        //  We can remove the event because we've done what we needed (started the unlock sound playing)
        return true;
    },

    /**
     * Stops all the sounds in the game.
     *
     * @method Phaser.SoundManager#stopAll
     */
    stopAll: function ()
    {
        if (this.noAudio)
        {
            return;
        }

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].stop();
            }
        }
    },

    /**
     * Pauses all the sounds in the game.
     *
     * @method Phaser.SoundManager#pauseAll
     */
    pauseAll: function ()
    {
        if (this.noAudio)
        {
            return;
        }

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].pause();
            }
        }
    },

    /**
     * Resumes every sound in the game.
     *
     * @method Phaser.SoundManager#resumeAll
     */
    resumeAll: function ()
    {
        if (this.noAudio)
        {
            return;
        }

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].resume();
            }
        }
    },

    /**
     * Decode a sound by its asset key.
     *
     * @method Phaser.SoundManager#decode
     * @param {string} key - Assets key of the sound to be decoded.
     * @param {Phaser.Sound} [sound] - Its buffer will be set to decoded data.
     */
    decode: function (key, sound)
    {
        sound = sound || null;

        var soundData = this.game.cache.getSoundData(key);

        if (soundData)
        {
            if (this.game.cache.isSoundDecoded(key) === false)
            {
                this.game.cache.updateSound(key, 'isDecoding', true);

                var _this = this;

                try
                {
                    this.context.decodeAudioData(soundData, function (buffer)
                    {
                        if (!_this.game.isBooted)
                        {
                            // Game was destroyed.

                            return;
                        }

                        if (buffer)
                        {
                            _this.game.cache.decodedSound(key, buffer);
                            _this.onSoundDecode.dispatch(key, sound);
                        }
                    });
                }
                catch (e) {} // eslint-disable-line no-empty
            }
        }
    },

    /**
     * This method allows you to give the SoundManager a list of Sound files, or keys, and a callback.
     * Once all of the Sound files have finished decoding the callback will be invoked.
     * The amount of time spent decoding depends on the codec used and file size.
     * If all of the files given have already decoded the callback is triggered immediately.
     *
     * @method Phaser.SoundManager#setDecodedCallback
     * @param {string|array} files - An array containing either Phaser.Sound objects or their key strings as found in the Phaser.Cache.
     * @param {Function} callback - The callback which will be invoked once all files have finished decoding.
     * @param {Object} callbackContext - The context in which the callback will run.
     */
    setDecodedCallback: function (files, callback, callbackContext)
    {
        if (typeof files === 'string')
        {
            files = [ files ];
        }

        this._watchList.reset();

        for (var i = 0; i < files.length; i++)
        {
            if (files[i] instanceof Phaser.Sound)
            {
                if (!this.game.cache.isSoundDecoded(files[i].key))
                {
                    this._watchList.add(files[i].key);
                }
            }
            else if (!this.game.cache.isSoundDecoded(files[i]))
            {
                this._watchList.add(files[i]);
            }
        }

        //  All decoded already?
        if (this._watchList.total === 0)
        {
            this._watching = false;
            callback.call(callbackContext);
        }
        else
        {
            this._watching = true;
            this._watchCallback = callback;
            this._watchContext = callbackContext;
        }
    },

    /**
     * Updates every sound in the game, checks for audio unlock on mobile and monitors the decoding watch list.
     *
     * @method Phaser.SoundManager#update
     * @protected
     */
    update: function ()
    {
        if (this.noAudio)
        {
            return;
        }

        // When suspended the context does not advance at all.

        if (!this.webAudioIsSuspended())
        {
            for (var i = 0; i < this._sounds.length; i++)
            {
                this._sounds[i].update();
            }
        }

        if (this._watching)
        {
            var key = this._watchList.first;

            while (key)
            {
                if (this.game.cache.isSoundDecoded(key))
                {
                    this._watchList.remove(key);
                }

                key = this._watchList.next;
            }

            if (this._watchList.total === 0)
            {
                this._watching = false;
                this._watchCallback.call(this._watchContext);
            }
        }
    },

    /**
     * Adds a new Sound into the SoundManager.
     *
     * @method Phaser.SoundManager#add
     * @param {string} key - Asset key for the sound.
     * @param {number} [volume=1] - Default value for the volume.
     * @param {boolean} [loop=false] - Whether or not the sound will loop.
     * @param {boolean} [connect=true] - Controls if the created Sound object will connect to the master gainNode of the SoundManager when running under WebAudio.
     * @return {Phaser.Sound} The new sound instance.
     */
    add: function (key, volume, loop, connect)
    {
        if (volume === undefined) { volume = 1; }
        if (loop === undefined) { loop = false; }
        if (connect === undefined) { connect = this.connectToMaster; }

        var sound = new Phaser.Sound(this.game, key, volume, loop, connect);

        this._sounds.push(sound);

        return sound;
    },

    /**
     * Adds a new AudioSprite into the SoundManager.
     *
     * @method Phaser.SoundManager#addSprite
     * @param {string} key - Asset key for the sound.
     * @return {Phaser.AudioSprite} The new AudioSprite instance.
     */
    addSprite: function (key)
    {
        var audioSprite = new Phaser.AudioSprite(this.game, key);

        return audioSprite;
    },

    /**
     * Removes a Sound from the SoundManager. The removed Sound is destroyed before removal.
     *
     * @method Phaser.SoundManager#remove
     * @param {Phaser.Sound} sound - The sound object to remove.
     * @return {boolean} True if the sound was removed successfully, otherwise false.
     */
    remove: function (sound)
    {
        var i = this._sounds.length;

        while (i--)
        {
            if (this._sounds[i] === sound)
            {
                this._sounds[i].destroy(false);
                this._sounds.splice(i, 1);
                return true;
            }
        }

        return false;
    },

    /**
     * Removes all Sounds from the SoundManager.
     * The removed Sounds are destroyed before removal.
     *
     * @method Phaser.SoundManager#removeAll
     */
    removeAll: function ()
    {
        this.stopAll();

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].destroy();
            }
        }

        this._sounds.length = 0;
    },

    /**
     * Removes all Sounds from the SoundManager that have an asset key matching the given value.
     * The removed Sounds are destroyed before removal.
     *
     * @method Phaser.SoundManager#removeByKey
     * @param {string} key - The key to match when removing sound objects.
     * @return {number} The number of matching sound objects that were removed.
     */
    removeByKey: function (key)
    {
        var i = this._sounds.length;
        var removed = 0;

        while (i--)
        {
            if (this._sounds[i].key === key)
            {
                this._sounds[i].destroy(false);
                this._sounds.splice(i, 1);
                removed++;
            }
        }

        return removed;
    },

    /**
     * Adds a new Sound into the SoundManager and starts it playing.
     *
     * @method Phaser.SoundManager#play
     * @param {string} key - Asset key for the sound.
     * @param {number} [volume=1] - Default value for the volume.
     * @param {boolean} [loop=false] - Whether or not the sound will loop.
     * @return {Phaser.Sound} The new sound instance.
     */
    play: function (key, volume, loop)
    {
        if (this.noAudio)
        {
            return;
        }

        var sound = this.add(key, volume, loop);

        sound.play();

        return sound;
    },

    /**
     * Internal mute handler called automatically by the SoundManager.mute setter.
     *
     * @method Phaser.SoundManager#setMute
     * @private
     */
    setMute: function ()
    {
        if (this._muted)
        {
            return;
        }

        this._muted = true;

        if (this.usingWebAudio)
        {
            this._muteVolume = this.masterGain.gain.value;
            this.masterGain.gain.value = 0;
        }

        //  Loop through sounds
        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i].usingAudioTag)
            {
                this._sounds[i].mute = true;
            }
        }

        this.onMute.dispatch();
    },

    /**
     * Internal mute handler called automatically by the SoundManager.mute setter.
     *
     * @method Phaser.SoundManager#unsetMute
     * @private
     */
    unsetMute: function ()
    {
        if (!this._muted || this._codeMuted)
        {
            return;
        }

        this._muted = false;

        if (this.usingWebAudio)
        {
            this.masterGain.gain.value = this._muteVolume;
        }

        //  Loop through sounds
        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i].usingAudioTag)
            {
                this._sounds[i].mute = false;
            }
        }

        this.onUnMute.dispatch();
    },

    /**
     * Called by the game when paused.
     * @private
     */
    gamePaused: function ()
    {
        if (this.muteOnPause)
        {
            this.setMute();
        }
    },

    /**
     * Called by the game when resumed.
     * @private
     */
    gameResumed: function ()
    {
        if (this.muteOnPause)
        {
            this.unsetMute();
        }

        if (this.usingWebAudio && this.context.state !== 'running')
        {
            var _this = this;

            // Needed to handle resuming audio on iOS17/iOS18+ if you hide the browser, press the home button, etc. <https://github.com/phaserjs/phaser/issues/6829>
            setTimeout(function ()
            {
                if (!_this.context) { return; }

                _this.context.suspend();
                _this.context.resume();
            }, 100);
        }
    },

    /**
     * Stops all the sounds in the game, then destroys them and finally clears up any callbacks.
     *
     * @method Phaser.SoundManager#destroy
     */
    destroy: function ()
    {
        this.removeAll();

        this.onMute.dispose();
        this.onSoundDecode.dispose();
        this.onStateChange.dispose();
        this.onTouchUnlock.dispose();
        this.onUnMute.dispose();
        this.onVolumeChange.dispose();

        this.game.canvas.removeEventListener('click', this._onClick);

        if (this.context)
        {
            this.context.onstatechange = null;

            if (window.PhaserGlobal)
            {
                //  Store this in the PhaserGlobal window var, if set, to allow for re-use if the game is created again without the page refreshing
                window.PhaserGlobal.audioContext = this.context;
            }
            else
            if (this.context.close)
            {
                this.context.close();
            }

            this.context = null;
        }
    },

    /**
     * Handler for this.context.onstatechange. Copied and bound in SoundManager constructor.
     * @private
     */
    _onStateChange: function ()
    {
        this.onStateChange.dispatch(this.context.state);
    },

    /**
     * Handler for this.game.canvas 'click'. Copied and bound in SoundManager constructor.
     * @private
     */
    _onClick: function ()
    {
        this.resumeWebAudioIfSuspended();

        this.game.canvas.removeEventListener('click', this._onClick);
    }

};

Phaser.SoundManager.prototype.constructor = Phaser.SoundManager;

/**
 * @name Phaser.SoundManager#mute
 * @property {boolean} mute - Gets or sets the muted state of the SoundManager. This effects all sounds in the game.
 */
Object.defineProperty(Phaser.SoundManager.prototype, 'mute', {

    get: function ()
    {
        return this._muted;
    },

    set: function (value)
    {
        if (value)
        {
            if (this._muted)
            {
                return;
            }

            this._codeMuted = true;
            this.setMute();
        }
        else
        {
            if (!this._muted)
            {
                return;
            }

            this._codeMuted = false;
            this.unsetMute();
        }
    }

});

/**
 * @name Phaser.SoundManager#volume
 * @property {number} volume - Gets or sets the global volume of the SoundManager, a value between 0 and 1. The value given is clamped to the range 0 to 1.
 */
Object.defineProperty(Phaser.SoundManager.prototype, 'volume', {

    get: function ()
    {
        return this._volume;
    },

    set: function (value)
    {
        if (value < 0)
        {
            value = 0;
        }
        else if (value > 1)
        {
            value = 1;
        }

        if (this._volume !== value)
        {
            this._volume = value;

            if (this.usingWebAudio)
            {
                this.masterGain.gain.value = value;
            }
            else
            {
                //  Loop through the sound cache and change the volume of all html audio tags
                for (var i = 0; i < this._sounds.length; i++)
                {
                    if (this._sounds[i].usingAudioTag)
                    {
                        this._sounds[i].updateGlobalVolume(value);
                    }
                }
            }

            this.onVolumeChange.dispatch(value);
        }
    }

});
