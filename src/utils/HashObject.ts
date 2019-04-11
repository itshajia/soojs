namespace Soo {

    // 哈希计数
    let $hashCode: number = 1;

    // 哈希对象
    export class HashObject {
        constructor() {
            this.$hashCode = $hashCode++;
        }

        /** 哈希计数 */
        $hashCode: number;
        get hashCode(): number {
            return this.$hashCode;
        }
    }
}