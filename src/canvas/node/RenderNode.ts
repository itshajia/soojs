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
        globalAlpha: number = 1;

        /** 相对舞台的可见 */
        globalVisible: boolean = true;

        /** 相对舞台的矩阵对象 */
        globalMatrix: Matrix = new Matrix();


    }
}