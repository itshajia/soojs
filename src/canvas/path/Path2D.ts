namespace Soo.canvas {

    export const enum Path2DType {
        /** 纯色填充路径 */
        Fill = 1,

        /** 渐变填充路径 */
        GradientFill,

        /** 线条路径 */
        Stroke
    }

    export const enum Path2DCommand {
        /** 移动到点 */
        MoveTo = 1,

        /** 直线到点 */
        LineTo,

        /** 曲线 */
        CurveTo,

        /** 三次曲线 */
        CubicCurveTo
    }

    // 2D路径
    export class Path2D {
        type: Path2DType;

        /** 命令集合 */
        commands: number[] = [];
        /** 命令游标 */
        protected commandPosition: number = 0;

        /** 数据集合 */
        data: number | number[][] = [];

        /** 数据游标 */
        protected dataPosition: number = 0;

        /** 绘制位置移动到(x, y) */
        moveTo(x: number, y: number): void {
            this.commands[this.commandPosition++] = Path2DCommand.MoveTo;
            let pos = this.dataPosition;
            this.data[pos++] = x;
            this.data[pos++] = y;
            this.dataPosition = pos;
        }

        /** 绘制从当前位置到(x, y)的直线 */
        lineTo(x: number, y: number): void {
            this.commands[this.commandPosition++] = Path2DCommand.LineTo;
            let pos = this.dataPosition;
            this.data[pos++] = x;
            this.data[pos++] = y;
            this.dataPosition = pos;
        }

        /** 二次贝塞尔曲线 */
        curveTo(cpx: number, cpy: number, x: number, y: number): void {
            this.commands[this.commandPosition++] = Path2DCommand.CurveTo;
            let pos = this.dataPosition;
            this.data[pos++] = cpx;
            this.data[pos++] = cpy;
            this.data[pos++] = x;
            this.data[pos++] = y;
            this.dataPosition = pos;
        }

        /** 三次贝塞尔曲线 */
        cubicCurveTo(cpx1: number, cpy1: number, cpx2: number, cpy2: number, x: number, y: number): void {
            this.commands[this.commandPosition++] = Path2DCommand.CubicCurveTo;
            let pos = this.dataPosition;
            this.data[pos++] = cpx1;
            this.data[pos++] = cpy1;
            this.data[pos++] = cpx2;
            this.data[pos++] = cpy2;
            this.data[pos++] = x;
            this.data[pos++] = y;
            this.dataPosition = pos;
        }

        /** 绘制矩形 */
        drawRect(x: number, y: number, width: number, height: number): void {
            let x2 = x + width;
            let y2 = y + height;
            this.moveTo(x, y);
            this.lineTo(x2, y);
            this.lineTo(x2, y2);
            this.lineTo(x, y2);
            this.lineTo(x, y);
        }

        /** 绘制圆角矩形 */
        drawRoundRect(x: number, y: number, width: number, height: number, radius: number): void {
            if (!radius) {
                this.drawRect(x, y, width, height);
                return;
            }

            let halfWidth = width * 0.5;
            let halfHeight = height * 0.5;
            radius = Math.min(radius, halfWidth, halfHeight); // 半径不能超过要绘制的尺寸
            if (halfWidth == radius && halfHeight == radius) {
                this.drawCircle(x + radius, y + radius, radius);
                return;
            }

            //    A-----B
            //  H         C
            //  G         D
            //    F-----E
            // 从D点开始，结束在D点

        }

        /** 绘制圆 */
        drawCircle(x: number, y: number, radius: number): void {

        }

        /** 绘制椭圆 */
        drawEllipse(x: number, y: number, width: number, height: number): void {

        }
    }
}