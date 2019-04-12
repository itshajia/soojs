namespace Soo {

    // 进度事件
    export class ProgressEvent extends Event {
        /** 进度 */
        static PROGRESS: string = "progress";

        constructor(type: string, bubbles: boolean) {
            super(type, bubbles);
        }

        /** 进度完成数 */
        loaded: number = 0;

        /** 进度总数 */
        total: number;

        static dispatchProgressEvent(target: IEventDispatcher, type: string, loaded: number, total: number): boolean {
            let event = Event.create(ProgressEvent, type);
            event.loaded = loaded;
            event.total = total;
            let result = target.dispatch(event);
            Event.release(event);
            return result;
        }
    }
}