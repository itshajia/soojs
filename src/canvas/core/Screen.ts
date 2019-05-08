namespace Soo.canvas {

    // 设备屏幕
    export interface Screen {
        /** 更新屏幕尺寸 */
        updateScreenSize(): void;

        /** 设置内容区域尺寸 */
        setContentSize(width: number, height: number): void;
    }
}