/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Captcha = (function (_super) {
    __extends(Captcha, _super);
    function Captcha(lane) {
        _super.call(this, null);
        this.lane = lane;
    }
    Captcha.prototype.setEntry = function (entry) {
        this.entry = entry;
        this.image = smorball.loader.getResult("captcha_" + entry.image.substr(0, 3));
        // Animate in
        createjs.Tween.removeTweens(this);
        this.scaleX = this.scaleY = 0;
        createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
    };
    Captcha.prototype.clear = function () {
        var _this = this;
        // Animate Out
        createjs.Tween.removeTweens(this);
        this.scaleX = this.scaleY = 1;
        createjs.Tween.get(this).to({ scaleX: 0, scaleY: 0 }, 250, createjs.Ease.backOut).call(function (tween) { return _this.image = null; });
    };
    return Captcha;
})(createjs.Bitmap);
