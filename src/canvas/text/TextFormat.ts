namespace Soo.canvas {

    // 文本数据格式
    export interface TextFormat {
        /** 字体颜色 */
        color?: number;

        /** 字号大小 */
        size?: number;

        /** 描边大小 */
        stroke?: number;

        /** 描边颜色 */
        strokeColor?: number;

        /** 粗体 */
        bold?: boolean;

        /** 斜体 */
        italic?: boolean;

        /** 字体名称 */
        fontFamily?: string;
    }
}