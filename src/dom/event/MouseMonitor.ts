namespace Soo.dom.sys {
    import Point = Soo.math.Point;
    let $data = new Data();

    // 鼠标监听器
    export class MouseMonitor extends EventMonitor {
        /** 注册监听 */
        enable(obj: DOMElement): void {
            this.disable(obj);

            let element = obj.$el;
            if (element) {
                let elemData: any = $data.get(obj);
                let onMouseDown = elemData.onMouseDown = function(e) {
                    $onMouseDown.apply(obj, arguments);
                };
                let onMouseMove = elemData.onMouseMove = function(e) {
                    $onMouseMove.apply(obj, arguments);
                };
                let onMouseOut = elemData.onMouseOut = function(e) {
                    $onMouseOut.apply(obj, arguments);
                };
                element.addEventListener("mousedown", onMouseDown);
                element.addEventListener("mousemove", onMouseMove);
                element.addEventListener("mouseout", onMouseOut);
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
                let onMouseDown = elemData.onMouseDown;
                let onMouseMove = elemData.onMouseMove;
                let onMouseOut = elemData.onMouseOut;
                if (onMouseDown) {
                    element.removeEventListener("mousedown", onMouseDown);
                }
                if (onMouseMove) {
                    element.removeEventListener("mousemove", onMouseMove);
                }
                if (onMouseOut) {
                    element.removeEventListener("mouseout", onMouseOut);
                }
            }
        }
    }
    // 内部使用
    export let $mouseMonitor = new MouseMonitor();

    let $timer: any; // 计时器
    let $isClickEvent: boolean = true; // 是否为点击事件
    let $delay: number = 200; // 延迟时长(毫秒)
    let $clickCount: number = 0; // 点击次数
    let $clickTimer: any;

    /** 按下 */
    function $onMouseDown(event: any): void {
        let self = this;
        let element = event.currentTarget;
        let which = event.which;
        // 点击并在200ms内松开，则为点击事件；否则为 mouseup 事件
        $timer = setTimeout($preventClickHandler, $delay);

        let elemData: any = $data.hasData(this) && $data.get(this);
        if (elemData) {
            // 移除元素本身事件监听器，转交document，以便扩大操作范围
            element.removeEventListener("mousemove", elemData.onMouseMove);
        }

        let startPoint = getLocalPointFromPage(element, event.pageX, event.pageY);
        let lastPoint = startPoint.clone();
        let eventData = {
            event: event, which: event.which,
            element: element,
            startPoint: startPoint, currentPoint: startPoint, lastPoint: lastPoint,
            deltaPoint: Point.create(0, 0)
        };
        MouseEvent.dispatchMouseEvent(this, MouseEvent.MOUSE_DOWN, eventData);


        // 鼠标在页面文档上移动
        function onMouseMoveInDocument($event: any) {
            let currentPoint = getLocalPointFromPage(element, $event.pageX, $event.pageY);
            let deltaPoint = currentPoint.subtract(lastPoint);
            if (Math.abs(deltaPoint.x) > 0 || Math.abs(deltaPoint.y) > 0) { // 保证一定有位移，防止抖动误操作
                let eventData = {
                    event: $event, which: which,
                    element: element,
                    startPoint: startPoint, currentPoint: startPoint, lastPoint: lastPoint,
                    deltaPoint: deltaPoint
                };
                MouseEvent.dispatchMouseEvent(self, MouseEvent.MOUSE_DRAG, eventData);
                lastPoint = currentPoint.clone();
            }
            return preventEvent($event);
        }

        // 鼠标在页面文档上松开事件
        function onMouseUpInDocument($event: any) {
            clearTimeout($timer);
            let currentPoint = getLocalPointFromPage(element, $event.pageX, $event.pageY);
            let eventData = {
                event: $event, which: which,
                element: element,
                startPoint: startPoint, currentPoint: startPoint, lastPoint: lastPoint
            };
            if ($isClickEvent) {
                clearTimeout($clickTimer);
                $clickTimer = setTimeout(() => {
                    if ($clickCount == 1) {
                        MouseEvent.dispatchMouseEvent(self, MouseEvent.MOUSE_CLICK, eventData);
                    } else if ($clickCount == 2) {
                        MouseEvent.dispatchMouseEvent(self, MouseEvent.MOUSE_DOUBLE_CLICK, eventData);
                    }
                    $clickCount = 0; // 计数清零
                }, 150);
            } else {
                MouseEvent.dispatchMouseEvent(self, MouseEvent.MOUSE_UP, eventData);
            }
            // 归还事件控制权
            document.removeEventListener("mousemove", onMouseMoveInDocument);
            document.removeEventListener("mouseup", onMouseUpInDocument);
            if (elemData.onMouseMove) {
                element.addEventListener("mousemove", elemData.onMouseMove);
            }
            $isClickEvent = true;
        }

        // 转交事件控制权至document
        document.addEventListener("mousemove", onMouseMoveInDocument);
        document.addEventListener("mouseup", onMouseUpInDocument);
        preventEvent(event);
    }

    /** 移动 */
    function $onMouseMove(event: any): void {
        let element = event.currentTarget;
        let currentPoint = getLocalPointFromPage(element, event.pageX, event.pageY);
        let eventData = {
            event: event,
            element: element,
            currentPoint: currentPoint
        };
        MouseEvent.dispatchMouseEvent(this, MouseEvent.MOUSE_MOVE, eventData);
    }

    /** 移出 */
    function $onMouseOut(event: any): void {
        let element = event.currentTarget;
        let eventData = {
            event: event, element: element
        };
        MouseEvent.dispatchMouseEvent(this, MouseEvent.MOUSE_OUT, eventData);
    }

    /** 离开 */
    function $onMouseLeave(event: any): void {

    }

    /** 阻止点击事件执行 */
    function $preventClickHandler(): void {
        $isClickEvent = false;
    }
}