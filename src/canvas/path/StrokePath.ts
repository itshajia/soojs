namespace Soo.canvas {

    // 描边路径
    export class StrokePath extends Path2D {
        constructor() {
            super();
            this.type = Path2DType.Stroke;
        }

        /** 宽度 */
        lineWidth: number;

        /** 颜色 */
        lineColor: number;

        /** 透明度 */
        lineAlpha: number;

        /** 端点样式 */
        caps: string;

        /** 连接点样式 */
        joints: string;

        /** 剪切斜接的极限值 */
        miterLimit: number;

        /** 虚线参数组 */
        lineDash: number[];
    }
}