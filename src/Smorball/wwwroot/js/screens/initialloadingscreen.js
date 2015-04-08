/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LoadingScreen = (function (_super) {
    __extends(LoadingScreen, _super);
    function LoadingScreen() {
        _super.apply(this, arguments);
    }
    LoadingScreen.prototype.init = function () {
        // Create the anuimated star background
        this.background = new StarBackground();
        this.addChild(this.background);
        // Add the logo
        this.logo = new createjs.Bitmap(smorball.resources.getResource("smorball_logo"));
        Utils.centre(this.logo, true, false);
        this.logo.y = 0;
        this.addChild(this.logo);
        this.bar = new LoadingBar();
        this.bar.init();
        this.addChild(this.bar);
    };
    LoadingScreen.prototype.update = function (delta) {
        // Dont need to update if not visible
        if (!this.visible)
            return;
        // Update the animated background
        this.background.update(delta);
        // Update the bar based on our load progress
        this.bar.setProgress(smorball.resources.fgQueue.progress);
    };
    return LoadingScreen;
})(createjs.Container);
