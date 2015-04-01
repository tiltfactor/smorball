var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameState;
(function (GameState) {
    GameState[GameState["NotPlaying"] = 0] = "NotPlaying";
    GameState[GameState["Loading"] = 1] = "Loading";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["Timeout"] = 3] = "Timeout";
    GameState[GameState["GameOver"] = 4] = "GameOver";
})(GameState || (GameState = {}));
var GameManager = (function (_super) {
    __extends(GameManager, _super);
    function GameManager() {
        _super.apply(this, arguments);
        this.state = 0 /* NotPlaying */;
    }
    GameManager.prototype.init = function () {
        this.levels = smorball.resources.getResource("levels_data");
        this.enemyTypes = smorball.resources.getResource("enemies_data");
        this.athleteTypes = smorball.resources.getResource("athletes_data");
        console.log("this.enemyTypes", this.enemyTypes);
    };
    GameManager.prototype.loadLevel = function (levelIndex) {
        console.log("starting level", levelIndex);
        // Set these now
        this.state = 1 /* Loading */;
        this.levelIndex = levelIndex;
        this.level = this.getLevel(levelIndex);
        this.enemiesKilled = 0;
        this.enemyTouchdowns = 0;
        this.passesRemaining = smorball.config.passes;
        // Load the resources needed
        smorball.resources.loadLevelResources(levelIndex);
        // Show the loading screen
        smorball.screens.open(smorball.screens.loadingLevel);
    };
    GameManager.prototype.play = function () {
        // Open the correct screen
        smorball.screens.open(smorball.screens.game);
        smorball.screens.game.newGame();
        // Reset these
        this.enemies = [];
        this.athletes = [];
        // Update the spawner
        smorball.spawning.startNewLevel(this.level);
        smorball.captchas.startNewLevel(this.level);
        // Finaly change the state so we start playing
        this.state = 2 /* Playing */;
    };
    GameManager.prototype.getLevel = function (indx) {
        return this.levels[indx];
    };
    GameManager.prototype.update = function (delta) {
        if (this.state != 2 /* Playing */)
            return;
        _.each(this.enemies, function (e) { return e.update(delta); });
        _.each(this.athletes, function (e) { return e.update(delta); });
    };
    GameManager.prototype.gameOver = function (win) {
        this.state = 4 /* GameOver */;
        createjs.Ticker.setPaused(true);
        if (win) {
            var earnt = smorball.user.levelWon(this.levelIndex);
            smorball.screens.game.showVictory(earnt);
        }
        else
            smorball.screens.game.showDefeat(0);
    };
    GameManager.prototype.enemyReachedGoaline = function (enemy) {
        this.enemyTouchdowns++;
        smorball.captchas.refreshCaptcha(enemy.lane);
        if (this.enemyTouchdowns >= smorball.config.enemyTouchdowns)
            this.gameOver(false);
    };
    GameManager.prototype.getScore = function () {
        return (smorball.config.enemyTouchdowns - this.enemyTouchdowns) * 1000;
    };
    GameManager.prototype.enemyKilled = function (enemy) {
        this.enemiesKilled++;
    };
    GameManager.prototype.timeout = function () {
        this.state = 3 /* Timeout */;
        createjs.Ticker.setPaused(true);
        smorball.screens.game.timeoutEl.hidden = false;
        smorball.screens.game.captchas.visible = false;
        smorball.stage.update();
    };
    GameManager.prototype.resume = function () {
        this.state = 2 /* Playing */;
        createjs.Ticker.setPaused(false);
        smorball.screens.game.timeoutEl.hidden = true;
        smorball.screens.game.captchas.visible = true;
    };
    GameManager.prototype.help = function () {
        createjs.Ticker.setPaused(false);
        smorball.screens.instructions.backMenu = smorball.screens.game;
        smorball.screens.open(smorball.screens.instructions);
        smorball.screens.instructions.on("back", function () {
            createjs.Ticker.setPaused(true);
            smorball.stage.update();
        }, this, true);
    };
    GameManager.prototype.returnToMap = function () {
        createjs.Ticker.setPaused(false);
        this.state = 0 /* NotPlaying */;
        smorball.screens.open(smorball.screens.map);
    };
    return GameManager;
})(createjs.Container);
