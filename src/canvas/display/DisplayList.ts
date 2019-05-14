namespace Soo.canvas {

    // 显示对象列表
    export class DisplayList extends HashObject {
        constructor(target: DisplayObject, renderElement?: RenderElement) {
            super();
            this.$target = target;
            this.renderElement = renderElement;
            this.$dirtyRegion = new DirtyRegion(target);
            this.$isStage = target instanceof Stage;
        }

        /** 关联的显示对象 */
        $target: DisplayObject;

        /** 是否为舞台 */
        private $isStage: boolean = false;

        /** 渲染元素 */
        renderElement: RenderElement;

        /** 脏节点对象 */
        private $dirtyNodeList: DisplayObject[] = [];

        /** 标记一个显示对象需要重新渲染 */
        dirty(displayObject: DisplayObject): void {

        }

        /** 脏矩形列表 */
        private $dirtyList: Region[];
        /** 脏矩形对象 */
        private $dirtyRegion: DirtyRegion;

        /** 更新脏矩阵列表 */
        updateDirtyRegionList(): void {
            let dirtyRegion = this.$dirtyRegion;
            let dirtyNodeList = this.$dirtyNodeList;
            for (let i = 0, len = dirtyNodeList.length; i < len; i++) {
                let display = dirtyNodeList[i];
                let node = display.$getRenderNode();
                if (node) {
                    node.dirty = false;
                    if (this.$isStage) {
                        if (node.renderAlpha > 0 && node.renderVisible) {
                            if (dirtyRegion.addRegion(node.renderRegion)) {
                                node.dirty = true;
                            }
                        }
                    } else {

                    }
                }
            }
        }

        /** 脏矩形策略 */
        private $dirtyRegionPolicy: string = DirtyRegionPolicy.ON;
        set dirtyRegionPolicy(value: string) {
            this.$dirtyRegionPolicy = value;
        }
    }
}