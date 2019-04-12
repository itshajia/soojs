namespace Soo {

    // Http事件对象
    export class HttpEvent extends Event {
        /** 请求挂起 */
        static PENDING: string = "pending";

        /** 请求成功 */
        static SUCCESS: string = "success";

        /** 请求失败 */
        static ERROR: string = "error";

        /** 请求完成 */
        static COMPLETE: string = "complete";

        /** 请求取消 */
        static CANCELED: string = "canceled";

        constructor(type: string, bubbles: boolean) {
            super(type, bubbles);
        }

        static dispatchHttpEvent(target: IEventDispatcher, type: string, bubbles: boolean = false, data?: any): boolean {
            let event = Event.create(HttpEvent, type, bubbles);
            let result = target.dispatch(event, data);
            Event.release(event);
            return result;
        }
    }
}