namespace Soo {


    /** 合并对象属性 */
    export function extend(target: Object, ...objects: Object[]): Object {
        for (let i = 0, len = objects.length; i < len; i++) {
            let object = objects[i];
            for (let key in object) {
                if (object[key] != undefined) {
                    target[key] = object[key];
                }
            }
        }
        return target;
    }
}