/// <reference path="preloader.ts" />
/// <reference path="../data/leveldata.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LoaderClass = (function (_super) {
    __extends(LoaderClass, _super);
    function LoaderClass(config) {
        var _this = this;
        this.config = config;
        this.onResize();
        _super.call(this);
        this.initialize();
        //this.y = 600 - this.getTransformedBounds().height;
        window.onresize = function () {
            _this.onResize();
        };
        this.y = 600 - this.getTransformedBounds().height / 2;
        this.onResize();
    }
    LoaderClass.prototype.initialize = function () {
        var gameLevel = this.config.currentLevel;
        var config = { "currentLevel": gameLevel, "loader": this.config.loader, "type": this.config.type };
        this.preloader = new Preloader(config);
        this.addChild(this.preloader);
        if (this.config.type == 0) {
            var sb = new createjs.Bitmap(this.config.loader.getResult("smorball_logo"));
            if (sb.image != null) {
                this.addChild(sb);
                sb.setTransform(500, 0, 1, 1);
                this.preloader.x = 500;
                this.preloader.y = 800;
            }
            else {
                this.preloader.x = 500;
                this.preloader.y = 0;
            }
        }
        if (this.config.type == 1) {
            this.preloader.x = 500;
            this.preloader.y = 800;
            this.drawText(gameLevel);
            this.drawTeams(gameLevel);
        }
    };
    LoaderClass.prototype.updateLoader = function (perc) {
        this.preloader.update(perc);
    };
    LoaderClass.prototype.drawText = function (gameLevel) {
        var team = levelsData[gameLevel].name;
        var text = new createjs.Text(team, "bold 120px Boogaloo", "#ffffff");
        text.lineWidth = 630;
        text.textAlign = "center";
        text.lineHeight = text.getMeasuredHeight() / 2 + 20;
        text.shadow = new createjs.Shadow("#000000", 3, 3, 1);
        text.x = 800;
        text.y = -50;
        this.addChild(text);
    };
    LoaderClass.prototype.drawTeams = function (gameLevel) {
        this.drawHomeTeam();
        this.drawVSText();
        this.drawEnemyTeam(gameLevel);
    };
    LoaderClass.prototype.drawVSText = function () {
        var vs = new createjs.Text("VS", "bold 140px Boogaloo", "#ffffff");
        vs.shadow = new createjs.Shadow("#000000", 3, 3, 1);
        vs.textAlign = "center";
        vs.setTransform(790, 410);
        this.addChild(vs);
    };
    LoaderClass.prototype.drawHomeTeam = function () {
        var team = new createjs.Bitmap(this.config.loader.getResult("hometeam"));
        team.setTransform(140, 210);
        this.addChild(team);
    };
    LoaderClass.prototype.drawEnemyTeam = function (gameLevel) {
        var team = new createjs.Bitmap(this.config.loader.getResult("splash" + gameLevel));
        team.setTransform(960, 210);
        this.addChild(team);
    };
    LoaderClass.prototype.drawPlayButton = function () {
        var _this = this;
        var me = this;
        this.config.stage.enableMouseOver(10);
        var btnContainer = new createjs.Container();
        var btn = new createjs.Bitmap(this.config.loader.getResult("btn_bg"));
        btnContainer.x = this.preloader.x + btn.getTransformedBounds().width / 2 - 40;
        btnContainer.y = this.preloader.y;
        btnContainer.addEventListener("mousedown", function (e) {
            window.onresize = null;
            e.target.cursor = "pointer";
            btn.image = _this.config.loader.getResult("btn_down");
            _this.config.stage.removeAllChildren();
            _this.config.stage.update();
            $("#loaderDiv").hide();
            EventBus.dispatch("onImagesLoad");
            EventBus.dispatch("playSound", "stadiumAmbience");
            $("#inputText").focus();
        });
        btnContainer.addEventListener("mouseout", function (e) {
            e.target.cursor = "pointer";
            btn.image = _this.config.loader.getResult("btn_bg");
            _this.config.stage.update();
        });
        btnContainer.addEventListener("mouseover", function (e) {
            e.target.cursor = "pointer";
            btn.image = _this.config.loader.getResult("btn_over");
            _this.config.stage.update();
        });
        btnContainer.addEventListener("pressup", function (e) {
            e.target.cursor = "pointer";
            btn.image = _this.config.loader.getResult("btn_bg");
            _this.config.stage.update();
        });
        var btnText = new createjs.Text("PLAY", "bold 60px Boogaloo", "#ffffff");
        btnText.textBaseline = 'middle';
        btnText.x = btn.getTransformedBounds().width / 2 - btnText.getMeasuredWidth() / 2;
        btnText.y = btn.getTransformedBounds().height / 2 - btnText.getMeasuredHeight() / 2;
        btnContainer.addChild(btn, btnText);
        this.addChild(btnContainer);
        this.removeLoader();
    };
    LoaderClass.prototype.onResize = function () {
        var canvas = this.config.stage.canvas;
        this.canvasWidth = canvas.width = window.innerHeight * 4 / 3 > window.innerWidth ? window.innerWidth : window.innerHeight * 4 / 3;
        this.canvasHeight = canvas.height = this.canvasWidth * 3 / 4 > window.innerHeight ? window.innerHeight : this.canvasWidth * 3 / 4;
        this.config.stage.scaleX = this.canvasWidth / 1600;
        this.config.stage.scaleY = this.canvasHeight / 1200;
        this.config.stage.update();
        var paddingTop = (window.innerHeight - this.canvasHeight) / 2;
        var paddingLeft = (window.innerWidth - this.canvasWidth) / 2;
        $("#loaderCanvas").css({ top: paddingTop, left: 0 });
    };
    LoaderClass.prototype.removeLoader = function () {
        this.removeChild(this.preloader);
    };
    LoaderClass.prototype.drawSBlogo = function () {
        var sb = new createjs.Bitmap(this.config.loader.getResult("smorball_logo"));
        this.addChild(sb);
    };
    return LoaderClass;
})(createjs.Container);
