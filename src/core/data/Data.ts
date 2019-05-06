namespace Soo {

    // 数据对象
    export class Data extends HashObject {
        constructor() {
            super();
            this.$id = `data-${this.$hashCode}` ;
        }

        private $id: string;

        /** 缓存数据 */
        cache(owner: HashObject): any {
            let value = owner[this.$id];
            if (!value) {
                value = {};
                owner[this.$id] = value;
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
                owner[this.$id] && owner[this.$id][key];
        }

        /** 移除 */
        remove(owner: HashObject, key?: string): void {
            let cache = owner[this.$id];
            if (!cache) {
                return;
            }

            if (key) {
                delete cache[key];
            } else {
                delete owner[this.$id];
            }
        }

        /** 是否存在缓存数据 */
        hasData(owner: HashObject): boolean {
            let cache = owner[this.$id];
            return cache !== undefined && !isEmptyObject(cache);
        }
    }
}