namespace Soo {
    declare let Symbol: any;
    let nativeIsArray = Array.isArray;

    function $typeof(obj: any): string {
        let $$typeof;
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            $$typeof = function (obj) {
                return typeof obj;
            };
        } else {
            $$typeof = function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
        }

        return $$typeof(obj);
    }

    /** 是否为NULL */
    export function isNull(val: any): boolean {
        return val === null;
    }

    /** 是否为undefined */
    export function isUndefined(val: any): boolean {
        return val === void 0;
    }

    /** 是否为NULL OR Undefined */
    export function isNil(val: any): boolean {
        return val === null || val === void 0;
    }

    /** 是否为function */
    export function isFunction(val: any): boolean {
        return typeof val === 'function';
    }

    /** 是否为空的方法体 */
    export function isEmptyFunction(fun: Function): boolean {
        let body = fun.toString();
        let index = body.indexOf("{");
        let lastIndex = body.lastIndexOf("}");
        body = body.substring(index + 1, lastIndex);
        return body.trim() === "";
    }

    /** 是否为object */
    export function isObject(obj: any): boolean {
        return obj === Object(obj);
    }

    /** 对象是否为空对象 */
    export function isEmptyObject(obj: Object): boolean {
        for (let key in obj ) {
            return false;
        }
        return true;
    }

    /** 是否为字符串 */
    export function isString(val: any): boolean {
        return typeof val === 'string';
    }

    /** 是否为数字 */
    export function isNumber(val: any): boolean {
        return typeof val === 'number' && val === val;
    }

    /** 是否为数组 */
    export function isArray(val: any): boolean {
        return nativeIsArray(val) || toString.call(val) === '[object Array]';
    }

    /** 是否为偶数 */
    export function isEven(num: number): boolean {
        return num % 2 === 0;
    }

    /** 是否为空 */
    export function isEmpty(val: any): boolean {
        return val == null || !(keys(val) || val).length;
    }

    /** 验证json */
    export function isValidJSON(str: string): boolean {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
}