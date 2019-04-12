namespace Soo {

    // 事件流阶段
    export const enum EventPhase {
        /** 捕获阶段 */
        CAPTURING_PHASE = 1,

        /** 目标阶段 */
        AT_TARGET = 2,

        /** 冒泡阶段 */
        BUBBLING_PHASE = 3
    }
}