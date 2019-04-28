namespace Soo {

    // 显示对象容器抽象类
    export abstract class $Container extends $DisplayObject {
        constructor() {
            super();
        }

        /** 子项列表 */
        $children: $DisplayObject[] = [];
        get numChildren(): number {
            return this.$children.length;
        }

        /** 添加子项 */
        addChild(child: $DisplayObject): $DisplayObject {
            let index = this.$children.length;
            if (child.$parent == this) {
                index--;
                this.moveChildIndex(child, index);
                return child;
            }
            return this.$addChild(child, index);
        }

        /** 添加子项到指定索引位置 */
        addChildAt(child: $DisplayObject, index: number): $DisplayObject {
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

        abstract $addChild(child: $DisplayObject, index: number): $DisplayObject;

        /** 是否包含某个子项 */
        contains(child: $DisplayObject): boolean {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child.$parent;
            }
            return false;
        }

        /** 移除子项 */
        removeChild(child: $DisplayObject): $DisplayObject {
            let index = this.$children.indexOf(child);
            if (index != -1) {
                return this.$removeChild(index);
            }
        }

        /** 移除指定索引位置的子项 */
        removeChildAt(index: number): $DisplayObject {
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

        abstract $removeChild(index: number): $DisplayObject;

        /** 移动子项位置 */
        moveChildIndex(child: $DisplayObject, index: number): void {

        }

        /** 子项被添加到容器内 */
        $childAdded(child: $DisplayObject, index: number): void {

        }

        /** 子项从容器中移除 */
        $childRemoved(child: $DisplayObject, index: number): void {

        }
    }
}