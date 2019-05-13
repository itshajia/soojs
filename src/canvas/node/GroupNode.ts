namespace Soo.canvas {

    // 组渲染节点（包含多个子项节点）
    export class GroupNode extends RenderNode {
        constructor() {
            super();
            this.type = RenderNodeType.Group;
        }

        /** 添加子项节点 */
        addNode(node: RenderNode): void {
            this.renderData.push(node);
        }

        flushRenderData(): void {
            let data = this.renderData;
            for (let i = data.length - 1; i >= 0; i--) {
                data[i].flushRenderData();
            }
        }

    }
}