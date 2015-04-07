var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Captcha = (function (_super) {
    __extends(Captcha, _super);
    function Captcha(lane) {
        var _this = this;
        _super.call(this);
        this.lane = lane;
        // Create and add the spritesheet
        this.sprite = new createjs.Sprite(null);
        this.addChild(this.sprite);
        this.visible = false;
        // Position us in the right place
        var pos = smorball.config.captchaPositions[lane];
        this.x = pos.x;
        this.y = pos.y;
        // Draw a debug circle
        if (smorball.config.debug) {
            //var circle = new createjs.Shape();
            //circle.graphics.beginFill("red");
            //circle.graphics.drawCircle(0, 0, 10);
            //this.addChild(circle);
            // For debug purposes, let this be clickable
            this.mouseEnabled = true;
            this.cursor = "pointer";
            this.on("click", function () { return smorball.captchas.onCaptchaEnteredSuccessfully(_this.chunk.texts[0], _this); });
        }
    }
    Captcha.prototype.setChunk = function (chunk) {
        // Update the sprite
        this.chunk = chunk;
        this.sprite.spriteSheet = chunk.page.spritesheet;
        this.sprite.gotoAndStop(chunk.frame);
        this.sprite.regX = this.sprite.getBounds().width / 2;
        this.sprite.regY = this.sprite.getBounds().height / 2;
        this.sprite.x = this.sprite.getBounds().width / 2;
        this.visible = true;
        // Animate in
        createjs.Tween.removeTweens(this.sprite);
        this.sprite.scaleX = this.sprite.scaleY = 0;
        createjs.Tween.get(this.sprite).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
    };
    Captcha.prototype.clear = function () {
        var _this = this;
        this.chunk = null;
        // Animate Out
        createjs.Tween.removeTweens(this.sprite);
        this.scaleX = this.scaleY = 1;
        createjs.Tween.get(this.sprite).to({ scaleX: 0, scaleY: 0 }, 250, createjs.Ease.backOut).call(function (tween) { return _this.visible = false; });
    };
    return Captcha;
})(createjs.Container);
