namespace Soo.canvas {

    /** 创建 webGL */
    function createWebGL(width?: number, height?: number): HTMLCanvasElement {
        return ;
    }

    export class WebGLRenderer {
        constructor(width?: number, height?: number) {
            this.surface = createWebGL(width, height);
        }

        /** 画布 */
        surface: HTMLCanvasElement;
    }
}