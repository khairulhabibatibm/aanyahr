var NgModelBase = /** @class */ (function () {
    function NgModelBase() {
    }
    Object.defineProperty(NgModelBase.prototype, "value", {
        get: function () {
            return this._innerValue;
        },
        set: function (v) {
            if (v !== this._innerValue) {
                this._innerValue = v;
                this.onChangeCallback(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    NgModelBase.prototype.writeValue = function (v) {
        if (v !== this._innerValue) {
            this._innerValue = v;
        }
    };
    NgModelBase.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    NgModelBase.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    return NgModelBase;
}());
export { NgModelBase };
//# sourceMappingURL=utils.js.map