namespace Soo.canvas {

    // 单色填充路径
    export class FillPath extends Path2D {
        constructor() {
            super();
            this.type = Path2DType.Fill;
        }

        /** 填充颜色 */
        fillColor: number;

        /** 填充透明度 */
        fillAlpha: number;
    }
}