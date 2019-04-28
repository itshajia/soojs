namespace Soo.dom {

    // DOM渲染器
    export class DOMRenderer {

        /** 渲染执行 */
        render(domElement: DOMElement): void {
            if (domElement instanceof DOMContainer) {
                let children = domElement.$children;
                for (let i = 0, len = children.length; i < len; i++) {

                }
            }

        }
    }

    /** 系统内部使用 */
    export let $sysRenderer = new DOMRenderer();
}