namespace Soo.canvas {
    let $pool: Region[] = [];

    // 用作脏矩形区域测量
    export class Region {
        /** 最小点 */
        private $minX: number = 0;
        get minX(): number {
            return this.$minX;
        }
        set minX(value: number) {
            this.$minX = Math.floor(value);
        }
        private $minY: number = 0;
        get minY(): number {
            return this.$minY;
        }
        set minY(value: number) {
            this.$minY = Math.floor(value);
        }

        /** 最大点 */
        private $maxX: number = 0;
        get maxX(): number {
            return this.$maxX;
        }
        set maxX(value: number) {
            this.$maxX = Math.ceil(value);
        }
        private $maxY: number = 0;
        get maxY(): number {
            return this.$maxY;
        }
        set maxY(value: number) {
            this.$maxY = Math.ceil(value);
        }

        /** 尺寸 */
        width: number = 0;
        height: number = 0;

        /** 面积 */
        area: number = 0;

        /** 是否位置发生变化 */
        dirty: boolean = false;

        /** 指定值 */
        setTo(minX: number, minY: number, maxX: number, maxY: number): Region {
            this.minX = minX; this.minY = minY;
            this.maxX = maxX; this.maxY = maxY;
            this.update();
            return this;
        }

        /** 更新尺寸面积 */
        update(): void {
            this.width  = this.$maxX - this.$minX;
            this.height = this.$maxY - this.$minY;
            this.area = this.width * this.height;
        }

        /** 置空 */
        setEmpty(): void {
            this.minX = this.minY = this.maxX = this.maxY = 0;
            this.width = this.height = this.area = 0;
        }

        /** 是否为空区域 */
        isEmpty(): boolean {
            return this.width <= 0 || this.height <= 0;
        }

        /** 合并区域 */
        union(target: Region): void {
            this.minX = Math.min(this.minX, target.minX);
            this.minY = Math.min(this.minY, target.minY);
            this.maxX = Math.max(this.maxX, target.maxX);
            this.maxY = Math.max(this.maxY, target.maxY);
            this.update();
        }

        /** 相交区域 */
        intersect(target: Region): void {
            this.minX = Math.max(this.minX, target.minX);
            this.maxX = Math.min(this.maxX, target.maxX);
            if (this.minX >= this.maxX) {
                this.setEmpty();
                return;
            }

            this.minY = Math.max(this.minY, target.minY);
            this.maxY = Math.min(this.maxY, target.maxY);
            if (this.minY >= this.maxY) {
                this.setEmpty();
                return;
            }
            this.update();
        }

        /** 两个区域是否相交 */
        intersects(target: Region): boolean {
            if (this.isEmpty()) {
                return false;
            }
            let minX = Math.max(this.minX, target.minX);
            let maxX = Math.min(this.maxX, target.maxX);
            if (minX > maxX) {
                return false;
            }

            let minY = Math.max(this.minY, target.minY);
            let maxY = Math.min(this.maxY, target.maxY);
            return minY <= maxY;
        }

        /** 通过对象池创建*/
        static create(): Region {
            return $pool.pop() || new Region();
        }

        /** 释放对象至对象池 */
        static release(region: Region): void {
            if (!region) return;
            $pool.push(region);
        }
    }
}