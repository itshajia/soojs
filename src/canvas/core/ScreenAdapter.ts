namespace Soo.canvas {

    /** 舞台显示尺寸 */
    export interface StageDisplaySize {
        /** 舞台宽度 */
        stageWidth: number;

        /** 舞台高度 */
        stageHeight: number;

        /** 显示宽度（如果跟舞台宽度不同，则会产生缩放） */
        displayWidth: number;

        /** 显示高度（如果跟舞台高度不同，则会产生缩放） */
        displayHeight: number;
    }

    // 屏幕适配器
    export class ScreenAdapter extends HashObject {
        constructor() {
            super();
        }

        /** 计算舞台显示尺寸 */
        calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number,
                           contentWidth: number, contentHeight: number): StageDisplaySize {
            let displayWidth = screenWidth, displayHeight = screenHeight;
            let stageWidth = contentWidth, stageHeight = contentHeight;
            let scaleX = (displayWidth / stageWidth) || 0;
            let scaleY = (displayHeight / stageHeight) || 0;

            switch (scaleMode) {
                case StageScaleMode.SHOW_ALL: // 宽的方向填满播放器视口，窄的两边留有黑边
                    if (scaleX > scaleY) {
                        displayWidth = Math.round(stageWidth * scaleY);
                    } else {
                        displayHeight = Math.round(stageHeight * scaleX);
                    }
                    break;
                case StageScaleMode.NO_BORDER: // 窄的方向填满播放器视口，宽的两边会被裁剪
                    if (scaleX > scaleY) {
                        displayHeight = Math.round(stageHeight * scaleX);
                    } else {
                        displayWidth = Math.round(stageWidth * scaleY);
                    }
                    break;
                default: // 不缩放时，舞台尺寸即为屏幕视口尺寸
                    stageWidth = screenWidth;
                    stageHeight = screenHeight;
                    break;
            }

            // 这里的尺寸需要2的整数倍，防止不可知异常（画面抖动...）
            if (stageWidth % 2 !== 0) {
                stageWidth += 1;
            }
            if (stageHeight % 2 !== 0) {
                stageHeight += 1;
            }
            if (displayWidth % 2 !== 0) {
                displayWidth += 1;
            }
            if (displayHeight % 2 !== 0) {
                displayHeight += 1;
            }

            return {
                stageWidth: stageWidth | 0, stageHeight: stageHeight | 0,
                displayWidth: displayWidth | 0, displayHeight: displayHeight | 0
            };
        }
    }
}