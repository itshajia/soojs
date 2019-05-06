namespace Soo.dom.sys {
    let $data = new Data();

    // 鼠标滚轮监听器
    export class MouseWheelMonitor extends EventMonitor {
        /** 注册监听 */
        enable(obj: DOMElement): void {
            this.disable(obj);
            let data = $data.get(obj);
            let onMouseWheel = data.onMouseWheel = function() {
                $onMouseWheel.apply(obj, arguments);
            };

            let elem = obj.$el;
            if (elem) {
                elem.addEventListener("DOMMouseScroll", onMouseWheel);
                elem.addEventListener("mousewheel", onMouseWheel);
            }
        }

        /** 注销监听 */
        disable(obj: DOMElement): void {
            if (!$data.hasData(obj)) {
                return;
            }

            let elem = obj.$el;
            let data = $data.get(obj);
            let onMouseWheel = data.onMouseWheel;
            if (elem && onMouseWheel) {
                elem.removeEventListener("DOMMouseScroll", onMouseWheel);
                elem.removeEventListener("mousewheel", onMouseWheel);
            }
            $data.remove(obj);
        }
    }
    // 内部使用
    export let $mouseWheelMonitor = new MouseWheelMonitor();


    // 计时器
    let $timer: any;
    function $onMouseWheel(event: any): void {
        clearTimeout($timer);
        let element = event.currentTarget;
        $timer = setTimeout(function() {
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