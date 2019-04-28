namespace Soo.dom {
    
    // 布局接口
    export interface DOMLayout {
        /** 是否包含在父级容器布局中 */
        includeInLayout: boolean;

        /** 距离父级容器左边距离 */
        left: any;

        /** 距离父级容器右边距离 */
        right: any;

        /** 距离父级容器顶部距离 */
        top: any;

        /** 距离父级容器底部距离 */
        bottom: any;

        /** 在父级容器中距水平中心位置的距离 */
        horizontalCenter: any;

        /** 在父级容器中距竖直中心位置的距离 */
        verticalCenter: any;

        /** 相对父级容器宽度的百分比 */
        percentWidth: number;

        /** 相对父级容器高度的百分比 */
        percentHeight: number;


    }
}