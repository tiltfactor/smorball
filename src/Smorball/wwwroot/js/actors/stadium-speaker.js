/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var StadiumSpeaker = (function (_super) {
    __extends(StadiumSpeaker, _super);
    function StadiumSpeaker() {
        _super.call(this);
        StadiumSpeaker.timeTillNextSwitch = 0;
        StadiumSpeaker.isAnimOn = false;
        this.speakerOff = new createjs.Bitmap(smorball.resources.getResource("speaker_off"));
        this.speakerOff.regX = 182;
        this.speakerOff.regY = 123;
        this.addChild(this.speakerOff);
        this.speakerOn = new createjs.Bitmap(smorball.resources.getResource("speaker_on"));
        this.speakerOn.regX = 182;
        this.speakerOn.regY = 123;
        this.addChild(this.speakerOn);
    }
    StadiumSpeaker.prototype.update = function (delta) {
        if (smorball.screens.game.bubble.isOpen) {
            StadiumSpeaker.timeTillNextSwitch -= delta / 2;
            if (StadiumSpeaker.timeTillNextSwitch <= 0) {
                StadiumSpeaker.isAnimOn = !StadiumSpeaker.isAnimOn;
                StadiumSpeaker.timeTillNextSwitch = 0.2 + Math.random() * 0.2;
            }
            this.speakerOn.visible = StadiumSpeaker.isAnimOn;
        }
        else
            this.speakerOn.visible = false;
        // Is always opposite of the on state
        this.speakerOff.visible = !this.speakerOn.visible;
    };
    return StadiumSpeaker;
})(createjs.Container);
