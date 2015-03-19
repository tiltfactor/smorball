/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CommentaryBox = (function (_super) {
    __extends(CommentaryBox, _super);
    function CommentaryBox(config) {
        this.config = config;
        this.timer = 0;
        this.loadEvents();
        _super.call(this);
        this.drawScoreBoard();
        this.initShowCommentary();
        //startCommentaryTimer(this);
        this.x = this.config.width / 2;
    }
    CommentaryBox.prototype.setScore = function (score) {
        if (score >= 0) {
            this.score.text = score;
        }
    };
    CommentaryBox.prototype.setOpponenets = function (opponents) {
        this.opponents.text = opponents;
    };
    CommentaryBox.prototype.kill = function () {
        clearInterval(this.timer);
    };
    CommentaryBox.prototype.loadEvents = function () {
        var _this = this;
        EventBus.addEventListener("showCommentary", function (o) { return _this.showCommentary(o.target); });
        EventBus.addEventListener("showPendingEnemies", function (o) { return _this.setOpponenets(o.target); });
        EventBus.addEventListener("setScore", function (score) { return _this.setScore(score.target); });
    };
    CommentaryBox.prototype.drawScoreBoard = function () {
        //this.config.stage.addChild(this.scoreContainer);
        var score = new createjs.Bitmap(this.config.loader.getResult("score"));
        score.regX = score.getTransformedBounds().width / 2;
        score.y = 10;
        //  score.scaleX = 0.5;
        // score.scaleY = 0.5;
        this.addChild(score);
        this.initScorePosition(score);
        this.initOpponentsPosition(score);
        var cmtBox = new createjs.Bitmap(this.config.loader.getResult("cmt"));
        cmtBox.regX = cmtBox.getTransformedBounds().width / 2;
        // cmtBox.scaleX = 0.5;
        // cmtBox.scaleY = 0.5;
        cmtBox.y = score.getTransformedBounds().height - 10;
        this.drawSpeakers(cmtBox, score);
        this.speech = new createjs.Bitmap(this.config.loader.getResult("speech"));
        this.speech.regX = this.speech.getTransformedBounds().width / 2;
        this.speech.y = cmtBox.getTransformedBounds().height / 2 + this.speech.getTransformedBounds().height / 3;
        this.speech.alpha = 0;
        // this.speech.scaleX = 0.5;
        // this.speech.scaleY = 0.5;
        this.addChild(cmtBox, this.speech);
    };
    CommentaryBox.prototype.drawSpeakers = function (cmtBox, score) {
        for (var i = 0; i < 2; i++) {
            var speakerContainer = new createjs.Container();
            var speaker = new createjs.Bitmap(this.config.loader.getResult("speaker"));
            var pole = new createjs.Bitmap(this.config.loader.getResult("pole"));
            // pole.scaleX = 0.5;
            // pole.scaleY = 0.5;
            speaker.regX = speaker.getTransformedBounds().width / 2;
            speaker.scaleX = -1 * (Math.pow(-1, i));
            //speaker.scaleY = 0.5;
            speaker.x = this.x + (Math.pow(-1, i)) * ((cmtBox.getTransformedBounds().width / 2) + (speaker.getTransformedBounds().width / 2));
            speaker.y = score.getTransformedBounds().height + (score.getTransformedBounds().height / 2);
            pole.x = speaker.x - speaker.getTransformedBounds().width / 2 + 40;
            pole.y = speaker.y + speaker.getTransformedBounds().height / 2;
            speakerContainer.addChild(pole, speaker);
            speakerContainer.y = -20;
            this.addChild(speakerContainer);
        }
    };
    CommentaryBox.prototype.showCommentary = function (text) {
        if (text) {
            this.formatText(text);
            if (this.free) {
                this.show(this.infoAry.shift());
            }
        }
    };
    CommentaryBox.prototype.formatText = function (text) {
        var texts = text.split("@@");
        var time = 5000;
        if (texts.length != 1) {
            time = 2000;
        }
        for (var i = 0; i < texts.length; i++) {
            this.infoAry.push({
                text: texts[i],
                time: this.getTime(texts[i])
            });
        }
    };
    CommentaryBox.prototype.show = function (msg) {
        var _this = this;
        this.free = false;
        var w = this.info;
        this.info.text = msg.text.toUpperCase();
        this.info.alpha = 0;
        this.speech.alpha = 1;
        this.speech.scaleX = this.speech.scaleY = 0;
        createjs.Tween.get(this.speech).to({ scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.backOut).call(function () {
            createjs.Tween.get(_this.info).to({ alpha: 1 }, 100).wait(msg.time).call(function () {
                _this.free = true;
                _this.info.text = "";
                _this.speech.alpha = 0;
                if (_this.infoAry.length != 0) {
                    _this.show(_this.infoAry.shift());
                }
            });
        });
    };
    CommentaryBox.prototype.initShowCommentary = function () {
        this.info = new createjs.Text();
        this.info.font = "26px Boogaloo";
        this.info.color = "white";
        this.info.lineHeight = 32;
        this.info.shadow = new createjs.Shadow("#000000", 2, 2, 0);
        this.info.alpha = 1;
        this.info.x = this.speech.x - this.speech.getTransformedBounds().width / 2 + 20;
        this.info.y = this.speech.y + 20;
        this.info.lineWidth = this.speech.getTransformedBounds().width - 30;
        this.addChild(this.info);
        this.infoAry = [];
        this.free = true;
    };
    CommentaryBox.prototype.initScorePosition = function (score) {
        this.score = new createjs.Text();
        this.score.font = "bold 40px Scoreboard";
        this.score.color = "white";
        this.score.alpha = 1;
        this.score.text = "6";
        this.score.x = score.x + score.getTransformedBounds().width / 4;
        this.score.y = score.y + score.getTransformedBounds().height / 2.2;
        this.addChild(this.score);
    };
    CommentaryBox.prototype.initOpponentsPosition = function (score) {
        this.opponents = new createjs.Text();
        this.opponents.font = "bold 40px Scoreboard";
        this.opponents.color = "white";
        this.opponents.alpha = 1;
        this.opponents.text = "5";
        this.opponents.x = score.x - score.getTransformedBounds().width / 3 - this.opponents.getMeasuredWidth() / 2;
        this.opponents.y = score.y + score.getTransformedBounds().height / 2.2;
        this.addChild(this.opponents);
    };
    CommentaryBox.prototype.getTime = function (text) {
        return (text.length * 100);
    };
    return CommentaryBox;
})(createjs.Container);
