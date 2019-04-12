namespace Soo.math {

    /** 角度转为弧度 */
    export function angle2Radian(angle: number): number {
        return angle * DEG_TO_RAD;
    }

    /** 弧度转为角度 */
    export function radian2Angle(radian: number): number {
        return radian / DEG_TO_RAD;
    }

    // sin
    export function sin(angle: number): number {
        let angleFloor = Math.floor(angle);
        let resultFloor = sinInt(angleFloor);
        if (angleFloor == angle) {
            return resultFloor;
        }
        let angleCeil = angleFloor + 1;
        let resultCeil = sinInt(angleCeil);
        return (angle - angleFloor) * resultCeil + (angleCeil - angle) * resultFloor;
    }

    // cos
    export function cos(angle: number): number {
        let angleFloor = Math.floor(angle);
        let resultFloor = cosInt(angleFloor);
        if (angleFloor == angle) {
            return resultFloor;
        }
        let angleCeil = angleFloor + 1;
        let resultCeil = cosInt(angleCeil);
        return (angle - angleFloor) * resultCeil + (angleCeil - angle) * resultFloor;
    }


    const PI = Math.PI;


    let sin_map = {};
    let cos_map = {};
    let DEG_TO_RAD: number = PI / 180; // 角度到弧度
    for (let i = 0; i < 360; i++) {
        sin_map[i] = Math.sin(i * DEG_TO_RAD);
        cos_map[i] = Math.cos(i * DEG_TO_RAD);
    }
    sin_map[90] = 1;
    cos_map[90] = 0;
    sin_map[180] = 0;
    cos_map[180] = -1;
    sin_map[270] = -1;
    cos_map[270] = 0;

    function sinInt(angle: number): number {
        angle = angle % 360;
        if (angle < 0) {
            angle += 360;
        }
        return sin_map[angle];
    }

    function cosInt(angle: number): number {
        angle = angle % 360;
        if ( angle < 0 ) {
            angle += 360;
        }
        return cos_map[angle];
    }
}