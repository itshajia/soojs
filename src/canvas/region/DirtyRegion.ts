namespace Soo.canvas {

    // 脏矩形
    export class DirtyRegion {

        /** 脏列表 */
        private $list: Region[] = [];

        /** 裁剪区域 */
        private $hasClip: boolean = false;
        private $dirtyClip: boolean = false;
        private $clipWidth: number = 0;
        private $clipHeight: number = 0;
        private $clipArea: number = 0;


        /** 设置裁剪边界（超过边界的节点将跳过绘制） */
        setClipRect(width: number, height: number): void {
            this.$hasClip = true;
            this.$dirtyClip = true;
            this.$clipWidth = Math.ceil(width);
            this.$clipHeight = Math.ceil(height);
            this.$clipArea = this.$clipWidth * this.$clipHeight;
        }

        /** 添加一个脏矩形区域 */
        addRegion(target: Region): boolean {

        }

        /** 合并脏矩形 */
        private $mergeDirtyList(list: Region[]): boolean {
            if (list.length < 2) {
                return false;
            }

        }

        /** 脏策略 */
        private $dirtyRegionPolicy: string = DirtyRegionPolicy.ON;
        set dirtyRegionPolicy(value: string) {
            this.$dirtyRegionPolicy = value;
        }
    }
}