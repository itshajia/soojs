namespace Soo {

    // 手触摸事件
    export class TouchEvent extends Event {
        /** 触摸开始 */
        static TOUCH_START: string = "touchStart";

        /** 触摸开始（两个触摸点） */
        static TOUCH_DOUBLE_START: string = "touchDoubleStart";

        /** 触摸开始（多个触摸点） */
        static TOUCH_MULTI_START: string = "touchMultiStart";

        /** 拖拽 */
        static TOUCH_DRAG: string = "touchDrag";

        /** 拖拽（两个触控点） */
        static TOUCH_DOUBLE_DRAG: string = "touchDoubleDrag";

        /** 拖拽（多个触控点） */
        static TOUCH_MULTI_DRAG: string = "touchMultiDrag";

        /** 拖拽结束 */
        static TOUCH_DRAG_END: string = "touchDragEnd";

        /** 触摸结束 */
        static TOUCH_END: string = "touchEnd";

        /** 单次点击 */
        static TOUCH_TAP: string = "touchTap";

        /** 双击 */
        static TOUCH_DOUBLE_TAP: string = "touchDoubleTap";

        /** 触控点缩放 */
        static TOUCH_PINCH: string = "touchPinch";

        /** 触控点按压 */
        static TOUCH_PRESS: string = "touchPress";

        /** 旋转 */
        static TOUCH_ROTATE: string = "touchRotate";

        constructor(type: string, bubbles: boolean) {
            super(type, bubbles);
        }

        static dispatchTouchEvent(target: IEventDispatcher, type: string, data?: any): boolean {
            let event = Event.create(TouchEvent, type);
            let result = target.dispatch(event);
            Event.release(event);
            return result;
        }
    }
}