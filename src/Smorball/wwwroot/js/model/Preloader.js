/// <reference path="../data/loaderdata.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Preloader = (function (_super) {
    __extends(Preloader, _super);
    function Preloader(config) {
        this.config = config;
        this.fillColor = "#AFA";
        this.strokeColor = "#000";
        this.width = 800;
        this.height = 80;
        _super.call(this);
        this.drawPreloader();
        this.setMessage("LOADING...");
    }
    Preloader.prototype.drawPreloader = function () {
        var outline = new createjs.Bitmap(this.config.loader.getResult("loading_bar_bottom"));
        var inline = new createjs.Bitmap(this.config.loader.getResult("loading_bar_top"));
        var bar = new createjs.Bitmap(this.config.loader.getResult("loading_bar"));
        this.bar = new createjs.Shape();
        this.bar.graphics.beginBitmapFill(bar.image).drawRect(5, 5, 570, 44).endFill();
        this.bar.scaleX = 0;
        this.addChild(outline, this.bar, inline);
    };
    Preloader.prototype.update = function (perc) {
        perc = perc > 1 ? 1 : perc;
        this.bar.scaleX = perc;
    };
    Preloader.prototype.setMessage = function (text) {
        var msgField = new createjs.Text(text, "Bold 60px Boogaloo", "#ffffff");
        msgField.shadow = new createjs.Shadow("#000000", 3, 3, 1);
        msgField.y = this.y - 80;
        msgField.x = this.x + 200;
        this.addChild(msgField);
    };
    Preloader.prototype.setBackground = function (me) {
        var loaderData = LoaderData[this.config.currentLevel];
        var loaderMessage = new createjs.Text("LOADING...", "40px Boogaloo", "#ff770");
        loaderMessage.x = -loaderMessage.getMeasuredHeight();
        var logo = new createjs.Bitmap(null);
        var img = this.config.loader.getResult("loader_default_bg");
        if (loaderData != undefined) {
            var img = this.config.loader.getResult(loaderData.id);
            if (loaderData.message != undefined) {
                loaderMessage.text = loaderData.message;
                loaderMessage.x = this.width / 2 - loaderMessage.getBounds().width / 2;
                loaderMessage.y = this.height / 2 - loaderMessage.getBounds().height / 2;
                this.addChild(loaderMessage);
            }
        }
        if (img != null) {
            logo.image = img;
            logo.x = this.width / 2 - logo.getBounds().width / 2;
            logo.y = this.height / 2 - logo.getBounds().height / 2;
            this.addChildAt(logo, 0);
        }
    };
    return Preloader;
})(createjs.Container);
