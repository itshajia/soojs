namespace Soo.canvas {

    // 渐变类型
    export const GradientType = {
        /** 线性渐变填充 */
        LINEAR: "linear",

        /** 放射状渐变填充 */
        RADIAL: "radial"
    };

    // 渐变色填充路径
    export class GradientFillPath extends Path2D {
        constructor() {
            super();
            this.type = Path2DType.GradientFill;
        }

        /** 渐变类型 */
        gradientType: string;

        /** 颜色组 */
        colors: number[];

        /** 透明组 */
        alphas: number[];

        /** 颜色分配比例组 */
        ratios: number[];
    }
}