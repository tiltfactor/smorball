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
    function Enemy(type, startingLane) {
        _super.call(this);
        // Save these
        this.type = type;
        this.typeData = enemyData[type];
        this.startingLane = this.currentLane = startingLane;
        // Start at the correct position
        var startPos = gameConfig.enemySpawnPositions[this.startingLane];
        this.x = startPos.x;
        this.y = startPos.y;
        this.lifes = [];
        this.speed = this.typeData.speed;
        this.hit = false;
        this.spritesheet = new createjs.SpriteSheet(this.getSpritesheetData());
        this.sprite = new createjs.Sprite(this.spritesheet, "run");
        this.sprite.framerate = 20;
        this.sprite.x = -this.typeData.offsetX;
        this.sprite.y = -this.typeData.offsetY;
        this.heartsContainer = new createjs.Container();
        this.heartsContainer.y = -(this.sprite.getBounds().height + 50);
        this.addChild(this.heartsContainer);
        //this.setScale(this.typeData.sX, this.typeData.sY);
        this.setEffects();
        this.addChild(this.sprite);
        this.life = this.typeData.life;
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
        var jsonName = "enemy_json_" + this.type + "_" + Utils.zeroPad(level, 2);
        var pngName = "enemy_png_" + this.type + "_" + Utils.zeroPad(level, 2);
        var data = smorball.loader.getResult(jsonName);
        var sprite = smorball.loader.getResult(pngName);
        data.images = [sprite];
        console.log("creating enemy", this.type, data, sprite);
        return data;
    };
    Enemy.prototype.setExtras = function () {
        this.typeData = enemyData[this.type];
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
        this.sprite.gotoAndPlay("run");
    };
    Enemy.prototype.update = function (delta) {
        this.x = this.x - this.speed * delta;
        if (this.endPoint != null && this.hit == false && this.x < this.endPoint) {
            this.hit = true;
            this.lifes.length = 0;
            this.kill(0);
            EventBus.dispatch("killLife");
        }
    };
    Enemy.prototype.die = function () {
        this.sprite.gotoAndPlay("dead");
    };
    Enemy.prototype.kill = function (life) {
        var _this = this;
        var me = this;
        for (var i = 0; i < life; i++) {
            if (this.lifes.length != 0) {
                this.removeLife();
            }
        }
        var fileId = this.typeData.sound.hit;
        EventBus.dispatch("playSound", fileId);
        //var lanesObj = this.config.lanesObj;
        //for (var i = 0; i < lanesObj.length; i++) {
        //	if (this.startingLane == lanesObj[i].laneId) {
        //		var currentLaneObj = lanesObj[i];
        //	}
        //}
        if (this.lifes.length == 0) {
            this.hit = true;
            var fileId = this.typeData.sound.die;
            EventBus.dispatch("playSound", fileId);
            this.sprite.gotoAndPlay("dead");
            this.sprite.on("animationend", function () { return smorball.stageController.removeEnemy(_this); }, this, true);
        }
        else {
        }
        return this.lifes.length;
    };
    Enemy.prototype.setSpeed = function (speed) {
        this.speed = speed;
        this.sprite._animation.speed = speed;
    };
    Enemy.prototype.addLife = function (start) {
        var life = new createjs.Bitmap(smorball.loader.getResult("heart_full"));
        this.lifeRectSize = life.getBounds().width;
        this.heartsContainer.addChild(life);
        this.lifes.push(life);
        this.heartsContainer.x = -this.heartsContainer.getBounds().width / 2;
    };
    Enemy.prototype.removeLife = function () {
        var life = this.lifes.pop();
        life.image = smorball.loader.getResult("heart_empty");
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
        //this.config.enemySound = EnemyData[this.type].sound;
    };
    Enemy.prototype.getMaxLife = function () {
        return enemyData[this.type].life;
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
    return Enemy;
})(createjs.Container);
