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
var PlayerAthleteStates;
(function (PlayerAthleteStates) {
    PlayerAthleteStates[PlayerAthleteStates["AnimatingIn"] = 0] = "AnimatingIn";
    PlayerAthleteStates[PlayerAthleteStates["ReadyToRun"] = 1] = "ReadyToRun";
    PlayerAthleteStates[PlayerAthleteStates["Running"] = 2] = "Running";
    PlayerAthleteStates[PlayerAthleteStates["Dieing"] = 3] = "Dieing";
    PlayerAthleteStates[PlayerAthleteStates["Dead"] = 4] = "Dead";
})(PlayerAthleteStates || (PlayerAthleteStates = {}));
var PlayerAthlete = (function (_super) {
    __extends(PlayerAthlete, _super);
    function PlayerAthlete(laneId, type) {
        this.laneId = laneId;
        this.type = type;
        this.powerup = "normal";
        this.state = 1 /* ReadyToRun */;
        this.typeData = playerData[this.type];
        this.sprite = new createjs.Sprite(this.constructSpritesheet(), "idle");
        this.sprite.framerate = 20;
        this.sprite.x = -this.typeData.offsetX;
        this.sprite.y = -this.typeData.offsetY;
        this.setEffects(this.type);
        _super.call(this);
        this.addChild(this.sprite);
        this.hitPowerup = false;
        this.life = 1;
        this.singleHit = false;
        this.hitEnemies = [];
        this.speed = this.typeData.speed;
        this.bounds = this.getBounds();
        if (location.hostname == "localhost") {
            var circle = new createjs.Shape();
            circle.graphics.beginFill("red");
            circle.graphics.drawCircle(0, 0, 10);
            this.addChild(circle);
        }
    }
    PlayerAthlete.prototype.updateSpriteSheet = function () {
        this.sprite.spriteSheet = this.constructSpritesheet();
    };
    PlayerAthlete.prototype.constructSpritesheet = function () {
        var data = smorball.loader.getResult(this.type + "_" + this.powerup + "_json");
        var sprite = smorball.loader.getResult(this.type + "_" + this.powerup + "_png");
        data.images = [sprite];
        return new createjs.SpriteSheet(data);
    };
    PlayerAthlete.prototype.setEffects = function (id) {
        this.playerSound = playerData[id].sound;
    };
    PlayerAthlete.prototype.animateIn = function () {
        this.startX = this.x;
        this.x -= 200;
        this.state = 0 /* AnimatingIn */;
        this.sprite.gotoAndPlay("run");
    };
    PlayerAthlete.prototype.update = function (delta) {
        if (this.state == 0 /* AnimatingIn */) {
            this.x = this.x + this.speed * delta;
            if (this.x >= this.startX)
                this.setReadyToRun();
        }
        else if (this.state == 2 /* Running */) {
            this.x = this.x + this.speed * delta;
            // If we run past the end of the world then lets just die
            if (this.x > gameConfig.worldWidth)
                this.kill(1);
        }
    };
    PlayerAthlete.prototype.setReadyToRun = function () {
        this.x = this.startX;
        this.state = 1 /* ReadyToRun */;
        this.sprite.gotoAndPlay("idle");
        smorball.stageController.capatchas.refreshCaptcha(this.laneId);
    };
    PlayerAthlete.prototype.run = function () {
        this.sprite.gotoAndPlay("run");
    };
    PlayerAthlete.prototype.addPowerups = function (power) {
        this.life = power.life;
        this.singleHit = power.singleHit;
    };
    PlayerAthlete.prototype.confused = function () {
        this.sprite.gotoAndPlay("confused");
    };
    PlayerAthlete.prototype.kill = function (enemyLife) {
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
            this.sprite.gotoAndPlay("tackle");
            this.sprite.on("animationend", function () { return smorball.stageController.removeAthlete(_this); }, this, true);
            return 0;
        }
    };
    PlayerAthlete.prototype.tackle = function () {
        var _this = this;
        var me = this;
        this.sprite.gotoAndPlay("tackle");
        this.toRun = function () {
            _this.sprite.removeEventListener("animationend", _this.toRun);
            _this.sprite.gotoAndPlay("run");
        };
        this.sprite.addEventListener("animationend", this.toRun);
    };
    PlayerAthlete.prototype.setEndPoint = function (endPointX) {
        this.endPoint = endPointX;
    };
    PlayerAthlete.prototype.getHeight = function () {
        return this.sprite._rectangle.height;
    };
    PlayerAthlete.prototype.getWidth = function () {
        return this.sprite._rectangle.width;
    };
    PlayerAthlete.prototype.getLife = function () {
        return this.life;
    };
    PlayerAthlete.prototype.setLife = function (life) {
        this.life = life;
    };
    return PlayerAthlete;
})(createjs.Container);
