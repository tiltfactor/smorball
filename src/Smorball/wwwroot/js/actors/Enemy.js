var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EnemyState;
(function (EnemyState) {
    EnemyState[EnemyState["Alive"] = 0] = "Alive";
    EnemyState[EnemyState["Dieing"] = 1] = "Dieing";
    EnemyState[EnemyState["Scoring"] = 2] = "Scoring";
    EnemyState[EnemyState["Damaged"] = 3] = "Damaged";
})(EnemyState || (EnemyState = {}));
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(type, startingLane) {
        _super.call(this);
        this.state = 0 /* Alive */;
        // Store these
        this.type = type;
        this.startingLane = this.lane = startingLane;
        this.lifeRemaining = type.life;
        // Start us off in the correct position
        var startPos = smorball.config.enemySpawnPositions[this.startingLane];
        this.x = startPos.x;
        this.y = startPos.y;
        // Setup the spritesheet
        var ss = new createjs.SpriteSheet(this.getSpritesheetData());
        this.sprite = new createjs.Sprite(ss, "run");
        this.sprite.framerate = 20;
        this.addChild(this.sprite);
        // Offset by the correct offset
        this.sprite.x = -this.type.offsetX;
        this.sprite.y = -this.type.offsetY;
        // Create the health indicator
        this.addHearts();
        // Draw a debug circle
        if (smorball.config.debug) {
            var circle = new createjs.Shape();
            circle.graphics.beginFill("red");
            circle.graphics.drawCircle(0, 0, 10);
            this.addChild(circle);
        }
    }
    Enemy.prototype.addHearts = function () {
        // Set the hearts container
        this.heartsContainer = new createjs.Container();
        this.heartsContainer.y = -(this.sprite.getBounds().height + 50);
        this.addChild(this.heartsContainer);
        for (var i = 0; i < this.type.life; i++) {
            var life = new createjs.Bitmap(smorball.resources.getResource("heart_full"));
            this.heartsContainer.addChild(life);
            this.heartsContainer.x = -this.heartsContainer.getBounds().width / 2;
        }
    };
    Enemy.prototype.getSpritesheetData = function () {
        var level = smorball.game.levelIndex;
        var jsonName = this.type.id + "_" + Utils.zeroPad(level, 2) + "_json";
        var pngName = this.type.id + "_" + Utils.zeroPad(level, 2) + "_png";
        var data = smorball.resources.getResource(jsonName);
        var sprite = smorball.resources.getResource(pngName);
        data.images = [sprite];
        return data;
    };
    Enemy.prototype.update = function (delta) {
        var _this = this;
        if (this.state == 0 /* Alive */) {
            // Move the enemy along
            this.x = this.x - this.type.speed * delta;
            // If we get the goal line then happy days!
            if (this.x < smorball.config.goalLine) {
                this.state = 2 /* Scoring */;
                smorball.game.enemyReachedGoaline(this);
                this.sprite.gotoAndPlay("scoring");
                this.sprite.on("animationend", function (e) { return _this.destroy(); }, this, false);
            }
        }
    };
    Enemy.prototype.tackled = function (athlete) {
        var _this = this;
        // Decrement the life
        this.lifeRemaining--;
        var bm = this.heartsContainer.getChildAt(this.lifeRemaining);
        bm.image = smorball.resources.getResource("heart_empty");
        // If we are dead then play the anmation and destroy
        if (this.lifeRemaining == 0) {
            smorball.game.enemyKilled(this);
            this.state = 1 /* Dieing */;
            this.sprite.gotoAndPlay("dead");
            this.sprite.on("animationend", function (e) { return _this.destroy(); }, this, false);
        }
        else {
            this.state = 3 /* Damaged */;
            this.sprite.gotoAndPlay("hurt");
            this.sprite.on("animationend", function (e) {
                _this.state = 0 /* Alive */;
                _this.sprite.gotoAndPlay("run");
            }, this, false);
        }
    };
    Enemy.prototype.destroy = function () {
        smorball.game.enemies.splice(smorball.game.enemies.indexOf(this), 1);
        smorball.screens.game.actors.removeChild(this);
    };
    return Enemy;
})(createjs.Container);
