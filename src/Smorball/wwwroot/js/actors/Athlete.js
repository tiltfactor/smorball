/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AthleteState;
(function (AthleteState) {
    AthleteState[AthleteState["Entering"] = 0] = "Entering";
    AthleteState[AthleteState["ReadyToRun"] = 1] = "ReadyToRun";
    AthleteState[AthleteState["Running"] = 2] = "Running";
    AthleteState[AthleteState["Dieing"] = 3] = "Dieing";
})(AthleteState || (AthleteState = {}));
var Athlete = (function (_super) {
    __extends(Athlete, _super);
    function Athlete(type, lane) {
        _super.call(this);
        this.state = 1 /* ReadyToRun */;
        this.lane = lane;
        this.type = type;
        // Start us off in the correct position
        var startPos = smorball.config.friendlySpawnPositions[this.lane];
        this.x = startPos.x;
        this.y = startPos.y;
        // Setup the spritesheet
        var ss = new createjs.SpriteSheet(this.getSpritesheetData());
        this.sprite = new createjs.Sprite(ss, "idle");
        this.sprite.framerate = 20;
        this.addChild(this.sprite);
        // Offset by the correct offset
        this.sprite.x = -this.type.offsetX;
        this.sprite.y = -this.type.offsetY;
        // Draw a debug circle
        if (smorball.config.debug) {
            var circle = new createjs.Shape();
            circle.graphics.beginFill("red");
            circle.graphics.drawCircle(0, 0, 10);
            this.addChild(circle);
        }
        this.animateIn();
    }
    Athlete.prototype.animateIn = function () {
        this.startX = this.x;
        this.x -= (200 + Math.random() * 10);
        this.state = 0 /* Entering */;
        this.sprite.gotoAndPlay("run");
    };
    Athlete.prototype.getSpritesheetData = function () {
        var level = smorball.game.levelIndex;
        var jsonName = this.type.id + "_normal_json";
        var pngName = this.type.id + "_normal_png";
        var data = smorball.resources.getResource(jsonName);
        var sprite = smorball.resources.getResource(pngName);
        data.images = [sprite];
        return data;
    };
    Athlete.prototype.update = function (delta) {
        if (this.state == 0 /* Entering */) {
            this.x = this.x + this.type.speed * delta;
            if (this.x >= this.startX)
                this.setReadyToRun();
        }
        else if (this.state == 2 /* Running */) {
            // Move the enemy along
            this.x = this.x + this.type.speed * delta;
            // Check for collisions
            this.checkCollisions();
            // If we get to the end of the world then die
            if (this.x > smorball.config.width)
                this.tackle();
        }
    };
    Athlete.prototype.checkCollisions = function () {
        var _this = this;
        var myBounds = this.getBounds();
        myBounds.x += this.x;
        myBounds.y += this.y;
        _.chain(smorball.game.enemies).filter(function (e) { return e.state == 0 /* Alive */ && e.lane == _this.lane; }).each(function (e) {
            var theirBounds = e.getBounds();
            theirBounds.x += e.x;
            theirBounds.y += e.y;
            if (myBounds.intersects(theirBounds)) {
                e.tackled(_this);
                _this.tackle();
            }
        });
    };
    Athlete.prototype.tackle = function () {
        var _this = this;
        this.state = 3 /* Dieing */;
        this.sprite.gotoAndPlay("tackle");
        this.sprite.on("animationend", function (e) { return _this.destroy(); }, this, false);
    };
    Athlete.prototype.setReadyToRun = function () {
        this.x = this.startX;
        this.state = 1 /* ReadyToRun */;
        this.sprite.gotoAndPlay("idle");
        smorball.captchas.refreshCaptcha(this.lane);
    };
    Athlete.prototype.destroy = function () {
        smorball.game.athletes.splice(smorball.game.athletes.indexOf(this), 1);
        smorball.screens.game.actors.removeChild(this);
    };
    Athlete.prototype.run = function () {
        this.state = 2 /* Running */;
        this.sprite.gotoAndPlay("run");
    };
    return Athlete;
})(createjs.Container);
