namespace Soo.canvas {

    // 舞台
    export class Stage extends Container {
        constructor() {
            super();
            this.$stage = this;
            this.$nestLevel = 1;
        }

        /** 舞台宽度 */
        private $stageWidth: number = 0;
        get stageWidth(): number {
            return this.$stageWidth;
        }

        /** 舞台高度 */
        private $stageHeight: number = 0;
        get stageHeight(): number {
            return this.$stageHeight;
        }
    }
}