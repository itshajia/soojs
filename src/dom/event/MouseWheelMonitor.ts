namespace Soo.dom.sys {
    let $data = new Data();

    // 鼠标滚轮监听器
    export class MouseWheelMonitor extends EventMonitor {
        /** 注册监听 */
        enable(obj: DOMElement): void {
            this.disable(obj);

            let element = obj.$el;
            if (element) {
                let elemData: any = $data.get(obj);
                let onMouseWheel = elemData.onMouseWheel = function(e) {
                    $onMouseWheel.apply(obj, arguments);
                };
                element.addEventListener("DOMMouseScroll", onMouseWheel);
                element.addEventListener("mousewheel", onMouseWheel);
            }
        }

        /** 注销监听 */
        disable(obj: DOMElement): void {
            let element = obj.$el;
            if (element) {
                let elemData: any = $data.hasData(obj) && $data.get(obj);
                if (!elemData) {
                    return;
                }
                let onMouseWheel = elemData.onMouseWheel;
                if (onMouseWheel) {
                    element.removeEventListener("DOMMouseScroll", onMouseWheel);
                    element.removeEventListener("mousewheel", onMouseWheel);
                }

            }
        }
    }
    // 内部使用
    export let $mouseWheelMonitor = new MouseWheelMonitor();


    // 计时器
    let $timer: any;
    function $onMouseWheel(event: any): void {
        clearTimeout($timer);
        let element = event.currentTarget;
        $timer = setTimeout(() => {
            event = window.event || event;
            let wheelDelta = event.wheelDelta || -event.detail ||
                -event.originalEvent.detail || -event.originalEvent.deltaY;
            let direction = Math.max(-1, Math.min(1, wheelDelta));
            let eventData = {
                event: event, which: event.which,
                element: element,
                direction: direction
            };
            MouseEvent.dispatchMouseEvent(this, MouseEvent.MOUSE_WHEEL, eventData);
        });
    }
}