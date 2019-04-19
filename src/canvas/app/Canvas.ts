namespace Soo {
    import DOMElement = Soo.dom.DOMElement;

    export type CanvasOptions = {
        /** 渲染模式 auto, canvas, webgl */
        renderMode?: string;

        /** 抗锯齿 */
        antialias?: boolean;
    };

    // Canvas应用
    export class Canvas extends DOMElement{
        constructor() {
            super();
        }
    }
}