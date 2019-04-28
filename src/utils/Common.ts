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

    // 多类继承混合
    export function applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            });
        });
    }
}