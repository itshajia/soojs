namespace Soo {

    /** 当前时间（精确到毫秒） */
    export function now(): number {
        return new Date().getTime();
    }
}