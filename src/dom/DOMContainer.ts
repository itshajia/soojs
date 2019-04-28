namespace Soo.dom {

    // dom显示容器
    export class DOMContainer extends DOMElement {
        constructor(element: any) {
            super(element);
        }

        /** 子项列表 */
        $children: DOMElement[] = [];
        get numChildren(): number {
            return this.$children.length;
        }

        /** 添加子项 */
        addChild(child: DOMElement): DOMElement {
            let index = this.$children.length;
            if (child.$parent == this) {
                index--;
                this.moveChildIndex(child, index);
                return child;
            }
            return this.$addChild(child, index);
        }

        /** 添加子项到指定索引位置 */
        addChildAt(child: DOMElement, index: number): DOMElement {
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

        $addChild(child: DOMElement, index: number): DOMElement {
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
                let list = $EVENT_ADD_TO_DOM_STAGE_LIST;
                while (list.length) {
                    let $item = list.shift();
                    if ($item.$stage) {
                        $item.dispatchWith(Event.ADDED_TO_STAGE);
                    }
                }
            }

            this.$childAdded(child, index);
            return child;
        }

        /** 是否包含某个子项 */
        contains(child: DOMElement): boolean {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child.$parent;
            }
            return false;
        }

        /** 移除子项 */
        removeChild(child: DOMElement): DOMElement {
            let index = this.$children.indexOf(child);
            if (index != -1) {
                return this.$removeChild(index);
            }
        }

        /** 移除指定索引位置的子项 */
        removeChildAt(index: number): DOMElement {
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

        $removeChild(index: number): DOMElement {
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
                let list = $EVENT_REMOVE_FROM_DOM_STAGE_LIST;
                while (list.length) {
                    let $item = list.shift();
                    if ($item.$hasAddToStage) {
                        $item.$hasAddToStage = false;
                        $item.dispatchWith(Event.REMOVED_FROM_STAGE);
                    }
                    $item.$stage = null;
                }
            }

            return child;
        }

        /** 移动子项位置 */
        moveChildIndex(child: DOMElement, index: number): void {

        }

        /** 容器添加到舞台 */
        $onAddToStage(stage: DOMStage, nestLevel: number): void {
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
        $childAdded(child: DOMElement, index: number): void {

        }

        /** 子项从容器中移除 */
        $childRemoved(child: DOMElement, index: number): void {

        }
    }
}

namespace Soo {
    export let DOMContainer = dom.DOMContainer;
}