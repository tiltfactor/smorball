var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Captcha = (function (_super) {
    __extends(Captcha, _super);
    function Captcha(lane) {
        _super.call(this);
        this.lane = lane;
        // Create and add the spritesheet
        var ss = new createjs.SpriteSheet(this.getSpritesheetData());
        this.sprite = new createjs.Sprite(ss, "000");
        this.addChild(this.sprite);
        this.visible = false;
        // Position us in the right place
        var pos = smorball.config.captchaPositions[lane];
        this.x = pos.x;
        this.y = pos.y;
        // Draw a debug circle
        if (smorball.config.debug) {
            var circle = new createjs.Shape();
            circle.graphics.beginFill("red");
            circle.graphics.drawCircle(0, 0, 10);
            this.addChild(circle);
        }
    }
    Captcha.prototype.getSpritesheetData = function () {
        var data = smorball.resources.getResource("captchas_json");
        var sprite = smorball.resources.getResource("captchas_jpg");
        data.images = [sprite];
        return data;
    };
    Captcha.prototype.setEntry = function (entry) {
        // Update the sprite
        this.entry = entry;
        var frame = parseInt(entry.image.replace(".png", ""));
        console.log("Setting captcha to: ", frame, entry);
        this.sprite.gotoAndStop(frame);
        this.visible = true;
        // Animate in
        createjs.Tween.removeTweens(this);
        this.scaleX = this.scaleY = 0;
        createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
    };
    Captcha.prototype.clear = function () {
        var _this = this;
        this.entry = null;
        // Animate Out
        createjs.Tween.removeTweens(this);
        this.scaleX = this.scaleY = 1;
        createjs.Tween.get(this).to({ scaleX: 0, scaleY: 0 }, 250, createjs.Ease.backOut).call(function (tween) { return _this.visible = false; });
    };
    return Captcha;
})(createjs.Container);
