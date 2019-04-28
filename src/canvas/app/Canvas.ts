namespace Soo.canvas {
    import DOMElement = Soo.dom.DOMElement;

    export type CanvasOptions = {
        /** 渲染模式 auto, canvas, webgl */
        renderMode?: string;

        /** 抗锯齿 */
        antialias?: boolean;

        /** 帧数 */
        fps?: number;

        /** 是否分层提高性能 */
        layered?: boolean;
    };



    // Canvas应用
    export class Canvas extends dom.DOMContainer {
        constructor(options?: CanvasOptions) {
            super("<div></div>");

            let $options: CanvasOptions = extend(this.defaultOptions, options);
            if ($options.layered) {
                let bgStage = new Stage();
                let bgRenderer = new dom.CanvasElement();
                let bgCanvas = bgRenderer.surface;
                let bgPlayer = new Player(bgRenderer, bgStage);

                let fgStage = new Stage();
                let fgRenderer = new dom.CanvasElement();
                let fgCanvas = fgRenderer.surface;
                let fgPlayer = new Player(fgRenderer, fgStage);
            } else {

            }

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

        /** 是否分层 */
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
                layered: true, // 默认开启分层（分层模式开启后，将分为 背景层 和 前景层）
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

        /** 渲染元素(画布) */
        private $renderer: dom.RenderElement;
        get renderer(): dom.RenderElement {
            return this.$renderer;
        }

        /** 分层模式开启后，将分为 背景层 和 前景层 */
        private $bgRenderer: dom.RenderElement;
        get bgRenderer(): dom.RenderElement {
            return this.$bgRenderer;
        }

        private $fgRenderer: dom.RenderElement;
        get fgRenderer(): dom.RenderElement {
            return this.$fgRenderer;
        }
    }
}

namespace Soo {
    export let Canvas = canvas.Canvas;
}