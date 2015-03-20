/// <reference path="../data/playerdata.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="spritesheet.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpriteMan = (function (_super) {
    __extends(SpriteMan, _super);
    function SpriteMan(config) {
        this.config = config;
        this.playerTypes = ["player", "hockey", "football"];
        this.type = this.getRandomType();
        var id = this.type + "_normal";
        this.spriteData = new SpriteSheet({ "id": id, "data": PlayerData[id].data, "loader": this.config.loader, "gameState": this.config.gameState });
        this.sprite = new createjs.Sprite(this.spriteData, "idle");
        this.extras = PlayerData[id].extras;
        this.setScale(this.extras.sX, this.extras.sY);
        this.setEffects(id);
        _super.call(this);
        this.addChild(this.sprite);
        this.hit = false;
        this.hitPowerup = false;
        this.life = 1;
        this.singleHit = false;
        this.hitEnemies = [];
        this.speed = this.config.speed || 12;
        this.bounds = this.getBounds();
    }
    SpriteMan.prototype.getRandomType = function () {
        var type = Math.floor(Math.random() * this.playerTypes.length);
        return this.playerTypes[type];
    };
    SpriteMan.prototype.setDefaultSpriteSheet = function () {
        var id = this.type + "_normal";
        this.spriteData = new SpriteSheet({ "id": id, "data": PlayerData[id].data, "loader": this.config.loader });
        this.sprite.spriteSheet = this.spriteData;
        this.extras = PlayerData[id].extras;
        this.setScale(this.extras.sX, this.extras.sY);
        this.sprite.gotoAndPlay("idle");
    };
    SpriteMan.prototype.setPowerupSpriteSheet = function (powerupType) {
        var id = this.type + "_" + powerupType;
        this.spriteData = new SpriteSheet({ "id": id, "data": PlayerData[id].data, "loader": this.config.loader });
        this.sprite.spriteSheet = this.spriteData;
        this.extras = PlayerData[id].extras;
        this.setScale(this.extras.sX, this.extras.sY);
        this.sprite.gotoAndPlay("idle");
    };
    SpriteMan.prototype.setEffects = function (id) {
        this.config.playerSound = PlayerData[id].extras.sound;
    };
    SpriteMan.prototype.run = function () {
        var _this = this;
        var me = this;
        this.sprite.gotoAndPlay("run");
        this.myTick = function () {
            _this.tick();
        };
        this.addEventListener("tick", this.myTick);
    };
    SpriteMan.prototype.addPowerups = function (power) {
        this.life = power.life;
        this.singleHit = power.singleHit;
    };
    SpriteMan.prototype.pause = function () {
        this.removeEventListener("tick", this.myTick);
        this.sprite.gotoAndPlay("idle");
    };
    SpriteMan.prototype.confused = function () {
        this.sprite.gotoAndPlay("confused");
    };
    SpriteMan.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        this.regX = 0;
        this.regY = this.getHeight();
    };
    SpriteMan.prototype.setSpeed = function (speed) {
        this.speed = speed;
        this.sprite._animation.speed = speed;
    };
    SpriteMan.prototype.kill = function (enemyLife) {
        var _this = this;
        for (var i = 0; i < enemyLife; i++) {
            if (this.life != 0) {
                this.life -= 1;
            }
        }
        if (this.life != 0) {
            this.tackle();
        }
        if (this.life == 0) {
            this.hit = true;
            this.sprite.gotoAndPlay("tackle");
            this.removeEventListener("tick", this.myTick);
            this.sprite.on("animationend", function () {
                EventBus.dispatch("killme", _this);
                EventBus.addEventListener("removeFromStage", _this);
            }, this, true);
            return 0;
        }
    };
    SpriteMan.prototype.tackle = function () {
        var _this = this;
        var me = this;
        this.sprite.gotoAndPlay("tackle");
        this.toRun = function () {
            _this.sprite.removeEventListener("animationend", _this.toRun);
            _this.sprite.gotoAndPlay("run");
        };
        this.sprite.addEventListener("animationend", this.toRun);
    };
    SpriteMan.prototype.setEndPoint = function (endPointX) {
        this.endPoint = endPointX;
    };
    SpriteMan.prototype.getHeight = function () {
        return this.sprite._rectangle.height;
    };
    SpriteMan.prototype.getWidth = function () {
        return this.sprite._rectangle.width;
    };
    SpriteMan.prototype.setScale = function (sx, sy) {
        this.sprite.setTransform(0, 6, sx, sy);
    };
    SpriteMan.prototype.getLaneId = function () {
        return this.config.laneId;
    };
    SpriteMan.prototype.getLife = function () {
        return this.life;
    };
    SpriteMan.prototype.setLife = function (life) {
        this.life = life;
    };
    SpriteMan.prototype.tick = function () {
        this.x = this.x + this.speed;
        if (this.endPoint != null && this.hit == false && this.x > this.endPoint - this.getWidth()) {
            this.hit = true;
            this.kill(1);
        }
    };
    return SpriteMan;
})(createjs.Container);
