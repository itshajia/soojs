namespace Soo.math {
    let $pool: Matrix[] = [];
    let PI = Math.PI;
    let HalfPI = PI / 2;
    let TwoPI = PI * 2;

    // 平面矩阵
    export class Matrix extends HashObject {
        constructor(a: number = 1, b: number = 0,
                    c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
            super();
            this.a = a; this.b = b;
            this.c = c; this.d = d;
            this.tx = tx; this.ty = ty;
        }

        /** X轴定位值（缩放或旋转） */
        a: number;

        /** Y轴定位值（旋转或倾斜） */
        b: number;

        /** X轴定位值（旋转或倾斜） */
        c: number;

        /** Y轴定位值（缩放或旋转） */
        d: number;

        /** X轴平移距离 */
        tx:number;

        /** Y轴平移距离 */
        ty: number;

        /** 指定值 */
        setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
            this.a = a; this.b = b;
            this.c = c; this.d = d;
            this.tx = tx; this.ty = ty;
            return this;
        }

        /** 克隆对象 */
        clone(): Matrix {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        }

        /** 复制源 */
        copyFrom(source: Matrix): Matrix {
            this.a = source.a; this.b = source.b;
            this.c = source.c; this.d = source.d;
            this.tx = source.tx; this.ty = source.ty;
            return this;
        }

        /** 比较是否相同 */
        equals(to: Matrix): boolean {
            return this.a == to.a && this.b == to.b &&
                this.c == to.c && this.d == to.d &&
                this.tx == to.tx && this.ty == to.ty;
        }

        /** 转化为字符串 */
        toString(): string {
            return `(a=${this.a}, b=${this.b}, c=${this.c}, d=${this.d}, tx=${this.tx}, ty=${this.ty})`;
        }

        /** 恒等矩阵 */
        identity(): void {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
        }

        /** 逆转换 */
        invert(): void {
            this.$invertInto(this);
        }
        protected $invertInto(target: Matrix): void {
            let a = this.a, b = this.b;
            let c = this.c, d = this.d;
            let tx = this.tx, ty = this.ty;
            if (b == 0 && c == 0) {
                target.b = target.c = 0;
                if (a == 0 || d == 0) {
                    target.a = target.d = target.tx = target.ty = 0;
                } else {
                    a = target.a = 1 / a;
                    d = target.d = 1 / d;
                    target.tx = -a * tx;
                    target.ty = -d * ty;
                }
                return;
            }

            let determinant = a * d - b * c; // 行列式
            if (determinant == 0) {
                target.identity();
                return;
            }
            determinant = 1 / determinant;
            let k = target.a = d * determinant;
            b = target.b = -b * determinant;
            c = target.c = -c * determinant;
            d = target.d = a * determinant;
            target.tx = -(k * tx + c * ty);
            target.ty = -(b * tx + d * ty);
        }

        /** 旋转变换 */
        rotate(radian: number): void {
            if (radian !== 0) {
                let angle = radian2Angle(radian);
                let cos = cos(angle);
                let sin = sin(angle);
                let a = this.a;
                let b = this.b;
                let c = this.c;
                let d = this.d;
                let tx = this.tx;
                let ty = this.ty;
                this.a = a * cos - b * sin;
                this.b = a * sin + b * cos;
                this.c = c * cos - d * sin;
                this.d = c * sin + d * cos;
                this.tx = tx * cos - ty * sin;
                this.ty = tx * sin + ty * cos;
            }
        }

        /** 缩放变换 */
        scale(sx: number, sy: number): void {
            if (sx !== 1) {
                this.a *= sx; this.c *= sx; this.tx *= sx;
            }
            if (sy !== 1) {
                this.b *= sy; this.d *= sy; this.ty *= sy;
            }
        }

        /** 平移变换 */
        translate(dx: number, dy: number): void {
            this.tx += dx;
            this.ty += dy;
        }

        /** 连接矩阵（矩阵相乘，即多个变换叠加） */
        concat(matrix: Matrix): void {
            let a = this.a * matrix.a;
            let b = 0.0;
            let c = 0.0;
            let d = this.d * matrix.d;
            let tx = this.tx * matrix.a + matrix.tx;
            let ty = this.ty * matrix.d + matrix.ty;

            if (this.b !== 0.0 || this.c !== 0.0 || matrix.b !== 0.0 || matrix.c !== 0.0) {
                a += this.b * matrix.c;
                d += this.c * matrix.b;
                b += this.a * matrix.b + this.b * matrix.d;
                c += this.c * matrix.a + this.d * matrix.c;
                tx += this.ty * matrix.c;
                ty += this.tx * matrix.b;
            }

            this.a = a; this.b = b;
            this.c = c; this.d = d;
            this.tx = tx; this.ty = ty;
        }

        /** 行列式 */
        get determinant(): number {
            return this.a * this.d - this.b * this.c;
        }

        /** 横向缩放值 */
        get scaleX(): number {
            if (this.b == 0) {
                return this.a;
            }
            let result = Math.sqrt(this.a * this.a + this.b * this.b);
            return this.determinant < 0 ? -result : result;
        }

        /** 纵向缩放值 */
        get scaleY(): number {
            if (this.c == 0) {
                return this.d;
            }
            let result = Math.sqrt(this.c * this.c + this.d * this.d);
            return this.determinant < 0 ? -result : result;
        }

        /** 横向倾斜值 */
        get skewX(): number {
            if (this.d < 0) {
                return Math.atan2(this.d, this.c) + HalfPI;
            }
            return Math.atan2(this.d, this.c) - HalfPI;
        }

        /** 纵向倾斜值 */
        get skewY(): number {
            if (this.a < 0) {
                return Math.atan2(this.b, this.a) - PI;
            }
            return Math.atan2(this.b, this.a);
        }

        /** 点变换 */
        transformPoint(x: number, y: number, result?: Point): Point {
            let $x = this.a * x + this.c * y + this.tx;
            let $y = this.b * x + this.d * y + this.ty;
            if (result) {
                return result.setTo($x, $y);
            }
            return new Point($x, $y);
        }

        /** 通过对象池创建*/
        static create(): Matrix {
            return $pool.pop() || new Matrix();
        }

        /** 释放对象至对象池 */
        static release(matrix: Matrix): void {
            if (!matrix) return;
            $pool.push(matrix);
        }
    }

    // 仅供框架内部使用
    export let $TempMatrix = new Matrix();
}