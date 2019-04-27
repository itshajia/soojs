namespace Soo.dom {

    // dom显示对象
    export class DOMElement extends EventDispatcher {
        constructor(element: any) {
            super();
        }

        /** 真实dom元素 */
        $el: HTMLElement;
        get element(): HTMLElement {
            return this.$el;
        }

        /** 父级 */
        $parent: DOMContainer = null;
        get parent(): DOMContainer {
            return this.$parent;
        }
        $setParent(parent: DOMElement): void {

        }

        /** 防止重复行为 */
        $hasAddToStage: boolean = false;
        /** 显示对象添加到舞台 */
        $onAddToStage(): void {
            if (!this.$hasAddToStage) {
                this.$hasAddToStage = true;
                this.dispatchWith(Event.ADDED_TO_STAGE);
            }
        }

        /** 显示对象移除舞台 */
        $onRemoveFromStage(): void {
            if (this.$hasAddToStage) {
                this.$hasAddToStage = false;
                this.dispatchWith(Event.REMOVED_FROM_STAGE);
            }
        }
    }
}

namespace Soo {
    export let DOMElement = dom.DOMElement;
}