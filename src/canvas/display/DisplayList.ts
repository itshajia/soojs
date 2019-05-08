namespace Soo.canvas {

    // 显示对象列表
    export class DisplayList extends HashObject {
        constructor(root: DisplayObject) {
            super();
            this.root = root;
        }

        /** 显示列表根节点对象 */
        root: DisplayObject;

        /** 是否为舞台 */
        private $isStage: boolean = false;

        /** 渲染元素 */
        renderer: Renderer;

        /** 脏矩形策略 */
        private $dirtyRegionPolicy: string = DirtyRegionPolicy.ON;
        set dirtyRegionPolicy(value: string) {
            this.$dirtyRegionPolicy = value;
        }
    }
}