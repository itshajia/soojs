namespace Soo {

    /** 是否存在于数组中 */
    export function inArray(item: any, items: any[]): boolean {
        return items == null ? false : ([].indexOf.call( items, item ) != -1);
    }

    /** 返回数组唯一值 */

}