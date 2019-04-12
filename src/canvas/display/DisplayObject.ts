namespace Soo.canvas {
    import Matrix = Soo.math.Matrix;
    export let $EVENT_ADD_TO_STAGE_LIST: DisplayObject[] = [];
    export let $EVENT_REMOVE_FROM_STAGE_LIST: DisplayObject[] = [];

    // 显示对象失效标志
    export const enum DisplayObjectFlags {
        /** 自身绘制区域尺寸失效 */
        InvalidContentBounds = 0x0002,

        /** 矩形区域失效（包含自身绘制区域和子项的区域） */
        InvalidBounds = 0x0004,

        /** 矩阵属性失效标志 */
        InvalidMatrix = 0x0008,

        /** 上级矩阵失效 */
        InvalidConcatenatedMatrix = 0x0010,

        /** 上级逆矩阵失效 */
        InvalidInvertedConcatenatedMatrix = 0x0020,

        /** 上级透明度属性失效 */
        InvalidConcatenatedAlpha = 0x0040
    }

    // 显示对象
    export class DisplayObject extends EventDispatcher {
        constructor() {
            super();
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

        /** 沿着显示列表向上传递标志量，如果已经被设置过了就停止传递 */
        protected $propagateFlagsUp(flags: DisplayObjectFlags): void {
            if (this.$hasFlags(flags)) {
                return;
            }
            this.$setFlags(flags);
            let parent = this.$parent;
            if (parent) {
                parent.$propagateFlagsUp(flags);
            }
        }

        /** 沿着显示列表乡下传递标志量 */
        protected $propagateFlagsDown(flags: DisplayObjectFlags): void {
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

        /** 显示对象矩阵 */
        private $matrix: Matrix = new Matrix();
        get matrix(): Matrix {
            return this.$getMatrix().clone();
        }
        $getMatrix(): Matrix {
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

            }
            return true;
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


        /** 标记矩阵失效 */
        protected $invalidateMatrix(): void {

        }
        /** 标记位置发生改变 */
        protected $invalidatePosition(): void {

        }
    }
    
}