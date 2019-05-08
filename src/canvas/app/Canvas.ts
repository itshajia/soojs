namespace Soo.canvas {

    export type CanvasOptions = {
        /** 渲染模式 auto, canvas, webgl */
        renderMode?: string;

        /** 抗锯齿 */
        antialias?: boolean;

        /** 帧数 */
        fps?: number;

        /** 内容宽度 */
        contentWidth?: number;

        /** 内容高度 */
        contentHeight?: number;

        /** 是否画布层数（一般用来提高性能） */
        layered?: boolean;
    };



    // Canvas应用
    export class Canvas extends HashObject implements Screen {
        constructor(options?: CanvasOptions) {
            super();

            let $options: CanvasOptions = extend(this.defaultOptions, options);
            let container = this.$element = document.createElement("div");
            let renderer = this.$bgRenderer = new CanvasRenderer();
            let stage = this.$bgStage == new Stage();
            this.$renderers.push(renderer);
            this.$stages.push(stage);
            this.$players.push(new Player(renderer, stage));
            container.appendChild(renderer.surface);
            if ($options.layered) {
                renderer = new CanvasRenderer();
                stage = new Stage();
                this.$renderers.push(renderer);
                this.$stages.push(stage);
                this.$players.push(new Player(renderer, stage));
                container.appendChild(renderer.surface);
            }

            this.$fgRenderer = renderer;
            this.$fgStage = stage;
        }

        /** 渲染模式 */
        private $renderMode: string;
        get renderMode(): string {
            return this.$renderMode;
        }

        /** 抗锯齿 */
        private $antialias: boolean;
        get antialias(): boolean {
            return this.$antialias;
        }

        /** 帧数 */
        private $fps: number;
        get fps(): number {
            return this.$fps;
        }

        /** 内容宽度 */
        private $contentWidth: number;
        get contentWidth(): number {
            return this.$contentWidth;
        }

        /** 内容高度 */
        private $contentHeight: number;
        get contentHeight(): number {
            return this.$contentHeight;
        }

        /** 画布层数 */
        private $layered: boolean;
        get layered(): boolean {
            return this.$layered;
        }

        /** 适配模式 */
        private $adaptationMode: string = AdaptationMode.SHOW_ALL;
        get adaptationMode(): string {
            return this.$adaptationMode;
        }
        set adaptationMode(value: string) {
            if (this.$adaptationMode == value) {
                return;
            }
            this.$adaptationMode = value;

        }

        /** 默认属性参数 */
        get defaultOptions(): CanvasOptions {
            return {
                renderMode: "canvas",
                antialias: false,
                fps: 30,
                contentWidth: 512, contentHeight: 512,
                layered: false, // 默认关闭分层（分层模式开启后，将分为 背景层 和 前景层）
            };
        }

        /** 属性参数 */
        get options(): CanvasOptions {
            return {
                renderMode: this.$renderMode,
                antialias: this.$antialias,
                fps: this.$fps,
                contentWidth: this.$contentWidth, contentHeight: this.$contentHeight,
                layered: this.$layered
            };
        }
        set options(options: CanvasOptions) {
            this.$renderMode = options.renderMode;
            this.$antialias = options.antialias;
            this.$fps = options.fps;
            this.$contentWidth = options.contentWidth;
            this.$contentHeight = options.contentHeight;
            this.$layered = options.layered;
        }

        /** 播放器容器实例 */
        private $element: HTMLElement;
        get element(): HTMLElement {
            return this.$element;
        }

        /** 渲染器 */
        private $renderers: Renderer[] = [];
        private $bgRenderer: Renderer;
        private $fgRenderer: Renderer;
        get bgRenderer(): Renderer {
            return this.$bgRenderer;
        }
        get fgRenderer(): Renderer {
            return this.$fgRenderer;
        }
        get renderer(): Renderer {
            return this.$bgRenderer;
        }

        /** 舞台列表 */
        private $stages: Stage[] = [];
        private $bgStage: Stage;
        private $fgStage: Stage;
        get bgStage(): Stage {
            return this.$bgStage;
        }
        get fgStage(): Stage {
            return this.$fgStage;
        }
        get stage(): Stage {
            return this.$bgStage;
        }

        /** 播放器列表 */
        private $players: Player[] = [];

        /** 更新屏幕尺寸 */
        updateScreenSize(): void {
            for (let i = 0; i < 2; i++) {
                this.$updateScreenSize(this.$renderers[i].surface, this.$players[i]);
            }
        }

        private $updateScreenSize(canvas: HTMLCanvasElement, player: Player): void {
            let screenRect = this.$element.getBoundingClientRect();
            let screenWidth = screenRect.width;
            let screenHeight = screenRect.height;
            if (screenWidth == 0 || screenHeight == 0) {
                return;
            }
            let top = 0;
            if (screenRect.top < 0) {
                screenHeight += screenRect.top;
                top = -screenRect.top;
            }
            let stageSize = $screenAdapter.calculateStageSize(
                this.$adaptationMode, screenWidth, screenHeight, this.$contentWidth, this.$contentHeight);
            let displayWidth = stageSize.displayWidth;
            let displayHeight = stageSize.displayHeight;
            let stageWidth = stageSize.stageWidth;
            let stageHeight = stageSize.stageHeight;

            canvas.style.width = displayWidth +"px";
            canvas.style.height = displayHeight +"px";
            canvas.style.top = top + (screenHeight - displayHeight) / 2 + "px";
            canvas.style.left = (screenWidth - displayWidth) / 2 + "px";

            player.updateStageSize(stageWidth, stageHeight);
        }

        setContentSize(width: number, height: number): void {
            this.$contentWidth = width;
            this.$contentHeight = height;
            this.updateScreenSize();
        }
    }
}

namespace Soo {
    export let Canvas = canvas.Canvas;
}