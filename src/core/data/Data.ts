namespace Soo {

    // 数据对象
    export class Data extends HashObject {
        /** 缓存数据 */
        cache(owner: HashObject): any {
            let value = owner[this.$hashCode];
            if (!value) {
                value = {};
                owner[this.$hashCode] = value;
            }
            return value;
        }

        /** 存储数据 */
        set(owner: HashObject, key: string, value: any): any {
            let cache = this.cache(owner);
            cache[key] = value;
            return cache;
        }

        /** 获取数据 */
        get(owner: HashObject, key?: string): any {
            return key === undefined ?
                this.cache(owner) :
                owner[this.$hashCode] && owner[this.$hashCode][key];
        }

        /** 是否存在缓存数据 */
        hasData(owner: HashObject): boolean {
            let cache = owner[this.$hashCode];
            return cache !== undefined && !isEmptyObject(cache);
        }
    }
}