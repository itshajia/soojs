namespace Soo.canvas {
    import Rectangle = Soo.math.Rectangle;
    import $TempRectangle = Soo.math.$TempRectangle;
    import $TempHitTestPoint = Soo.math.$TempHitTestPoint;

    // 显示对象容器
    export class Container extends DisplayObject {
        constructor() {
            super();
        }

        /** 沿着显示列表向下传递设置标志量 */
        $setFlagsDown(flags: DisplayObjectFlags): void {
            if (this.$hasFlags(flags)) {
                return;
            }

            this.$setFlags(flags);
            let children = this.$children;
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].$setFlagsDown(flags);
            }
        }

        /** 子项列表 */
        $children: DisplayObject[] = [];
        get numChildren(): number {
            return this.$children.length;
        }

        /** 添加子项 */
        addChild(child: DisplayObject): DisplayObject {
            let index = this.$children.length;
            if (child.$parent == this) {
                index--;
                this.moveChildIndex(child, index);
                return child;
            }
            return this.$addChild(child, index);
        }

        /** 添加子项到指定索引位置 */
        addChildAt(child: DisplayObject, index: number): DisplayObject {
            index = +index | 0;
            let length = this.$children.length;
            if (index < 0 || index >= length) {
                index = length;
                if (child.$parent == this) { // 如果已经存在于容器中，则移动位置
                    index--;
                    this.moveChildIndex(child, index);
                    return child;
                }
            }

            return this.$addChild(child, index);
        }

        $addChild(child: DisplayObject, index: number): DisplayObject {
            let childParent = child.$parent;
            if (childParent) { // 从原先的容器中删除
                childParent.removeChild(child);
            }

            this.$children.splice(index, 0, child);
            child.$setParent(this); // 设置新的父级容器

            let stage = this.$stage;
            if (stage) { // 如果父级容器也在舞台中，则通知子项添加到舞台中
                child.$onAddToStage(stage, this.$nestLevel + 1);
            }
            // 添加事件通知
            child.dispatchWith(Event.ADDED, true);

            if (stage) {
                let list = $EVENT_ADD_TO_STAGE_LIST;
                while (list.length) {
                    let $item = list.shift();
                    if ($item.$stage) {
                        $item.dispatchWith(Event.ADDED_TO_STAGE);
                    }
                }
            }

            child.$setFlagsDown(DisplayObjectFlags.AddedOrRemoved);
            this.$setFlagsUp(DisplayObjectFlags.DirtyBounds); // 添加子项后，可能会影响到父级的边界，所以这里需要网上传递
            this.$childAdded(child, index);
            return child;
        }

        /** 是否包含某个子项 */
        contains(child: DisplayObject): boolean {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child.parent;
            }
            return false;
        }

        /** 返回指定索引位置上的子项 */
        getChildAt(index: number): DisplayObject {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$children[index];
            }
        }

        /** 返回子项索引值 */
        getChildIndex(child: DisplayObject): number {
            return this.$children.indexOf(child);
        }

        /** 移除子项 */
        removeChild(child: DisplayObject): DisplayObject {
            let index = this.$children.indexOf(child);
            if (index != -1) {
                return this.$removeChild(index);
            }
        }

        /** 移除指定索引位置的子项 */
        removeChildAt(index: number): DisplayObject {
            if (index >= 0 && index < this.$children.length) {
                return this.$removeChild(index);
            }
        }

        /** 移除所有子项 */
        removeChildren(): void {
            let children = this.$children;
            for (let i = children.length - 1; i >= 0; i--) {
                this.$removeChild(i);
            }
        }

        $removeChild(index: number): DisplayObject {
            let children = this.$children;
            let child = children[index];
            if (!child) {
                return;
            }
            children.splice(index, 1);
            child.$setParent(null);
            this.$childRemoved(child, index);
            child.dispatchWith(Event.REMOVED, true);

            if (this.$stage) { // 在舞台上
                child.$onRemoveFromStage();
                let list = $EVENT_REMOVE_FROM_STAGE_LIST;
                while (list.length) {
                    let $item = list.shift();
                    if ($item.$hasAddToStage) {
                        $item.$hasAddToStage = false;
                        $item.dispatchWith(Event.REMOVED_FROM_STAGE);
                    }
                    $item.$stage = null;
                }
            }

            child.$setFlagsDown(DisplayObjectFlags.AddedOrRemoved);
            this.$setFlagsUp(DisplayObjectFlags.DirtyBounds); // 移除子项后，可能会影响到父级的边界，所以这里需要网上传递
            return child;
        }

        /** 移动子项位置 */
        moveChildIndex(child: DisplayObject, index: number): void {
            index = +index | 0;
            let children = this.$children;
            let lastIndex = children.indexOf(child);
            if (lastIndex == -1 || lastIndex == index) {
                return;
            }

            // 删除原先位置
            this.$childRemoved(child, lastIndex);
            children.splice(lastIndex, 1);
            // 放到新的位置
            children.splice(index, 0, child);
            this.$childAdded(child, index);
        }

        /** 容器添加到舞台 */
        $onAddToStage(stage: Stage, nestLevel: number): void {
            super.$onAddToStage(stage, nestLevel);
            nestLevel++;
            let children = this.$children;
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].$onAddToStage(stage, nestLevel);
            }
        }

        /** 容器移除舞台 */
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            let children = this.$children;
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].$onRemoveFromStage();
            }
        }

        /** 子项被添加到容器内 */
        $childAdded(child: DisplayObject, index: number): void {

        }

        /** 子项从容器中移除 */
        $childRemoved(child: DisplayObject, index: number): void {

        }

        /** 测量子项占用区域 */
        $measureChildrenBounds(containerBounds: Rectangle): void {
            let children = this.$children;
            let length = children.length;
            if (length === 0) {
                return;
            }

            let $temp: Rectangle = $TempRectangle;
            let xMin = containerBounds.x;
            let xMax = xMin + containerBounds.width;
            let yMin = containerBounds.y;
            let yMax = yMin + containerBounds.height;
            let childBounds;
            for (let i = 0; i < length; i++) {
                children[i].getBounds($temp);
                children[i].$getMatrix().transformBounds($temp); // 矩形区域经过变换后的结果
                childBounds = $temp;
                if (childBounds.isEmpty()) {
                    continue;
                }
                xMin = Math.min(xMin, childBounds.x);
                xMax = Math.max(xMax, childBounds.x + childBounds.width);
                yMin = Math.min(yMin, childBounds.y);
                yMax = Math.max(yMax, childBounds.y + childBounds.height);
            }
            containerBounds.setTo(xMin, yMin, xMax - xMin, yMax - yMin);
        }

        /** 子项是否支持交互 */
        $touchChildren: boolean = true;
        get touchChildren(): boolean {
            return this.$touchChildren;
        }
        set touchChildren(value: boolean) {
            if (this.$touchChildren == value) {
                return false;
            }
            this.$touchChildren = value;
        }

        $dirtyRender(): void {
            super.$dirtyRender();

            let children = this.$children;
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].$dirtyRender();
            }
        }

        $dirtyTransform(): void {
            super.$dirtyTransform();

            let children = this.$children;
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].$dirtyTransform();
            }
        }

        /** 碰撞测试 */
        $hitTest(stageX: number, stageY: number): DisplayObject {
            if (!this.$visible) {
                return null;
            }

            this.globalToLocal(stageX, stageY, $TempHitTestPoint);
            let localX = $TempHitTestPoint.x;
            let localY = $TempHitTestPoint.y;

            const children = this.$children;
            let found = false;
            let target;
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
                target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if (target.touchEnabled) {
                        break;
                    } else {
                        target = null;
                    }
                }
            }

            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
            }
            if (found && this.$touchEnabled) {
                return this;
            }
            return super.$hitTest(stageX, stageY);
        }
    }
}


namespace Soo {
    export let CanvasContainer = canvas.Container;
}