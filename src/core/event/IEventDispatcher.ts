namespace Soo {

    // 事件触发器实现接口
    export interface IEventDispatcher {
        /** 注册事件 */
        addEventListener(type: string, listener: Function, context: any, data?: any, useCapture?: boolean, priority?: number): void;

        /** 一次性事件 */
        once(type: string, listener: Function, context: any, data?: any, useCapture?: boolean, priority?: number): void;

        /** 移除事件 */
        removeEventListener(type: string, listener: Function, context: any, useCapture?: boolean): void;

        /** 检测是否注册了特定类型的事件 */
        hasEventListener(type: string): boolean;

        /** 事件触发 */
        dispatch(event: Event, data?: any) : boolean;
    }
}