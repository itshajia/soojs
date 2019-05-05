namespace Soo {

    // Mouse Touch Event
    export class MTEvent extends Event {
        constructor(type: string, bubbles: boolean) {
            super(type, bubbles);
        }

        static dispatchMTEvent(target: IEventDispatcher, type: string, data?: any): boolean {
            let event = Event.create(MTEvent, type);
            let result = target.dispatch(event);
            Event.release(event);
            return result;
        }
    }
}