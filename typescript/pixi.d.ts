// Type definitions for PIXI with Phaser Deviations.

declare module PIXI {

    export var game: Phaser.Game;
    export var WEBGL_RENDERER: number;
    export var CANVAS_RENDERER: number;
    export var VERSION: string;

    export enum blendModes {

        NORMAL,
        ADD,
        MULTIPLY,
        SCREEN,
        OVERLAY,
        DARKEN,
        LIGHTEN,
        COLOR_DODGE,
        COLOR_BURN,
        HARD_LIGHT,
        SOFT_LIGHT,
        DIFFERENCE,
        EXCLUSION,
        HUE,
        SATURATION,
        COLOR,
        LUMINOSITY

    }

    export enum scaleModes {

        DEFAULT,
        LINEAR,
        NEAREST

    }

    export var glContexts: WebGLRenderingContext[];
    export var instances: any[];

    export var TextureSilentFail: boolean;

    export function canUseNewCanvasBlendModes(): boolean;

    export function CompileFragmentShader(gl: WebGLRenderingContext, shaderSrc: string[]): any;

    export interface IEventCallback {
        (e?: IEvent): void;
    }

    export interface IEvent {
        type: string;
        content: any;
    }

    export interface HitArea {
        contains(x: number, y: number): boolean;
    }

    export interface IInteractionDataCallback {
        (interactionData: InteractionData): void;
    }

    export interface PixiRenderer {

        autoResize: boolean;
        clearBeforeRender: boolean;
        height: number;
        resolution: number;
        transparent: boolean;
        type: number;
        view: HTMLCanvasElement;
        width: number;

        destroy(): void;
        render(stage: DisplayObjectContainer): void;
        resize(width: number, height: number): void;

    }

    export interface PixiRendererOptions {

        autoResize?: boolean;
        antialias?: boolean;
        clearBeforeRender?: boolean;
        preserveDrawingBuffer?: boolean;
        resolution?: number;
        transparent?: boolean;
        view?: HTMLCanvasElement;

    }

    export interface BitmapTextStyle {

        font?: string;
        align?: string;
        tint?: string;

    }

    export interface TextStyle {

        align?: string;
        dropShadow?: boolean;
        dropShadowColor?: string;
        dropShadowAngle?: number;
        dropShadowDistance?: number;
        fill?: string;
        font?: string;
        lineJoin?: string;
        stroke?: string;
        strokeThickness?: number;
        wordWrap?: boolean;
        wordWrapWidth?: number;

    }

    export interface Loader {

        load(): void;

    }

    export interface MaskData {

        alpha: number;
        worldTransform: number[];

    }

    export interface RenderSession {

        context: CanvasRenderingContext2D;
        maskManager: CanvasMaskManager;
        scaleMode: scaleModes;
        smoothProperty: string;
        roundPixels: boolean;

    }

    export interface ShaderAttribute {
        // TODO: Find signature of shader attributes
    }

    export interface FilterBlock {

        visible: boolean;
        renderable: boolean;

    }

    // Phaser.Filter is used instead
    export class AbstractFilter {

        constructor(fragmentSrc: string | string[], uniforms: any);

        dirty: boolean;
        padding: number;
        uniforms: any;
        fragmentSrc: string | string[];

        apply(frameBuffer: WebGLFramebuffer): void;
        syncUniforms(): void;

    }

    export class BaseTexture implements Mixin {

        static fromCanvas(canvas: HTMLCanvasElement, scaleMode?: scaleModes): BaseTexture;

        constructor(source: HTMLImageElement, scaleMode: scaleModes);
        constructor(source: HTMLCanvasElement, scaleMode: scaleModes);

        height: number;
        hasLoaded: boolean;
        mipmap: boolean;
        premultipliedAlpha: boolean;
        resolution: number;
        scaleMode: scaleModes;
        skipRender: boolean;
        source: HTMLImageElement;
        textureIndex: number;
        width: number;

        listeners(eventName: string): Function[];
        emit(eventName: string, data?: any): boolean;
        dispatchEvent(eventName: string, data?: any): boolean;
        on(eventName: string, fn: Function): Function;
        addEventListener(eventName: string, fn: Function): Function;
        once(eventName: string, fn: Function): Function;
        off(eventName: string, fn: Function): Function;
        removeAllEventListeners(eventName: string): void;
        forceLoaded(width: number, height: number): void;
        destroy(): void;
        dirty(): void;
        unloadFromGPU(): void;

    }

    export class CanvasBuffer {

        constructor(width: number, height: number);

        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        height: number;
        width: number;

        destroy(): void;
        clear(): void;
        resize(width: number, height: number): void;

    }

    export class CanvasMaskManager {

        pushMask(maskData: MaskData, renderSession: RenderSession): void;
        popMask(renderSession: RenderSession): void;

    }

    export class CanvasRenderer implements PixiRenderer {

        constructor(game: Phaser.Game);

        game: Phaser.Game;
        type: number;
        resolution: number;
        clearBeforeRender: boolean;
        transparent: boolean;
        autoResize: boolean;
        width: number;
        height: number;
        view: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        refresh: boolean;
        count: number;
        maskManager: CanvasMaskManager;
        renderSession: RenderSession;

        render(stage: DisplayObjectContainer): void;
        resize(width: number, height: number): void;
        setTexturePriority(textureNameCollection: string[]): string[];
        destroy(removeView?: boolean): void;

    }

    export class CanvasTinter {

        static getTintedTexture(sprite: Sprite, color: number): HTMLCanvasElement;
        static tintWithMultiply(texture: Texture, color: number, canvas: HTMLCanvasElement): void;
        static tintWithOverlay(texture: Texture, color: number, canvas: HTMLCanvasElement): void;
        static tintWithPerPixel(texture: Texture, color: number, canvas: HTMLCanvasElement): void;

        static canUseMultiply: boolean;
        static tintMethod: any;

    }

    export class DisplayObject {

        alpha: number;
        buttonMode: boolean;
        cacheAsBitmap: boolean;
        defaultCursor: string;
        filterArea: Rectangle;
        filters: AbstractFilter[];
        hitArea: HitArea;
        interactive: boolean;
        mask: Phaser.Graphics;
        parent: DisplayObjectContainer;
        pivot: Point;
        position: Point;
        renderable: boolean;
        rotation: number;
        scale: Point;
        stage: DisplayObjectContainer;
        visible: boolean;
        worldAlpha: number;
        worldPosition: Point;
        worldScale: Point;
        worldTransform: Matrix;
        worldRotation: number;
        worldVisible: boolean;
        x: number;
        y: number;

        click(e: InteractionData): void;
        displayObjectUpdateTransform(parent?: DisplayObjectContainer): void;
        generateTexture(resolution?: number, scaleMode?: number, renderer?: PixiRenderer | number): Phaser.RenderTexture;
        mousedown(e: InteractionData): void;
        mouseout(e: InteractionData): void;
        mouseover(e: InteractionData): void;
        mouseup(e: InteractionData): void;
        mousemove(e: InteractionData): void;
        mouseupoutside(e: InteractionData): void;
        rightclick(e: InteractionData): void;
        rightdown(e: InteractionData): void;
        rightup(e: InteractionData): void;
        rightupoutside(e: InteractionData): void;
        setStageReference(stage: DisplayObjectContainer): void;
        tap(e: InteractionData): void;
        toGlobal(position: Point): Point;
        toLocal(position: Point, from: DisplayObject): Point;
        touchend(e: InteractionData): void;
        touchendoutside(e: InteractionData): void;
        touchstart(e: InteractionData): void;
        touchmove(e: InteractionData): void;
        updateTransform(parent?: DisplayObjectContainer): void;

    }

    export class DisplayObjectContainer extends DisplayObject {

        constructor();

        children: DisplayObject[];
        height: number;
        width: number;
        ignoreChildInput: boolean;

        addChild(child: DisplayObject): DisplayObject;
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        getBounds(targetCoordinateSpace?: DisplayObject | Matrix): Rectangle;
        getChildAt(index: number): DisplayObject;
        getChildIndex(child: DisplayObject): number;
        getLocalBounds(): Rectangle;
        removeChild(child: DisplayObject): DisplayObject;
        removeChildAt(index: number): DisplayObject;
        removeChildren(beginIndex?: number, endIndex?: number): DisplayObject[];
        removeStageReference(): void;
        setChildIndex(child: DisplayObject, index: number): void;
        swapChildren(child: DisplayObject, child2: DisplayObject): void;
        contains(child: DisplayObject): boolean;

    }

    export class FilterTexture {

        constructor(gl: WebGLRenderingContext, width: number, height: number, scaleMode: scaleModes);

        fragmentSrc: string[];
        frameBuffer: WebGLFramebuffer;
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        scaleMode: number;
        texture: WebGLTexture;

        clear(): void;
        resize(width: number, height: number): void;
        destroy(): void;

    }

    export class ImageLoader implements Mixin {

        constructor(url: string, crossorigin?: boolean);

        texture: Texture;

        listeners(eventName: string): Function[];
        emit(eventName: string, data?: any): boolean;
        dispatchEvent(eventName: string, data?: any): boolean;
        on(eventName: string, fn: Function): Function;
        addEventListener(eventName: string, fn: Function): Function;
        once(eventName: string, fn: Function): Function;
        off(eventName: string, fn: Function): Function;
        removeAllEventListeners(eventName: string): void;

        load(): void;
        loadFramedSpriteSheet(frameWidth: number, frameHeight: number, textureName: string): void;

    }

    export class InteractionData {

        global: Point;
        target: Sprite;
        originalEvent: Event;

        getLocalPosition(displayObject: DisplayObject, point?: Point, globalPos?: Point): Point;

    }

    // Phaser.Matrix is used instead
    export class Matrix {

        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;

        append(matrix: Matrix): Matrix;
        apply(pos: Point, newPos: Point): Point;
        applyInverse(pos: Point, newPos: Point): Point;
        determineMatrixArrayType(): number[];
        identity(): Matrix;
        rotate(angle: number): Matrix;
        fromArray(array: number[]): void;
        translate(x: number, y: number): Matrix;
        toArray(transpose: boolean): number[];
        scale(x: number, y: number): Matrix;

    }

    export interface Mixin {

        listeners(eventName: string): Function[];
        emit(eventName: string, data?: any): boolean;
        dispatchEvent(eventName: string, data?: any): boolean;
        on(eventName: string, fn: Function): Function;
        addEventListener(eventName: string, fn: Function): Function;
        once(eventName: string, fn: Function): Function;
        off(eventName: string, fn: Function): Function;
        removeAllEventListeners(eventName: string): void;

    }

    export interface IPixiShader {

        fragmentSrc: string[];
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        vertexSrc: string[];

        destroy(): void;
        init(): void;

    }

    export class PixiShader implements IPixiShader {

        constructor(gl: WebGLRenderingContext);

        attributes: ShaderAttribute[];
        defaultVertexSrc: string[];
        dirty: boolean;
        firstRun: boolean;
        textureCount: number;
        fragmentSrc: string[];
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        vertexSrc: string[];

        initSampler2D(): void;
        initUniforms(): void;
        syncUniforms(): void;

        destroy(): void;
        init(): void;

    }

    export class PixiFastShader implements IPixiShader {

        constructor(gl: WebGLRenderingContext);

        textureCount: number;
        fragmentSrc: string[];
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        vertexSrc: string[];

        destroy(): void;
        init(): void;

    }

    export class PrimitiveShader implements IPixiShader {

        constructor(gl: WebGLRenderingContext);
        fragmentSrc: string[];
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        vertexSrc: string[];

        destroy(): void;
        init(): void;

    }

    export class ComplexPrimitiveShader implements IPixiShader {

        constructor(gl: WebGLRenderingContext);
        fragmentSrc: string[];
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        vertexSrc: string[];

        destroy(): void;
        init(): void;

    }

    export class StripShader implements IPixiShader {

        constructor(gl: WebGLRenderingContext);
        fragmentSrc: string[];
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        vertexSrc: string[];

        destroy(): void;
        init(): void;

    }

    // Overwritten by Phaser.Point
    export class Point {

        constructor(x?: number, y?: number);

        x: number;
        y: number;

        clone(): Point;
        set(x: number, y: number): void;

    }

    // Overwritten by Phaser.Rectangle
    export class Rectangle implements HitArea {

        constructor(x?: number, y?: number, width?: number, height?: number);

        x: number;
        y: number;
        width: number;
        height: number;

        clone(): Rectangle;
        contains(x: number, y: number): boolean;

    }

    export class Rope extends Strip {

        points: Point[];
        vertices: number[];

        constructor(texture: Texture, points: Point[]);

        refresh(): void;
        setTexture(texture: Texture): void;

    }

    export class Sprite extends DisplayObjectContainer {

        constructor(texture: Texture);

        anchor: Point;
        blendMode: blendModes;
        exists: boolean;
        shader: IPixiShader;
        texture: Texture;
        tint: number;

        static defaultAnchor: {x: number; y: number};

        setTexture(texture: Texture, destroyBase?: boolean): void;

    }

    export class SpriteBatch extends DisplayObjectContainer {

        constructor(texture?: Texture);

        ready: boolean;
        textureThing: Texture;

        initWebGL(gl: WebGLRenderingContext): void;

    }

    export class Strip extends DisplayObjectContainer {

        static DrawModes: {

            TRIANGLE_STRIP: number;
            TRIANGLES: number;

        };

        constructor(texture: Texture);

        blendMode: number;
        colors: number[];
        dirty: boolean;
        indices: number[];
        canvasPadding: number;
        texture: Texture;
        uvs: number[];
        vertices: number[];

        getBounds(matrix?: Matrix): Rectangle;

    }

    export class Texture implements Mixin {

        static emptyTexture: Texture;

        static fromCanvas(canvas: HTMLCanvasElement, scaleMode?: scaleModes): Texture;

        constructor(baseTexture: BaseTexture, frame?: Rectangle, crop?: Rectangle, trim?: Rectangle);

        baseTexture: BaseTexture;
        crop: Rectangle;
        frame: Rectangle;
        height: number;
        noFrame: boolean;
        requiresUpdate: boolean;
        trim: Point;
        width: number;
        scope: any;
        valid: boolean;
        rotated: boolean;

        listeners(eventName: string): Function[];
        emit(eventName: string, data?: any): boolean;
        dispatchEvent(eventName: string, data?: any): boolean;
        on(eventName: string, fn: Function): Function;
        addEventListener(eventName: string, fn: Function): Function;
        once(eventName: string, fn: Function): Function;
        off(eventName: string, fn: Function): Function;
        removeAllEventListeners(eventName: string): void;

        destroy(destroyBase: boolean): void;
        setFrame(frame: Rectangle): void;

    }

    export class TilingSprite extends Sprite {

        constructor(texture: Texture, width: number, height: number);

        canvasBuffer: PIXI.CanvasBuffer;
        blendMode: number;
        refreshTexture: boolean;
        texture: Texture;
        textureDebug: boolean;
        tint: number;
        tilePosition: Point;
        tilePattern: PIXI.Texture;
        tileScale: Point;
        tileScaleOffset: Point;

        destroy(): void;
        generateTilingTexture(forcePowerOfTwo?: boolean): void;
        setTexture(texture: Texture): void;

    }

    export class VideoTexture extends BaseTexture {

        static baseTextureFromVideo(video: HTMLVideoElement, scaleMode: number): BaseTexture;
        static textureFromVideo(video: HTMLVideoElement, scaleMode: number): Texture;
        static fromUrl(videoSrc: string, scaleMode?: number, autoPlay?: boolean, type?: string, loop?: boolean): Texture;

        controls: boolean;
        autoUpdate: boolean;
        type: string;

        changeSource(src: string, type: string, loop: boolean): void;
        play(): void;
        stop(): void;

        destroy(): void;
        updateBound(): void;
        onPlayStart: () => void;
        onPlayStop: () => void;
        onCanPlay: (event: any) => void;

    }

    export class WebGLBlendModeManager {

        currentBlendMode: number;

        destroy(): void;
        setBlendMode(blendMode: number): boolean;
        setContext(gl: WebGLRenderingContext): void;

    }

    export class WebGLFastSpriteBatch {

        constructor(gl: CanvasRenderingContext2D);

        currentBatchSize: number;
        currentBaseTexture: BaseTexture;
        currentBlendMode: number;
        renderSession: RenderSession;
        drawing: boolean;
        indexBuffer: any;
        indices: number[];
        lastIndexCount: number;
        matrix: Matrix;
        maxSize: number;
        shader: IPixiShader;
        size: number;
        vertexBuffer: any;
        vertices: number[];
        vertSize: number;

        end(): void;
        begin(spriteBatch: SpriteBatch, renderSession: RenderSession): void;
        destroy(removeView?: boolean): void;
        flush(): void;
        render(spriteBatch: SpriteBatch): void;
        renderSprite(sprite: Sprite): void;
        setContext(gl: WebGLRenderingContext): void;
        start(): void;
        stop(): void;

    }

    export class WebGLFilterManager {

        filterStack: AbstractFilter[];
        transparent: boolean;
        offsetX: number;
        offsetY: number;

        applyFilterPass(filter: AbstractFilter, filterArea: Texture, width: number, height: number): void;
        begin(renderSession: RenderSession, buffer: ArrayBuffer): void;
        destroy(): void;
        initShaderBuffers(): void;
        popFilter(): void;
        pushFilter(filterBlock: FilterBlock): void;
        setContext(gl: WebGLRenderingContext): void;

    }

    export class WebGLGraphics {

        static graphicsDataPool: any[];

        static renderGraphics(graphics: Phaser.Graphics, renderRession: RenderSession): void;
        static updateGraphics(graphics: Phaser.Graphics, gl: WebGLRenderingContext): void;
        static switchMode(webGL: WebGLRenderingContext, type: number): any;
        static buildRectangle(graphicsData: Phaser.GraphicsData, webGLData: any): void;
        static buildRoundedRectangle(graphicsData: Phaser.GraphicsData, webGLData: any): void;
        static quadraticBezierCurve(fromX: number, fromY: number, cpX: number, cpY: number, toX: number, toY: number): number[];
        static buildCircle(graphicsData: Phaser.GraphicsData, webGLData: any): void;
        static buildLine(graphicsData: Phaser.GraphicsData, webGLData: any): void;
        static buildComplexPoly(graphicsData: Phaser.GraphicsData, webGLData: any): void;
        static buildPoly(graphicsData: Phaser.GraphicsData, webGLData: any): boolean;

        reset(): void;
        upload(): void;

    }

    export class WebGLGraphicsData {

        constructor(gl: WebGLRenderingContext);

        gl: WebGLRenderingContext;
        glPoints: any[];
        color: number[];
        points: any[];
        indices: any[];
        buffer: WebGLBuffer;
        indexBuffer: WebGLBuffer;
        mode: number;
        alpha: number;
        dirty: boolean;

        reset(): void;
        upload(): void;

    }

    export class WebGLMaskManager {

        destroy(): void;
        popMask(renderSession: RenderSession): void;
        pushMask(maskData: any[], renderSession: RenderSession): void;
        setContext(gl: WebGLRenderingContext): void;

    }

    export class WebGLRenderer implements PixiRenderer {

        static createWebGLTexture(texture: Texture, gl: WebGLRenderingContext): void;

        constructor(game: Phaser.Game);

        game: Phaser.Game;
        type: number;
        resolution: number;
        transparent: boolean;
        autoResize: boolean;
        preserveDrawingBuffer: boolean;
        clearBeforeRender: boolean;
        width: number;
        height: number;
        currentBatchedTextures: string[];
        view: HTMLCanvasElement;
        projection: Point;
        offset: Point;
        shaderManager: WebGLShaderManager;
        spriteBatch: WebGLSpriteBatch;
        maskManager: WebGLMaskManager;
        filterManager: WebGLFilterManager;
        stencilManager: WebGLStencilManager;
        blendModeManager: WebGLBlendModeManager;
        renderSession: RenderSession;

        initContext(): void;
        render(stage: DisplayObjectContainer): void;
        renderDisplayObject(displayObject: DisplayObject, projection: Point, buffer: WebGLBuffer): void;
        resize(width: number, height: number): void;
        updateTexture(texture: Texture): void;
        destroy(): void;
        mapBlendModes(): void;
        setTexturePriority(textureNameCollection: string[]): string[];

    }

    export class WebGLShaderManager {

        maxAttibs: number;
        attribState: any[];
        stack: any[];
        tempAttribState: any[];

        destroy(): void;
        setAttribs(attribs: ShaderAttribute[]): void;
        setContext(gl: WebGLRenderingContext): void;
        setShader(shader: IPixiShader): boolean;

    }

    export class WebGLStencilManager {

        stencilStack: any[];
        reverse: boolean;
        count: number;

        bindGraphics(graphics: Phaser.Graphics, webGLData: any[], renderSession: RenderSession): void;
        destroy(): void;
        popStencil(graphics: Phaser.Graphics, webGLData: any[], renderSession: RenderSession): void;
        pushStencil(graphics: Phaser.Graphics, webGLData: any[], renderSession: RenderSession): void;
        setContext(gl: WebGLRenderingContext): void;

    }

    export class WebGLSpriteBatch {

        blendModes: number[];
        colors: number[];
        currentBatchSize: number;
        currentBaseTexture: Texture;
        defaultShader: AbstractFilter;
        dirty: boolean;
        drawing: boolean;
        indices: number[];
        lastIndexCount: number;
        positions: number[];
        textures: Texture[];
        shaders: IPixiShader[];
        size: number;
        sprites: any[];
        vertices: number[];
        vertSize: number;

        begin(renderSession: RenderSession): void;
        destroy(): void;
        end(): void;
        flush(shader?: IPixiShader): void;
        render(sprite: Sprite): void;
        renderBatch(texture: Texture, size: number, startIndex: number): void;
        renderTilingSprite(sprite: TilingSprite): void;
        setBlendMode(blendMode: blendModes): void;
        setContext(gl: WebGLRenderingContext): void;
        start(): void;
        stop(): void;

    }

}

declare function requestAnimFrame(callback: Function): void;

declare module PIXI.PolyK {
    export function Triangulate(p: number[]): number[];
}
