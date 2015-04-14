var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FloatingText = (function (_super) {
    __extends(FloatingText, _super);
    function FloatingText(txt, x, y) {
        var _this = this;
        _super.call(this);
        this.x = x;
        this.y = y;
        this.text = new createjs.Text();
        this.text.font = "70px Boogaloo";
        this.text.text = txt;
        this.text.color = "white";
        this.text.shadow = new createjs.Shadow("black", 2, 2, 2);
        this.addChild(this.text);
        this.text.regX = this.text.getBounds().width / 2;
        this.text.regY = this.text.getBounds().height / 2;
        createjs.Tween.get(this).to({ y: y - 100 }, 2000);
        createjs.Tween.get(this).to({ alpha: 0 }, 2000, createjs.Ease.quintIn).call(function () { return _this.destroy(); });
    }
    FloatingText.prototype.destroy = function () {
        smorball.screens.game.actors.removeChild(this);
    };
    return FloatingText;
})(createjs.Container);
