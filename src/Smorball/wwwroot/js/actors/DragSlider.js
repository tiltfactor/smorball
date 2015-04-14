var RangeSlider = (function () {
    function RangeSlider(id, onDrag) {
        var _this = this;
        this.draggerWidth = 10;
        this.down = false;
        this.dragCallback = onDrag;
        this.range = document.getElementById(id);
        this.dragger = this.range.children[0];
        this.dragger.style.width = this.draggerWidth + 'px';
        this.dragger.style.left = -this.draggerWidth + 'px';
        this.dragger.style.marginLeft = (this.draggerWidth / 2) + 'px';
        this.range.addEventListener("mousedown", function (e) {
            _this.rangeWidth = _this.range.offsetWidth;
            _this.rangeLeft = _this.range.offsetLeft;
            _this.down = true;
            _this.updateDragger(e);
            return false;
        });
        document.addEventListener("mousemove", function (e) {
            _this.updateDragger(e);
        });
        document.addEventListener("mouseup", function () {
            _this.down = false;
        });
    }
    RangeSlider.prototype.updateDragger = function (e) {
        if (this.down && e.pageX >= this.rangeLeft && e.pageX <= (this.rangeLeft + this.rangeWidth)) {
            this.dragger.style.left = e.pageX - this.rangeLeft - this.draggerWidth + 'px';
            if (this.dragCallback != null)
                this.dragCallback(Math.round(((e.pageX - this.rangeLeft) / this.rangeWidth) * 100));
        }
    };
    return RangeSlider;
})();
