namespace Soo.canvas {

    // Canvas系统计时器
    export class SysTicker extends Ticker {
        constructor() {
            super();
        }

        /** 播放器列表 */
        private $players: Player[] = [];

        /** 添加播放器 */
        addPlayer(player: Player): void {
            let players = this.$players;
            if (players.indexOf(player) === -1) {
                players.push(player);
            }
        }

        /** 移除播放器 */
        removePlayer(player: Player): void {
            let players = this.$players;
            let index = players.indexOf(player);
            if (index !== -1) {
                players.splice(index, 1);
            }
        }

        /** 刷新 */
        onUpdate(): void {
            super.onUpdate();
            this.$render();
        }

        /** 执行一次屏幕渲染 */
        $render(): void {
            let players = this.$players;
            let length = players.length;
            if (length === 0) {
                return;
            }

            for (let i = 0; i < length; i++) {
                players[i].$render();
            }
        }
    }

    export let $canvasSysTicker: SysTicker = new SysTicker();
}

namespace Soo {
    export let CanvasSysTicker = canvas.SysTicker;
}