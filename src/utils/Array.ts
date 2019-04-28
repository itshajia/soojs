namespace Soo {
    let nativeKeys = Object.keys;

    /** 是否存在于数组中 */
    export function inArray(item: any, items: any[]): boolean {
        return items == null ? false : ([].indexOf.call( items, item ) != -1);
    }

    /** 返回数组唯一值 */
    export function unique(array: any[]): any[] {
        let result = [];
        for (let i = 0, len = array.length; i < len; i++) {
            if (!inArray(array[i], result)) {
                result.push(array[i]);
            }
        }
        return result;
    }

    /** 返回对象属性名集合 */
    export function keys(obj: any): string[] {
        if (!isObject(obj)) {
            return [];
        }
        if (nativeKeys) {
            return nativeKeys(obj);
        }
        let keys = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
    }
}