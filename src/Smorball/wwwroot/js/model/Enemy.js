/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="spritesheet.ts" />
/// <reference path="../data/enemydata.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(config) {
        _super.call(this);
        this.config = config;
        this.lifes = [];
        this.speed = config.speed || 1;
        this.hit = false;
        this.typeData = EnemyData[this.config.id];
        this.spritesheet = new createjs.SpriteSheet(this.getSpritesheetData());
        this.sprite = new createjs.Sprite(this.spritesheet, "run");
        this.sprite.x = -this.typeData.offsetX;
        this.sprite.y = -this.typeData.offsetY;
        this.heartsContainer = new createjs.Container();
        this.heartsContainer.y = -(this.sprite.getBounds().height + 50);
        this.addChild(this.heartsContainer);
        //this.setScale(this.typeData.sX, this.typeData.sY);
        this.setEffects();
        this.addChild(this.sprite);
        this.life = this.config.life || EnemyData[this.config.id].life;
        this.generateLife();
        this.setExtras();
        this.bounds = this.getBounds();
        console.log(location.hostname);
        if (location.hostname == "localhost") {
            var circle = new createjs.Shape();
            circle.graphics.beginFill("red");
            circle.graphics.drawCircle(0, 0, 10);
            this.addChild(circle);
        }
    }
    Enemy.prototype.getSpritesheetData = function () {
        var level = 1; // this.config.gameState.currentLevel;
        var jsonName = "enemy_json_" + this.config.id + "_" + Utils.zeroPad(level, 2);
        var pngName = "enemy_png_" + this.config.id + "_" + Utils.zeroPad(level, 2);
        var data = this.config.loader.getResult(jsonName);
        var sprite = this.config.loader.getResult(pngName);
        data.images = [sprite];
        console.log("creating enemy", this.config.id, data, sprite);
        return data;
    };
    Enemy.prototype.setExtras = function () {
        this.typeData = EnemyData[this.config.id];
        this.life = this.typeData.life || 1;
        this.speed = this.typeData.speed || 1;
        if (this.typeData.changeLane) {
            setTimeout(function () {
                EventBus.dispatch("changeLane");
            }, 2000);
        }
    };
    /*var drawBorder = function(me){
        var shape = new createjs.Shape();
        shape.graphics.beginStroke("#000").setStrokeStyle(0.1).drawRect(0,0,this.getWidth(),this.getHeight());
        this.addChild(shape);

    }*/
    Enemy.prototype.run = function () {
        var _this = this;
        var me = this;
        this.sprite.gotoAndPlay("run");
        this.myTick = function () {
            _this.tick();
        };
        this.addEventListener("tick", this.myTick);
    };
    Enemy.prototype.pause = function () {
        this.removeEventListener("tick", this.myTick);
        this.sprite.gotoAndPlay("run");
    };
    Enemy.prototype.die = function () {
        this.sprite.gotoAndPlay("dead");
    };
    Enemy.prototype.kill = function (life) {
        var _this = this;
        var me = this;
        for (i = 0; i < life; i++) {
            if (this.lifes.length != 0) {
                this.removeLife();
            }
        }
        var fileId = this.config.enemySound.hit;
        EventBus.dispatch("playSound", fileId);
        var lanesObj = this.config.lanesObj;
        for (var i = 0; i < lanesObj.length; i++) {
            if (this.config.laneId == lanesObj[i].laneId) {
                var currentLaneObj = lanesObj[i];
            }
        }
        if (this.lifes.length == 0) {
            this.hit = true;
            var fileId = this.config.enemySound.die;
            EventBus.dispatch("playSound", fileId);
            this.sprite.gotoAndPlay("dead");
            this.removeEventListener("tick", this.myTick);
            this.sprite.on("animationend", function () { return smorball.stageController.removeEnemy(_this); }, this, true);
        }
        else {
            var knockBack = this.x + this.config.gameState.gs.knockBack * currentLaneObj.config.width;
            this.x = this.startX < knockBack ? this.startX : knockBack;
        }
        return this.lifes.length;
    };
    Enemy.prototype.setSpeed = function (speed) {
        this.speed = speed;
        this.sprite._animation.speed = speed;
    };
    Enemy.prototype.setStartPoint = function (x, y) {
        this.startX = x;
        this.startY = y;
        this.setPosition(x, y);
    };
    Enemy.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        //this.regX = 0;
        //this.regY = this.getHeight();
    };
    Enemy.prototype.addLife = function (start) {
        var life = new createjs.Bitmap(this.config.loader.getResult("heart_full"));
        this.lifeRectSize = life.getBounds().width;
        this.heartsContainer.addChild(life);
        this.lifes.push(life);
        this.heartsContainer.x = -this.heartsContainer.getBounds().width / 2;
    };
    Enemy.prototype.removeLife = function () {
        var life = this.lifes.pop();
        life.image = this.config.loader.getResult("heart_empty");
    };
    Enemy.prototype.getHeight = function () {
        return this.sprite.getBounds().height + this.lifeRectSize + 1;
    };
    Enemy.prototype.getWidth = function () {
        return this.sprite.getBounds().width;
    };
    Enemy.prototype.setScale = function (sx, sy) {
        this.sprite.setTransform(0, 6, sx, sy);
    };
    Enemy.prototype.setEffects = function () {
        this.config.enemySound = EnemyData[this.config.id].sound;
    };
    Enemy.prototype.getMaxLife = function () {
        return EnemyData[this.config.id].life;
    };
    Enemy.prototype.getLife = function () {
        return this.lifes.length;
    };
    Enemy.prototype.generateLife = function () {
        for (var i = 0; i < this.life; i++) {
            this.addLife(false);
        }
    };
    Enemy.prototype.setEndPoint = function (endPointX) {
        this.endPoint = endPointX;
    };
    Enemy.prototype.tick = function () {
        this.x = this.x - this.speed;
        if (this.endPoint != null && this.hit == false && this.x < this.endPoint) {
            this.hit = true;
            this.lifes.length = 0;
            this.kill(0);
            EventBus.dispatch("killLife");
        }
    };
    Enemy.prototype.getWaveId = function () {
        return this.config.waveId;
    };
    Enemy.prototype.getLaneId = function () {
        return this.config.laneId;
    };
    Enemy.prototype.setLaneId = function (laneId) {
        this.config.laneId = laneId;
    };
    Enemy.prototype.onKillPush = function () {
        return this.config.onKill;
    };
    return Enemy;
})(createjs.Container);
