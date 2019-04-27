namespace Soo.dom {

    /** 创建 webGL */
    function createWebGL(width?: number, height?: number): HTMLCanvasElement {
        return ;
    }

    export class WebGLElement extends DOMElement {
        constructor(width?: number, height?: number) {
            super(createWebGL(width, height));
        }
    }
}