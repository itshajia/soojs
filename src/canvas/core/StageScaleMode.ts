namespace Soo.canvas {

    // 舞台适配缩放模式
    export const StageScaleMode = {
        /** 不缩放（即使播放器视口大小改变，依然保持原样） */
        NO_SCALE: "noScale",

        /** 保持原始宽高比缩放（宽的方向填满播放器视口，窄的两边留有黑边） */
        SHOW_ALL: "showAll",

        /** 保持原始宽高比缩放（窄的方向填满播放器视口，宽的两边会被裁剪） */
        NO_BORDER: "noBorder",
    };
}