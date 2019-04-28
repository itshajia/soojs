namespace Soo.dom {
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
}