namespace Soo {
    export let $TICKERS: Ticker[] = [];

    function addToList(ticker: Ticker): void {
        if ($TICKERS.indexOf(ticker) == -1) {
            $TICKERS.push(ticker);
        }
    }

    function removeFromList(ticker: Ticker): void {
        let index = $TICKERS.indexOf(ticker);
        if (index != -1) {
            $TICKERS.splice(index, 1);
        }
    }

    // 计时器
    export class Ticker {
        constructor() {
            this.$startTime = Date.now();
            addToList(this);
        }

        /** 开始时间 */
        private $startTime: number;

        /** 计时器时间（相对计时器开始时间的值，表示计时器运行时长） */
        getTime(): number {
            return Date.now() - this.$startTime;
        }

        /** 帧率 */
        $frameRate: number = 60;
        get frameRate(): number {
            return this.$frameRate;
        }
        set frameRate(value: number) {
            value = Math.max(0, Math.min(60, value));

        }

        /** 是否被暂停 */
        private $isPaused: boolean = false;
        /** 暂停 */
        pause(): void {
            this.$isPaused = true;
        }

        /** 恢复 */
        resume(): void {
            this.$isPaused = false;
        }

        /** 刷新 */
        $update(): void {

        }
        onUpdate(): void {

        }

        /** 销毁 */
        destroy(): void {
            removeFromList(this);
        }
    }
}