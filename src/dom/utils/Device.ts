namespace Soo.dom {

    import landscape = Soo.device.landscape;
    import ios = Soo.device.ios;
    import android = Soo.device.android;
    import blackberry = Soo.device.blackberry;
    import windows = Soo.device.windows;
    import fxos = Soo.device.fxos;
    import meego = Soo.device.meego;
    import nodeWebkit = Soo.device.nodeWebkit;
    import television = Soo.device.television;
    import desktop = Soo.device.desktop;
    import cordova = Soo.device.cordova;
    import ipad = Soo.device.ipad;
    import iphone = Soo.device.iphone;
    import ipod = Soo.device.ipod;
    import androidTablet = Soo.device.androidTablet;
    import blackberryTablet = Soo.device.blackberryTablet;
    import windowsTablet = Soo.device.windowsTablet;
    import windowsPhone = Soo.device.windowsPhone;
    import fxosTablet = Soo.device.fxosTablet;
    const DOC = window.document.documentElement;

    function onOrientation(): void {
        $updateOrientation();
    }
    function $updateOrientation(): void {
        let doc = DOC;
        if (landscape()) {
            removeClass(doc, "portrait");
            addClass(doc, "landscape");
        } else {
            removeClass(doc, "landscape");
            addClass(doc, "portrait");
        }
    }


    let $isRunning: boolean = false;
    export function device(): void {
        if ($isRunning) {
            return;
        }
        $isRunning = true;
        let orientationEvent;
        if (Object.prototype.hasOwnProperty.call(window, "onorientationchange")) {
            orientationEvent = "orientationchange";
        } else {
            orientationEvent = "resize";
        }
        if (window.addEventListener) {
            window.addEventListener(orientationEvent, onOrientation, false);
        } else if (window['attachEvent']) {
            window['attachEvent'](orientationEvent, onOrientation);
        } else {
            window[orientationEvent] = <any>onOrientation;
        }

        let doc = DOC;
        if (ios()) {
            if (ipad()) {
                addClass(doc, "ios ipad tablet");
            } else if (iphone()) {
                addClass(doc, "ios iphone mobile");
            } else if (ipod()) {
                addClass(doc, "ios ipod mobile");
            }
        } else if (android()) {
            if (androidTablet()) {
                addClass(doc, "android tablet");
            } else {
                addClass(doc, "android mobile");
            }
        } else if (blackberry()) {
            if (blackberryTablet()) {
                addClass(doc, "blackberry tablet");
            } else {
                addClass(doc, "blackberry mobile");
            }
        } else if (windows()) {
            if (windowsTablet()) {
                addClass(doc, "windows tablet");
            } else if (windowsPhone()) {
                addClass(doc, "windows mobile");
            } else {
                addClass(doc, "desktop");
            }
        } else if (fxos()) {
            if (fxosTablet()) {
                addClass(doc, "fxos tablet");
            } else {
                addClass(doc, "fxos mobile");
            }
        } else if (meego()) {
            addClass(doc, "meego mobile");
        } else if (nodeWebkit()) {
            addClass(doc, "node-webkit");
        } else if (television()) {
            addClass(doc, "television");
        } else if (desktop()) {
            addClass(doc, "desktop");
        }

        if (cordova()) {
            addClass(doc, "cordova");
        }
        $updateOrientation();
    }

}