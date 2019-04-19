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

        /** 子项列表 */
        $children: DOMElement[] = [];

        /** 父级 */
        $parent: DOMElement = null;
        get parent(): DOMElement {
            return this.$parent;
        }
        $setParent(parent: DOMElement): void {

        }
    }
}

namespace Soo {
    export let DOMElement = dom.DOMElement;
}