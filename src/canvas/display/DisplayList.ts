namespace Soo.canvas {

    // 显示对象列表
    export class DisplayList extends HashObject {
        constructor(root: DisplayObject, renderElement?: RenderElement) {
            super();
            this.root = root;
            this.renderElement = renderElement;
        }

        /** 显示列表根节点对象 */
        root: DisplayObject;

        /** 是否为舞台 */
        private $isStage: boolean = false;

        /** 渲染元素 */
        renderElement: RenderElement;

        /** 标记一个显示对象需要重新渲染 */
        dirty(displayObject: DisplayObject): void {

        }

        /** 脏矩形策略 */
        private $dirtyRegionPolicy: string = DirtyRegionPolicy.ON;
        set dirtyRegionPolicy(value: string) {
            this.$dirtyRegionPolicy = value;
        }
    }
}