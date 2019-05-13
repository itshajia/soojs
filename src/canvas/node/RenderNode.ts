namespace Soo.canvas {
    import Matrix = Soo.math.Matrix;

    // 渲染节点类型
    export const enum RenderNodeType {
        /** 位图渲染 */
        Bitmap = 1,

        /** 文本渲染 */
        Text,

        /** 矢量(图形)渲染 */
        Graphics,

        /** 组渲染 */
        Group
    }

    export abstract class RenderNode {
        /** 节点类型 */
        type: RenderNodeType;

        /** 是否需要重新绘制 */
        dirty: boolean = false;

        /** 相对舞台的整体透明度 */
        renderAlpha: number = 1;

        /** 相对舞台的可见 */
        renderVisible: boolean = true;

        /** 相对于显示列表根节点或位图缓存根节点的矩阵对象 */
        renderMatrix: Matrix = new Matrix();

        /** 自身在显示列表根节点或位图缓存根节点的显示尺寸 */
        renderRegion: Region = new Region();

        /** 是否发生了改变 */
        changed: boolean = false;

        /** 绘制数据 */
        renderData: any[] = [];

        /** 绘制次数 */
        renderCount: number = 0;

        /** 清空所有数据（在调用显示对象的render方法前执行） */
        flushRenderData(): void {
            this.renderData.length = 0;
            this.renderCount = 0;
        }
    }
}