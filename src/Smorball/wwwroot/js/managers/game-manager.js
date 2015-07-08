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
        var _this = this;
        this.levels = smorball.resources.getResource("levels_data");
        this.enemyTypes = smorball.resources.getResource("enemies_data");
        this.levelEnemyTypes = this.enemyTypes;
        this.athleteTypes = smorball.resources.getResource("athletes_data");
        // Lets make sure that all the athlete spritesheets have been created at the start
        _.each(this.athleteTypes, function (type) {
            var a = new Athlete(type, 0);
            _.each(["helmet", "bullhorn", "cleats"], function (p) { return a.selectedPowerupChanged(p); });
        });
        // Listen for keyboard presses
        document.onkeydown = function (e) { return _this.onKeyDown(e); };
    };
    GameManager.prototype.onKeyDown = function (e) {
        // Only handle keypresses if we are running
        if (this.state != 2 /* Playing */)
            return;
        // Tab
        if (e.keyCode == 9) {
            smorball.screens.game.selectNextPowerup();
            e.preventDefault();
        }
        // Alt
        if (e.keyCode == 18) {
            if (smorball.game.passesRemaining > 0) {
                smorball.captchas.pass();
            }
            e.preventDefault();
        }
    };
    GameManager.prototype.loadLevel = function (levelIndex) {
        console.log("starting level", levelIndex);
        // Set these now
        this.state = 1 /* Loading */;
        this.levelIndex = levelIndex;
        this.level = this.getLevel(levelIndex);
        
        //to save game size, we want to avoid trying to load a spritesheet if that
        //enemy type is not used in this level. To that end, we set the path of all
        //enemies not used in this level to spritePath "01" so it just loads the one 
        //from the first level
        this.levelEnemyTypes = jQuery.extend(true, {}, this.enemyTypes);
        _.each(smorball.game.levelEnemyTypes, function(enemy){
        	var enemyNeeded = false;
        	for (var i=0; i<smorball.game.level.enemytypes.length; i++){
        		console.log("checking "+enemy.id+" against "+smorball.game.level.enemytypes[i]);
        		if (enemy.id == smorball.game.level.enemytypes[i]) {
        			console.log("needed");
        			enemyNeeded = true;
        		}
        	}
        	if (!enemyNeeded){
        		console.log("deleting "+enemy.id);
				enemy.spritesPathTemplate=enemy.spritesPathTemplate.replace("{0}","01");
        	}
        });
        
        this.enemiesKilled = 0;
        this.enemySpeedBuff = 0;
        this.levelScore = smorball.config.maxScore;
        this.passesRemaining = this.level.passes == null ? smorball.config.passes : this.level.passes;
        // Load the resources needed
        smorball.resources.loadLevelResources(levelIndex);
        // Take this oppertunity to grab a new page from the API
        if(createjs.BrowserDetect.isChrome)
        {
        	smorball.captchas.remoteChunks = [];
       		//smorball.captchas.loadPagesFromServer(1, 0);
        }
        else
        	smorball.captchas.loadPagesFromServer(2, 0);
        // Show the loading screen
        smorball.screens.open(smorball.screens.loadingLevel);
    };
    GameManager.prototype.play = function () {
        // Force one of each enemy to be created, this will ensure that the spritesheet cache is correctly constructed
        _.each(smorball.game.levelEnemyTypes, function (t) { return new Enemy(t, 0); });
        // Reset these
        this.enemies = [];
        this.athletes = [];
        this.timeOnLevel = 0;
        this.knockbackMultiplier = 1;
        this.levelScore = smorball.config.maxScore;
        // Let these know about the new level starting (order is important here)
        smorball.screens.open(smorball.screens.game);
        smorball.screens.game.newLevel();
        smorball.powerups.newLevel();
        smorball.timeTrial.newLevel();
        smorball.user.newLevel();
        smorball.spawning.startNewLevel(this.level);
        smorball.captchas.startNewLevel(this.level);
        smorball.upgrades.newLevel();
        // Start playing the crowd cheering sound
        this.ambienceSound = smorball.audio.playAudioSprite("stadium_ambience_looping_sound", { startTime: 0, duration: 28000, loop: -1 }, 0.8);
        // Finaly change the state so we start playing
        this.state = 2 /* Playing */;
    };
    GameManager.prototype.getLevel = function (indx) {
        return this.levels[indx];
    };
    GameManager.prototype.update = function (delta) {
        if (this.state != 2 /* Playing */)
            return;
        this.timeOnLevel += delta;
        _.each(this.enemies, function (e) {
            if (e != null)
                e.update(delta);
        });
        _.each(this.athletes, function (e) {
            if (e != null)
                e.update(delta);
        });
        if (this.levelScore <= 0)
            this.gameOver(false);
    };
    GameManager.prototype.gameOver = function (win) {
        // Set these
        this.state = 4 /* GameOver */;
        //createjs.Ticker.setPaused(true);
        // Send inputs to server
        smorball.captchas.sendInputsToServer();
        // If this is a timetrail level then we need to do something special
        if (this.level.timeTrial) {
            // Save this
            smorball.user.lastSurvivalTime = this.timeOnLevel;
            // If we beat the best time then update it here
            if (this.timeOnLevel > smorball.user.bestSurvivalTime)
                smorball.user.bestSurvivalTime = this.timeOnLevel;
            // Show the end screen
            smorball.screens.game.showTimeTrialEnd();
            // Save
            smorball.persistance.persist();
        }
        else if (win) {
            // Stop the ambience
            smorball.audio.fadeOutAndStop(this.ambienceSound, 2000);
            // Play a different ambient sound
            this.ambienceSound = smorball.audio.playSound("crowd_cheering_ambient_sound", 0.8);
            // If this is the first level then lets adjust the difficulty
            if (this.levelIndex == 0)
                smorball.difficulty.updateDifficulty(this.timeOnLevel);
            // Make all the audience cheer
            smorball.screens.game.stadium.cheerAudience();
            // Work out how much we earnt
            var earnt = smorball.user.levelWon(this.levelIndex);
            smorball.screens.game.showVictory(earnt);
        }
        else
            smorball.screens.game.showDefeat(0);
    };
    GameManager.prototype.enemyReachedGoaline = function (enemy) {
        // Decrement 1000 from the score
        this.levelScore -= 100;
        // Rememberthis too
        this.enemiesKilled++;
        // Show some floating text
        smorball.screens.game.actors.addChild(new FloatingText("-100", enemy.x, enemy.y - enemy.getBounds().height));
        // Flash the score red
        smorball.screens.game.flashRed(smorball.screens.game.scoreEl, 800);
        smorball.screens.game.flashRed(smorball.screens.game.opponentsEl, 800);
        // Change the captcha
        if (this.levelIndex == 0)
            smorball.captchas.refreshCaptcha(enemy.lane);
        // If its a time trail then only one enemy is allowed to reach the goaline
        if (this.level.timeTrial)
            this.gameOver(false);
    };
    GameManager.prototype.getOpponentsRemaining = function () {
        return smorball.spawning.enemySpawnsThisLevel - smorball.game.enemiesKilled;
    };
    GameManager.prototype.getEnemyProximity = function (lane) {
        var enemiesInLane = _.where(this.enemies, {"lane": lane});
        if (enemiesInLane.length == 0) // there are no enemies in the lane
            return 0;
        var closestEnemy = _.min(enemiesInLane, "x");
        var enemyDistance = closestEnemy.x - smorball.config.goalLine;
        var laneWidth = smorball.config.enemySpawnPositions[lane].x - smorball.config.goalLine;
        return 1 - enemyDistance / laneWidth;
    }
    GameManager.prototype.enemyKilled = function (enemy) {
        this.enemiesKilled++;
        smorball.powerups.onEnemyKilled(enemy);
        // Flash the score red
        smorball.screens.game.flashRed(smorball.screens.game.opponentsEl, 800);
    };
    GameManager.prototype.timeout = function () {
        this.state = 3 /* Timeout */;
        createjs.Ticker.setPaused(true);
        smorball.screens.game.showTimeout();
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
        var _this = this;
        createjs.Ticker.setPaused(false);
        this.ambienceSound.paused = true;
        smorball.screens.instructions.backMenu = smorball.screens.game;
        smorball.screens.open(smorball.screens.instructions);
        smorball.screens.instructions.on("back", function () {
            createjs.Ticker.setPaused(true);
            _this.ambienceSound.paused = false;
            smorball.stage.update();
        }, this, true);
    };
    GameManager.prototype.returnToMap = function () {
        createjs.Ticker.setPaused(false);
        this.state = 0 /* NotPlaying */;
        smorball.screens.open(smorball.screens.map);
        // Send inputs to server
        smorball.captchas.sendInputsToServer();
        // Stop the ambience
        if (this.ambienceSound && this.ambienceSound.playState != "playFinished")
            smorball.audio.fadeOutAndStop(this.ambienceSound, 2000);
    };
    return GameManager;
})(createjs.Container);
