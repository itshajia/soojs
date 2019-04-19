namespace Soo {
    // 多语言
    export let $locale_strings: any = {};
    let $default_language: string = "zh_CN";
    let $language: string = $default_language;
    let $langs: string[] = ["zh", "zh_CN", "en", "en_US"];

    /** 设置语言版本 */
    export function language(value: string): string {
        let index = $langs.indexOf(value);
        if (index == -1) {
            value = $default_language;
        }
        switch (value) {
            case "zh":
                value = "zh_CN";
                break;
            case "en":
                value = "en_US";
                break;
        }
        $language = value;
        return value;
    }

    /** 多语言翻译 */
    export function lang(code: number, ...args): string {
        let text = $locale_strings[$language][code];
        if (!text) {
            return `{${code}}`;
        }
        for (let i = 0, len = args.length; i < len; i++) {
            text = text.replace(`{${i}}`, args[i]);
        }
        return text;
    }
}