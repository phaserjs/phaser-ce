/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
 *
 * The loader uses a combination of tag loading (eg. Image elements) and XHR and provides progress and completion callbacks.
 *
 * Parallel loading (see {@link #enableParallel}) is supported and enabled by default.
 * Load-before behavior of parallel resources is controlled by synchronization points as discussed in {@link #withSyncPoint}.
 *
 * Texture Atlases can be created with tools such as [Texture Packer](https://www.codeandweb.com/texturepacker/phaser) and
 * [Shoebox](http://renderhjs.net/shoebox/)
 *
 * @class Phaser.Loader
 * @param {Phaser.Game} game - A reference to the currently running game.
 */
Phaser.Loader = function (game)
{
    /**
     * Local reference to game.
     * @property {Phaser.Game} game
     * @protected
     */
    this.game = game;

    /**
     * Local reference to the Phaser.Cache.
     * @property {Phaser.Cache} cache
     * @protected
     */
    this.cache = game.cache;

    /**
     * If true all calls to Loader.reset will be ignored. Useful if you need to create a load queue before swapping to a preloader state.
     * @property {boolean} resetLocked
     * @default
     */
    this.resetLocked = false;

    /**
     * True if the Loader is in the process of loading the queue.
     * @property {boolean} isLoading
     * @default
     */
    this.isLoading = false;

    /**
     * True if all assets in the queue have finished loading.
     * @property {boolean} hasLoaded
     * @default
     */
    this.hasLoaded = false;

    /**
     * You can optionally link a progress sprite with {@link Phaser.Loader#setPreloadSprite setPreloadSprite}.
     *
     * This property is an object containing: sprite, rect, direction, width and height
     *
     * @property {?object} preloadSprite
     * @protected
     */
    this.preloadSprite = null;

    /**
     * The crossOrigin value applied to loaded images. Very often this needs to be set to 'anonymous'.
     * @property {boolean|string} crossOrigin
     * @default
     */
    this.crossOrigin = false;

    /**
     * If you want to append a URL before the path of any asset you can set this here.
     * Useful if allowing the asset base url to be configured outside of the game code.
     * The string _must_ end with a "/".
     *
     * @property {string} baseURL
     */
    this.baseURL = '';

    /**
     * The value of `path`, if set, is placed before any _relative_ file path given. For example:
     *
     * ```javascript
     * load.path = "images/sprites/";
     * load.image("ball", "ball.png");
     * load.image("tree", "level1/oaktree.png");
     * load.image("boom", "http://server.com/explode.png");
     * ```
     *
     * Would load the `ball` file from `images/sprites/ball.png` and the tree from
     * `images/sprites/level1/oaktree.png` but the file `boom` would load from the URL
     * given as it's an absolute URL.
     *
     * Please note that the path is added before the filename but *after* the baseURL (if set.)
     *
     * The string _must_ end with a "/".
     *
     * @property {string} path
     */
    this.path = '';

    /**
     * Used to map the application mime-types to to the Accept header in XHR requests.
     * If you don't require these mappings, or they cause problems on your server, then
     * remove them from the headers object and the XHR request will not try to use them.
     *
     * This object can also be used to set the `X-Requested-With` header to
     * `XMLHttpRequest` (or any other value you need). To enable this do:
     *
     * ```javascript
     * this.load.headers.requestedWith = 'XMLHttpRequest'
     * ```
     *
     * before adding anything to the Loader. The XHR loader will then call:
     *
     * ```javascript
     * setRequestHeader('X-Requested-With', this.headers['requestedWith'])
     * ```
     *
     * @property {object} headers
     * @default
     */
    this.headers = {
        requestedWith: false,
        json: 'application/json',
        xml: 'application/xml'
    };

    /**
     * This event is dispatched when the loading process starts: before the first file has been requested,
     * but after all the initial packs have been loaded.
     *
     * @property {Phaser.Signal} onLoadStart
     */
    this.onLoadStart = new Phaser.Signal();

    /**
     * This event is dispatched when the final file in the load queue has either loaded or failed,
     * before {@link #onLoadComplete} and before the loader is {@link #reset}.
     *
     * @property {Phaser.Signal} onBeforeLoadComplete
     */
    this.onBeforeLoadComplete = new Phaser.Signal();

    /**
     * This event is dispatched when the final file in the load queue has either loaded or failed,
     * after the loader is {@link #reset}.
     *
     * @property {Phaser.Signal} onLoadComplete
     */
    this.onLoadComplete = new Phaser.Signal();

    /**
     * This event is dispatched when an asset pack has either loaded or failed to load.
     *
     * This is called when the asset pack manifest file has loaded and successfully added its contents to the loader queue.
     *
     * Params: `(pack key, success?, total packs loaded, total packs)`
     *
     * @property {Phaser.Signal} onPackComplete
     */
    this.onPackComplete = new Phaser.Signal();

    /**
     * This event is dispatched immediately before a file starts loading.
     * It's possible the file may fail (eg. download error, invalid format) after this event is sent.
     *
     * Params: `(progress, file key, file url)`
     *
     * @property {Phaser.Signal} onFileStart
     */
    this.onFileStart = new Phaser.Signal();

    /**
     * This event is dispatched when a file has either loaded or failed to load.
     *
     * Any function bound to this will receive the following parameters:
     *
     * progress, file key, success?, total loaded files, total files
     *
     * Where progress is a number between 1 and 100 (inclusive) representing the percentage of the load.
     *
     * @property {Phaser.Signal} onFileComplete
     */
    this.onFileComplete = new Phaser.Signal();

    /**
     * This event is dispatched when a file (or pack) errors as a result of the load request.
     *
     * For files it will be triggered before `onFileComplete`. For packs it will be triggered before `onPackComplete`.
     *
     * Params: `(file key, file)`
     *
     * @property {Phaser.Signal} onFileError
     */
    this.onFileError = new Phaser.Signal();

    /**
     * If true (the default) then parallel downloading will be enabled.
     *
     * To disable all parallel downloads this must be set to false prior to any resource being loaded.
     *
     * @property {boolean} enableParallel
     */
    this.enableParallel = true;

    /**
     * The number of concurrent / parallel resources to try and fetch at once.
     *
     * Many current browsers limit 6 requests per domain; this is slightly conservative.
     *
     * This should generally be left at the default, but can be set to a higher limit for specific use-cases. Just be careful when setting large values as different browsers could behave differently.
     *
     * @property {integer} maxParallelDownloads
     */
    this.maxParallelDownloads = 4;

    /**
     * A counter: if more than zero, files will be automatically added as a synchronization point.
     * @property {integer} _withSyncPointDepth
     */
    this._withSyncPointDepth = 0;

    /**
     * Contains all the information for asset files (including packs) to load.
     *
     * File/assets are only removed from the list after all loading completes.
     *
     * @property {file[]} _fileList
     * @private
     */
    this._fileList = [];

    /**
     * Inflight files (or packs) that are being fetched/processed.
     *
     * This means that if there are any files in the flight queue there should still be processing
     * going on; it should only be empty before or after loading.
     *
     * The files in the queue may have additional properties added to them,
     * including `requestObject` which is normally the associated XHR.
     *
     * @property {file[]} _flightQueue
     * @private
     */
    this._flightQueue = [];

    /**
     * The offset into the fileList past all the complete (loaded or error) entries.
     *
     * @property {integer} _processingHead
     * @private
     */
    this._processingHead = 0;

    /**
     * True when the first file (not pack) has loading started.
     * This used to to control dispatching `onLoadStart` which happens after any initial packs are loaded.
     *
     * @property {boolean} _initialPacksLoaded
     * @private
     */
    this._fileLoadStarted = false;

    /**
     * Total packs seen - adjusted when a pack is added.
     * @property {integer} _totalPackCount
     * @private
     */
    this._totalPackCount = 0;

    /**
     * Total files seen - adjusted when a file is added.
     * @property {integer} _totalFileCount
     * @private
     */
    this._totalFileCount = 0;

    /**
     * Total packs loaded - adjusted just prior to `onPackComplete`.
     * @property {integer} _loadedPackCount
     * @private
     */
    this._loadedPackCount = 0;

    /**
     * Total files loaded - adjusted just prior to `onFileComplete`.
     * @property {integer} _loadedFileCount
     * @private
     */
    this._loadedFileCount = 0;
};

/**
 * @constant
 * @type {number}
 */
Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY = 0;

/**
 * @constant
 * @type {number}
 */
Phaser.Loader.TEXTURE_ATLAS_JSON_HASH = 1;

/**
 * @constant
 * @type {number}
 */
Phaser.Loader.TEXTURE_ATLAS_XML_STARLING = 2;

/**
 * @constant
 * @type {number}
 */
Phaser.Loader.PHYSICS_LIME_CORONA_JSON = 3;

/**
 * @constant
 * @type {number}
 */
Phaser.Loader.PHYSICS_PHASER_JSON = 4;

/**
 * @constant
 * @type {number}
 */
Phaser.Loader.TEXTURE_ATLAS_JSON_PYXEL = 5;

/**
 * Mapping of file extensions to media types.
 *
 * @static
 * @type {object}
 */
Phaser.Loader.mediaTypes = {
    avif: 'image/avif',
    bmp: 'image/bmp',
    cur: 'image/x-icon',
    gif: 'image/gif',
    ico: 'image/x-icon',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    webp: 'image/webp'
};

/**
 * Guess a media type for an URL.
 *
 * @method Phaser.Loader.getMediaType
 * @static
 * @param {string} url
 * @return {?string}
 */
Phaser.Loader.getMediaType = function (url)
{
    var matches = url.match(/\.(\w+)$/);

    if (!matches) { return null; }

    return Phaser.Loader.mediaTypes[matches[1]] || null;
};

/**
 * Convert a source string (URL) to an object, guessing its media type.
 *
 * @method Phaser.Loader._getSource
 * @static
 * @private
 * @param {object|string} source
 * @return {object}
 */
Phaser.Loader._getSource = function (source)
{
    if (typeof source === 'string')
    {
        return { url: source, type: Phaser.Loader.getMediaType(source) };
    }

    return source;
};

Phaser.Loader.prototype = {

    /**
     * Set a Sprite to be a "preload" sprite by passing it to this method.
     *
     * A "preload" sprite will have its width or height crop adjusted based on the percentage of the loader in real-time.
     * This allows you to easily make loading bars for games.
     *
     * The sprite will automatically be made visible when calling this.
     *
     * @method Phaser.Loader#setPreloadSprite
     * @param {Phaser.Sprite|Phaser.Image} sprite - The sprite or image that will be cropped during the load.
     * @param {number} [direction=0] - A value of zero means the sprite will be cropped horizontally, a value of 1 means its will be cropped vertically.
     */
    setPreloadSprite: function (sprite, direction)
    {
        direction = direction || 0;

        this.preloadSprite = { sprite: sprite, direction: direction, width: sprite.width, height: sprite.height, rect: null };

        if (direction === 0)
        {
            //  Horizontal rect
            this.preloadSprite.rect = new Phaser.Rectangle(0, 0, 1, sprite.height);
        }
        else
        {
            //  Vertical rect
            this.preloadSprite.rect = new Phaser.Rectangle(0, 0, sprite.width, 1);
        }

        sprite.crop(this.preloadSprite.rect);

        sprite.visible = true;
    },

    /**
     * Called automatically by ScaleManager when the game resizes in RESIZE scalemode.
     *
     * This can be used to adjust the preloading sprite size, eg.
     *
     * @method Phaser.Loader#resize
     * @protected
     */
    resize: function ()
    {
        if (this.preloadSprite && this.preloadSprite.height !== this.preloadSprite.sprite.height)
        {
            this.preloadSprite.rect.height = this.preloadSprite.sprite.height;
        }
    },

    /**
     * Check whether a file/asset with a specific key is queued to be loaded.
     *
     * To access a loaded asset use Phaser.Cache, eg. {@link Phaser.Cache#checkImageKey}
     *
     * @method Phaser.Loader#checkKeyExists
     * @param {string} type - The type asset you want to check.
     * @param {string} key - Key of the asset you want to check.
     * @return {boolean} Return true if exists, otherwise return false.
     */
    checkKeyExists: function (type, key)
    {
        return this.getAssetIndex(type, key) > -1;
    },

    /**
     * Get the queue-index of the file/asset with a specific key.
     *
     * Only assets in the download file queue will be found.
     *
     * @method Phaser.Loader#getAssetIndex
     * @param {string} type - The type asset you want to check.
     * @param {string} key - Key of the asset you want to check.
     * @return {number} The index of this key in the filelist, or -1 if not found.
     *     The index may change and should only be used immediately following this call
     */
    getAssetIndex: function (type, key)
    {
        var bestFound = -1;

        for (var i = 0; i < this._fileList.length; i++)
        {
            var file = this._fileList[i];

            if (file.type === type && file.key === key)
            {
                bestFound = i;

                // An already loaded/loading file may be superceded.
                if (!file.loaded && !file.loading)
                {
                    break;
                }
            }
        }

        return bestFound;
    },

    /**
     * Find a file/asset with a specific key.
     *
     * Only assets in the download file queue will be found.
     *
     * @method Phaser.Loader#getAsset
     * @param {string} type - The type asset you want to check.
     * @param {string} key - Key of the asset you want to check.
     * @return {any} Returns an object if found that has 2 properties: `index` and `file`; otherwise a non-true value is returned.
     *     The index may change and should only be used immediately following this call.
     */
    getAsset: function (type, key)
    {
        var fileIndex = this.getAssetIndex(type, key);

        if (fileIndex > -1)
        {
            return { index: fileIndex, file: this._fileList[fileIndex] };
        }

        return false;
    },

    /**
     * Reset the loader and clear any queued assets. If `Loader.resetLocked` is true this operation will abort.
     *
     * This will abort any loading and clear any queued assets.
     *
     * Optionally you can clear any associated events.
     *
     * @method Phaser.Loader#reset
     * @protected
     * @param {boolean} [hard=false] - If true then the preload sprite and other artifacts may also be cleared.
     * @param {boolean} [clearEvents=false] - If true then the all Loader signals will have removeAll called on them.
     */
    reset: function (hard, clearEvents)
    {
        if (clearEvents === undefined) { clearEvents = false; }

        if (this.resetLocked)
        {
            return;
        }

        if (hard)
        {
            this.preloadSprite = null;
        }

        this.isLoading = false;

        this._processingHead = 0;
        this._fileList.length = 0;
        this._flightQueue.length = 0;

        this._fileLoadStarted = false;
        this._totalFileCount = 0;
        this._totalPackCount = 0;
        this._loadedPackCount = 0;
        this._loadedFileCount = 0;

        if (clearEvents)
        {
            this.onLoadStart.removeAll();
            this.onLoadComplete.removeAll();
            this.onPackComplete.removeAll();
            this.onFileStart.removeAll();
            this.onFileComplete.removeAll();
            this.onFileError.removeAll();
        }
    },

    /**
     * Internal function that adds a new entry to the file list. Do not call directly.
     *
     * @method Phaser.Loader#addToFileList
     * @protected
     * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
     * @param {string} key - The unique Cache ID key of this resource.
     * @param {string} [url] - The URL the asset will be loaded from.
     * @param {object} [properties=(none)] - Any additional properties needed to load the file. These are added directly to the added file object and overwrite any defaults.
     * @param {boolean} [overwrite=false] - If true then this will overwrite a file asset of the same type/key. Otherwise it will only add a new asset. If overwrite is true, and the asset is already being loaded (or has been loaded), then it is appended instead.
     * @param {string} [extension] - If no URL is given the Loader will sometimes auto-generate the URL based on the key, using this as the extension.
     * @return {Phaser.Loader} This instance of the Phaser Loader.
     */
    addToFileList: function (type, key, url, properties, overwrite, extension)
    {
        if (overwrite === undefined) { overwrite = false; }

        if (key === undefined || key === '')
        {
            console.warn('Phaser.Loader: Invalid or no key given of type ' + type);
            return this;
        }

        if (url === undefined || url === null)
        {
            if (extension)
            {
                url = key + extension;
            }
            else
            {
                console.warn('Phaser.Loader: No URL given for file type: ' + type + ' key: ' + key);
                return this;
            }
        }

        var file = {
            type: type,
            key: key,
            path: this.path,
            url: url,
            syncPoint: this._withSyncPointDepth > 0,
            data: null,
            loading: false,
            loaded: false,
            error: false
        };

        if (properties)
        {
            for (var prop in properties)
            {
                file[prop] = properties[prop];
            }
        }

        var fileIndex = this.getAssetIndex(type, key);

        if (overwrite && fileIndex > -1)
        {
            var currentFile = this._fileList[fileIndex];

            if (!currentFile.loading && !currentFile.loaded)
            {
                this._fileList[fileIndex] = file;
            }
            else
            {
                this._fileList.push(file);
                this._totalFileCount++;
            }
        }
        else if (fileIndex === -1)
        {
            this._fileList.push(file);
            this._totalFileCount++;
        }

        return this;
    },

    /**
     * Internal function that replaces an existing entry in the file list with a new one. Do not call directly.
     *
     * @method Phaser.Loader#replaceInFileList
     * @protected
     * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
     * @param {string} key - The unique Cache ID key of this resource.
     * @param {string} url - The URL the asset will be loaded from.
     * @param {object} properties - Any additional properties needed to load the file.
     */
    replaceInFileList: function (type, key, url, properties)
    {
        return this.addToFileList(type, key, url, properties, true);
    },

    /**
     * Add a JSON resource pack ('packfile') to the Loader.
     *
     * A packfile is a JSON file that contains a list of assets to the be loaded.
     * Please see the example 'loader/asset pack' in the Phaser Examples repository.
     *
     * Packs are always put before the first non-pack file that is not loaded / loading.
     *
     * This means that all packs added before any loading has started are added to the front
     * of the file queue, in the order added.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * The URL of the packfile can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * @method Phaser.Loader#pack
     * @param {string} key - Unique asset key of this resource pack.
     * @param {string} [url] - URL of the Asset Pack JSON file. If you wish to pass a json object instead set this to null and pass the object as the data parameter.
     * @param {object} [data] - The Asset Pack JSON data. Use this to pass in a json data object rather than loading it from a URL. TODO
     * @param {object} [callbackContext=(loader)] - Some Loader operations, like Binary and Script require a context for their callbacks. Pass the context here.
     * @return {Phaser.Loader} This Loader instance.
     */
    pack: function (key, url, data, callbackContext)
    {
        if (url === undefined) { url = null; }
        if (data === undefined) { data = null; }
        if (callbackContext === undefined) { callbackContext = null; }

        if (!url && !data)
        {
            console.warn('Phaser.Loader.pack - Both url and data are null. One must be set.');

            return this;
        }

        var pack = {
            type: 'packfile',
            key: key,
            url: url,
            path: this.path,
            syncPoint: true,
            data: null,
            loading: false,
            loaded: false,
            error: false,
            callbackContext: callbackContext
        };

        //  A data object has been given
        if (data)
        {
            if (typeof data === 'string')
            {
                data = JSON.parse(data);
            }

            pack.data = data || {};

            //  Already consider 'loaded'
            pack.loaded = true;
        }

        /*
         * Add before first non-pack/no-loaded ~ last pack from start prior to loading
         * (Read one past for splice-to-end)
         */
        for (var i = 0; i < this._fileList.length + 1; i++)
        {
            var file = this._fileList[i];

            if (!file || (!file.loaded && !file.loading && file.type !== 'packfile'))
            {
                this._fileList.splice(i, 0, pack);
                this._totalPackCount++;
                break;
            }
        }

        return this;
    },

    /**
     * Adds an Image to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * Phaser can load all common image types: png, jpg, gif and any other format the browser can natively handle.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the image via `Cache.getImage(key)`.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
     * and no URL is given then the Loader will set the URL to be "alien.png". It will always add `.png` as the extension.
     * If you do not desire this action then provide a URL.
     *
     * ##### Compressed Textures
     *
     * This method also supports passing in a texture object as the `url` argument. This allows you to load
     * compressed textures into Phaser. You can also use `Loader.texture` to do this.
     *
     * Compressed Textures are a WebGL only feature, and require 3rd party tools to create.
     * Available tools include Texture Packer, PVRTexTool, DirectX Texture Tool and Mali Texture Compression Tool.
     *
     * Supported texture compression formats are: PVRTC, S3TC and ETC1.
     * Supported file formats are: PVR, DDS, KTX and PKM.
     *
     * The formats that support all 3 compression algorithms are PVR and KTX.
     * PKM only supports ETC1, and DDS only S3TC for now.
     *
     * The texture path object looks like this:
     *
     * ```javascript
     * load.image('factory', {
     *     etc1: 'assets/factory_etc1.pkm',
     *     s3tc: 'assets/factory_dxt1.pvr',
     *     pvrtc: 'assets/factory_pvrtc.pvr',
     *     truecolor: 'assets/factory.png'
     * });
     * ```
     *
     * The `truecolor` property points to a standard PNG file, that will be used if none of the
     * compressed formats are supported by the browser / GPU.
     *
     * ##### Multiple Image Sources
     *
     * You can pass an array `url` argument to load one of several alternative image sources.
     * The browser will choose its preferred source. You can also use `Loader.imageset` to do this.
     *
     * ```javascript
     * load.image('flower', [
     *     'flower.avif',
     *     'flower.webp',
     *     'flower.png'
     * ]);
     * ```
     *
     * You can also describe the media types explicitly:
     *
     * ```javascript
     * load.image('flower', [
     *     { url: 'flower.avif', type: 'image/avif' },
     *     { url: 'flower.webp', type: 'image/webp' },
     *     { url: 'flower.png', type: 'image/png' }
     * ]);
     * ```
     *
     * @method Phaser.Loader#image
     * @param {string} key - Unique asset key of this image file.
     * @param {string|object|string[]|object[]} [url] - URL of an image file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png". Can also be a texture data object or a source array.
     * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
     * @return {Phaser.Loader} This Loader instance.
     */
    image: function (key, url, overwrite)
    {
        if (Array.isArray(url))
        {
            return this.imageset(key, url, overwrite);
        }
        if (typeof url === 'object')
        {
            return this.texture(key, url, overwrite);
        }
        else
        {
            return this.addToFileList('image', key, url, undefined, overwrite, '.png');
        }
    },

    /**
     * Adds an Image to the current load queue, giving several alternative sources.
     * The browser will choose its preferred source.
     *
     * Sources can be URLs or objects in the form { url, type }, where `type` is the media type.
     * If the source is an URL (string) then Phaser will guess the media type.
     *
     * @method Phaser.Loader#imageset
     * @param {string} key - Unique asset key of this image file.
     * @param {string[]|object[]} [sources] - Source URLs or objects in the form { url, type }.
     * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
     * @return {Phaser.Loader} This Loader instance.
     */
    imageset: function (key, sources, overwrite)
    {
        var defaultSource = sources[sources.length - 1];
        var url = (typeof defaultSource === 'string') ? defaultSource : defaultSource.url;

        return this.addToFileList('imageset', key, url, { sources: sources }, overwrite);
    },

    /**
     * Generate an image from a BitmapData object and add it to the current load queue.
     *
     * @method Phaser.Loader#imageFromBitmapData
     * @param {string} key - Unique asset key for the generated image.
     * @param {Phaser.BitmapData} bitmapData
     * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
     * @return {Phaser.Loader} This Loader instance.
     */
    imageFromBitmapData: function (key, bitmapData, overwrite)
    {
        return this.image(key, bitmapData.canvas.toDataURL('image/png'), overwrite);
    },

    /**
     * Generate a grid image and add it to the current load queue.
     *
     * @method Phaser.Loader#imageFromGrid
     * @see Phaser.Create#grid
     */
    imageFromGrid: function (key, width, height, cellWidth, cellHeight, color)
    {
        return this.imageFromBitmapData(key, this.game.create.grid(key, width, height, cellWidth, cellHeight, color, false));
    },

    /**
     * Generate a texture image and add it to the current load queue.
     *
     * @method Phaser.Loader#imageFromTexture
     * @see Phaser.Create#texture
     */
    imageFromTexture: function (key, data, pixelWidth, pixelHeight, palette)
    {
        return this.imageFromBitmapData(key, this.game.create.texture(key, data, pixelWidth, pixelHeight, palette, false));
    },

    /**
     * Adds a Compressed Texture Image to the current load queue.
     *
     * Compressed Textures are a WebGL only feature, and require 3rd party tools to create.
     * Available tools include Texture Packer, PVRTexTool, DirectX Texture Tool and Mali Texture Compression Tool.
     *
     * Supported texture compression formats are: PVRTC, S3TC and ETC1.
     * Supported file formats are: PVR, DDS, KTX and PKM.
     *
     * The formats that support all 3 compression algorithms are PVR and KTX.
     * PKM only supports ETC1, and DDS only S3TC for now.
     *
     * The texture path object looks like this:
     *
     * ```javascript
     * load.texture('factory', {
     *     etc1: 'assets/factory_etc1.pkm',
     *     s3tc: 'assets/factory_dxt1.pvr',
     *     pvrtc: 'assets/factory_pvrtc.pvr',
     *     truecolor: 'assets/factory.png'
     * });
     * ```
     *
     * The `truecolor` property points to a standard PNG file, that will be used if none of the
     * compressed formats are supported by the browser / GPU.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the image via `Cache.getImage(key)`
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
     * and no URL is given then the Loader will set the URL to be "alien.pvr". It will always add `.pvr` as the extension.
     * If you do not desire this action then provide a URL.
     *
     * @method Phaser.Loader#texture
     * @param {string} key - Unique asset key of this image file.
     * @param {object} object - The texture path data object.
     * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
     * @return {Phaser.Loader} This Loader instance.
     */
    texture: function (key, object, overwrite)
    {
        if (this.game.renderType === Phaser.WEBGL)
        {
            var compression = this.game.renderer.extensions.compression;
            var exkey;

            for (exkey in object)
            {
                if (exkey.toUpperCase() in compression)
                {
                    return this.addToFileList('texture', key, object[exkey], undefined, overwrite, '.pvr');
                }
            }
        }

        /*
         * Check if we have a truecolor texture to fallback.
         * Also catches calls to this function that are from a Canvas renderer
         */

        if (object.truecolor)
        {
            this.addToFileList('image', key, object.truecolor, undefined, overwrite, '.png');
        }

        return this;
    },

    /**
     * Adds an array of images to the current load queue.
     *
     * It works by passing each element of the array to the Loader.image method.
     *
     * The files are **not** loaded immediately after calling this method. The files are added to the queue ready to be loaded when the loader starts.
     *
     * Phaser can load all common image types: png, jpg, gif and any other format the browser can natively handle.
     *
     * The keys must be unique Strings. They are used to add the files to the Phaser.Cache upon successful load.
     *
     * Retrieve the images via `Cache.getImage(key)`
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
     * and no URL is given then the Loader will set the URL to be "alien.png". It will always add `.png` as the extension.
     * If you do not desire this action then provide a URL.
     *
     * @method Phaser.Loader#images
     * @param {array} keys - An array of unique asset keys of the image files.
     * @param {array} [urls] - Optional array of URLs. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png". If provided the URLs array length must match the keys array length.
     * @return {Phaser.Loader} This Loader instance.
     */
    images: function (keys, urls)
    {
        if (Array.isArray(urls))
        {
            for (var i = 0; i < keys.length; i++)
            {
                this.image(keys[i], urls[i]);
            }
        }
        else
        {
            for (var i = 0; i < keys.length; i++)
            {
                this.image(keys[i]);
            }
        }

        return this;
    },

    /**
     * Adds a Text file to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getText(key)`
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
     * and no URL is given then the Loader will set the URL to be "alien.txt". It will always add `.txt` as the extension.
     * If you do not desire this action then provide a URL.
     *
     * @method Phaser.Loader#text
     * @param {string} key - Unique asset key of the text file.
     * @param {string} [url] - URL of the text file. If undefined or `null` the url will be set to `<key>.txt`, i.e. if `key` was "alien" then the URL will be "alien.txt".
     * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
     * @return {Phaser.Loader} This Loader instance.
     */
    text: function (key, url, overwrite)
    {
        return this.addToFileList('text', key, url, undefined, overwrite, '.txt');
    },

    /**
     * Adds a JSON file to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getJSON(key)`. JSON files are automatically parsed upon load.
     * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the text file as needed.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
     * and no URL is given then the Loader will set the URL to be "alien.json". It will always add `.json` as the extension.
     * If you do not desire this action then provide a URL.
     *
     * @method Phaser.Loader#json
     * @param {string} key - Unique asset key of the json file.
     * @param {string} [url] - URL of the JSON file. If undefined or `null` the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
     * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
     * @return {Phaser.Loader} This Loader instance.
     */
    json: function (key, url, overwrite)
    {
        return this.addToFileList('json', key, url, undefined, overwrite, '.json');
    },

    /**
     * Adds a fragment shader file to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getShader(key)`.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "blur"
     * and no URL is given then the Loader will set the URL to be "blur.frag". It will always add `.frag` as the extension.
     * If you do not desire this action then provide a URL.
     *
     * @method Phaser.Loader#shader
     * @param {string} key - Unique asset key of the fragment file.
     * @param {string} [url] - URL of the fragment file. If undefined or `null` the url will be set to `<key>.frag`, i.e. if `key` was "blur" then the URL will be "blur.frag".
     * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
     * @return {Phaser.Loader} This Loader instance.
     */
    shader: function (key, url, overwrite)
    {
        return this.addToFileList('shader', key, url, undefined, overwrite, '.frag');
    },

    /**
     * Adds an XML file to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getXML(key)`.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
     * and no URL is given then the Loader will set the URL to be "alien.xml". It will always add `.xml` as the extension.
     * If you do not desire this action then provide a URL.
     *
     * @method Phaser.Loader#xml
     * @param {string} key - Unique asset key of the xml file.
     * @param {string} [url] - URL of the XML file. If undefined or `null` the url will be set to `<key>.xml`, i.e. if `key` was "alien" then the URL will be "alien.xml".
     * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
     * @return {Phaser.Loader} This Loader instance.
     */
    xml: function (key, url, overwrite)
    {
        return this.addToFileList('xml', key, url, undefined, overwrite, '.xml');
    },

    /**
     * Adds a JavaScript file to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * The key must be a unique String.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
     * and no URL is given then the Loader will set the URL to be "alien.js". It will always add `.js` as the extension.
     * If you do not desire this action then provide a URL.
     *
     * Upon successful load the JavaScript is automatically turned into a script tag and executed, so be careful what you load!
     *
     * A callback, which will be invoked as the script tag has been created, can also be specified.
     * The callback must return relevant `data`.
     *
     * @method Phaser.Loader#script
     * @param {string} key - Unique asset key of the script file.
     * @param {string} [url] - URL of the JavaScript file. If undefined or `null` the url will be set to `<key>.js`, i.e. if `key` was "alien" then the URL will be "alien.js".
     * @param {function} [callback=(none)] - Optional callback that will be called after the script tag has loaded, so you can perform additional processing.
     * @param {object} [callbackContext=(loader)] - The context under which the callback will be applied. If not specified it will use the Phaser Loader as the context.
     * @return {Phaser.Loader} This Loader instance.
     */
    script: function (key, url, callback, callbackContext)
    {
        if (callback === undefined) { callback = false; }

        if (callback !== false && callbackContext === undefined) { callbackContext = this; }

        return this.addToFileList('script', key, url, { syncPoint: true, callback: callback, callbackContext: callbackContext }, false, '.js');
    },

    /**
     * Adds a binary file to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getBinary(key)`.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
     * and no URL is given then the Loader will set the URL to be "alien.bin". It will always add `.bin` as the extension.
     * If you do not desire this action then provide a URL.
     *
     * It will be loaded via xhr with a responseType of "arraybuffer". You can specify an optional callback to process the file after load.
     * When the callback is called it will be passed 2 parameters: the key of the file and the file data.
     *
     * WARNING: If a callback is specified the data will be set to whatever it returns. Always return the data object, even if you didn't modify it.
     *
     * @method Phaser.Loader#binary
     * @param {string} key - Unique asset key of the binary file.
     * @param {string} [url] - URL of the binary file. If undefined or `null` the url will be set to `<key>.bin`, i.e. if `key` was "alien" then the URL will be "alien.bin".
     * @param {function} [callback=(none)] - Optional callback that will be passed the file after loading, so you can perform additional processing on it.
     * @param {object} [callbackContext] - The context under which the callback will be applied. If not specified it will use the callback itself as the context.
     * @return {Phaser.Loader} This Loader instance.
     */
    binary: function (key, url, callback, callbackContext)
    {
        if (callback === undefined) { callback = false; }

        // Why is the default callback context the ..callback?
        if (callback !== false && callbackContext === undefined) { callbackContext = callback; }

        return this.addToFileList('binary', key, url, { callback: callback, callbackContext: callbackContext }, false, '.bin');
    },

    /**
     * Adds a Sprite Sheet to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * To clarify the terminology that Phaser uses: A Sprite Sheet is an image containing frames, usually of an animation, that are all equal
     * dimensions and often in sequence. For example if the frame size is 32x32 then every frame in the sprite sheet will be that size.
     * Sometimes (outside of Phaser) the term "sprite sheet" is used to refer to a texture atlas.
     * A Texture Atlas works by packing together images as best it can, using whatever frame sizes it likes, often with cropping and trimming
     * the frames in the process. Software such as Texture Packer, Flash CC or Shoebox all generate texture atlases, not sprite sheets.
     * If you've got an atlas then use `Loader.atlas` instead.
     *
     * The key must be a unique String. It is used to add the image to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getImage(key)`. Sprite sheets, being image based, live in the same Cache as all other Images.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
     * and no URL is given then the Loader will set the URL to be "alien.png". It will always add `.png` as the extension.
     * If you do not desire this action then provide a URL.
     *
     * An image with four frames, `margin = 1`, and `spacing = 2` looks like this:
     *
     * ```
     * ........
     * .#  #  .
     * .      .
     * .      .
     * .#  #  .
     * .      .
     * .      .
     * ........
     *
     * .  margin
     *    spacing
     * #  sprite frame
     * ```
     *
     * `spacing` must be on only the right and bottom edges of each frame, including the last row and column.
     *
     * The first sprite frame is found at (margin) px from the left of the image.
     * The second sprite frame is found at (margin + frameWidth + spacing) px from the left of the image, and so on.
     *
     * @method Phaser.Loader#spritesheet
     * @param {string} key - Unique asset key of the sheet file.
     * @param {string} url - URL of the sprite sheet file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
     * @param {number} frameWidth - Width in pixels of a single frame in the sprite sheet.
     * @param {number} frameHeight - Height in pixels of a single frame in the sprite sheet.
     * @param {number} [frameMax=-1] - How many frames in this sprite sheet. If not specified it will divide the whole image into frames.
     * @param {number} [margin=0] - The distance from the top-left of the image to the top-left of the first frame, if any.
     * @param {number} [spacing=0] - The distance from the right edge of a frame to the left edge of the next frame on the same row, from the right edge of the last frame of a row to the margin, from the bottom edge of a frame to the top edge of the next frame on the same column, and from the bottom edge of the last frame of a column to the margin.
     * @param {number} [skipFrames=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one image.
     * @return {Phaser.Loader} This Loader instance.
     */
    spritesheet: function (key, url, frameWidth, frameHeight, frameMax, margin, spacing, skipFrames)
    {
        if (frameMax === undefined) { frameMax = -1; }
        if (margin === undefined) { margin = 0; }
        if (spacing === undefined) { spacing = 0; }
        if (skipFrames === undefined) { skipFrames = 0; }

        return this.addToFileList('spritesheet', key, url, { frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax, margin: margin, spacing: spacing, skipFrames: skipFrames }, false, '.png');
    },

    /**
     * Adds an audio file to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getSound(key)`.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * Mobile warning: There are some mobile devices (certain iPad 2 and iPad Mini revisions) that cannot play 48000 Hz audio.
     * When they try to play the audio becomes extremely distorted and buzzes, eventually crashing the sound system.
     * The solution is to use a lower encoding rate such as 44100 Hz.
     *
     * @method Phaser.Loader#audio
     * @param {string} key - Unique asset key of the audio file.
     * @param {string|string[]|object[]} urls - Either a single string or an array of URIs or pairs of `{uri: .., type: ..}`.
     *    If an array is specified then the first URI (or URI + mime pair) that is device-compatible will be selected.
     *    For example: `"jump.mp3"`, `['jump.mp3', 'jump.ogg', 'jump.m4a']`, or `[{uri: "data:<opus_resource>", type: 'opus'}, 'fallback.mp3']`.
     *    BLOB and DATA URIs can be used but only support automatic detection when used in the pair form; otherwise the format must be manually checked before adding the resource.
     * @param {boolean} [autoDecode=true] - When using Web Audio the audio files can either be decoded at load time or run-time.
     *    Audio files can't be played until they are decoded and, if specified, this enables immediate decoding. Decoding is a non-blocking async process, however it consumes huge amounts of CPU time on mobiles especially.
     * @return {Phaser.Loader} This Loader instance.
     */
    audio: function (key, urls, autoDecode)
    {
        if (this.game.sound.noAudio)
        {
            return this;
        }

        if (autoDecode === undefined) { autoDecode = true; }

        if (typeof urls === 'string')
        {
            urls = [ urls ];
        }

        return this.addToFileList('audio', key, urls, { buffer: null, autoDecode: autoDecode });
    },

    /**
     * Adds an audio sprite file to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Audio Sprites are a combination of audio files and a JSON configuration.
     *
     * The JSON follows the format of that created by https://github.com/tonistiigi/audiosprite
     *
     * Retrieve the file via `Cache.getSoundData(key)`.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * @method Phaser.Loader#audioSprite
     * @param {string} key - Unique asset key of the audio file.
     * @param {Array|string} urls - An array containing the URLs of the audio files, i.e.: [ 'audiosprite.mp3', 'audiosprite.ogg', 'audiosprite.m4a' ] or a single string containing just one URL.
     * @param {string} [jsonURL=null] - The URL of the audiosprite configuration JSON object. If you wish to pass the data directly set this parameter to null.
     * @param {string|object} [jsonData=null] - A JSON object or string containing the audiosprite configuration data. This is ignored if jsonURL is not null.
     * @param {boolean} [autoDecode=true] - When using Web Audio the audio files can either be decoded at load time or run-time.
     *    Audio files can't be played until they are decoded and, if specified, this enables immediate decoding. Decoding is a non-blocking async process, however it consumes huge amounts of CPU time on mobiles especially.
     * @return {Phaser.Loader} This Loader instance.
     */
    audioSprite: function (key, urls, jsonURL, jsonData, autoDecode)
    {
        if (this.game.sound.noAudio)
        {
            return this;
        }

        if (jsonURL === undefined) { jsonURL = null; }
        if (jsonData === undefined) { jsonData = null; }
        if (autoDecode === undefined) { autoDecode = true; }

        this.audio(key, urls, autoDecode);

        if (jsonURL)
        {
            this.json(key + '-audioatlas', jsonURL);
        }
        else if (jsonData)
        {
            if (typeof jsonData === 'string')
            {
                jsonData = JSON.parse(jsonData);
            }

            this.cache.addJSON(key + '-audioatlas', '', jsonData);
        }
        else
        {
            console.warn('Phaser.Loader.audiosprite - You must specify either a jsonURL or provide a jsonData object');
        }

        return this;
    },

    /**
     * A legacy alias for Loader.audioSprite. Please see that method for documentation.
     *
     * @method Phaser.Loader#audiosprite
     * @param {string} key - Unique asset key of the audio file.
     * @param {Array|string} urls - An array containing the URLs of the audio files, i.e.: [ 'audiosprite.mp3', 'audiosprite.ogg', 'audiosprite.m4a' ] or a single string containing just one URL.
     * @param {string} [jsonURL=null] - The URL of the audiosprite configuration JSON object. If you wish to pass the data directly set this parameter to null.
     * @param {string|object} [jsonData=null] - A JSON object or string containing the audiosprite configuration data. This is ignored if jsonURL is not null.
     * @param {boolean} [autoDecode=true] - When using Web Audio the audio files can either be decoded at load time or run-time.
     *    Audio files can't be played until they are decoded and, if specified, this enables immediate decoding. Decoding is a non-blocking async process, however it consumes huge amounts of CPU time on mobiles especially.
     * @return {Phaser.Loader} This Loader instance.
     */
    audiosprite: function (key, urls, jsonURL, jsonData, autoDecode)
    {
        return this.audioSprite(key, urls, jsonURL, jsonData, autoDecode);
    },

    /**
     * Adds a video file to the current load queue.
     *
     * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getVideo(key)`.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * You don't need to preload a video in order to play it in your game. See `Video.createVideoFromURL` for details.
     *
     * @method Phaser.Loader#video
     * @param {string} key - Unique asset key of the video file.
     * @param {string|string[]|object[]} urls - Either a single string or an array of URIs or pairs of `{uri: .., type: ..}`.
     *    If an array is specified then the first URI (or URI + mime pair) that is device-compatible will be selected.
     *    For example: `"boom.mp4"`, `['boom.mp4', 'boom.ogg', 'boom.webm']`, or `[{uri: "data:<opus_resource>", type: 'opus'}, 'fallback.mp4']`.
     *    BLOB and DATA URIs can be used but only support automatic detection when used in the pair form; otherwise the format must be manually checked before adding the resource.
     * @param {string} [loadEvent='canplaythrough'] - This sets the Video source event to listen for before the load is considered complete.
     *    'canplaythrough' implies the video has downloaded enough, and bandwidth is high enough that it can be played to completion.
     *    'canplay' implies the video has downloaded enough to start playing, but not necessarily to finish.
     *    'loadeddata' just makes sure that the video meta data and first frame have downloaded. Phaser uses this value automatically if the
     *    browser is detected as being Firefox and no `loadEvent` is given, otherwise it defaults to `canplaythrough`.
     * @param {boolean} [asBlob=false] - Video files can either be loaded via the creation of a video element which has its src property set.
     *    Or they can be loaded via xhr, stored as binary data in memory and then converted to a Blob. This isn't supported in IE9 or Android 2.
     *    If you need to have the same video playing at different times across multiple Sprites then you need to load it as a Blob.
     * @return {Phaser.Loader} This Loader instance.
     */
    video: function (key, urls, loadEvent, asBlob)
    {
        if (loadEvent === undefined)
        {
            if (this.game.device.firefox)
            {
                loadEvent = 'loadeddata';
            }
            else
            {
                loadEvent = 'canplaythrough';
            }
        }

        if (asBlob === undefined) { asBlob = false; }

        if (typeof urls === 'string')
        {
            urls = [ urls ];
        }

        return this.addToFileList('video', key, urls, { buffer: null, asBlob: asBlob, loadEvent: loadEvent });
    },

    /**
     * Adds a Tile Map data file to the current load queue.
     *
     * Phaser can load data in two different formats: CSV and Tiled JSON.
     *
     * Tiled is a free software package, specifically for creating tilemaps, and is available from http://www.mapeditor.org
     *
     * You can choose to either load the data externally, by providing a URL to a json file.
     * Or you can pass in a JSON object or String via the `data` parameter.
     * If you pass a String the data is automatically run through `JSON.parse` and then immediately added to the Phaser.Cache.
     *
     * If a URL is provided the file is **not** loaded immediately after calling this method, but is added to the load queue.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getTilemapData(key)`. JSON files are automatically parsed upon load.
     * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the text file as needed.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified and no data is given then the Loader will take the key and create a filename from that.
     * For example if the key is "level1" and no URL or data is given then the Loader will set the URL to be "level1.json".
     * If you set the format to be Tilemap.CSV it will set the URL to be "level1.csv" instead.
     *
     * If you do not desire this action then provide a URL or data object.
     *
     * @method Phaser.Loader#tilemap
     * @param {string} key - Unique asset key of the tilemap data.
     * @param {string} [url] - URL of the tile map file. If undefined or `null` and no data is given the url will be set to `<key>.json`, i.e. if `key` was "level1" then the URL will be "level1.json".
     * @param {object|string} [data] - An optional JSON data object. If given then the url is ignored and this JSON object is used for map data instead.
     * @param {number} [format=Phaser.Tilemap.CSV] - The format of the map data. Either Phaser.Tilemap.CSV or Phaser.Tilemap.TILED_JSON.
     * @return {Phaser.Loader} This Loader instance.
     */
    tilemap: function (key, url, data, format)
    {
        if (url === undefined) { url = null; }
        if (data === undefined) { data = null; }
        if (format === undefined) { format = Phaser.Tilemap.CSV; }

        if (!url && !data)
        {
            if (format === Phaser.Tilemap.CSV)
            {
                url = key + '.csv';
            }
            else
            {
                url = key + '.json';
            }
        }

        //  A map data object has been given
        if (data)
        {
            switch (format)
            {
                case Phaser.Tilemap.CSV:
                    //  A csv string or object has been given
                    break;

                case Phaser.Tilemap.TILED_JSON:
                    //  A json string or object has been given

                    if (typeof data === 'string')
                    {
                        data = JSON.parse(data);
                    }
                    break;
            }

            this.cache.addTilemap(key, null, data, format);
        }
        else
        {
            this.addToFileList('tilemap', key, url, { format: format });
        }

        return this;
    },

    /**
     * Adds a CSV Map data file to the current load queue.
     *
     * @method Phaser.Loader#tilemapCSV
     * @param {string} key - Unique asset key of the tilemap data.
     * @param {string} [url] - URL of the tile map file. If undefined or `null` and no data is given the url will be set to `<key>.csv`, i.e. if `key` was "level1" then the URL will be "level1.csv".
     * @param {string} [data] - A CSV data string. If given then the url is ignored and this is used for map data instead.
     * @return {Phaser.Loader} This Loader instance.
     *
     * @see Phaser.Loader#tilemap
     */
    tilemapCSV: function (key, url, data)
    {
        return this.tilemap(key, url, data, Phaser.Tilemap.CSV);
    },

    /**
     * Adds a Tiled JSON Map data file to the current load queue.
     *
     * @method Phaser.Loader#tilemapTiledJSON
     * @param {string} key - Unique asset key of the tilemap data.
     * @param {string} [url] - URL of the tile map file. If undefined or `null` and no data is given the url will be set to `<key>.json`, i.e. if `key` was "level1" then the URL will be "level1.json".
     * @param {object|string} [data] - A JSON data object or string. If given then the url is ignored and this is used for map data instead.
     * @return {Phaser.Loader} This Loader instance.
     *
     * @see Phaser.Loader#tilemap
     */
    tilemapTiledJSON: function (key, url, data)
    {
        return this.tilemap(key, url, data, Phaser.Tilemap.TILED_JSON);
    },

    /**
     * Adds a physics data file to the current load queue.
     *
     * The data must be in `Lime + Corona` JSON format. [Physics Editor](https://www.codeandweb.com) by code'n'web exports in this format natively.
     *
     * You can choose to either load the data externally, by providing a URL to a json file.
     * Or you can pass in a JSON object or String via the `data` parameter.
     * If you pass a String the data is automatically run through `JSON.parse` and then immediately added to the Phaser.Cache.
     *
     * If a URL is provided the file is **not** loaded immediately after calling this method, but is added to the load queue.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getJSON(key)`. JSON files are automatically parsed upon load.
     * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the text file as needed.
     *
     * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the URL isn't specified and no data is given then the Loader will take the key and create a filename from that.
     * For example if the key is "alien" and no URL or data is given then the Loader will set the URL to be "alien.json".
     * It will always use `.json` as the extension.
     *
     * If you do not desire this action then provide a URL or data object.
     *
     * @method Phaser.Loader#physics
     * @param {string} key - Unique asset key of the physics json data.
     * @param {string} [url] - URL of the physics data file. If undefined or `null` and no data is given the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
     * @param {object|string} [data] - An optional JSON data object. If given then the url is ignored and this JSON object is used for physics data instead.
     * @param {string} [format=Phaser.Physics.LIME_CORONA_JSON] - The format of the physics data.
     * @return {Phaser.Loader} This Loader instance.
     */
    physics: function (key, url, data, format)
    {
        if (url === undefined) { url = null; }
        if (data === undefined) { data = null; }
        if (format === undefined) { format = Phaser.Physics.LIME_CORONA_JSON; }

        if (!url && !data)
        {
            url = key + '.json';
        }

        //  A map data object has been given
        if (data)
        {
            if (typeof data === 'string')
            {
                data = JSON.parse(data);
            }

            this.cache.addPhysicsData(key, null, data, format);
        }
        else
        {
            this.addToFileList('physics', key, url, { format: format });
        }

        return this;
    },

    /**
     * Adds Bitmap Font files to the current load queue.
     *
     * To create the Bitmap Font files you can use:
     *
     * BMFont (Windows, free): http://www.angelcode.com/products/bmfont/
     * Glyph Designer (OS X, commercial): http://www.71squared.com/en/glyphdesigner
     * Littera (Web-based, free): http://kvazars.com/littera/
     *
     * You can choose to either load the data externally, by providing a URL to an xml file.
     * Or you can pass in an XML object or String via the `xmlData` parameter.
     * If you pass a String the data is automatically run through `Loader.parseXML` and then immediately added to the Phaser.Cache.
     *
     * If URLs are provided the files are **not** loaded immediately after calling this method, but are added to the load queue.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getBitmapFont(key)`. XML files are automatically parsed upon load.
     * If you need to control when the XML is parsed then use `Loader.text` instead and parse the XML file as needed.
     *
     * The URLs can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the textureURL isn't specified then the Loader will take the key and create a filename from that.
     * For example if the key is "megaFont" and textureURL is null then the Loader will set the URL to be "megaFont.png".
     * The same is true for the atlasURL. If atlasURL isn't specified and no atlasData has been provided then the Loader will
     * set the atlasURL to be the key. For example if the key is "megaFont" the atlasURL will be set to "megaFont.xml".
     *
     * If you do not desire this action then provide URLs and / or a data object.
     *
     * @method Phaser.Loader#bitmapFont
     * @param {string} key - Unique asset key of the bitmap font.
     * @param {string} textureURL -  URL of the Bitmap Font texture file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "megaFont" then the URL will be "megaFont.png".
     * @param {string} atlasURL - URL of the Bitmap Font atlas file (xml/json). If undefined or `null` AND `atlasData` is null, the url will be set to `<key>.xml`, i.e. if `key` was "megaFont" then the URL will be "megaFont.xml".
     * @param {object} atlasData - An optional Bitmap Font atlas in string form (stringified xml/json).
     * @param {number} [xSpacing=0] - If you'd like to add additional horizontal spacing between the characters then set the pixel value here.
     * @param {number} [ySpacing=0] - If you'd like to add additional vertical spacing between the lines then set the pixel value here.
     * @return {Phaser.Loader} This Loader instance.
     */
    bitmapFont: function (key, textureURL, atlasURL, atlasData, xSpacing, ySpacing)
    {
        if (textureURL === undefined || textureURL === null)
        {
            textureURL = key + '.png';
        }

        if (atlasURL === undefined) { atlasURL = null; }
        if (atlasData === undefined) { atlasData = null; }

        if (atlasURL === null && atlasData === null)
        {
            atlasURL = key + '.xml';
        }

        if (xSpacing === undefined) { xSpacing = 0; }
        if (ySpacing === undefined) { ySpacing = 0; }

        //  A URL to a json/xml atlas has been given
        if (atlasURL)
        {
            this.addToFileList('bitmapfont', key, textureURL, { atlasURL: atlasURL, xSpacing: xSpacing, ySpacing: ySpacing });
        }
        else
        {
            //  A stringified xml/json atlas has been given
            if (typeof atlasData === 'string')
            {
                var json, xml;

                try
                {
                    json = JSON.parse(atlasData);
                }
                catch (e)
                {
                    xml = this.parseXml(atlasData);
                }

                if (!xml && !json)
                {
                    throw new Error('Phaser.Loader. Invalid Bitmap Font atlas given');
                }

                this.addToFileList('bitmapfont', key, textureURL, {
                    atlasURL: null, atlasData: json || xml,
                    atlasType: (json ? 'json' : 'xml'), xSpacing: xSpacing, ySpacing: ySpacing
                });
            }
        }

        return this;
    },

    /**
     * Adds a Texture Atlas file to the current load queue.
     *
     * Unlike `Loader.atlasJSONHash` this call expects the atlas data to be in a JSON Array format.
     *
     * To create the Texture Atlas you can use tools such as:
     *
     * [Texture Packer](https://www.codeandweb.com/texturepacker/phaser)
     * [Shoebox](http://renderhjs.net/shoebox/)
     *
     * If using Texture Packer we recommend you enable "Trim sprite names".
     * If your atlas software has an option to "rotate" the resulting frames, you must disable it.
     *
     * You can choose to either load the data externally, by providing a URL to a json file.
     * Or you can pass in a JSON object or String via the `atlasData` parameter.
     * If you pass a String the data is automatically run through `JSON.parse` and then immediately added to the Phaser.Cache.
     *
     * If URLs are provided the files are **not** loaded immediately after calling this method, but are added to the load queue.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getImage(key)`. JSON files are automatically parsed upon load.
     * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the JSON file as needed.
     *
     * The URLs can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the textureURL isn't specified then the Loader will take the key and create a filename from that.
     * For example if the key is "player" and textureURL is null then the Loader will set the URL to be "player.png".
     * The same is true for the atlasURL. If atlasURL isn't specified and no atlasData has been provided then the Loader will
     * set the atlasURL to be the key. For example if the key is "player" the atlasURL will be set to "player.json".
     *
     * If you do not desire this action then provide URLs and / or a data object.
     *
     * @method Phaser.Loader#atlasJSONArray
     * @param {string} key - Unique asset key of the texture atlas file.
     * @param {string} [textureURL] - URL of the texture atlas image file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
     * @param {string} [atlasURL] - URL of the texture atlas data file. If undefined or `null` and no atlasData is given, the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
     * @param {object} [atlasData] - A JSON data object. You don't need this if the data is being loaded from a URL.
     * @return {Phaser.Loader} This Loader instance.
     */
    atlasJSONArray: function (key, textureURL, atlasURL, atlasData)
    {
        return this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
    },

    /**
     * Adds a Texture Atlas file to the current load queue.
     *
     * Unlike `Loader.atlas` this call expects the atlas data to be in a JSON Hash format.
     *
     * To create the Texture Atlas you can use tools such as:
     *
     * [Texture Packer](https://www.codeandweb.com/texturepacker/phaser)
     * [Shoebox](http://renderhjs.net/shoebox/)
     *
     * If using Texture Packer we recommend you enable "Trim sprite names".
     * If your atlas software has an option to "rotate" the resulting frames, you must disable it.
     *
     * You can choose to either load the data externally, by providing a URL to a json file.
     * Or you can pass in a JSON object or String via the `atlasData` parameter.
     * If you pass a String the data is automatically run through `JSON.parse` and then immediately added to the Phaser.Cache.
     *
     * If URLs are provided the files are **not** loaded immediately after calling this method, but are added to the load queue.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getImage(key)`. JSON files are automatically parsed upon load.
     * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the JSON file as needed.
     *
     * The URLs can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the textureURL isn't specified then the Loader will take the key and create a filename from that.
     * For example if the key is "player" and textureURL is null then the Loader will set the URL to be "player.png".
     * The same is true for the atlasURL. If atlasURL isn't specified and no atlasData has been provided then the Loader will
     * set the atlasURL to be the key. For example if the key is "player" the atlasURL will be set to "player.json".
     *
     * If you do not desire this action then provide URLs and / or a data object.
     *
     * @method Phaser.Loader#atlasJSONHash
     * @param {string} key - Unique asset key of the texture atlas file.
     * @param {string} [textureURL] - URL of the texture atlas image file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
     * @param {string} [atlasURL] - URL of the texture atlas data file. If undefined or `null` and no atlasData is given, the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
     * @param {object} [atlasData] - A JSON data object. You don't need this if the data is being loaded from a URL.
     * @return {Phaser.Loader} This Loader instance.
     */
    atlasJSONHash: function (key, textureURL, atlasURL, atlasData)
    {
        return this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    },

    /**
     * Adds a Texture Atlas file to the current load queue.
     *
     * This call expects the atlas data to be in the Starling XML data format.
     *
     * To create the Texture Atlas you can use tools such as:
     *
     * [Texture Packer](https://www.codeandweb.com/texturepacker/phaser)
     * [Shoebox](http://renderhjs.net/shoebox/)
     *
     * If using Texture Packer we recommend you enable "Trim sprite names".
     * If your atlas software has an option to "rotate" the resulting frames, you must disable it.
     *
     * You can choose to either load the data externally, by providing a URL to an xml file.
     * Or you can pass in an XML object or String via the `atlasData` parameter.
     * If you pass a String the data is automatically run through `Loader.parseXML` and then immediately added to the Phaser.Cache.
     *
     * If URLs are provided the files are **not** loaded immediately after calling this method, but are added to the load queue.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getImage(key)`. XML files are automatically parsed upon load.
     * If you need to control when the XML is parsed then use `Loader.text` instead and parse the XML file as needed.
     *
     * The URLs can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the textureURL isn't specified then the Loader will take the key and create a filename from that.
     * For example if the key is "player" and textureURL is null then the Loader will set the URL to be "player.png".
     * The same is true for the atlasURL. If atlasURL isn't specified and no atlasData has been provided then the Loader will
     * set the atlasURL to be the key. For example if the key is "player" the atlasURL will be set to "player.xml".
     *
     * If you do not desire this action then provide URLs and / or a data object.
     *
     * @method Phaser.Loader#atlasXML
     * @param {string} key - Unique asset key of the texture atlas file.
     * @param {string} [textureURL] - URL of the texture atlas image file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
     * @param {string} [atlasURL] - URL of the texture atlas data file. If undefined or `null` and no atlasData is given, the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.xml".
     * @param {object} [atlasData] - An XML data object. You don't need this if the data is being loaded from a URL.
     * @return {Phaser.Loader} This Loader instance.
     */
    atlasXML: function (key, textureURL, atlasURL, atlasData)
    {
        if (atlasURL === undefined) { atlasURL = null; }
        if (atlasData === undefined) { atlasData = null; }

        if (!atlasURL && !atlasData)
        {
            atlasURL = key + '.xml';
        }

        return this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);
    },

    /**
     * Adds a Texture Atlas file to the current load queue.
     *
     * To create the Texture Atlas you can use tools such as:
     *
     * [Texture Packer](https://www.codeandweb.com/texturepacker/phaser)
     * [Shoebox](http://renderhjs.net/shoebox/)
     *
     * If using Texture Packer we recommend you enable "Trim sprite names".
     * If your atlas software has an option to "rotate" the resulting frames, you must disable it.
     *
     * You can choose to either load the data externally, by providing a URL to a json file.
     * Or you can pass in a JSON object or String via the `atlasData` parameter.
     * If you pass a String the data is automatically run through `JSON.parse` and then immediately added to the Phaser.Cache.
     *
     * If URLs are provided the files are **not** loaded immediately after calling this method, but are added to the load queue.
     *
     * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
     *
     * Retrieve the file via `Cache.getImage(key)`. JSON files are automatically parsed upon load.
     * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the JSON file as needed.
     *
     * The URLs can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
     *
     * If the textureURL isn't specified then the Loader will take the key and create a filename from that.
     * For example if the key is "player" and textureURL is null then the Loader will set the URL to be "player.png".
     * The same is true for the atlasURL. If atlasURL isn't specified and no atlasData has been provided then the Loader will
     * set the atlasURL to be the key. For example if the key is "player" the atlasURL will be set to "player.json".
     *
     * If you do not desire this action then provide URLs and / or a data object.
     *
     * @method Phaser.Loader#atlas
     * @param {string} key - Unique asset key of the texture atlas file.
     * @param {string} [textureURL] - URL of the texture atlas image file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
     * @param {string} [atlasURL] - URL of the texture atlas data file. If undefined or `null` and no atlasData is given, the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
     * @param {object} [atlasData] - A JSON or XML data object. You don't need this if the data is being loaded from a URL.
     * @param {number} [format] - The format of the data. Can be Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY (the default), Phaser.Loader.TEXTURE_ATLAS_JSON_HASH or Phaser.Loader.TEXTURE_ATLAS_XML_STARLING.
     * @return {Phaser.Loader} This Loader instance.
     */
    atlas: function (key, textureURL, atlasURL, atlasData, format)
    {
        if (textureURL === undefined || textureURL === null)
        {
            textureURL = key + '.png';
        }

        if (atlasURL === undefined) { atlasURL = null; }
        if (atlasData === undefined) { atlasData = null; }
        if (format === undefined) { format = Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY; }

        if (!atlasURL && !atlasData)
        {
            if (format === Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
            {
                atlasURL = key + '.xml';
            }
            else
            {
                atlasURL = key + '.json';
            }
        }

        //  A URL to a json/xml file has been given
        if (atlasURL)
        {
            this.addToFileList('textureatlas', key, textureURL, { atlasURL: atlasURL, format: format });
        }
        else
        {
            switch (format)
            {
                case Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY:
                    //  A json string or object has been given

                    if (typeof atlasData === 'string')
                    {
                        atlasData = JSON.parse(atlasData);
                    }
                    break;

                case Phaser.Loader.TEXTURE_ATLAS_XML_STARLING:
                    //  An xml string or object has been given

                    if (typeof atlasData === 'string')
                    {
                        var xml = this.parseXml(atlasData);

                        if (!xml)
                        {
                            throw new Error('Phaser.Loader. Invalid Texture Atlas XML given');
                        }

                        atlasData = xml;
                    }
                    break;
            }

            this.addToFileList('textureatlas', key, textureURL, { atlasURL: null, atlasData: atlasData, format: format });
        }

        return this;
    },

    /**
     * Add a synchronization point to the assets / files added within the supplied callback.
     *
     * A synchronization point denotes that an asset _must_ be completely loaded before
     * subsequent assets can be loaded. An asset marked as a sync-point does not need to wait
     * for previous assets to load (unless they are sync-points). Resources, such as packs, may still
     * be downloaded around sync-points, as long as they do not finalize loading.
     *
     * @method Phaser.Loader#withSyncPoint
     * @param {function} callback - The callback is invoked and is supplied with a single argument: the loader.
     * @param {object} [callbackContext=(loader)] - Context for the callback.
     * @return {Phaser.Loader} This Loader instance.
     */
    withSyncPoint: function (callback, callbackContext)
    {
        this._withSyncPointDepth++;

        try
        {
            callback.call(callbackContext || this, this);
        }
        finally
        {
            this._withSyncPointDepth--;
        }

        return this;
    },

    /**
     * Add a synchronization point to a specific file/asset in the load queue.
     *
     * This has no effect on already loaded assets.
     *
     * @method Phaser.Loader#addSyncPoint
     * @param {string} type - The type of resource to turn into a sync point (image, audio, xml, etc).
     * @param {string} key - Key of the file you want to turn into a sync point.
     * @return {Phaser.Loader} This Loader instance.
     * @see {@link Phaser.Loader#withSyncPoint withSyncPoint}
     */
    addSyncPoint: function (type, key)
    {
        var asset = this.getAsset(type, key);

        if (asset)
        {
            asset.file.syncPoint = true;
        }

        return this;
    },

    /**
     * Remove a file/asset from the loading queue.
     *
     * A file that is loaded or has started loading cannot be removed.
     *
     * @method Phaser.Loader#removeFile
     * @protected
     * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
     * @param {string} key - Key of the file you want to remove.
     */
    removeFile: function (type, key)
    {
        var asset = this.getAsset(type, key);

        if (asset)
        {
            if (!asset.loaded && !asset.loading)
            {
                this._fileList.splice(asset.index, 1);
            }
        }
    },

    /**
     * Remove all file loading requests - this is _insufficient_ to stop current loading. Use `reset` instead.
     *
     * @method Phaser.Loader#removeAll
     * @protected
     */
    removeAll: function ()
    {
        this._fileList.length = 0;
        this._flightQueue.length = 0;
    },

    /**
     * Start loading the assets. Normally you don't need to call this yourself as the StateManager will do so.
     *
     * @method Phaser.Loader#start
     */
    start: function ()
    {
        if (this.isLoading)
        {
            return;
        }

        this.hasLoaded = false;
        this.isLoading = true;

        this.updateProgress();

        this.processLoadQueue();
    },

    /**
     * Process the next item(s) in the file/asset queue.
     *
     * Process the queue and start loading enough items to fill up the inflight queue.
     *
     * If a sync-file is encountered then subsequent asset processing is delayed until it completes.
     * The exception to this rule is that packfiles can be downloaded (but not processed) even if
     * there appear other sync files (ie. packs) - this enables multiple packfiles to be fetched in parallel.
     * such as during the start phaser.
     *
     * @method Phaser.Loader#processLoadQueue
     * @private
     */
    processLoadQueue: function ()
    {
        // Destroyed.
        if (!this.game.isBooted)
        {
            return;
        }

        if (!this.isLoading)
        {
            console.warn('Phaser.Loader - active loading canceled / reset');
            this.finishedLoading(true);
            return;
        }

        // Empty the flight queue as applicable
        for (var i = 0; i < this._flightQueue.length; i++)
        {
            var file = this._flightQueue[i];

            if (file.loaded || file.error)
            {
                this._flightQueue.splice(i, 1);
                i--;

                file.loading = false;
                file.requestUrl = null;
                file.requestObject = null;

                if (file.error)
                {
                    this.onFileError.dispatch(file.key, file);
                }

                if (file.type !== 'packfile')
                {
                    this._loadedFileCount++;
                    this.onFileComplete.dispatch(this.progress, file.key, !file.error, this._loadedFileCount, this._totalFileCount);
                }
                else if (file.type === 'packfile' && file.error)
                {
                    // Non-error pack files are handled when processing the file queue
                    this._loadedPackCount++;
                    this.onPackComplete.dispatch(file.key, !file.error, this._loadedPackCount, this._totalPackCount);
                }
            }
        }

        // When true further non-pack file downloads are suppressed
        var syncblock = false;

        var inflightLimit = this.enableParallel ? Math.max(1, this.maxParallelDownloads) : 1;

        for (var i = this._processingHead; i < this._fileList.length; i++)
        {
            var file = this._fileList[i];

            // Pack is fetched (ie. has data) and is currently at the start of the process queue.
            if (file.type === 'packfile' && !file.error && file.loaded && i === this._processingHead)
            {
                // Processing the pack / adds more files
                this.processPack(file);

                this._loadedPackCount++;
                this.onPackComplete.dispatch(file.key, !file.error, this._loadedPackCount, this._totalPackCount);
            }

            if (file.loaded || file.error)
            {
                // Item at the start of file list finished, can skip it in future
                if (i === this._processingHead)
                {
                    this._processingHead = i + 1;
                }
            }
            else if (!file.loading && this._flightQueue.length < inflightLimit)
            {
                // -> not loaded/failed, not loading
                if (file.type === 'packfile' && !file.data)
                {
                    /*
                     * Fetches the pack data: the pack is processed above as it reaches queue-start.
                     * (Packs do not trigger onLoadStart or onFileStart.)
                     */
                    this._flightQueue.push(file);
                    file.loading = true;

                    this.loadFile(file);
                }
                else if (!syncblock)
                {
                    if (!this._fileLoadStarted)
                    {
                        this._fileLoadStarted = true;
                        this.onLoadStart.dispatch();
                    }

                    this._flightQueue.push(file);
                    file.loading = true;
                    this.onFileStart.dispatch(this.progress, file.key, file.url);

                    this.loadFile(file);
                }
            }

            if (!file.loaded && file.syncPoint)
            {
                syncblock = true;
            }

            /*
             * Stop looking if queue full - or if syncblocked and there are no more packs.
             * (As only packs can be loaded around a syncblock)
             */
            if (this._flightQueue.length >= inflightLimit ||
                (syncblock && this._loadedPackCount === this._totalPackCount))
            {
                break;
            }
        }

        this.updateProgress();

        /*
         * True when all items in the queue have been advanced over
         * (There should be no inflight items as they are complete - loaded/error.)
         */
        if (this._processingHead >= this._fileList.length)
        {
            this.finishedLoading();
        }
        else if (!this._flightQueue.length)
        {
            /*
             * Flight queue is empty but file list is not done being processed.
             * This indicates a critical internal error with no known recovery.
             */
            console.warn('Phaser.Loader - aborting: processing queue empty, loading may have stalled');

            var _this = this;

            setTimeout(function ()
            {
                _this.finishedLoading(true);
            }, 2000);
        }
    },

    /**
     * The loading is all finished.
     *
     * @method Phaser.Loader#finishedLoading
     * @private
     * @param {boolean} [abnormal=true] - True if the loading finished abnormally.
     */
    finishedLoading: function (abnormal)
    {
        // Destroy could have occurred while loading
        if (this.hasLoaded || !this.game.state)
        {
            return;
        }

        this.hasLoaded = true;
        this.isLoading = false;

        // If there were no files make sure to trigger the event anyway, for consistency
        if (!abnormal && !this._fileLoadStarted)
        {
            this._fileLoadStarted = true;
            this.onLoadStart.dispatch();
        }

        this.game.state.loadUpdate();
        this.onBeforeLoadComplete.dispatch();
        this.reset();
        this.onLoadComplete.dispatch();
        this.game.state.loadComplete();
    },

    /**
     * Informs the loader that the given file resource has been fetched and processed;
     * or such a request has failed.
     *
     * @method Phaser.Loader#asyncComplete
     * @private
     * @param {object} file
     * @param {string} [error=''] - The error message, if any. No message implies no error.
     */
    asyncComplete: function (file, errorMessage)
    {
        if (errorMessage === undefined) { errorMessage = ''; }

        file.loaded = true;
        file.error = !!errorMessage;

        if (errorMessage)
        {
            file.errorMessage = errorMessage;

            console.warn('Phaser.Loader - ' + file.type + '[' + file.key + ']' + ': ' + errorMessage);
        }

        this.processLoadQueue();
    },

    /**
     * Process pack data. This will usually modify the file list.
     *
     * @method Phaser.Loader#processPack
     * @private
     * @param {object} pack
     */
    processPack: function (pack)
    {
        var packData = pack.data[pack.key];

        if (!packData)
        {
            console.warn('Phaser.Loader - ' + pack.key + ': pack has data, but not for pack key');
            return;
        }

        for (var i = 0; i < packData.length; i++)
        {
            var file = packData[i];

            switch (file.type)
            {
                case 'image':
                    this.image(file.key, file.url, file.overwrite);
                    break;

                case 'text':
                    this.text(file.key, file.url, file.overwrite);
                    break;

                case 'json':
                    this.json(file.key, file.url, file.overwrite);
                    break;

                case 'xml':
                    this.xml(file.key, file.url, file.overwrite);
                    break;

                case 'script':
                    this.script(file.key, file.url, file.callback, pack.callbackContext || this);
                    break;

                case 'binary':
                    this.binary(file.key, file.url, file.callback, pack.callbackContext || this);
                    break;

                case 'spritesheet':
                    this.spritesheet(file.key, file.url, file.frameWidth, file.frameHeight, file.frameMax, file.margin, file.spacing, file.skipFrames);
                    break;

                case 'video':
                    this.video(file.key, file.urls);
                    break;

                case 'audio':
                    this.audio(file.key, file.urls, file.autoDecode);
                    break;

                case 'audiosprite':
                    this.audiosprite(file.key, file.urls, file.jsonURL, file.jsonData, file.autoDecode);
                    break;

                case 'tilemap':
                    this.tilemap(file.key, file.url, file.data, Phaser.Tilemap[file.format]);
                    break;

                case 'physics':
                    this.physics(file.key, file.url, file.data, Phaser.Loader[file.format]);
                    break;

                case 'bitmapFont':
                    this.bitmapFont(file.key, file.textureURL, file.atlasURL, file.atlasData, file.xSpacing, file.ySpacing);
                    break;

                case 'atlasJSONArray':
                    this.atlasJSONArray(file.key, file.textureURL, file.atlasURL, file.atlasData);
                    break;

                case 'atlasJSONHash':
                    this.atlasJSONHash(file.key, file.textureURL, file.atlasURL, file.atlasData);
                    break;

                case 'atlasXML':
                    this.atlasXML(file.key, file.textureURL, file.atlasURL, file.atlasData);
                    break;

                case 'atlas':
                    this.atlas(file.key, file.textureURL, file.atlasURL, file.atlasData, Phaser.Loader[file.format]);
                    break;

                case 'shader':
                    this.shader(file.key, file.url, file.overwrite);
                    break;
            }
        }
    },

    /**
     * Transforms the asset URL.
     *
     * The default implementation prepends the baseURL if the url doesn't begin with http or //
     *
     * @method Phaser.Loader#transformUrl
     * @protected
     * @param {string} url - The url to transform.
     * @param {object} file - The file object being transformed.
     * @return {string} The transformed url. In rare cases where the url isn't specified it will return false instead.
     */
    transformUrl: function (url, file)
    {
        if (!url)
        {
            return false;
        }

        if (url.match(/^(?:blob:|data:|http:\/\/|https:\/\/|\/\/)/))
        {
            return url;
        }
        else
        {
            return this.baseURL + file.path + url;
        }
    },

    /**
     * Start fetching a resource.
     *
     * All code paths, async or otherwise, from this function must return to `asyncComplete`.
     *
     * @method Phaser.Loader#loadFile
     * @private
     * @param {object} file
     */
    loadFile: function (file)
    {
        //  Image or Data?
        switch (file.type)
        {
            case 'packfile':
                this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.fileComplete);
                break;

            case 'image':
            case 'spritesheet':
            case 'textureatlas':
            case 'bitmapfont':
                this.loadImageTag(file);
                break;

            case 'imageset':
                this.loadPictureTag(file);
                break;

            case 'audio':
                file.url = this.getAudioURL(file.url);

                if (file.url)
                {
                    //  WebAudio or Audio Tag?
                    if (this.game.sound.usingWebAudio)
                    {
                        this.xhrLoad(file, this.transformUrl(file.url, file), 'arraybuffer', this.fileComplete);
                    }
                    else if (this.game.sound.usingAudioTag)
                    {
                        this.loadAudioTag(file);
                    }
                }
                else
                {
                    this.fileError(file, null, 'No supported audio URL specified or device does not have audio playback support');
                }
                break;

            case 'video':
                file.url = this.getVideoURL(file.url);

                if (file.url)
                {
                    if (file.asBlob)
                    {
                        this.xhrLoad(file, this.transformUrl(file.url, file), 'blob', this.fileComplete);
                    }
                    else
                    {
                        this.loadVideoTag(file);
                    }
                }
                else
                {
                    this.fileError(file, null, 'No supported video URL specified or device does not have video playback support');
                }
                break;

            case 'json':

                this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.jsonLoadComplete);
                break;

            case 'xml':

                this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.xmlLoadComplete);
                break;

            case 'tilemap':

                if (file.format === Phaser.Tilemap.TILED_JSON)
                {
                    this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.jsonLoadComplete);
                }
                else if (file.format === Phaser.Tilemap.CSV)
                {
                    this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.csvLoadComplete);
                }
                else
                {
                    this.asyncComplete(file, 'invalid Tilemap format: ' + file.format);
                }
                break;

            case 'text':
            case 'script':
            case 'shader':
            case 'physics':
                this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.fileComplete);
                break;

            case 'texture':

                if (file.key.split('_').pop() === 'truecolor')
                {
                    this.loadImageTag(file);
                }
                else
                {
                    this.xhrLoad(file, this.transformUrl(file.url, file), 'arraybuffer', this.fileComplete);
                }
                break;

            case 'binary':
                this.xhrLoad(file, this.transformUrl(file.url, file), 'arraybuffer', this.fileComplete);
                break;
        }
    },

    /**
     * Continue async loading through an Image tag.
     * @private
     */
    loadImageTag: function (file)
    {
        var _this = this;

        file.data = new Image();
        file.data.name = file.key;

        if (this.crossOrigin)
        {
            file.data.crossOrigin = this.crossOrigin;
        }

        file.data.onload = function ()
        {
            if (file.data.onload)
            {
                file.data.onload = null;
                file.data.onerror = null;
                _this.fileComplete(file);
            }
        };

        file.data.onerror = function ()
        {
            if (file.data.onload)
            {
                file.data.onload = null;
                file.data.onerror = null;
                _this.fileError(file);
            }
        };

        file.data.src = this.transformUrl(file.url, file);

        /*
         * Image is immediately-available/cached
         * More info here: https://github.com/photonstorm/phaser/issues/2534
         */
        if (file.data.complete && file.data.width && file.data.height)
        {
            file.data.onload = null;
            file.data.onerror = null;
            this.fileComplete(file);
        }
    },

    /**
     * Continue async loading through a Picture tag.
     * @private
     */
    loadPictureTag: function (file)
    {
        var _this = this;
        var picElm = document.createElement('picture');
        var sources = file.sources;
        var defaultSource = Phaser.Loader._getSource(sources.pop());

        for (var i = 0, len = sources.length; i < len; i++)
        {
            var source = Phaser.Loader._getSource(sources[i]);

            if (!source.type || !source.url)
            {
                console.warn('Skipping an invalid source for image "%s" (url: "%s", type: "%s")', file.key, source.url, source.type);
            }

            var sourceElm = document.createElement('source');

            sourceElm.setAttribute('type', source.type);
            sourceElm.setAttribute('srcset', this.transformUrl(source.url, file));

            picElm.appendChild(sourceElm);
        }

        file.data = document.createElement('img');
        file.data.name = file.key;

        if (this.crossOrigin)
        {
            file.data.crossOrigin = this.crossOrigin;
        }

        file.data.onload = function ()
        {
            if (file.data.onload)
            {
                file.data.onload = null;
                file.data.onerror = null;
                file.url = file.data.currentSrc;
                _this.fileComplete(file);
            }
        };

        file.data.onerror = function ()
        {
            if (file.data.onload)
            {
                file.data.onload = null;
                file.data.onerror = null;
                file.url = file.data.currentSrc;
                _this.fileError(file);
            }
        };

        picElm.appendChild(file.data);

        file.data.src = this.transformUrl(defaultSource.url, file);

        /*
         * Image is immediately-available/cached?
         * More info here: https://github.com/photonstorm/phaser/issues/2534
         */
        if (file.data.complete && file.data.width && file.data.height)
        {
            file.data.onload = null;
            file.data.onerror = null;
            this.fileComplete(file);
        }
    },

    /**
     * Continue async loading through a Video tag.
     * @private
     */
    loadVideoTag: function (file)
    {
        var _this = this;

        file.data = document.createElement('video');
        file.data.name = file.key;
        file.data.crossOrigin = this.crossOrigin;
        file.data.controls = false;
        file.data.autoplay = false;
        file.data.playsInline = true;

        var videoLoadEvent = function ()
        {
            file.data.removeEventListener(file.loadEvent, videoLoadEvent, false);
            file.data.onerror = null;
            file.data.canplay = true;
            _this.fileComplete(file);
        };

        file.data.onerror = function ()
        {
            file.data.removeEventListener(file.loadEvent, videoLoadEvent, false);
            file.data.onerror = null;
            file.data.canplay = false;
            _this.fileError(file);
        };

        file.data.addEventListener(file.loadEvent, videoLoadEvent, false);

        file.data.src = this.transformUrl(file.url, file);
        file.data.load();
    },

    /**
     * Continue async loading through an Audio tag.
     * @private
     */
    loadAudioTag: function (file)
    {
        var _this = this;

        if (this.game.sound.touchLocked)
        {
            //  If audio is locked we can't do this yet, so need to queue this load request. Bum.
            file.data = new Audio();
            file.data.name = file.key;
            file.data.preload = 'auto';
            file.data.src = this.transformUrl(file.url, file);

            this.fileComplete(file);
        }
        else
        {
            file.data = new Audio();
            file.data.name = file.key;

            var playThroughEvent = function ()
            {
                file.data.removeEventListener('canplaythrough', playThroughEvent, false);
                file.data.onerror = null;
                _this.fileComplete(file);
            };

            file.data.onerror = function ()
            {
                file.data.removeEventListener('canplaythrough', playThroughEvent, false);
                file.data.onerror = null;
                _this.fileError(file);
            };

            file.data.preload = 'auto';
            file.data.src = this.transformUrl(file.url, file);
            file.data.addEventListener('canplaythrough', playThroughEvent, false);
            file.data.load();
        }
    },

    /**
     * Starts the xhr loader.
     *
     * This is designed specifically to use with asset file processing.
     *
     * @method Phaser.Loader#xhrLoad
     * @private
     * @param {object} file - The file/pack to load.
     * @param {string} url - The URL of the file.
     * @param {string} type - The xhr responseType.
     * @param {function} onload - The function to call on success. Invoked in `this` context and supplied with `(file, xhr)` arguments.
     * @param {function} [onerror=fileError]  The function to call on error. Invoked in `this` context and supplied with `(file, xhr)` arguments.
     */
    xhrLoad: function (file, url, type, onload, onerror)
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = type;

        if (this.headers.requestedWith !== false)
        {
            xhr.setRequestHeader('X-Requested-With', this.headers.requestedWith);
        }

        if (this.headers[file.type])
        {
            xhr.setRequestHeader('Accept', this.headers[file.type]);
        }

        onerror = onerror || this.fileError;

        var _this = this;

        xhr.onload = function ()
        {
            try
            {
                if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status <= 599)
                { // Handle HTTP status codes of 4xx and 5xx as errors, even if xhr.onerror was not called.
                    return onerror.call(_this, file, xhr);
                }
                else
                {
                    return onload.call(_this, file, xhr);
                }
            }
            catch (e)
            {
                /*
                 *  If this was the last file in the queue and an error is thrown in the create method
                 *  then it's caught here, so be sure we don't carry on processing it
                 */

                if (!_this.hasLoaded)
                {
                    _this.asyncComplete(file, e.message || 'Exception');
                }
                else
                {
                    console.error(e);
                }
            }
        };

        xhr.onerror = function ()
        {
            try
            {
                return onerror.call(_this, file, xhr);
            }
            catch (e)
            {
                if (!_this.hasLoaded)
                {
                    _this.asyncComplete(file, e.message || 'Exception');
                }
                else
                {
                    console.error(e);
                }
            }
        };

        file.requestObject = xhr;
        file.requestUrl = url;

        xhr.send();
    },

    /**
     * Give a bunch of URLs, return the first URL that has an extension this device thinks it can play.
     *
     * It is assumed that the device can play "blob:" or "data:" URIs - There is no mime-type checking on data URIs.
     *
     * @method Phaser.Loader#getVideoURL
     * @private
     * @param {object[]|string[]} urls - See {@link #video} for format.
     * @return {string} The URL to try and fetch; or null.
     */
    getVideoURL: function (urls)
    {
        for (var i = 0; i < urls.length; i++)
        {
            var url = urls[i];
            var videoType;

            if (url.uri) // {uri: .., type: ..} pair
            {
                videoType = url.type;
                url = url.uri;

                if (this.game.device.canPlayVideo(videoType))
                {
                    return url;
                }
            }
            else
            {
                // Assume direct-data URI can be played if not in a paired form; select immediately
                if (url.indexOf('blob:') === 0 || url.indexOf('data:') === 0)
                {
                    return url;
                }

                if (url.indexOf('?') >= 0) // Remove query from URL
                {
                    url = url.substr(0, url.indexOf('?'));
                }

                var extension = url.substr((Math.max(0, url.lastIndexOf('.')) || Infinity) + 1);

                videoType = extension.toLowerCase();

                if (this.game.device.canPlayVideo(videoType))
                {
                    return urls[i];
                }
            }
        }

        return null;
    },

    /**
     * Give a bunch of URLs, return the first URL that has an extension this device thinks it can play.
     *
     * It is assumed that the device can play "blob:" or "data:" URIs - There is no mime-type checking on data URIs.
     *
     * @method Phaser.Loader#getAudioURL
     * @private
     * @param {object[]|string[]} urls - See {@link #audio} for format.
     * @return {string} The URL to try and fetch; or null.
     */
    getAudioURL: function (urls)
    {
        if (this.game.sound.noAudio)
        {
            return null;
        }

        for (var i = 0; i < urls.length; i++)
        {
            var url = urls[i];
            var audioType;

            if (url.uri) // {uri: .., type: ..} pair
            {
                audioType = url.type;
                url = url.uri;

                if (this.game.device.canPlayAudio(audioType))
                {
                    return url;
                }
            }
            else
            {
                // Assume direct-data URI can be played if not in a paired form; select immediately
                if (url.indexOf('blob:') === 0 || url.indexOf('data:') === 0)
                {
                    return url;
                }

                if (url.indexOf('?') >= 0) // Remove query from URL
                {
                    url = url.substr(0, url.indexOf('?'));
                }

                var extension = url.substr((Math.max(0, url.lastIndexOf('.')) || Infinity) + 1);

                audioType = extension.toLowerCase();

                if (this.game.device.canPlayAudio(audioType))
                {
                    return urls[i];
                }
            }
        }

        return null;
    },

    /**
     * Error occurred when loading a file.
     *
     * @method Phaser.Loader#fileError
     * @private
     * @param {object} file
     * @param {?XMLHttpRequest} xhr - XHR request, unspecified if loaded via other means (eg. tags)
     * @param {string} reason
     */
    fileError: function (file, xhr, reason)
    {
        var url = file.requestUrl || this.transformUrl(file.url, file);
        var message = 'error loading asset from URL ' + url;

        if (!reason && xhr)
        {
            reason = xhr.status;
        }

        if (reason)
        {
            message = message + ' (' + reason + ')';
        }

        this.asyncComplete(file, message);
    },

    /**
     * Called when a file has been downloaded and needs to be processed further.
     *
     * @method Phaser.Loader#fileComplete
     * @private
     * @param {object} file - File loaded
     * @param {?XMLHttpRequest} xhr - XHR request, unspecified if loaded via other means (eg. tags)
     */
    fileComplete: function (file, xhr)
    {
        // Destroyed.
        if (!this.game.isBooted)
        {
            return;
        }

        var loadNext = true;

        switch (file.type)
        {
            case 'packfile':

                // Pack data must never be false-ish after it is fetched without error
                var data = JSON.parse(xhr.responseText);
                file.data = data || {};
                break;

            case 'texture':

                var extension = (/\.([^.]+)$/).exec(file.url.split('?', 1)[0])[1].toLowerCase();
                if (file.data !== null)
                {
                    this.cache.addCompressedTextureMetaData(file.key, file.url, extension, file.data);
                }
                else
                {
                    this.cache.addCompressedTextureMetaData(file.key, file.url, extension, xhr.response);
                }
                break;

            case 'image':
            case 'imageset':

                this.cache.addImage(file.key, file.url, file.data);
                break;

            case 'spritesheet':

                this.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax, file.margin, file.spacing, file.skipFrames);
                break;

            case 'textureatlas':

                if (file.atlasURL == null)
                {
                    this.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
                }
                else
                {
                    //  Load the JSON or XML before carrying on with the next file
                    loadNext = false;

                    if (file.format === Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY || file.format === Phaser.Loader.TEXTURE_ATLAS_JSON_HASH || file.format === Phaser.Loader.TEXTURE_ATLAS_JSON_PYXEL)
                    {
                        this.xhrLoad(file, this.transformUrl(file.atlasURL, file), 'text', this.jsonLoadComplete);
                    }
                    else if (file.format === Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
                    {
                        this.xhrLoad(file, this.transformUrl(file.atlasURL, file), 'text', this.xmlLoadComplete);
                    }
                    else
                    {
                        throw new Error('Phaser.Loader. Invalid Texture Atlas format: ' + file.format);
                    }
                }
                break;

            case 'bitmapfont':

                if (!file.atlasURL)
                {
                    this.cache.addBitmapFont(file.key, file.url, file.data, file.atlasData, file.atlasType, file.xSpacing, file.ySpacing);
                }
                else
                {
                    //  Load the XML before carrying on with the next file
                    loadNext = false;
                    this.xhrLoad(file, this.transformUrl(file.atlasURL, file), 'text', function (file, xhr)
                    {
                        var json;

                        try
                        {
                            // Try to parse as JSON, if it fails, then it's hopefully XML
                            json = JSON.parse(xhr.responseText);
                        }
                        catch (e) {} // eslint-disable-line no-empty

                        if (json)
                        {
                            file.atlasType = 'json';
                            this.jsonLoadComplete(file, xhr);
                        }
                        else
                        {
                            file.atlasType = 'xml';
                            this.xmlLoadComplete(file, xhr);
                        }
                    });
                }
                break;

            case 'video':

                if (file.asBlob)
                {
                    try
                    {
                        file.data = xhr.response;
                    }
                    catch (e)
                    {
                        throw new Error('Phaser.Loader. Unable to parse video file as Blob: ' + file.key);
                    }
                }

                this.cache.addVideo(file.key, file.url, file.data, file.asBlob);
                break;

            case 'audio':

                if (this.game.sound.usingWebAudio)
                {
                    file.data = xhr.response;

                    this.cache.addSound(file.key, file.url, file.data, true, false);

                    if (file.autoDecode)
                    {
                        this.game.sound.decode(file.key);
                    }
                }
                else
                {
                    this.cache.addSound(file.key, file.url, file.data, false, true);
                }
                break;

            case 'text':
                file.data = xhr.responseText;
                this.cache.addText(file.key, file.url, file.data);
                break;

            case 'shader':
                file.data = xhr.responseText;
                this.cache.addShader(file.key, file.url, file.data);
                break;

            case 'physics':
                var data = JSON.parse(xhr.responseText);
                this.cache.addPhysicsData(file.key, file.url, data, file.format);
                break;

            case 'script':
                file.data = document.createElement('script');
                file.data.language = 'javascript';
                file.data.type = 'text/javascript';
                file.data.defer = false;
                file.data.text = xhr.responseText;
                document.head.appendChild(file.data);
                if (file.callback)
                {
                    file.data = file.callback.call(file.callbackContext, file.key, xhr.responseText);
                }
                break;

            case 'binary':
                if (file.callback)
                {
                    file.data = file.callback.call(file.callbackContext, file.key, xhr.response);
                }
                else
                {
                    file.data = xhr.response;
                }

                this.cache.addBinary(file.key, file.data);

                break;
        }

        if (loadNext)
        {
            this.asyncComplete(file);
        }
    },

    /**
     * Successfully loaded a JSON file - only used for certain types.
     *
     * @method Phaser.Loader#jsonLoadComplete
     * @private
     * @param {object} file - File associated with this request
     * @param {XMLHttpRequest} xhr
     */
    jsonLoadComplete: function (file, xhr)
    {
        var data = JSON.parse(xhr.responseText);

        if (file.type === 'tilemap')
        {
            this.cache.addTilemap(file.key, file.url, data, file.format);
        }
        else if (file.type === 'bitmapfont')
        {
            this.cache.addBitmapFont(file.key, file.url, file.data, data, file.atlasType, file.xSpacing, file.ySpacing);
        }
        else if (file.type === 'json')
        {
            this.cache.addJSON(file.key, file.url, data);
        }
        else
        {
            this.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);
        }

        this.asyncComplete(file);
    },

    /**
     * Successfully loaded a CSV file - only used for certain types.
     *
     * @method Phaser.Loader#csvLoadComplete
     * @private
     * @param {object} file - File associated with this request
     * @param {XMLHttpRequest} xhr
     */
    csvLoadComplete: function (file, xhr)
    {
        var data = xhr.responseText;

        this.cache.addTilemap(file.key, file.url, data, file.format);

        this.asyncComplete(file);
    },

    /**
     * Successfully loaded an XML file - only used for certain types.
     *
     * @method Phaser.Loader#xmlLoadComplete
     * @private
     * @param {object} file - File associated with this request
     * @param {XMLHttpRequest} xhr
     */
    xmlLoadComplete: function (file, xhr)
    {
        // Always try parsing the content as XML, regardless of actually response type
        var data = xhr.responseText;
        var xml = this.parseXml(data);

        if (!xml)
        {
            var responseType = xhr.responseType || xhr.contentType; // contentType for MS-XDomainRequest
            console.warn('Phaser.Loader - ' + file.key + ': invalid XML (' + responseType + ')');
            this.asyncComplete(file, 'invalid XML');
            return;
        }

        if (file.type === 'bitmapfont')
        {
            this.cache.addBitmapFont(file.key, file.url, file.data, xml, file.atlasType, file.xSpacing, file.ySpacing);
        }
        else if (file.type === 'textureatlas')
        {
            this.cache.addTextureAtlas(file.key, file.url, file.data, xml, file.format);
        }
        else if (file.type === 'xml')
        {
            this.cache.addXML(file.key, file.url, xml);
        }

        this.asyncComplete(file);
    },

    /**
     * Parses string data as XML.
     *
     * @method Phaser.Loader#parseXml
     * @private
     * @param {string} data - The XML text to parse
     * @return {?XMLDocument} Returns the xml document, or null if such could not parsed to a valid document.
     */
    parseXml: function (data)
    {
        var xml;

        try
        {
            if (window.DOMParser)
            {
                var domparser = new DOMParser();
                xml = domparser.parseFromString(data, 'text/xml');
            }
            else
            {
                xml = new ActiveXObject('Microsoft.XMLDOM');

                // Why is this 'false'?
                xml.async = 'false';
                xml.loadXML(data);
            }
        }
        catch (e)
        {
            xml = null;
        }

        if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length)
        {
            return null;
        }
        else
        {
            return xml;
        }
    },

    /**
     * Update the loading sprite progress.
     *
     * @method Phaser.Loader#updateProgress
     * @private
     */
    updateProgress: function ()
    {
        if (this.preloadSprite)
        {
            if (this.preloadSprite.direction === 0)
            {
                this.preloadSprite.rect.width = Math.floor((this.preloadSprite.width / 100) * this.progress);
            }
            else
            {
                this.preloadSprite.rect.height = Math.floor((this.preloadSprite.height / 100) * this.progress);
            }

            if (this.preloadSprite.sprite)
            {
                this.preloadSprite.sprite.updateCrop();
            }
            else
            {
                //  We seem to have lost our sprite - maybe it was destroyed?
                this.preloadSprite = null;
            }
        }
    },

    /**
     * Returns the number of files that have already been loaded, even if they errored.
     *
     * @method Phaser.Loader#totalLoadedFiles
     * @protected
     * @return {number} The number of files that have already been loaded (even if they errored)
     */
    totalLoadedFiles: function ()
    {
        return this._loadedFileCount;
    },

    /**
     * Returns the number of files still waiting to be processed in the load queue. This value decreases as each file in the queue is loaded.
     *
     * @method Phaser.Loader#totalQueuedFiles
     * @protected
     * @return {number} The number of files that still remain in the load queue.
     */
    totalQueuedFiles: function ()
    {
        return this._totalFileCount - this._loadedFileCount;
    },

    /**
     * Returns the number of asset packs that have already been loaded, even if they errored.
     *
     * @method Phaser.Loader#totalLoadedPacks
     * @protected
     * @return {number} The number of asset packs that have already been loaded (even if they errored)
     */
    totalLoadedPacks: function ()
    {
        return this._totalPackCount;
    },

    /**
     * Returns the number of asset packs still waiting to be processed in the load queue. This value decreases as each pack in the queue is loaded.
     *
     * @method Phaser.Loader#totalQueuedPacks
     * @protected
     * @return {number} The number of asset packs that still remain in the load queue.
     */
    totalQueuedPacks: function ()
    {
        return this._totalPackCount - this._loadedPackCount;
    }

};

/**
 * The non-rounded load progress value (from 0.0 to 100.0).
 *
 * A general indicator of the progress.
 * It is possible for the progress to decrease, after `onLoadStart`, if more files are dynamically added.
 *
 * @name Phaser.Loader#progressFloat
 * @property {number}
 */
Object.defineProperty(Phaser.Loader.prototype, 'progressFloat', {

    get: function ()
    {
        var progress = (this._loadedFileCount / this._totalFileCount) * 100;
        return Phaser.Math.clamp(progress || 0, 0, 100);
    }

});

/**
 * The rounded load progress percentage value (from 0 to 100). See {@link Phaser.Loader#progressFloat}.
 *
 * @name Phaser.Loader#progress
 * @property {integer}
 */
Object.defineProperty(Phaser.Loader.prototype, 'progress', {

    get: function ()
    {
        return Math.round(this.progressFloat);
    }

});

Phaser.Loader.prototype.constructor = Phaser.Loader;
