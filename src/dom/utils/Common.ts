namespace Soo.dom {
    import Point = Soo.math.Point;
    let doc = document;

    /** 创建dom */
    export function createElement(content: string): HTMLElement {
        let parent = doc.createElement("div");
        parent.innerHTML = content;
        let child = parent.childNodes[0] as HTMLElement;
        if (child) {
            parent.removeChild(child);
        }
        return child;
    }

    /** 添加dom */
    export function append(parent: HTMLElement, child: HTMLElement): HTMLElement {
        if (parent && child) {
            parent.appendChild(child);
        }
        return child;
    }

    /** 移除dom */
    export function remove(child: HTMLElement): HTMLElement {
        if (child && child.parentNode) {
            child.parentNode.removeChild(child);
        }
        return child;
    }

    /** 获取dom元素 */
    export function get(el: string): HTMLElement {
        if (!el) return;
        return doc.getElementById(el);
    }

    /** 上下文中寻找单个dom */
    export function findOne(context: HTMLElement, query: string): HTMLElement {
        if (context && context.querySelector) {
            return context.querySelector(query) as HTMLElement;
        }
    }

    /** 设置dom属性 */
    export function attr(el: HTMLElement, key: string, value?: any): any {
        if (!el) return;
        if (value) {
            el.setAttribute(key, value);
        } else {
            return el.getAttribute(key);
        }
    }

    /** 移除dom属性 */
    export function removeAttr(el: HTMLElement, key: string): void {
        if (el) {
            el.removeAttribute(key);
        }
    }

    /** 将页面坐标转换为元素的本地坐标 */
    export function getLocalPointFromPage(element: HTMLElement, pageX: number = 0, pageY: number = 0): Point {
        if (!element) {
            return;
        }
        let bounds = element.getBoundingClientRect();
        let clientX = pageX - bounds.left - window.pageXOffset;
        let clientY = pageY - bounds.top - window.pageYOffset;
        return Point.create(clientX, clientY);
    }

    /** 阻止事件行为 */
    export function preventEvent(e: any): boolean {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }
}