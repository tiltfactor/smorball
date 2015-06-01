var RangeSlider = (function () {
    function RangeSlider(selector, value, onValueChanged) {
        var _this = this;
        this.dragging = false;
        this.range = $(selector);
        this.handle = this.range.find(".handle");
        this.beforeBar = this.range.find(".before-bar");
        this.afterBar = this.range.find(".after-bar");
        this.handle.mousedown(function (event) {
            _this.dragging = true;
            _this.downOffset = event.offsetX;
            return false;
        });
        $(document).mouseup(function (event) {
            _this.dragging = false;
            return true;
        });
        $(document).mousemove(function (event) { return _this.onMouseMove(event); });
        this.value = value;
        this.onValueChanged = onValueChanged;
    }
    RangeSlider.prototype.onMouseMove = function (event) {
        if (!this.dragging)
            return;
        this.range.position();
        var rangeOffset = this.range.offset();
        var rangeWidth = this.range.width();
        var left = (event.pageX - rangeOffset.left) / smorball.stage.scaleX;
        if (left < 0)
            left = 0;
        if (left > rangeWidth)
            left = rangeWidth;
        this.value = left / rangeWidth;
        return true;
    };
    Object.defineProperty(RangeSlider.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = v;
            this.updateBar();
            if (this.onValueChanged != null)
                this.onValueChanged(v);
        },
        enumerable: true,
        configurable: true
    });
    RangeSlider.prototype.updateBar = function () {
        this.range.position();
        var rangeWidth = this.range.width();
        var left = ((rangeWidth * this.value) - this.handle.width() / 2);
        this.afterBar.get(0).style.left = (left + 10) + "px";
        this.afterBar.get(0).style.width = (rangeWidth - left - 10) + "px";
        this.handle.get(0).style.left = left + "px";
        this.handle.get(0).style.top = (-this.handle.height() / 2) + "px";
    };
    return RangeSlider;
})();
