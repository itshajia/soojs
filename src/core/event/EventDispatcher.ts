namespace Soo {

    const enum Keys {
        // 事件绑定对象
        eventTarget,
        // 事件集合
        eventsMap,
        // 捕获事件集合
        captureEventsMap,
        // 通知深度
        notifyLevel
    }

    // 事件项实现接口
    export interface EventBin {
        /** 事件类型 */
        type: string;

        /** 监听器 */
        listener: Function;

        /** 执行上下文 */
        context: any;

        /** 关联数据 */
        data?: any;

        /** 执行优先级 */
        priority: number;

        /** 事件绑定对象 */
        target: IEventDispatcher;

        /** 是否为捕获 */
        useCapture: boolean;

        /** 是否为一次性事件 */
        dispatchOnce: boolean;
    }

    // 单次触发事件临时存放列表
    let ONCE_EVENT_LIST: EventBin[] = [];

    // 事件发射器
    export class EventDispatcher extends HashObject implements IEventDispatcher {
        constructor(target: IEventDispatcher = null) {
            super();

            let values = this.$EventDispatcher;
            values[Keys.eventTarget] = target ? target : this;
            values[Keys.eventsMap] = {};
            values[Keys.captureEventsMap] = {};
            values[Keys.notifyLevel] = 0;
        }

        protected $EventDispatcher: Object = {};

        /** 获取事件集合 */
        private $getEventsMap(useCapture?: boolean): any {
            let values = this.$EventDispatcher;
            return useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
        }

        /** 注册事件 */
        addEventListener(type: string, listener: Function, context: any, data?: any, useCapture?: boolean, priority?: number): void {
            this.$addListener(type, listener, context, data, useCapture, priority);
        }

        /** 注册一次性事件 */
        once(type: string, listener: Function, context: any, data?: any, useCapture?: boolean, priority?: number): void {
            this.$addListener(type, listener, context, data, useCapture, priority, true);
        }

        /** 添加事件监听器 */
        protected $addListener(type: string, listener: Function, context:any, data?: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): void {
            let values = this.$EventDispatcher;
            let eventsMap = this.$getEventsMap(useCapture);
            let types = (type || "").match(/\S+/g) || [""];

            let list;
            for (let i = 0, len = types.length; i < len; i++) {
                list = eventsMap[types[i]];
                if (!list) {
                    list = eventsMap[type] = [];
                } else if (values[Keys.notifyLevel] !== 0) {
                    eventsMap[type] = list = list.concat();
                }
                this.$insertEventBin(list, type, listener, context, data, useCapture, priority, dispatchOnce);
            }
        }

        /** 插入事件项 */
        protected $insertEventBin(list: EventBin[], type: string, listener: Function, context: any, data?: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): boolean {
            priority = +priority | 0;
            let insertIndex = -1, bin;
            for (let i = 0, len = list.length; i < len; i++) {
                bin = list[i];
                // 如果已经加入，则返回
                if (bin.listener == listener && bin.context == context && bin.target == this) {
                    return false;
                }
                if (insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                    break;
                }
            }

            let eventBin: EventBin = {
                type: type, listener: listener, context: context, data: data, priority: priority,
                target: this, useCapture: useCapture, dispatchOnce: dispatchOnce
            };
            if (insertIndex != -1) {
                list.splice(insertIndex, 0, eventBin);
            } else {
                list.push(eventBin);
            }
            return true;
        }

        /** 移除事件 */
        removeEventListener(type: string, listener: Function, context: any, useCapture?: boolean): void {
            let values = this.$EventDispatcher;
            let eventsMap = this.$getEventsMap(useCapture);
            if (!eventsMap) {
                return;
            }
            let types = (type || "").match(/\S+/g) || [""];
            for (let i = 0, len = types.length; i < len; i++) {
                let list = eventsMap[types[i]];
                if (list) {
                    if (values[Keys.notifyLevel] !== 0) {
                        eventsMap[type] = list = list.concat();
                    }
                    this.$removeEventBin(list, listener, context);
                    if (list.length == 0) {
                        eventsMap[type] = null;
                    }
                }
            }
        }

        /** 移除事件项 */
        protected $removeEventBin(list: EventBin[], listener: Function, context: any): boolean {
            for (let i = 0, len = list.length; i < len; i++) {
                let bin = list[i];
                if (bin.listener == listener && bin.context == context && bin.target == this) {
                    list.splice(i, 1);
                    return true;
                }
            }
            return false;
        }

        /** 检测是否注册了特定类型的事件 */
        hasEventListener(type: string): boolean {
            let values = this.$EventDispatcher;
            return !!(values[Keys.eventsMap][type] || values[Keys.captureEventsMap][type]);
        }

        /** 事件发起者，事件即为冒泡阶段（capturePhase=false） */
        dispatch(event: Event, data?: any): boolean {
            let values = this.$EventDispatcher;
            event.currentTarget = values[Keys.eventTarget];
            event.setTarget(event.currentTarget);
            return this.$notifyListener(event, false, data);
        }

        /** 派发一个指定参数的事件（冒泡阶段） */
        dispatchWith(type: string, bubbles?: boolean, data?: any): boolean {
            if (bubbles || this.hasEventListener(type)) {
                let event = Event.create(Event, type, bubbles);
                let result = this.dispatch(event, data);
                Event.release(event);
                return result;
            }
            return true;
        }

        /** 事件通知 */
        protected $notifyListener(event: Event, capturePhase?: boolean, data?: any): boolean {
            let values = this.$EventDispatcher;
            let eventsMap = this.$getEventsMap(capturePhase);
            let list = eventsMap[event.type];
            if (!list || list.length === 0) {
                return true;
            }

            let onceList = ONCE_EVENT_LIST, eventBin;
            values[Keys.notifyLevel]++;
            for (let i = 0, len = list.length; i < len; i++) {
                eventBin = list[i];
                if (eventBin.data) {
                    event.data = eventBin.data;
                }
                eventBin.listener.apply(eventBin.context, (<any>[event]).concat([data]));
                if (eventBin.dispatchOnce) {
                    onceList.push(eventBin);
                }
                if (event.isPropagationImmediateStopped) { // 立即阻止后续事件
                    break;
                }
                if (event.isPropagationStopped && event.target == event.currentTarget) { // 执行到绑定对象时，停止往后传播
                    break;
                }
            }
            values[Keys.notifyLevel]--;
            while (eventBin = onceList.shift()) { // 移除一次性事件的监听器
                eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.context, eventBin.useCapture);
            }
            return !event.isPrevented;
        }
    }
}