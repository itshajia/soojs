namespace Soo.dom {
    export let $EVENT_ADD_TO_DOM_STAGE_LIST: DOMElement[] = [];
    export let $EVENT_REMOVE_FROM_DOM_STAGE_LIST: DOMElement[] = [];

    // dom显示对象
    export class DOMElement extends $DisplayObject {
        constructor(element: string | HTMLElement) {
            super();

            if (isString(element)) {
                this.$el = createElement(element as string);
            } else {
                this.$el = element as HTMLElement;
            }
            let el: HTMLElement = this.$el;
            let container = this.$childrenContainer = findOne(el, "[container]");
            el.style.position = "absolute"; // 为了通过x,y坐标来定位，这里需要设置为绝对定位
            if (container) {
                container.style.position = "absolute";
            }
        }

        /** 真实dom元素 */
        $el: HTMLElement;
        get element(): HTMLElement {
            return this.$el;
        }
        /** 子节点容器节点 */
        $childrenContainer: HTMLElement;
        get childrenContainer(): HTMLElement {
            return this.$childrenContainer || this.$el;
        }

        /** 父级 */
        $parent: DOMContainer = null;
        get parent(): DOMContainer {
            return this.$parent;
        }
        $setParent(parent: DOMContainer): boolean {
            if (parent == this.$parent) {
                return false;
            }

            if (parent) {
                this.$parent = parent;
                append(parent.childrenContainer, this.$el);
            } else {
                this.$parent = null;
                remove(this.$el);
            }
            return true;
        }

        /** 防止重复行为 */
        $hasAddToStage: boolean = false;
        /** 显示对象添加到舞台 */
        $onAddToStage(stage: DOMStage, nestLevel: number): void {
            this.$stage = stage;
            this.$nestLevel = nestLevel;
            this.$hasAddToStage = true;
            $EVENT_ADD_TO_DOM_STAGE_LIST.push(this);
        }

        /** 显示对象移除舞台 */
        $onRemoveFromStage(): void {
            this.$nestLevel = 0;
            $EVENT_REMOVE_FROM_DOM_STAGE_LIST.push(this);
        }

        /** 在显示列表中的嵌套深度（舞台为1，舞台的子项为2...如果对象不在显示列表中时值为0） */
        protected $nestLevel: number = 0;

        /** 舞台 */
        $stage: DOMStage = null;
        get stage(): DOMStage {
            return this.$stage;
        }

        /** 禁用属性 */
        private $disabled: boolean = true;
        get disabled(): boolean {
            return this.$disabled;
        }

        /** 启用 */
        enable(): DOMElement {
            if (this.$disabled) {
                this.$disabled = false;
                removeClass(this.$el, "disabled");

                if (this.$touchEnabled) {

                } else {

                }
            }
            return this;
        }

        /** 禁用 */
        disable(): DOMElement {
            if (!this.$disabled) {
                this.$disabled = true;
                addClass(this.$el, "disabled");

                if (this.$touchEnabled) {

                } else {

                }
            }
            return this;
        }

        /** 是否可见 */
        private $visible: boolean = true;
        get visible(): boolean {
            return this.$visible;
        }
        set visible(value: boolean) {
            if (value === this.$visible) {
                return;
            }

            this.$visible = value;
            attr(this.$el, "display", value ? "block" : "none");
        }

        /** 是否激活 */
        private $activated: boolean = false;
        get activated(): boolean {
            return this.$activated;
        }

        /** 激活 */
        activate(): DOMElement {
            if (!this.$activated && !this.$disabled) {
                this.$activated = true;
                addClass(this.$el, "active");
            }
            return this;
        }

        /** 取消激活 */
        deactivate(): DOMElement {
            if (this.$activated && !this.$disabled) {
                this.$activated = false;
                removeClass(this.$el, "active");
            }
            return this;
        }

        /** style */
        style(key?: string, value?: string): any {
            let $style = this.$el.style;
            if (!key) {
                return $style;
            }
            if (!value) {
                return $style[key];
            }

            // 设置属性
            $style[key] = value;
        }


    }
}

namespace Soo {
    export let DOMElement = dom.DOMElement;
}