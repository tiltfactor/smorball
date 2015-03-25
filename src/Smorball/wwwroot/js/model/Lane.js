/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../data/gameconfig.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Lane = (function (_super) {
    __extends(Lane, _super);
    function Lane(config) {
        this.config = config;
        this.laneId = config.id;
        this.leftArea = config.width / 6; //300;
        _super.call(this);
        this.x = this.config.x;
        this.y = this.config.y;
        this.drawLayout();
        this.setLeftArea();
    }
    /*getPlayerPosition = function(){
        var point = {};
        point.x = 10;
        point.y = this.config.y + this.config.height/2;
        return point;
    }*/
    Lane.prototype.setPlayer = function (player) {
        this.player = player;
        this.player.x = 0;
        if (player.type == "football") {
            this.player.x = 20;
        }
        this.player.y = (this.config.y - this.config.height * 0.75);
        this.player.setEndPoint(this.config.x + this.config.width);
    };
    Lane.prototype.getPowerupPosition = function () {
        var limit = (this.config.width - this.leftArea) * 3 / 4;
        return {
            x: (Math.random() * limit) + this.leftArea + this.config.x,
            y: this.config.y + this.config.height / 2 //this.config.y + (this.config.height/7);
        };
    };
    Lane.prototype.getCaptchaX = function () {
        return this.leftArea / 2;
    };
    Lane.prototype.getMaxCaptchaWidth = function () {
        return this.leftArea;
    };
    Lane.prototype.getEnemyEndPoint = function () {
        return {
            x: this.leftArea + this.config.x,
            y: this.config.y + this.config.height * 0.75 ///2;//this.config.y + (this.config.height/7);
        };
    };
    Lane.prototype.getEndPoint = function () {
        return gameConfig.enemySpawnPositions[this.config.id];
        //      return {
        //	x: this.config.x + this.config.width,
        //	y: this.config.y + this.config.height * 0.75 //this.config.y + (this.config.height/7);
        //};
    };
    Lane.prototype.getHeight = function () {
        return this.config.height;
    };
    Lane.prototype.getLaneId = function () {
        return this.config.id;
    };
    Lane.prototype.drawLayout = function () {
        var totalTiles = 9;
        var tileWidth = 178;
        var tileHeight = 192;
        var padding = 10;
        this.leftArea = tileWidth * 2;
        var tileImage = "grassTile";
        var w = 0;
        for (var i = 0; i < totalTiles; i++) {
            var ide = 0;
            if (this.laneId % 2 == 0) {
                ide = 3;
            }
            else {
                ide = 1;
            }
            if (i % 2 != 0) {
                ide++;
            }
            var bitmap = new createjs.Bitmap(this.config.loader.getResult(tileImage + ide));
            bitmap.x = w;
            bitmap.y = 0;
            w = w + tileWidth;
            this.addChild(bitmap);
        }
    };
    Lane.prototype.setLeftArea = function () {
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#ffffff").drawRect(0, 0, this.leftArea, this.config.height);
        shape.alpha = 0.5;
        this.addChild(shape);
    };
    return Lane;
})(createjs.Container);
