var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LoadingBar = (function (_super) {
    __extends(LoadingBar, _super);
    function LoadingBar(height) {
        _super.call(this);
        this.height = height;
    }
    LoadingBar.prototype.init = function () {
        // Add the loading bar bg
        this.loadingBarBottom = new createjs.Bitmap(smorball.resources.getResource("loading_bar_bottom"));
        Utils.centre(this.loadingBarBottom, true, false);
        this.loadingBarBottom.y = this.height;
        this.addChild(this.loadingBarBottom);
        // Add the loading bar 
        this.loadingBar = new createjs.Bitmap(smorball.resources.getResource("loading_bar"));
        this.loadingBar.x = this.loadingBarBottom.x;
        this.loadingBar.y = this.height + 8;
        this.addChild(this.loadingBar);
        // Add the loading bar fg
        this.loadingBarTop = new createjs.Bitmap(smorball.resources.getResource("loading_bar_top"));
        Utils.centre(this.loadingBarTop, true, false);
        this.loadingBarTop.y = this.height;
        this.addChild(this.loadingBarTop);
        // Add the "loading" text;
        this.loadingText = new createjs.Text("LOADING...", "70px Boogaloo", "white");
        Utils.centre(this.loadingText, true, false);
        this.loadingText.y = this.height - 100;
        this.loadingText.shadow = new createjs.Shadow("#000000", 3, 3, 0);
        this.addChild(this.loadingText);
    };
    LoadingBar.prototype.setProgress = function (progress) {
        this.loadingBar.scaleX = progress * this.loadingBarBottom.getBounds().width;
    };
    return LoadingBar;
})(createjs.Container);
