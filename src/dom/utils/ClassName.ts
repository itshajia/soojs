namespace Soo.dom {

    // 获取className列表
    export function getClassNames(el: HTMLElement): string[] {
        let className = attr(el, "class");
        if (!className) return [];
        return className.split(" ") || [];
    }

    /** 是否存在className */
    export function hasClass(el: HTMLElement, className: string): boolean {
        if (!el) return false;
        return new RegExp("(^|\\s)"+ className +"(\\s|$)").test(el.className);
    }

    /** 添加className */
    export function addClass(el: HTMLElement, value: string): void {
        let values = value.split(" ");
        if (values && values.length) {
            let $classNames = getClassNames(el);
            for (let i = 0, len = values.length; i < len; i++) {
                if (!inArray(values[i], $classNames)) {
                    $classNames.push(values[i]);
                }
            }
            attr(el, "class", $classNames.join("" ));
        }
    }

    /** 删除className */
    export function removeClass(el: HTMLElement, value: string): void {
        let values = value.split(" ");
        if (values && values.length) {
            let $classNames = getClassNames(el);
            let result = [];
            for (let i = 0, len = $classNames.length; i < len; i++) {
                if (!inArray($classNames[i], values)) {
                    result.push($classNames[i]);
                }
            }
            if (result.length) {
                attr(el, "class", result.join(" "));
            } else {
                removeAttr(el, "class");
            }
        }
    }
}