namespace Soo {

    // 事件监听器抽象类
    export abstract class EventMonitor extends EventDispatcher {
        /** 注册监听 */
        abstract enable(obj: HashObject, ...args): void;

        /** 注销监听 */
        abstract disable(obj: HashObject, ...args): void;
    }
}