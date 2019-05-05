namespace Soo.dom.sys {

    // 手势监听器
    export class TouchMonitor extends EventMonitor {
        constructor() {
            super();
        }

        /** 注册监听 */
        enable(obj: DOMElement): void {

        }

        /** 注销监听 */
        disable(obj: DOMElement): void {

        }
    }
    // 内部使用
    export let $touchMonitor = new TouchMonitor();
}