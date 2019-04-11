if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        let aArgs = Array.prototype.slice.call(arguments, 1);
        let fToBind = this;
        let fNOP = function () {
        };
        let fBound = function () {
            return fToBind.apply(
                this instanceof fNOP && oThis ?
                    this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    }
}