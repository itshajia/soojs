namespace Soo.canvas {

    // 矢量渲染节点
    export class GraphicsNode extends RenderNode {
        constructor() {
            super();
            this.type = RenderNodeType.Graphics;
        }

        /** 填充单色 */
        beginFill(color: number, alpha: number = 1, nextPath?: Path2D): Path2D {
            let path = new FillPath();
            path.fillColor = color;
            path.fillAlpha = alpha;
            if (nextPath) { // 新的 path 被插入到 nextPath 的前面
                let index = this.renderData.lastIndexOf(nextPath);
                this.renderData.splice(index, 0, path);
            } else {
                this.renderData.push(path);
            }
            this.renderCount++;
            return path;
        }

        /** 线段样式 */
        lineStyle(width: number, color?: number, alpha: number = 1,
                  caps?: string, joints?: string, miterLimit: number = 3, lineDash: number[] = []): Path2D {
            let path = new StrokePath();
            path.lineWidth = width;
            path.lineColor = color;
            path.lineAlpha = alpha;
            path.caps = caps || CapsStyle.ROUND;
            path.joints = joints;
            path.miterLimit = miterLimit;
            path.lineDash = lineDash;
            this.renderData.push(path);
            this.renderCount++;
            return path;
        }

        /** 清空数据 */
        clear(): void {
            this.renderData.length = 0;
            this.renderCount = 0;
        }
    }
}