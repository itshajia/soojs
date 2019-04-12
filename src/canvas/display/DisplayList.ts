namespace Soo.canvas {

    // 显示对象列表
    export class DisplayList extends HashObject {
        constructor() {
            super();
        }

        /** 是否为舞台 */
        private $isStage: boolean = false;

        /** 脏矩形策略 */
        private $dirtyRegionPolicy: string = DirtyRegionPolicy.ON;
        set dirtyRegionPolicy(value: string) {
            this.$dirtyRegionPolicy = value;
        }
    }
}