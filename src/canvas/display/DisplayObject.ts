namespace Soo.canvas {
    import Matrix = Soo.math.Matrix;
    import clampRotation = Soo.math.clampRotation;
    import angle2Radian = Soo.math.angle2Radian;
    import radian2Angle = Soo.math.radian2Angle;
    import Rectangle = Soo.math.Rectangle;
    export let $EVENT_ADD_TO_STAGE_LIST: DisplayObject[] = [];
    export let $EVENT_REMOVE_FROM_STAGE_LIST: DisplayObject[] = [];

    // 显示对象失效标志
    export const enum DisplayObjectFlags {
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
        AddedOrRemoved = DisplayObjectFlags.DirtyConcatenatedMatrix |
            DisplayObjectFlags.DirtyInvertedConcatenatedMatrix |
            DisplayObjectFlags.DirtyConcatenatedAlpha |
            DisplayObjectFlags.DirtyConcatenatedVisible |
            DisplayObjectFlags.DirtyChildren,

        /** 初始化的标志量 */
        InitFlags = DisplayObjectFlags.DirtyConcatenatedMatrix |
            DisplayObjectFlags.DirtyInvertedConcatenatedMatrix |
            DisplayObjectFlags.DirtyConcatenatedAlpha |
            DisplayObjectFlags.DirtyConcatenatedVisible |
            DisplayObjectFlags.DirtyRenderNodes |
            DisplayObjectFlags.Dirty
    }

    // 显示对象
    export class DisplayObject extends EventDispatcher {
        constructor() {
            super();
            this.$displayFlags = DisplayObjectFlags.InitFlags;
        }

        protected $displayFlags: DisplayObjectFlags;
        /** 是否包含多个标志量的其中之一 */
        protected $hasAnyFlags(flags: DisplayObjectFlags): boolean {
            return !!(this.$displayFlags & flags);
        }
        /** 是否含有指定的标志量 */
        protected $hasFlags(flags: DisplayObjectFlags): boolean {
            return (this.$displayFlags & flags) == flags;
        }

        protected $setFlags(flags: DisplayObjectFlags): void {
            this.$displayFlags |= flags;
        }
        protected $removeFlags(flags: DisplayObjectFlags): void {
            this.$displayFlags &= ~flags;
        }

        /** 沿着显示列表向上移除标志量，如果标志量没被设置过就停止删除 */
        protected $removeFlagsUp(flags: DisplayObjectFlags): void {
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
        protected $setFlagsUp(flags: DisplayObjectFlags): void {
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
        protected $setFlagsDown(flags: DisplayObjectFlags): void {
            this.$setFlags(flags);
        }

        /** 包含此显示对象的容器 */
        private $parent: Container = null;
        get parent(): Container {
            return this.$parent;
        }
        $setParent(parent: Container): void {
            this.$parent = parent;
        }

        /** 防止重复行为 */
        private $hasAddToStage: boolean = false;
        /** 显示对象添加到舞台 */
        protected $onAddToStage(stage: Stage, nestLevel: number): void {
            this.$stage = stage;
            this.$nestLevel = nestLevel;
            this.$hasAddToStage = true;
            $EVENT_ADD_TO_STAGE_LIST.push(this);
        }

        /** 显示对象移除舞台 */
        protected $onRemoveFromStage(): void {
            this.$nestLevel = 0;
            $EVENT_REMOVE_FROM_STAGE_LIST.push(this);
        }

        /** 在显示列表中的嵌套深度（舞台为1，舞台的子项为2...如果对象不在显示列表中时值为0） */
        protected $nestLevel: number = 0;

        /** 舞台 */
        protected $stage: Stage = null;
        get stage(): Stage {
            return this.$stage;
        }

        /** 标记绘图失效，需要重新绘制 */
        protected $dirtyRender(notifyChildren?: boolean): void {

        }

        /** 标记变换叠加的显示内容失效 */
        protected $dirtyTransform(): void {

        }

        /** 标记自身内容尺寸失效 */
        protected $dirtyContentBounds(): void {}

        /** 标记矩阵失效 */
        protected $dirtyMatrix(): void {

        }
        /** 标记位置发生改变 */
        protected $dirtyPosition(): void {

        }

        /** 显示对象矩阵 */
        private $matrix: Matrix = new Matrix();
        get matrix(): Matrix {
            return this.$getMatrix().clone();
        }
        $getMatrix(): Matrix {
            if (this.$hasFlags(DisplayObjectFlags.DirtyMatrix)) {
                this.$matrix.$updateScaleAndRotation(this.$scaleX, this.$scaleY, this.$skewX, this.$skewY);
                this.$removeFlags(DisplayObjectFlags.DirtyMatrix);
            }
            return this.$matrix;
        }
        set matrix(value: Matrix) {
            this.$setMatrix(value);
        }
        $setMatrix(matrix: Matrix, needUpdateProperties: boolean = true): boolean {
            let m = this.$matrix;
            if (m.equals(matrix)) {
                return false;
            }
            m.copyFrom(matrix);
            if (needUpdateProperties) {
                this.$scaleX = m.scaleX;
                this.$scaleY = m.scaleY;
                this.$skewX = m.skewX;
                this.$skewY = m.skewY;
                this.$skewXDeg = clampRotation(radian2Angle(this.$skewX));
                this.$skewYDeg = clampRotation(radian2Angle(this.$skewY));
                this.$rotation = clampRotation(radian2Angle(this.$skewY));
            }
            this.$removeFlags(DisplayObjectFlags.DirtyMatrix);
            // TODO
            return true;
        }

        /** 显示对象以及它所有父级对象的连接矩阵 */
        private $concatenatedMatrix: Matrix;
        $getConcatenatedMatrix(): Matrix {

        }

        /** 显示对象以及它所有父级对象的连接逆向矩阵 */
        private $invertedConcatenatedMatrix: Matrix;
        $getInvertedConcatenatedMatrix(): Matrix {

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
            this.$dirtyMatrix();
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
            this.$dirtyMatrix();
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
            this.$dirtyMatrix();
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
            this.$dirtyMatrix();
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
            this.$dirtyMatrix();
            return true;
        }

        /** 横向绝对锚点 */
        protected $anchorOffsetX: number = 0;
        get anchorOffsetX(): number {
            return this.$anchorOffsetX;
        }
        set anchorOffsetX(value: number) {
            this.$setAnchorOffsetX(value);
        }
        $setAnchorOffsetX(value: number): boolean {
            value = +value || 0;
            if (value == this.$anchorOffsetX) {
                return false;
            }
            this.$anchorOffsetX = value;
            this.$dirtyPosition();
            return true;
        }

        /** 纵向绝对锚点 */
        protected $anchorOffsetY: number = 0;
        get anchorOffsetY(): number {
            return this.$anchorOffsetY;
        }
        set anchorOffsetY(value: number) {
            this.$setAnchorOffsetY(value);
        }
        $setAnchorOffsetY(value: number): boolean {
            value = +value || 0;
            if (value == this.$anchorOffsetY) {
                return false;
            }
            this.$anchorOffsetY = value;
            this.$dirtyPosition();
            return true;
        }

        /** 是否可见 */
        protected $visible: boolean = true;
        get visible(): boolean {
            return this.$visible;
        }
        set visible(value: boolean) {
            this.$setVisible(value);
        }
        $setVisible(value: boolean): boolean {
            if (value == this.$visible) {
                return false;
            }
            this.$visible = value;
            this.$dirtyTransform();
            return true;
        }

        private $concatenatedVisible: boolean;
        $getConcatenatedVisible(): boolean {
            if (this.$hasFlags(DisplayObjectFlags.DirtyConcatenatedVisible)) {
                if (this.$parent) {
                    this.$concatenatedVisible = this.$parent.$getConcatenatedVisible() && this.$visible;
                } else {
                    this.$concatenatedVisible = this.$visible;
                }
            }
            return this.$concatenatedVisible;
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
            this.$setFlagsDown(DisplayObjectFlags.DirtyConcatenatedAlpha);
            this.$dirtyRender();
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

        /** 背景透明区域是否可以穿透 */
        protected $touchThrough: boolean = false;
        get touchThrough(): boolean {
            return this.$touchThrough;
        }
        set touchThrough(value: boolean) {
            if (this.$touchThrough == value) {
                return;
            }
            this.$touchThrough = value;
        }

        /** 遮罩层 */
        protected $mask: DisplayObject = null;
        protected $maskRect: Rectangle = null;
        /** 被遮罩的目标 */
        private $maskedTarget: DisplayObject = null;
        get mask(): DisplayObject | Rectangle {
            return this.$mask || this.$maskRect;
        }
        set mask(value: DisplayObject | Rectangle) {
            if (value === this) {
                return;
            }
            if (value) {
                if (value instanceof DisplayObject) {
                    if (value === this.$mask) {
                        return;
                    }
                    if (value.$maskedTarget) { // 一个遮罩层对象只能在一个显示对象上生效
                        value.$maskedTarget.mask = null;
                    }
                    value.$maskedTarget = this;
                    // TODO
                    this.$mask = value;
                    this.$maskRect = null;
                } else {
                    this.$setMaskRect(<Rectangle>value);
                    if (this.$mask) {
                        this.$mask.$maskedTarget = null;
                        // TODO
                    }
                    this.$mask = null;
                }
            } else {
                if (this.$mask) {
                    this.$mask.$maskedTarget = null;
                    // TODO
                }
                this.$mask = null;
                this.$maskRect = null;
            }
            // TODO
        }
        private $setMaskRect(value: Rectangle): boolean {
            if (!value && !this.$maskRect) {
                return false;
            }
            if (value) {
                if (!this.$maskRect) {
                    this.$maskRect = new Rectangle();
                }
                this.$maskRect.copyFrom(value);
            } else {
                this.$maskRect = null;
            }
            // TODO
            return true;
        }
    }
    
}