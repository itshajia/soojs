namespace Soo.canvas {

    // 脏矩形
    export class DirtyRegion {
        constructor(target: DisplayObject) {
            this.$target = target;
        }

        /** 关联的显示对象 */
        private $target: DisplayObject;

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

        /** 获取最终脏矩形列表 */
        getDirtyRegions(): Region[] {
            let list = this.$list;
            if (this.$dirtyRegionPolicy == DirtyRegionPolicy.OFF) {
                this.clearDirtyRegions();
                let region = Region.create();
                if (this.$hasClip) {
                    list.push(region.setTo(0, 0, this.$clipWidth, this.$clipHeight));
                } else {

                }
            } else {

            }
        }

        /** 清空 */
        clearDirtyRegions(): void {
            let list = this.$list;
            for (let i = 0, len = list.length; i < len; i++) {
                Region.release(list[i]);
            }
            list.length = 0;
        }

        /** 合并脏矩形 */
        private $mergeDirtyList(list: Region[]): void {
            let hasClip= this.$hasClip;
            while (list.length >= 2) {
                let length = list.length;
                let maxDelta = length > 3 ? Number.POSITIVE_INFINITY : 0;
                let mergeA = 0, mergeB = 0;
                // 逐个对比
                for (let i = 0; i < length - 1; i++) {
                    let regionA = list[i];
                    for (let j = i + 1; j < length; j++) {
                        let regionB = list[j];
                        let delta = unionArea(regionA, regionB) - regionA.area - regionB.area;
                        if (delta < maxDelta) { // 选出交集最大的两个区域
                            mergeA = i;
                            mergeB = j;
                            maxDelta = delta;
                        }
                    }
                }

                if (mergeA != mergeB) { // 合并两个区域
                    let region = list[mergeB];
                    list[mergeA].union(region);
                    Region.release(region);
                    list.splice(mergeB, 1);
                }
            }
        }

        /** 脏策略 */
        private $dirtyRegionPolicy: string = DirtyRegionPolicy.ON;
        set dirtyRegionPolicy(value: string) {
            this.$dirtyRegionPolicy = value;
        }
    }

    /** 计算两个区域的合并区域面积 */
    function unionArea(r1: Region, r2: Region): number {
        let minX = Math.min(r1.minX, r2.minX);
        let minY = Math.min(r1.minY, r2.minY);
        let maxX = Math.max(r1.maxX, r2.maxX);
        let maxY = Math.max(r1.maxY, r2.maxY);
        return (maxX - minX) * (maxY - minY);
    }
}