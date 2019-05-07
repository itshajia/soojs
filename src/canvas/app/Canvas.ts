namespace Soo.canvas {

    export type CanvasOptions = {
        /** 渲染模式 auto, canvas, webgl */
        renderMode?: string;

        /** 抗锯齿 */
        antialias?: boolean;

        /** 帧数 */
        fps?: number;

        /** 是否画布层数（一般用来提高性能） */
        layered?: boolean;
    };



    // Canvas应用
    export class Canvas extends HashObject {
        constructor(options?: CanvasOptions) {
            super();

            let $options: CanvasOptions = extend(this.defaultOptions, options);
            let renderer = this.$bgRenderer = new CanvasRenderer();
            let stage = this.$bgStage == new Stage();
            this.$players.push(new Player(renderer, stage));
            if ($options.layered) {
                renderer = new CanvasRenderer();
                stage = new Stage();
                this.$players.push(new Player(renderer, stage));
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

        /** 画布层数 */
        private $layered: boolean;
        get layered(): boolean {
            return this.$layered;
        }


        /** 默认属性参数 */
        get defaultOptions(): CanvasOptions {
            return {
                renderMode: "canvas",
                antialias: false,
                fps: 30,
                layered: false, // 默认关闭分层（分层模式开启后，将分为 背景层 和 前景层）
            };
        }

        /** 属性参数 */
        get options(): CanvasOptions {
            return {
                renderMode: this.$renderMode,
                antialias: this.$antialias,
                fps: this.$fps,
                layered: this.$layered
            };
        }
        set options(options: CanvasOptions) {
            this.$renderMode = options.renderMode;
            this.$antialias = options.antialias;
            this.$fps = options.fps;
            this.$layered = options.layered;
        }

        /** 渲染器 */
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
    }
}

namespace Soo {
    export let Canvas = canvas.Canvas;
}