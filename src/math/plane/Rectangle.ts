namespace Soo.math {
    let $pool: Rectangle[] = [];

    // 平面矩形
    export class Rectangle extends HashObject {
        constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
            super();
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        /** X坐标 */
        x: number;

        /** Y坐标 */
        y: number;

        /** 宽度 */
        width: number;

        /** 高度 */
        height: number;

        /** 指定值 */
        setTo(x: number, y: number, width: number, height: number): Rectangle {
            this.x = x; this.y = y;
            this.width = width; this.height = height;
            return this;
        }

        /** 克隆对象 */
        clone(): Rectangle {
            return new Rectangle(this.x, this.y, this.width, this.height);
        }

        /** 复制源 */
        copyFrom(source: Rectangle): Rectangle {
            this.x = source.x; this.y = source.y;
            this.width = source.width; this.height = source.height;
            return this;
        }

        /** 比较是否相同 */
        equals(to: Rectangle): boolean {
            if (this == to) {
                return true;
            }
            return this.x === to.x && this.y === to.y
                && this.width === to.width && this.height === to.height;
        }

        /** 转化为字符串 */
        toString(): string {
            return `(x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height})`;
        }

        /** 通过对象池创建*/
        static create(x: number, y: number, width: number, height: number): Rectangle {
            let rect = $pool.pop() || new Rectangle();
            return rect.setTo(x, y, width, height);
        }

        /** 释放对象至对象池 */
        static release(point: Rectangle): void {
            if (!point) return;
            $pool.push(point);
        }
    }

    // 仅供框架内部使用
    export let $TempRectangle = new Rectangle();
}