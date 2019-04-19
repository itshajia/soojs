namespace Soo.canvas {
    import Rectangle = Soo.math.Rectangle;

    // 矢量图形
    export class Graphics extends Container {
        constructor() {
            super();
            this.$renderNode = new GraphicsNode();
        }

        /** 渲染节点 */
        protected $renderNode: GraphicsNode;

        /** 单色填充 */
        private $fillPath: Path2D;

        /** 描边 */
        private $strokePath: Path2D;
        private $topLeftStrokeWidth: number = 0;
        private $bottomRightStrokeWidth: number = 0;
        private $setStrokeWidth(width: number): void {
            switch (width) {
                case 1:
                    this.$topLeftStrokeWidth = 0;
                    this.$bottomRightStrokeWidth = 1;
                    break;
                case 3:
                    this.$topLeftStrokeWidth = 1;
                    this.$bottomRightStrokeWidth = 2;
                    break;
                default:
                    let half = Math.ceil(width * 0.5) | 0;
                    this.$topLeftStrokeWidth = this.$bottomRightStrokeWidth = half;
                    break;
            }
        }

        /** 填充单色 */
        beginFill(color: number, alpha: number = 1): void {
            color = +color || 0;
            alpha = +alpha || 0;
            // 颜色填充放在描边的前面
            this.$fillPath = this.$renderNode.beginFill(color, alpha, this.$strokePath);
        }

        /** 渐变填充 */
        beginGradientFill(): void {

        }

        endFill(): void {
            this.$fillPath = null;
        }

        /** 线段样式 */
        lineStyle(thickness: number = 0, color: number = 0, alpha: number = 1,
                  caps?: string, joints?: string, miterLimit?: number, lineDash?: number[]): void {
            if (thickness <= 0) {
                this.$strokePath = null;
                this.$setStrokeWidth(0);
            } else {
                this.$setStrokeWidth(thickness);
                this.$strokePath = this.$renderNode.lineStyle(thickness, color, alpha, caps, joints, miterLimit, lineDash);
            }
        }

        /** 绘制矩形 */
        drawRect(x: number, y: number, width: number, height: number): void {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;

            let fillPath = this.$fillPath;
            let strokePath = this.$strokePath;
            fillPath && fillPath.drawRect(x, y, width, height);
            strokePath && strokePath.drawRect(x, y, width, height);
        }

        /** 绘制圆角矩形 */
        drawRoundRect(x: number, y: number, width: number, height: number, radius: number): void {

        }

        /** 绘制圆 */
        drawCircle(x: number, y: number, radius: number): void {

        }

        /** 绘制椭圆 */
        drawEllipse(x: number, y: number, width: number, height: number): void {

        }

        /** 绘制圆弧路径 */
        drawArc(x: number, y: number, radius: number, startRadian: number, endRadian: number, anticlockwise?: boolean): void {

        }


        /** 测量自身内容区域 */
        $measureContentBounds(bounds: Rectangle): void {

        }
    }
}