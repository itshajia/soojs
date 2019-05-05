namespace Soo {

    // 鼠标事件
    export class MouseEvent extends Event {
        /** 按下 */
        static MOUSE_DOWN: string = "mouseDown";

        /** 拖拽 */
        static MOUSE_DRAG: string = "mouseDrag";

        /** 松开 */
        static MOUSE_UP: string = "mouseUp";

        /** 点击 */
        static MOUSE_CLICK: string = "mouseClick";

        /** 双击 */
        static MOUSE_DOUBLE_CLICK: string = "mouseDoubleClick";

        /** 移动 */
        static MOUSE_MOVE: string = "mouseMove";

        /** 移出 */
        static MOUSE_OUT: string = "mouseOut";

        /** 离开 */
        static MOUSE_LEAVE: string = "mouseLeave";

        /** 滚轮事件 */
        static MOUSE_WHEEL: string = "mouseWheel";

        constructor(type: string, bubbles: boolean) {
            super(type, bubbles);
        }

        static dispatchMouseEvent(target: IEventDispatcher, type: string, data?: any): boolean {
            let event = Event.create(MouseEvent, type);
            let result = target.dispatch(event);
            Event.release(event);
            return result;
        }
    }
}