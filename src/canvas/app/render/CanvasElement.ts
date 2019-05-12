namespace Soo.canvas {

    /** 创建 canvas */
    function createCanvas(width?: number, height?: number): HTMLCanvasElement {
        let canvas = document.createElement("canvas");
        if (!isNaN(width) && !isNaN(height)) {
            canvas.width = width;
            canvas.height = height;
        }

        let context = canvas.getContext("2d");
        if (context["imageSmoothingEnabled"] === undefined) {
            let keys = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
            let key:string;
            for (let i = keys.length - 1; i >= 0; i--) {
                key = keys[i];
                if (context[key] !== void 0) {
                    break;
                }
            }
            try {
                Object.defineProperty(context, "imageSmoothingEnabled", {
                    get: function () {
                        return this[key];
                    },
                    set: function (value) {
                        this[key] = value;
                    }
                });
            }
            catch (e) {
                context["imageSmoothingEnabled"] = context[key];
            }
        }
        return canvas;
    }

    export class CanvasElement implements RenderElement {
        constructor(width?: number, height?: number) {
            this.surface = createCanvas(width, height);
            this.context = this.surface.getContext("2d");
        }

        /** 画布 */
        surface: HTMLCanvasElement;

        /** 上下文 */
        context: CanvasRenderingContext2D;

        /** 宽度 */
        get width(): number {
            return this.surface.width;
        }

        /** 高度 */
        get height(): number {
            return this.surface.height;
        }

        /** 改变画布大小，并清空 */
        resize(width: number, height: number): void {
            let surface = this.surface;
            surface.width = width;
            surface.height = height;
            this.clear();
        }

        /** 清空，并设置裁剪区域 */
        beginClip(): void {

        }

        /** 取消上一次设置的clip */
        endClip(): void {
            this.context.restore();
        }

        /** 绘制图像 */
        drawImage(img: HTMLImageElement, sourceX: number, sourceY: number, sourceW: number, sourceH: number,
                  drawX: number, drawY: number, drawW: number, drawH: number): void {
            this.context.drawImage(img, sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH);
        }

        /** 获取像素数据 */
        getImageData(x: number, y: number, width?: number, height?: number): ImageData {
            return this.context.getImageData(x, y, width, height);
        }

        /** 填充画布 */
        putImageData(imageData: ImageData): void {
            this.context.putImageData(imageData, 0, 0);
        }

        /** 填充颜色 */
        fillColor(color: string): void {
            let surface = this.surface;
            let context = this.context;
            context.fillStyle = color;
            context.fillRect(0, 0, surface.width, surface.height);
        }

        /** 转化 base64字符串 */
        toDataURL(type?: string, encoderOptions?: number): string {
            return this.surface.toDataURL(type, encoderOptions);
        }

        /** 清空画布数据 */
        clear(): void {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.surface.width, this.surface.height);
        }
    }
}