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
    AthleteState[AthleteState["Tackling"] = 3] = "Tackling";
})(AthleteState || (AthleteState = {}));
var Athlete = (function (_super) {
    __extends(Athlete, _super);
    function Athlete(type, lane) {
        _super.call(this);
        this.state = 1 /* ReadyToRun */;
        this.lane = lane;
        this.type = type;
        this.damageMultiplier = 1;
        this.enemiesTackled = [];
        // If a powerup is already selected then make sure we have it set
        if (smorball.screens.game.selectedPowerup != null)
            this.powerup = smorball.screens.game.selectedPowerup.type;
        // Start us off in the correct position
        var startPos = smorball.config.friendlySpawnPositions[this.lane];
        this.x = startPos.x;
        this.y = startPos.y;
        // Setup the spritesheet
        this.sprite = new SBSprite(this.getSpritesheet(), "idle");
        this.sprite.regX = this.type.offsetX;
        this.sprite.regY = this.type.offsetY;
        this.sprite.framerate = 20;
        this.sprite.scaleX = this.sprite.scaleY = this.type.scale;
        this.addChild(this.sprite);
        // Draw a debug circle
        //if (smorball.config.debug) {
        //	var circle = new createjs.Shape();
        //	circle.graphics.beginFill("red");
        //	circle.graphics.drawCircle(0, 0, 10);
        //	this.addChild(circle);
        //}
        this.animateIn();
    }
    Athlete.prototype.animateIn = function () {
        this.startX = this.x;
        this.x -= (200 + Math.random() * 10);
        this.state = 0 /* Entering */;
        this.sprite.gotoAndPlay("run");
    };
    Athlete.prototype.getSpritesheet = function () {
        var level = smorball.game.levelIndex;
        // The variation depends upon the selected powerup
        var variation = "normal";
        if (this.powerup == "cleats")
            variation = "cleats";
        else if (this.powerup == "helmet")
            variation = "helmet";
        // Work out the resource name for the data and the image
        var jsonName = this.type.id + "_" + variation + "_json";
        var pngName = this.type.id + "_" + variation + "_png";
        // Grab them
        var data = smorball.resources.getResource(jsonName);
        var sprite = smorball.resources.getResource(pngName);
        // BIG HACK for helmeted hockey lady to make the animation look right
        if (this.type.id == "hockey" && this.powerup == "helmet") {
            // Clone the data
            data = JSON.parse(JSON.stringify(data));
            var frames = data.frames;
            var newframes = frames.slice();
            // Rejig the frames
            newframes[41] = frames[39];
            newframes[42] = frames[38];
            newframes[43] = frames[39];
            newframes[44] = frames[36];
            newframes[45] = frames[35];
            newframes[46] = frames[34];
            newframes[47] = frames[33];
            // Set the new frames
            data.frames = newframes;
        }
        // Update the data with the image and return
        data.images = [sprite];
        var cjsSS = new createjs.SpriteSheet(data);
        return smorball.sprites.getSpriteSheet(this.type.id + "_" + variation, cjsSS);
    };
    Athlete.prototype.update = function (delta) {
        if (this.state == 0 /* Entering */) {
            this.x = this.x + this.type.speed * delta;
            if (this.x >= this.startX)
                this.setReadyToRun();
        }
        else if (this.state == 2 /* Running */) {
            // Move the enemy along
            var speed = this.type.speed;
            if (this.powerup == "cleats")
                speed *= smorball.powerups.types.cleats.speedMultiplier;
            for (var i = 0; i < smorball.config.physicsIterations; i++) {
                this.x += (speed * delta) / smorball.config.physicsIterations;
                // Check for collisions, if we collide then stop checking
                if (this.checkCollisions())
                    break;
            }
            // If we get to the end of the world then die
            if (this.x > smorball.config.width)
                this.destroy();
        }
    };
    Athlete.prototype.checkCollisions = function () {
        var _this = this;
        var myBounds = this.getTransformedBounds();
        // Look for enemies in the correct state
        var enemies = _.filter(smorball.game.enemies, function (e) { return e.state == 0 /* Alive */ && e.lane == _this.lane && _this.enemiesTackled.indexOf(e) == -1; });
        for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            var theirBounds = e.getTransformedBounds();
            if (myBounds.intersects(theirBounds)) {
                e.tackled(this);
                this.tackle(e);
                return true;
            }
        }
        // Check collisions with powerups
        var powerups = _.filter(smorball.powerups.views, function (p) { return p.lane == _this.lane && p.state == 0 /* NotCollected */; });
        for (var i = 0; i < powerups.length; i++) {
            var p = powerups[i];
            var theirBounds = p.getTransformedBounds();
            if (myBounds.intersects(theirBounds)) {
                p.collect();
            }
        }
        // Dont stop play
        return false;
    };
    Athlete.prototype.tackle = function (enemy) {
        var _this = this;
        // Rember that we have tackeld this enemy
        this.enemiesTackled.push(enemy);
        // Play the tackle anim adn stop running
        this.state = 3 /* Tackling */;
        this.sprite.gotoAndPlay("tackle");
        // Play a sound
        smorball.audio.playSound(this.type.sound.tackle);
        // When the animation is done
        this.sprite.on("animationend", function (e) {
            // If we have the hemlet then we can get back up and continue to run
            if (_this.powerup == "helmet") {
                _this.state = 2 /* Running */;
                _this.sprite.gotoAndPlay("run");
            }
            else
                _this.onDeathAnimationComplete();
        }, this, false);
    };
    Athlete.prototype.onDeathAnimationComplete = function () {
        var _this = this;
        this.sprite.stop();
        createjs.Tween.get(this).to({ alpha: 0 }, 500).call(function () { return _this.destroy(); });
    };
    Athlete.prototype.setReadyToRun = function () {
        this.x = this.startX;
        this.state = 1 /* ReadyToRun */;
        this.sprite.gotoAndPlay("idle");
        var captcha = smorball.captchas.getCaptcha(this.lane);
        if (captcha.chunk == null)
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
    Athlete.prototype.selectedPowerupChanged = function (powerup) {
        // If we arent in one of the states that cares then dont dont anything
        if (this.state != 0 /* Entering */ && this.state != 1 /* ReadyToRun */)
            return;
        this.powerup = powerup;
        this.sprite.spriteSheet = this.getSpritesheet();
    };
    return Athlete;
})(createjs.Container);
