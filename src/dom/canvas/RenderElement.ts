namespace Soo.dom {

    // 渲染元素
    export interface RenderElement {
        /** 画布 */
        surface: any;

        /** 渲染上下文 */
        context: any;

        /** 改变画布大小，并清空 */
        resize(width: number, height: number): void;
        //resizeTo(width: number, height: number): void;

        /** 清空，并设置裁剪区域 */
        beginClip(): void;

        /** 取消上一次设置的clip */
        endClip(): void;

        /** 绘制图像 */
        drawImage(img: HTMLImageElement, sourceX: number, sourceY: number, sourceW: number, sourceH: number,
                  drawX: number, drawY: number, drawW: number, drawH: number): void;

        /** 获取像素数据 */
        getImageData(x: number, y: number, width?: number, height?: number): ImageData;

        /** 填充画布 */
        putImageData(imageData: ImageData): void;

        /** 填充颜色 */
        fillColor(color: string): void;

        /** 转化 base64字符串 */
        toDataURL(type?: string, ...args: any[]): string;

        /** 清空画布数据 */
        clear(): void;
    }
}