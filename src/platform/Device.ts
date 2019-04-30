namespace Soo.device {

    // 设备功能模块（current-device）
    const USER_AGENT: string = window.navigator.userAgent.toLocaleLowerCase();
    const TELEVISION = [
        "googletv",
        "viera",
        "smarttv",
        "internet.tv",
        "netcast",
        "nettv",
        "appletv",
        "boxee",
        "kylo",
        "roku",
        "dlnadoc",
        "roku",
        "pov_tv",
        "hbbtv",
        "ce-html"
    ];

    let $ios: boolean = null;
    let $iphone: boolean = null;
    let $ipod: boolean = null;
    let $ipad: boolean = null;
    let $android: boolean = null;
    let $androidPhone: boolean = null;
    let $androidTablet: boolean = null;
    let $blackberry: boolean = null;
    let $blackberryPhone: boolean = null;
    let $blackberryTablet: boolean = null;
    let $windows: boolean = null;
    let $windowsPhone: boolean = null;
    let $windowsTablet: boolean = null;
    let $fxos: boolean = null;
    let $fxosPhone: boolean = null;
    let $fxosTablet: boolean = null;
    let $meego: boolean = null;
    let $cordova: boolean = null;
    let $nodeWebkit: boolean = null;
    let $mobile: boolean = null;
    let $tablet: boolean = null;
    let $desktop: boolean = null;
    let $television: boolean = null;


    function $find(value: string): boolean {
        return USER_AGENT.indexOf(value) !== -1;
    }



    // ios
    export function ios(): boolean {
        if ($ios !== null) {
            return $ios;
        }
        return $ios = $find("");
    }

    // iphone
    export function iphone(): boolean {
        if ($iphone !== null) {
            return $iphone;
        }
        return $iphone = (!windows() && $find("iphone"));
    }

    // ipod
    export function ipod(): boolean {
        if ($ipod !== null) {
            return $ipod;
        }
        return $ipod = $find("ipod");
    }

    // ipad
    export function ipad(): boolean {
        if ($ipad !== null) {
            return $ipad;
        }
        return $ipad = $find("ipad");
    }

    // android
    export function android(): boolean {
        if ($android !== null) {
            return $android;
        }
        return $android = (!windows() && $find("android"));
    }
    export function androidPhone(): boolean {
        if ($androidPhone !== null) {
            return $androidPhone;
        }
        return $androidPhone = (android() && $find("mobile"));
    }
    export function androidTablet(): boolean {
        if ($androidTablet !== null) {
            return $androidTablet;
        }
        return $androidTablet = (android() && !$find("mobile"));
    }

    // blackberry
    export function blackberry(): boolean {
        if ($blackberry !== null) {
            return $blackberry;
        }
        return $blackberry = ($find("blackberry") || $find("bb10") || $find("rim"));
    }
    export function blackberryPhone(): boolean {
        if ($blackberryPhone !== null) {
            return $blackberryPhone;
        }
        return $blackberryPhone = (blackberry() && !$find("table"));
    }
    export function blackberryTablet(): boolean {
        if ($blackberryTablet !== null) {
            return $blackberryTablet;
        }
        return $blackberryTablet = (blackberry() && $find("table"));
    }

    // windows
    export function windows(): boolean {
        if ($windows !== null) {
            return $windows;
        }
        return $windows = $find("windows");
    }
    export function windowsPhone(): boolean {
        if ($windowsPhone !== null) {
            return $windowsPhone;
        }
        return $windowsPhone = (windows() && $find("phone"));
    }
    export function windowsTablet(): boolean {
        if ($windowsTablet !== null) {
            return $windowsTablet;
        }
        return $windowsTablet = (windows() && ($find('touch') && !windowsPhone()));
    }

    // fxos
    export function fxos(): boolean {
        if ($fxos !== null) {
            return $fxos;
        }
        return $fxos = ($find('(mobile;') || $find('(tablet;')) && $find('; rv:');
    }
    export function fxosPhone(): boolean {
        if ($fxosPhone !== null) {
            return $fxosPhone;
        }
        return $fxosPhone = (fxos() && $find('mobile'));
    }
    export function fxosTablet(): boolean {
        if ($fxosTablet !== null) {
            return $fxosTablet;
        }
        return $fxosTablet = (fxos() && $find('tablet'));
    }

    // meego
    export function meego(): boolean {
        if ($meego !== null) {
            return $meego;
        }
        return $meego = $find("meego");
    }

    // cordova
    export function cordova(): boolean {
        if ($cordova !== null) {
            return $cordova;
        }
        return $cordova = $find("cordova");
    }

    // nodeWebkit
    export function nodeWebkit(): boolean {
        if ($nodeWebkit !== null) {
            return $nodeWebkit;
        }
        return $nodeWebkit = (typeof window["process"] === 'object');
    }

    // mobile
    export function mobile(): boolean {
        if ($mobile !== null) {
            return $mobile;
        }
        return $mobile = (androidPhone() || iphone() || ipod() || windowsPhone()
            || blackberryPhone() || fxosPhone() || meego());
    }

    // tablet
    export function tablet(): boolean {
        if ($tablet !== null) {
            return $tablet;
        }
        return $tablet = (ipad() || androidTablet() || blackberryTablet()
        || windowsTablet() || fxosTablet());
    }

    // desktop
    export function desktop(): boolean {
        if ($desktop !== null) {
            return $desktop;
        }
        return $desktop = (!tablet() && !mobile());
    }

    // television
    export function television(): boolean {
        if ($television !== null) {
            return $television;
        }
        $television = false;
        let television = TELEVISION;
        let i = 0;
        while (i < television.length) {
            if (this.$find(television[i])) {
                $television = true;
                break;
            }
            i++
        }
        return $television;
    }

    // portrait
    export function portrait(): boolean {
        return (window.innerHeight / window.innerWidth) > 1;
    }

    // landscape
    export function landscape(): boolean {
        return (window.innerHeight / window.innerWidth) < 1;
    }
}