namespace Soo {

    // 事件对象
    export class Event extends HashObject {
        /** 对象添加到舞台的显示列表中 */
        static ADDED_TO_STAGE: string = "addedToStage";

        /** 对象移除舞台的显示列表 */
        static REMOVED_FROM_STAGE: string = "removedFromStage";

        /** 显示对象添加到显示容器中(即使容器不在舞台) */
        static ADDED: string = "added";

        /** 显示对象移除显示容器(即使容器不在舞台) */
        static REMOVED: string = "removed";

        /** 进入新的一帧(广播事件，无论对象是否在显示列表中) */
        static ENTER_FRAME: string = "enterFrame";

        /** 渲染事件(即将渲染，渲染前一刻触发) */
        static RENDER: string = "render";

        /** 渲染完成(通用用户图像更新的监听) */
        static RENDERED: string = "rendered";

        /** 渲染出错 */
        static RENDER_ERROR: string = "renderError";

        /** 舞台尺寸或UI组件尺寸发生改变 */
        static RESIZE: string = "resize";

        /** 错误 */
        static ERROR: string = "error";

        constructor(type: string, bubbles: boolean = false, data?: any) {
            super();
            this.$type = type;
            this.$bubbles = bubbles;
            this.data = data;
        }

        /** 事件类型 */
        private $type: string;
        get type(): string {
            return this.$type;
        }

        /** 是否参与事件流的冒泡阶段 */
        private $bubbles: boolean;
        get bubbles(): boolean {
            return this.$bubbles;
        }

        /** 事件流中需要传递的可选数据 */
        data: any;

        /** 事件流执行阶段 */
        private $eventPhase: EventPhase;
        get eventPhase(): EventPhase {
            return this.$eventPhase;
        }
        set eventPhase(value: EventPhase) {
            this.$eventPhase = value;
        }

        /** 事件绑定目标 */
        private $currentTarget: any = null;
        get currentTarget(): any {
            return this.$currentTarget;
        }
        set currentTarget(value: any) {
            this.$currentTarget = value;
        }

        /** 事件目标 */
        private $target: any = null;
        get target(): any {
            return this.$target;
        }
        setTarget(value: any): boolean {
            if (this.$target == value) {
                return false;
            }
            this.$target = value;
            return true;
        }

        /** 阻止事件行为 */
        private $isPrevented: boolean = false;
        get isPrevented(): boolean {
            return this.$isPrevented;
        }
        prevent(): void {
            this.$isPrevented = true;
        }

        /** 停止事件冒泡（不会影响当前节点） */
        private $isPropagationStopped: boolean = false;
        get isPropagationStopped(): boolean {
            return this.$isPropagationStopped;
        }
        stopPropagation(): void {
            if (this.$bubbles) {
                this.$isPropagationStopped = true;
            }
        }

        /** 立刻停止当前节点中和所有后续节点的事件流的处理（影响当前节点） */
        private $isPropagationImmediateStopped: boolean = false;
        get isPropagationImmediateStopped(): boolean {
            return this.$isPropagationImmediateStopped;
        }
        stopImmediatePropagation(): void {
            if (this.$bubbles) {
                this.$isPropagationImmediateStopped = true;
            }
        }

        /** 清理事件相关数据 */
        protected clean(): void {
            this.data = this.$currentTarget = null;
            this.$target = null;
        }

        /** 从对象池中获取或创建一个新的事件对象 */
        static create<T extends Event>(EventClass: {new (type: string, bubbles?: boolean): T; eventPool?: Event[]}, type: string, bubbles?: boolean): T {
            let eventPool: Event[];
            if (EventClass.hasOwnProperty("eventPool")) {
                eventPool = EventClass.eventPool;
            } else {
                eventPool = EventClass.eventPool = [];
            }

            let event: T;
            if (eventPool.length) {
                event = <T>eventPool.pop();
                event.$type = type;
                event.$bubbles = bubbles;
                event.$isPrevented = false;
                event.$isPropagationStopped = false;
                event.$isPropagationImmediateStopped = false;
                event.$eventPhase = EventPhase.AT_TARGET;
                return event;
            }
            return new EventClass(type, bubbles);
        }

        /** 释放一个事件对象到缓存池 */
        static release(event: Event): void {
            if (!event) {
                return;
            }

            event.clean();
            let EventClass = Object.getPrototypeOf(event).constructor;
            EventClass.eventPool.push(event);
        }

        /** 触发事件 */
        static dispatchEvent(target: IEventDispatcher, type: string, bubbles: boolean = false): boolean {
            let event = Event.create(Event, type, bubbles);
            let result = target.dispatch(event);
            Event.release(event);
            return result;
        }
    }
}