namespace Soo.dom {

    // 舞台
    export class DOMStage extends DOMContainer {
        constructor(element: any) {
            super(element);
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

namespace Soo {
    export let DOMStage = dom.DOMStage;
}