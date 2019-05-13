namespace Soo {
    /** 系统计时开始时间 */
    export let $SYS_START_TIME: number = Date.now();

    /** 系统时间（这是一个相对系统开始时间的值，表示系统运行时长） */
    export function getSysTime(): number {
        return Date.now() - $SYS_START_TIME;
    }

    // 系统计时器
    export class SysTicker extends Ticker {
        constructor() {
            super();
        }
    }

    // 系统内部使用
    export let $sysTicker: SysTicker = new SysTicker();
    startTicker(); // 启动系统计时器

    /** 刷新计时器 */
    function updateTickers(): void {
        $TICKERS.forEach(function(ticker: Ticker) {
            ticker.$update();
        });
    }

    /** 启动系统计时器 */
    function startTicker(): void {
        let requestAnimationFrame =
            window["requestAnimationFrame"] ||
            window["webkitRequestAnimationFrame"] ||
            window["mozRequestAnimationFrame"] ||
            window["oRequestAnimationFrame"] ||
            window["msRequestAnimationFrame"];

        if (!requestAnimationFrame) {
            requestAnimationFrame = function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
        }

        requestAnimationFrame(onTicker);
        function onTicker(): void {
            updateTickers();
            requestAnimationFrame(onTicker);
        }
    }
}