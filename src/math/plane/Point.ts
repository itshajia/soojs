namespace Soo.math {
    let $pool: Point[] = [];

    // 平面点
    export class Point extends HashObject {
        constructor(x: number = 0, y: number = 0) {
            super();
            this.x = x;
            this.y = y;
        }

        /** X坐标 */
        x: number;

        /** Y坐标 */
        y: number;

        /** 指定坐标位置 */
        setTo(x: number, y: number): Point {
            this.x = x; this.y = y;
            return this;
        }

        /** 克隆对象 */
        clone(): Point {
            return new Point(this.x, this.y);
        }

        /** 复制源 */
        copyFrom(source: Point): Point {
            this.x = source.x; this.y = source.y;
            return this;
        }

        /** 比较是否相同 */
        equals(to: Point): boolean {
            if (this == to) {
                return true;
            }
            return this.x == to.x && this.y == to.y;
        }

        /** 加上一个坐标点 */
        add(v: Point): Point {
            return new Point(this.x + v.x, this.y + v.y);
        }

        /** 减去一个坐标点 */
        subtract(v: Point): Point {
            return new Point(this.x - v.x, this.y - v.y);
        }

        /** 转化为字符串 */
        toString(): string {
            return `(x=${this.x}, y=${this.y})`;
        }

        /** 通过对象池创建*/
        static create(x: number, y: number): Point {
            let point = $pool.pop() || new Point();
            return point.setTo(x, y);
        }

        /** 释放对象至对象池 */
        static release(point: Point): void {
            if (!point) return;
            $pool.push(point);
        }
    }

    // 仅供框架内部使用
    export let $TempPoint = new Point();
    export let $TempHitTestPoint = new Point();
}