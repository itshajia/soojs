namespace Soo {
    import angle2Radian = Soo.math.angle2Radian;
    import clampRotation = Soo.math.clampRotation;
    import Matrix = Soo.math.Matrix;
    import Rectangle = Soo.math.Rectangle;

    // 显示对象失效标志
    export const enum $DisplayObjectFlags {
        /** 自身绘制区域尺寸失效 */
        DirtyContentBounds = 0x0002, // 10

        /** 矩形区域失效（包含自身绘制区域和子项的区域） */
        DirtyBounds = 0x0004, // 100

        /** 矩阵属性失效标志 */
        DirtyMatrix = 0x0008, // 1000

        /** 上级矩阵失效 */
        DirtyConcatenatedMatrix = 0x0010, // 10000

        /** 上级逆矩阵失效 */
        DirtyInvertedConcatenatedMatrix = 0x0020, // 100000

        /** 上级透明度属性失效 */
        DirtyConcatenatedAlpha = 0x0040, // 1000000

        /** 上级可见属性失效 */
        DirtyConcatenatedVisible = 0x0080,

        /** DrawData失效 */
        DirtyRenderNodes = 0x0100,

        /** 自身重新绘制 */
        DirtyRender = 0x200,

        /** 重绘所有子项 */
        DirtyChildren = 0x400,

        Dirty = DirtyRender | DirtyChildren,

        /** 添加或删除时的标志量（只影响子项，需向子项传递标志） */
        AddedOrRemoved = $DisplayObjectFlags.DirtyConcatenatedMatrix |
            $DisplayObjectFlags.DirtyInvertedConcatenatedMatrix |
            $DisplayObjectFlags.DirtyConcatenatedAlpha |
            $DisplayObjectFlags.DirtyConcatenatedVisible |
            $DisplayObjectFlags.DirtyChildren,

        /** 初始化的标志量 */
        InitFlags = $DisplayObjectFlags.DirtyConcatenatedMatrix |
            $DisplayObjectFlags.DirtyInvertedConcatenatedMatrix |
            $DisplayObjectFlags.DirtyConcatenatedAlpha |
            $DisplayObjectFlags.DirtyConcatenatedVisible |
            $DisplayObjectFlags.DirtyRenderNodes |
            $DisplayObjectFlags.Dirty
    }

    // 显示对象抽象类
    export abstract class $DisplayObject extends EventDispatcher {
        constructor() {
            super();
        }

        protected $displayFlags: $DisplayObjectFlags;
        /** 是否包含多个标志量的其中之一 */
        protected $hasAnyFlags(flags: $DisplayObjectFlags): boolean {
            return !!(this.$displayFlags & flags);
        }
        /** 是否含有指定的标志量 */
        protected $hasFlags(flags: $DisplayObjectFlags): boolean {
            return (this.$displayFlags & flags) == flags;
        }

        protected $setFlags(flags: $DisplayObjectFlags): void {
            this.$displayFlags |= flags;
        }
        protected $removeFlags(flags: $DisplayObjectFlags): void {
            this.$displayFlags &= ~flags;
        }

        /** 沿着显示列表向上移除标志量，如果标志量没被设置过就停止删除 */
        protected $removeFlagsUp(flags: $DisplayObjectFlags): void {
            if (!this.$hasAnyFlags(flags)) {
                return;
            }
            this.$removeFlags(flags);
            let parent = this.$parent;
            if (parent) {
                parent.$removeFlagsUp(flags);
            }
        }

        /** 沿着显示列表向上设置标志量，如果已经被设置过了就停止传递 */
        protected $setFlagsUp(flags: $DisplayObjectFlags): void {
            if (this.$hasFlags(flags)) {
                return;
            }
            this.$setFlags(flags);
            let parent = this.$parent;
            if (parent) {
                parent.$setFlagsUp(flags);
            }
        }

        /** 沿着显示列表向下传递设置标志量 */
        $setFlagsDown(flags: $DisplayObjectFlags): void {
            this.$setFlags(flags);
        }

        /** 父级 */
        $parent: $Container = null;
        get parent(): $Container {
            return this.$parent;
        }
        $setParent(parent: $Container): boolean {
            return;
        }

        /** 显示对象矩阵 */
        private $matrix: Matrix = new Matrix();
        get matrix(): Matrix {
            return this.$getMatrix();
        }
        $getMatrix(): Matrix {
            return this.$matrix;
        }
        set matrix(value: Matrix) {
            this.$setMatrix(value);
        }
        $setMatrix(matrix: Matrix): boolean {
            return;
        }

        /** X坐标 */
        get x(): number {
            return this.$getX();
        }
        $getX(): number {
            return this.$matrix.tx;
        }
        set x(value: number) {
            this.$setX(value);
        }
        $setX(value: number): boolean {
            value = +value || 0;
            let m = this.$matrix;
            if (value == m.tx) {
                return false;
            }
            m.tx = value;
            return true;
        }

        /** Y坐标 */
        get y(): number {
            return this.$getY();
        }
        $getY(): number {
            return this.$matrix.ty;
        }
        set y(value: number) {
            this.$setY(value);
        }
        $setY(value: number): boolean {
            value = +value || 0;
            let m = this.$matrix;
            if (value == m.ty) {
                return false;
            }
            m.ty = value;
            return true;
        }

        /** 水平缩放值 */
        private $scaleX: number = 1;
        get scaleX(): number {
            return this.$getScaleX();
        }
        $getScaleX(): number {
            return this.$scaleX;
        }
        set scaleX(value: number) {
            this.$setScaleX(value);
        }
        $setScaleX(value: number): boolean {
            value = +value || 0;
            if (this.$scaleX == value) {
                return false;
            }
            this.$scaleX = value;
            return true;
        }

        /** 垂直缩放值 */
        private $scaleY: number = 1;
        get scaleY(): number {
            return this.$getScaleY();
        }
        $getScaleY(): number {
            return this.$scaleY;
        }
        set scaleY(value: number) {
            this.$setScaleY(value);
        }
        $setScaleY(value: number): boolean {
            if (this.$scaleY == value) {
                return false;
            }
            this.$scaleY = value;
            return true;
        }

        /** 水平斜切值 */
        private $skewX: number = 0;
        private $skewXDeg: number = 0;
        get skewX(): number {
            return this.$skewXDeg;
        }
        set skewX(angle: number) {
            this.$setSkewX(angle);
        }
        $setSkewX(angle: number): boolean {
            angle = +angle || 0;
            if (angle == this.$skewXDeg) {
                return false;
            }
            this.$skewXDeg = angle;
            angle = clampRotation(angle);
            this.$skewX = angle2Radian(angle);
            return true;
        }

        /** 垂直斜切值 */
        private $skewY: number = 0;
        private $skewYDeg: number = 0;
        get skewY(): number {
            return this.$skewYDeg;
        }
        set skewY(angle: number) {
            this.$setSkewY(angle);
        }
        $setSkewY(angle: number): boolean {
            angle = +angle || 0;
            if (angle == this.$skewYDeg) {
                return false;
            }
            this.$skewYDeg = angle;
            angle = clampRotation(angle);
            this.$skewY = angle2Radian(angle);
            return true;
        }

        /** 旋转角度 */
        private $rotation: number = 0;
        get rotation(): number {
            return this.$getRotation();
        }
        $getRotation(): number {
            return this.$rotation;
        }
        set rotation(angle: number) {
            this.$setRotation(angle);
        }
        $setRotation(angle: number): boolean {
            angle = clampRotation(+angle || 0);
            if (angle == this.$rotation) {
                return false;
            }
            let delta = angle - this.$rotation;
            let radian = angle2Radian(delta);
            this.$skewX += radian;
            this.$skewY += radian;
            this.$rotation = angle;
            return true;
        }

        /** 透明度 */
        protected $alpha: number = 1;
        get alpha(): number {
            return this.$alpha;
        }
        set alpha(value: number) {
            this.$setAlpha(value);
        }
        $setAlpha(value: number): boolean {
            value = +value || 0;
            if (value == this.$alpha) {
                return false;
            }
            this.$alpha = value;
            return true;
        }

        /** 是否可操作 */
        protected $touchEnabled: boolean = false;
        get touchEnabled(): boolean {
            return this.$touchEnabled;
        }
        set touchEnabled(value: boolean) {
            if (this.$touchEnabled == value) {
                return;
            }
            this.$touchEnabled = value;
        }

        /** 是否包含在父级容器布局中 */
        protected $includeInLayout: boolean;
        get includeInLayout(): boolean {
            return this.$includeInLayout;
        }
        set includeInLayout(value: boolean) {
            if (value === this.$includeInLayout) {
                return;
            }
            this.$includeInLayout = value;
        }

        /** 宽度 */
        private $explicitWidth: number = NaN;
        get width(): number {
            return this.$getWidth();
        }
        $getWidth(): number {
            return isNaN(this.$explicitWidth) ? this.$getBounds().width : this.$explicitWidth;
        }
        set width(value: number) {

        }
        $setWidth(value: number): boolean {
            this.$explicitWidth = isNaN(value) ? NaN : value;
            value = +value;
            if (value < 0) {
                return false;
            }
            return true;
        }

        /** 高度 */
        private $explicitHeight: number = NaN;
        get height(): number {
            return this.$getHeight();
        }
        $getHeight(): number {
            return isNaN(this.$explicitHeight) ? this.$getBounds().height : this.$explicitHeight;
        }
        set height(value: number) {
            this.$setHeight(value);
        }
        $setHeight(value: number): boolean {
            this.$explicitHeight = isNaN(value) ? NaN : value;
            value = +value;
            if (value < 0) {
                return false;
            }
            return true;
        }

        /** 显示对象占用的矩形区域集合 */
        $bounds: Rectangle = new Rectangle();
        $getBounds(): Rectangle {
            let bounds = this.$bounds;
            if (this.$hasFlags($DisplayObjectFlags.DirtyBounds)) {
                bounds.copyFrom(this.$getContentBounds());
                this.$measureChildrenBounds(bounds); // 如果显示对象为容器，则测量子项占据内容真实有效
                this.$removeFlags($DisplayObjectFlags.DirtyBounds);
            }
            return bounds;
        }

        /** 自身内容区域 */
        $contentBounds: Rectangle = new Rectangle();
        $getContentBounds(): Rectangle {
            let bounds = this.$contentBounds;
            if (this.$hasFlags($DisplayObjectFlags.DirtyContentBounds)) {
                this.$measureContentBounds(bounds);
                this.$removeFlags($DisplayObjectFlags.DirtyContentBounds);
            }
            return bounds;
        }
        /** 测量自身内容区域 */
        $measureContentBounds(bounds: Rectangle): void {

        }
        /** 测量子项占用区域 */
        $measureChildrenBounds(bounds: Rectangle): void {

        }

        /** 测量宽度 */
        get measuredWidth(): number {
            return this.$getBounds().width;
        }
        /** 测量高度 */
        get measuredHeight(): number {
            return this.$getBounds().height;
        }
    }
}