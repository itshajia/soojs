namespace Soo.canvas {

    // Canvas播放器
    export class Player extends HashObject {
        constructor(renderer: Renderer, stage: Stage) {
            super();
            this.stage = stage;
        }

        /** 舞台 */
        stage: Stage;

        /** 是否在播放 */
        private $isPlaying: boolean = false;

        /** 启动 */
        start(): void {
            if (this.$isPlaying || !this.stage) {
                return;
            }

            this.$isPlaying = true;
            $canvasSysTicker.addPlayer(this);
        }

        /** 暂停 */
        pause(): void {
            if (!this.$isPlaying) {
                return;
            }
            this.$isPlaying = false;
            $canvasSysTicker.removePlayer(this);
        }

        /** 停止（不能重新启动） */
        stop(): void {
            this.pause();
            this.stage = null;
        }

        /** 屏幕渲染 */
        $render(): void {

        }
    }
}