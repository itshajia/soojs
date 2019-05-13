namespace Soo.canvas {

    // 文本节点
    export class TextNode extends RenderNode {
        constructor() {
            super();
            this.type = RenderNodeType.Text;
        }

        /** 文本颜色 */
        color: number = 0xffffff;

        /** 字号大小 */
        size: number = 15;

        /** 描边大小 */
        stroke: number = 0;

        /** 描边颜色 */
        strokeColor: number = 0x000000;

        /** 加粗 */
        bold: boolean = false;

        /** 斜体 */
        italic: boolean = false;

        /** 字体名称 */
        fontFamily: string = "Arial";

        /** 绘制文本 */
        drawText(x: number, y: number, text: string, format: TextFormat): void {
            this.renderData.push(x, y, text, format);
            this.renderCount++;
            this.dirty = true;
        }


    }
}