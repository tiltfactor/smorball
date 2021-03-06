/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CommentatorBubble = (function (_super) {
    __extends(CommentatorBubble, _super);
    function CommentatorBubble() {
        _super.call(this);
        // Create the background
        this.background = new createjs.Bitmap(smorball.resources.getResource("stadium_speech_bubble_blue"));
        this.background.regX = this.background.getBounds().width / 2;
        this.addChild(this.background);
        // Create the text
        this.text = new createjs.Text("hello world!");
        this.text.font = "32px Boogaloo";
        this.text.color = "white";
        this.text.textAlign = "center";
        this.text.lineHeight = 32;
        this.text.shadow = new createjs.Shadow("#000000", 2, 2, 0);
        this.text.alpha = 1;
        this.text.x = 0;
        this.text.y = 20;
        this.text.lineWidth = this.background.getTransformedBounds().width - 40;
        this.addChild(this.text);
        this.visible = false;
        this.isOpen = false;
    }
    CommentatorBubble.prototype.showCommentary = function (commentry, bubbleVariant) {
        var _this = this;
        this.visible = true;
        this.background.image = smorball.resources.getResource("stadium_speech_bubble_" + bubbleVariant);
        this.text.text = commentry.toUpperCase();
        this.text.y = this.background.getBounds().height / 2 - this.text.getBounds().height / 2;
        // Animate in
        createjs.Tween.removeTweens(this.background);
        this.background.scaleX = this.background.scaleY = 0;
        var t = createjs.Tween.get(this.background).to({ scaleX: 1, scaleY: 1 }, 3000, createjs.Ease.elasticOut);
        // If this isnt the tutorial level then animate out after a cetain time
        if (smorball.game.levelIndex != 0)
            t.wait(2000 + commentry.length * 40).to({ scaleX: 0, scaleY: 0 }, 500, createjs.Ease.backIn);
        createjs.Tween.removeTweens(this.text);
        this.text.alpha = 0;
        t = createjs.Tween.get(this.text).wait(1500).to({ alpha: 1 }, 500, createjs.Ease.sineOut).call(function () { return _this.isOpen = true; });
        // If this isnt the tutorial level then animate out after a cetain time
        if (smorball.game.levelIndex != 0)
            t.wait(2500 + commentry.length * 40).to({ alpha: 0 }, 500).call(function () { return _this.isOpen = false; });
    };
    return CommentatorBubble;
})(createjs.Container);
