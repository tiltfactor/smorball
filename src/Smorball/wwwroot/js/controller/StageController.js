/// <reference path="../model/lane.ts" />
/// <reference path="../model/mybag.ts" />
/// <reference path="../model/waves.ts" />
/// <reference path="../model/commentarybox.ts" />
/// <reference path="../data/manifest.ts" />
/// <reference path="../data/leveldata.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
var StageController = (function () {
    function StageController() {
        this.events = {};
        this.activePowerup = undefined;
    }
    StageController.prototype.init = function () {
        var _this = this;
        this.stage = new createjs.Stage("myCanvas");
        this.stage.enableMouseOver(10);
        this.setCanvasAttributes();
        createjs.Ticker.setFPS(20);
        this.events.tick = function () { return _this.tick(); };
        createjs.Ticker.addEventListener("tick", function () { return _this.tick(); });
        createjs.Ticker.setPaused(true);
        this.loadEvents();
        this.currentIndex = 0;
        this.default_player = "player_normal";
        this.powerup_player = "player_helmet";
    };
    StageController.prototype.loadEvents = function () {
        var _this = this;
        EventBus.addEventListener("newGame", function () { return _this.newGame(); });
        EventBus.addEventListener("resumeGame", function () { return _this.resumeGame(); });
        EventBus.addEventListener("pauseGame", function () { return _this.pauseGame(); });
        //EventBus.addEventListener("killme",(o) => this.killMe(o));
        EventBus.addEventListener("killLife", function () { return _this.killLife(); });
        //EventBus.addEventListener("pushEnemy",(o:any) => this.pushEnemy(o.target));
        EventBus.addEventListener("pushPowerup", function (o) { return _this.pushPowerup(o.target); });
        EventBus.addEventListener("showTimeoutScreen", function () { return _this.showTimeoutScreen(); });
        EventBus.addEventListener("showMessage", function (text) { return _this.showGameMessage(text); });
        EventBus.addEventListener("compareCaptcha", function () { return _this.compareCaptcha(); });
        EventBus.addEventListener("toggleTickerStatus", function () { return _this.toggleTickerStatus(); });
        EventBus.addEventListener("unselectAllInBag", function () { return _this.unselectAllInBag(); });
        EventBus.addEventListener("selectPowerUp", function (powerup) { return _this.selectPowerUp(powerup.target); });
        EventBus.addEventListener("changeLane", function (obj) { return _this.changeLane(obj.target); });
        EventBus.addEventListener("showCaptchas", function () { return _this.captchaProcessor.showCaptchas(); });
        EventBus.addEventListener("onImagesLoad", function () { return _this.onImagesLoad(); });
        EventBus.addEventListener("resetAll", function () { return _this.resetAll(); });
        EventBus.addEventListener("hideTimeOut", function () { return _this.hideTimeOut(); });
        EventBus.addEventListener("stopCheering", function () {
            console.log("MIKEC ==> stop cheering does not exit?!"); /*this.stopCheering()*/
        });
        EventBus.addEventListener("removeFromStage", function (o) { return _this.removeFromStage(o.target); });
    };
    StageController.prototype.newGame = function () {
        if (smorball.gameState.inputTextArr.length != 0) {
            this.saveInputTexts();
        }
        smorball.myBag.newGame();
        this.timeSpend = 0;
        this.currentTime = createjs.Ticker.getTime(true);
        $("#inputText").val("");
        this.resetGame();
        smorball.gameState.currentState = smorball.gameState.states.RUN;
        this.levelConfig = LevelData[smorball.gameState.currentLevel];
        this.spawning = new Spawning({ "gameState": smorball.gameState });
        this.captchaProcessor = new CaptchaProcessor({
            "loader": smorball.loader,
            "canvasWidth": this.canvasWidth,
            "canvasHeight": this.canvasHeight,
            "gameState": smorball.gameState
        });
        $("#loaderDiv").show();
        this.loadImages();
        $("#myCanvas").show();
        EventBus.dispatch("setMute");
        var config = { "gameState": smorball.gameState };
        this.score = new Score(config);
    };
    StageController.prototype.loadImages = function () {
        var manifest = [];
        if (!smorball.gameState.level) {
            smorball.gameState.level = true;
            console.log("Loading images from manifest for level", smorball.gameState.currentLevel);
            smorball.loader.loadLevelQueue(this.constructLevelManifest(smorball.gameState.currentLevel), smorball.gameState.currentLevel);
        }
        else {
            smorball.loader.loadLevelQueue(manifest, smorball.gameState.currentLevel);
        }
    };
    StageController.prototype.constructLevelManifest = function (level) {
        // HAAAAACK! Settings level to always be 1 for now so we use the same sprites
        level = 1;
        // We take the standard level elements then we need to add level specific assets such as the enemy variations
        var assets = Manifest.level.slice();
        _.each(EnemyData, function (enemy) {
            var path = Utils.format(enemy.spritesPathTemplate, Utils.zeroPad(level, 2));
            assets.push({ src: path + ".json", id: "enemy_json_" + enemy.id + "_" + Utils.zeroPad(level, 2) });
            assets.push({ src: path + ".png", id: "enemy_png_" + enemy.id + "_" + Utils.zeroPad(level, 2) });
            //console.log("enemy", enemy, path, asset);
        });
        return assets;
    };
    StageController.prototype.onImagesLoad = function () {
        var _this = this;
        $("#canvasHolder input").prop("disabled", false);
        window.onmousedown = function () { return _this.prevent(); };
        $("#inputText").focus();
        this.onResize();
        window.onresize = function () {
            _this.onResize();
        };
        this.drawBackGround();
        this.drawLane();
        this.drawStadium();
        this.drawLogo();
        this.actorsContainer = new createjs.Container();
        this.stage.addChild(this.actorsContainer);
        EventBus.dispatch("showCommentary", this.levelConfig.waves.message);
        EventBus.dispatch("setScore", this.life);
        this.initShowMessage();
        this.generateWaves();
        this.showPowerup();
        this.setCaptchaIndex();
        EventBus.dispatch("toggleTickerStatus");
    };
    StageController.prototype.initShowMessage = function () {
        this.message = new createjs.Bitmap(null);
        this.message.x = 800;
        this.message.y = 1000;
        this.message.alpha = 0;
        this.stage.addChild(this.message);
    };
    StageController.prototype.setCaptchaIndex = function () {
        var _this = this;
        var captchas = _.filter(this.stage.children, function (a) {
            if (a.name == "captchaHolder")
                return a;
        });
        var length = this.stage.children.length;
        _.each(captchas, function (a) {
            var player = _this.lanes[a.id - 1].player;
            if (player) {
                length = _this.stage.getChildIndex(player);
            }
            _this.stage.setChildIndex(a, length - 1);
        });
    };
    StageController.prototype.showGameMessage = function (msg) {
        var text = msg.target;
        this.showMessage(text);
    };
    StageController.prototype.showMessage = function (text) {
        this.message.image = smorball.loader.getResult(text);
        this.message.x = 800 - this.message.getBounds().width / 2;
        var index = this.stage.children.length - 1;
        this.stage.setChildIndex(this.message, index);
        createjs.Tween.get(this.message).to({ alpha: 1 }, 100).wait(500).to({ alpha: 0 }, 1000);
    };
    StageController.prototype.setCanvasAttributes = function () {
        this.freeBottomAreaY = 70;
        this.freeLeftAreaX = 0;
        this.onResize();
        this.width = 1600;
        this.height = 1200;
        this.freeTopAreaY = this.height / 2;
    };
    StageController.prototype.onResize = function () {
        var canvas = this.stage.canvas;
        this.canvasWidth = canvas.width = window.innerHeight * 4 / 3 > window.innerWidth ? window.innerWidth : window.innerHeight * 4 / 3;
        this.canvasHeight = canvas.height = this.canvasWidth * 3 / 4 > window.innerHeight ? window.innerHeight : this.canvasWidth * 3 / 4;
        this.stage.scaleX = this.canvasWidth / 1600;
        this.stage.scaleY = this.canvasHeight / 1200;
        this.stage.update();
        var paddingTop = (window.innerHeight - this.canvasHeight) / 2 > 0 ? (window.innerHeight - this.canvasHeight) / 2 : 0;
        $("#myCanvas").css({ top: paddingTop });
        $("#canvasHolder").css({ height: this.canvasHeight * .07 });
        $("#canvasHolder").css({ width: this.canvasWidth, left: (window.innerWidth - this.canvasWidth) / 2, top: this.canvasHeight + paddingTop - $("#canvasHolder").height(), position: 'absolute' });
    };
    StageController.prototype.drawStadium = function () {
        var width = 1600;
        this.stadium = new createjs.Container();
        this.seatContainer = new Blocks({ "loader": smorball.loader, "width": width });
        var lc = this.seatContainer.drawLeftChairBlock();
        var rc = this.seatContainer.drawRightChairBlock();
        this.cbBox = new CommentaryBox({ "loader": smorball.loader, "width": width });
        this.adBoard = new AdBoard({ "loader": smorball.loader });
        this.adBoard.y = this.cbBox.getTransformedBounds().height - this.adBoard.getTransformedBounds().height / 2 - this.adBoard.getTransformedBounds().height / 6;
        this.stadium.addChild(lc, rc, this.cbBox, this.adBoard);
        this.stage.addChild(this.stadium);
        this.drawTimeOut();
    };
    StageController.prototype.drawBackGround = function () {
        this.bgContainer = new createjs.Container();
        this.stage.addChild(this.bgContainer);
        var shape = new createjs.Shape();
        shape.graphics.beginBitmapFill(smorball.loader.getResult("background")).drawRect(0, 0, this.width, this.height);
        this.bgContainer.addChild(shape);
    };
    StageController.prototype.drawTimeOut = function () {
        var _this = this;
        var mbtn = new createjs.Bitmap(smorball.loader.getResult("menu_btn_idle"));
        mbtn.x = mbtn.getTransformedBounds().width / 4;
        mbtn.y = mbtn.getTransformedBounds().height / 4;
        mbtn.addEventListener("mousedown", function (evt) {
            evt.target.image = smorball.loader.getResult("menu_btn_click");
            evt.target.cursor = "pointer";
            EventBus.dispatch("showTimeoutScreen");
        });
        mbtn.addEventListener("mouseover", function (evt) {
            evt.target.image = smorball.loader.getResult("menu_btn_over");
            evt.target.cursor = "pointer";
            _this.stage.update();
        });
        mbtn.addEventListener("pressup", function (evt) {
            evt.target.image = smorball.loader.getResult("menu_btn_idle");
            evt.target.cursor = "pointer";
        });
        mbtn.addEventListener("mouseout", function (evt) {
            evt.target.image = smorball.loader.getResult("menu_btn_idle");
            evt.target.cursor = "pointer";
        });
        this.stadium.addChild(mbtn);
    };
    StageController.prototype.drawLogo = function () {
        var logo = new createjs.Bitmap(null);
        logo.image = smorball.loader.getResult("splash" + smorball.gameState.currentLevel);
        logo.x = 800 - logo.getTransformedBounds().width / 2;
        logo.y = 600;
        logo.alpha = 0.25;
        this.stage.addChildAt(logo, 6);
    };
    StageController.prototype.showScore = function () {
        this.scoreText = new createjs.Text("Total Score :" + this.score.getTotalScore(), "20px Arial", "#000000");
        this.scoreText.setTransform(this.width - 300, 10, 1, 1);
        this.stage.addChild(this.scoreText);
    };
    StageController.prototype.updateScore = function () {
        this.scoreText.text = "Total Score :" + this.score.getTotalScore();
    };
    StageController.prototype.getTime = function () {
        var width = this.width - this.freeLeftAreaX - 300; //left lane area
        this.timeDelay = ((width / createjs.Ticker.getFPS() * 1) - this.levelConfig.time) * 1000;
        return this.timeDelay;
    };
    StageController.prototype.generateWaves = function () {
        this.waves = new Waves({
            "waves": this.levelConfig.waves,
            "lanesObj": this.lanes,
            "lanes": this.levelConfig.lanes,
            "loader": smorball.loader,
            "gameState": smorball.gameState
        });
        this.waves.init();
        EventBus.dispatch("showPendingEnemies", this.waves.getPendingEnemies());
    };
    StageController.prototype.killLife = function () {
        this.life--;
        EventBus.dispatch("setScore", this.life);
        if (this.life == 0) {
            this.gameOver();
        }
    };
    StageController.prototype.drawLane = function () {
        var width = (this.width - this.freeLeftAreaX);
        var height = (this.height - this.freeTopAreaY - this.freeBottomAreaY);
        var totalLanes = 3; //this.levelConfig.lanes;
        var laneHeight = height / totalLanes;
        for (var i = 0; i < totalLanes; i++) {
            var laneId = i + 1;
            var config = {
                "x": this.freeLeftAreaX,
                "y": (laneHeight * i) + this.freeTopAreaY,
                "width": width,
                "height": laneHeight,
                "id": laneId,
                "loader": smorball.loader
            };
            var lane = new Lane(config);
            this.stage.addChild(lane);
            this.lanes.push(lane);
            if (!(this.levelConfig.lanes == 1 && (laneId == 1 || laneId == 3))) {
                var captchaHolder = this.captchaProcessor.getCaptchaPlaceHolder(lane.getMaxCaptchaWidth(), 60 + lane.getHeight(), laneId);
                captchaHolder.name = "captchaHolder";
                captchaHolder.x = lane.getCaptchaX() + 30;
                captchaHolder.y = lane.y + 90;
                this.stage.addChild(captchaHolder);
            }
        }
        this.resetPlayers();
        var config = {
            "x": this.freeLeftAreaX,
            "y": this.height - this.freeBottomAreaY,
            "width": width,
            "height": this.freeBottomAreaY,
            "id": 4,
            "loader": smorball.loader
        };
        var lane = new Lane(config);
        this.stage.addChild(lane);
    };
    StageController.prototype.resumeGame = function () {
        this.captchaProcessor.showCaptchas();
        EventBus.dispatch("exitMenu");
        $("#canvasHolder").show();
        $("#myCanvas").show();
        EventBus.dispatch("toggleTickerStatus");
        createjs.Ticker.addEventListener("tick", this.events.tick);
    };
    StageController.prototype.pauseGame = function () {
        if (!createjs.Ticker.getPaused()) {
            //this.captchaProcessor.hideCaptchas();
            EventBus.dispatch("toggleTickerStatus");
            EventBus.dispatch("showMenu");
        }
    };
    StageController.prototype.showTimeoutScreen = function () {
        if (!createjs.Ticker.getPaused() && smorball.gameState.currentState == smorball.gameState.states.RUN) {
            smorball.gameState.currentState = smorball.gameState.states.MAIN_MENU;
            this.captchaProcessor.hideCaptchas();
            this.stage.update();
            EventBus.dispatch("toggleTickerStatus");
            EventBus.dispatch("showTimeout");
            EventBus.dispatch("setMute");
            EventBus.dispatch('pauseWaves', true);
        }
    };
    StageController.prototype.removeAthlete = function (athlete) {
        this.players = _.without(this.players, athlete);
        this.actorsContainer.removeChild(athlete);
    };
    StageController.prototype.removeEnemy = function (enemy) {
        this.enemies = _.without(this.enemies, enemy);
        this.actorsContainer.removeChild(enemy);
    };
    StageController.prototype.resetPlayers = function () {
        for (var i = 0; i < this.lanes.length; i++) {
            var lane = this.lanes[i];
            if (lane.player == undefined) {
                setTimeout(this.makeTimeoutLaneFunction(lane), 1000);
            }
            else {
                lane.player.updateSpriteSheet();
            }
        }
    };
    StageController.prototype.makeTimeoutLaneFunction = function (lane) {
        var _this = this;
        return function () { return _this.addPlayer(lane); };
    };
    StageController.prototype.addPlayer = function (lane) {
        if (!(smorball.gameState.currentLevel == 1 && (lane.getLaneId() == 1 || lane.getLaneId() == 3))) {
            var config = {
                "loader": smorball.loader,
                "laneId": lane.getLaneId(),
                "gameState": smorball.gameState
            };
            if (lane.player == undefined) {
                var type = Utils.randomOne(_.keys(playerData));
                var player = new PlayerAthlete(lane.getLaneId(), type);
                lane.setPlayer(player);
                var spawnPos = gameConfig.friendlySpawnPositions[lane.getLaneId() - 1];
                player.x = spawnPos.x;
                player.y = spawnPos.y;
                this.actorsContainer.addChild(player);
                //this.stage.addChild(player);
                //var setPlayerIndex = () => {
                //	var index0 = this.stage.getChildIndex(this.lanes[0].player);
                //	var index1 = this.stage.getChildIndex(this.lanes[1].player);
                //	var index2 = this.stage.getChildIndex(this.lanes[2].player);
                //	if (index0 > index1 && index1 >= 0) {
                //		this.stage.swapChildren(this.lanes[0].player, this.lanes[1].player);
                //		setPlayerIndex();
                //	} else if (index1 > index2 && index2 >= 0) {
                //		this.stage.swapChildren(this.lanes[1].player, this.lanes[2].player);
                //		setPlayerIndex();
                //	}
                //}
                //setPlayerIndex();
                this.setCaptchaIndex();
            }
        }
    };
    StageController.prototype.activatePlayer = function (player) {
        var powerup = this.activePowerup;
        if (powerup && player != undefined) {
            player.addPowerups(this.activePowerup.getPower());
            this.activePowerup = undefined;
        }
        if (player != undefined) {
            this.players.push(player);
            player.run();
        }
    };
    StageController.prototype.resetGame = function () {
        this.removeAllEvents();
        this.removeAllChildren();
        this.players = [];
        this.enemies = [];
        this.gems = [];
        this.powerups = [];
        this.lanes = [];
        this.wavesc = [];
        this.activePowerup = undefined;
        this.passCount = 0;
        this.life = smorball.gameState.maxLife;
    };
    StageController.prototype.removeAllChildren = function () {
        this.stage.removeAllChildren();
        this.stage.update();
    };
    StageController.prototype.removeAllEvents = function () {
    };
    StageController.prototype.tick = function () {
        if (!createjs.Ticker.getPaused()) {
            this.stage.update();
            this.hitTest();
        }
    };
    StageController.prototype.hitTest = function () {
        if (this.players != undefined && this.players.length != 0) {
            for (var i = 0; i < this.players.length; i++) {
                var player = this.players[i];
                if (player.hit == true)
                    continue;
                var enemy = this.hitTestEnemies(player);
                var powerup = this.hitTestPowerups(player);
                if (enemy != null && player.hit == false && enemy.hit == false) {
                    if (player.singleHit) {
                        var hitList = player.hitEnemies;
                        if (hitList.indexOf(enemy.id) == -1) {
                            player.tackle();
                            player.hitEnemies.push(enemy.id);
                            enemy.kill(player.getLife());
                        }
                    }
                    else {
                        var enemyLife = enemy.getLife();
                        var fileId = player.playerSound.tackle;
                        EventBus.dispatch("playSound", fileId);
                        enemy.kill(player.getLife());
                        player.kill(enemyLife);
                    }
                }
                if (powerup != null && player.hitPowerup == false && powerup.hit == false) {
                    this.addToMyBag(powerup);
                    player.hitPowerup = false;
                    this.updateLevelStatus(powerup);
                }
            }
        }
    };
    StageController.prototype.hitTestEnemies = function (player) {
        if (this.enemies.length != 0) {
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                if (enemy.hit == true || player.laneId != enemy.getLaneId())
                    continue;
                //if(enemy.hit == true) continue;
                var hit = this.isCollision(player, enemy);
                if (hit) {
                    return enemy;
                }
            }
        }
    };
    StageController.prototype.hitTestPowerups = function (player) {
        if (this.powerups.length != 0) {
            for (var i = 0; i < this.powerups.length; i++) {
                var powerup = this.powerups[i];
                if (powerup.getLaneId() != player.laneId)
                    continue;
                var hit = this.isCollisionPowerup(player, powerup);
                if (hit) {
                    return powerup;
                }
            }
        }
    };
    StageController.prototype.isCollisionPowerup = function (player, object) {
        return (object.x <= player.x + player.getWidth() && player.x <= object.x + object.getWidth());
    };
    StageController.prototype.isCollision = function (player, object) {
        return (object.x <= player.x + player.getWidth() && player.x <= object.x + object.getWidth());
    };
    StageController.prototype.compareCaptcha = function () {
        EventBus.dispatch("playSound", "textEntry1");
        var output = this.captchaProcessor.compare();
        if (output.cheated) {
            EventBus.dispatch("showCommentary", output.message);
            this.showResultScreen(2);
        }
        else {
            this.showMessage(output.message);
            this.removeActivePowerup();
            if (output.pass) {
                if (this.activePowerup != null) {
                    EventBus.dispatch("playSound", "correctPowerup");
                    smorball.myBag.selectedId = -1;
                }
                else {
                    EventBus.dispatch("playSound", "correctSound");
                }
                if (this.activePowerup != null && this.activePowerup.getId() == "bullhorn") {
                    this.startPlayersFromAllLanes();
                }
                else {
                    var lane = this.getLaneById(output.laneId);
                    this.activatePlayer(lane.player);
                    if (output.extraDamage && lane.player != undefined && lane.player.getLife() == 1) {
                        lane.player.setLife(smorball.gameState.gs.extraDamage);
                    }
                    lane.player = undefined;
                }
                this.resetPlayers();
            }
            else {
                EventBus.dispatch("playSound", "incorrectSound");
                this.updatePlayerOnDefault();
                this.playConfusedAnimation();
                this.activePowerup = undefined;
            }
        }
    };
    StageController.prototype.playConfusedAnimation = function () {
        for (var i = 0; i < this.lanes.length; i++) {
            var lane = this.lanes[i];
            if (lane.player) {
                lane.player.x = lane.player.x + 70;
                lane.player.sprite.addEventListener("animationend", function (e) {
                    e.target.removeEventListener("animationend", e.target._listeners.animationend[0]);
                    e.target.parent.x = e.target.parent.x - 70;
                });
                lane.player.confused();
            }
        }
    };
    StageController.prototype.removeActivePowerup = function () {
        if (this.activePowerup) {
            smorball.myBag.removeFromBag(this.activePowerup);
        }
    };
    StageController.prototype.startPlayersFromAllLanes = function () {
        for (var i = 0; i < this.lanes.length; i++) {
            var lane = this.lanes[i];
            this.activatePlayer(lane.player);
            lane.player = undefined;
        }
    };
    StageController.prototype.toggleTickerStatus = function () {
        createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
    };
    StageController.prototype.updateLevelStatus = function (object) {
        var type = "";
        if (object instanceof Enemy)
            type = "enemy";
        this.waves.update(object.getWaveId(), object.onKillPush(), type);
        var enemyCount = this.enemies.length;
        var powerupCount = this.powerups.length;
        if (enemyCount == 0 && powerupCount == 0) {
            this.waitForForcePush(object.getWaveId());
        }
        if (this.waves.getStatus() && enemyCount == 0) {
            EventBus.dispatch("playSound", "crowdCheering");
            this.updateLevel();
        }
    };
    StageController.prototype.waitForForcePush = function (waveId) {
        var _this = this;
        setTimeout(function () {
            if (_this.enemies.length == 0) {
                EventBus.dispatch("forcePush", waveId);
            }
        }, 2000);
    };
    StageController.prototype.updateLevel = function () {
        this.score.addGameLevelPoints(this.life);
        if (smorball.gameState.currentLevel == 1) {
            this.calculateTime();
            this.calculateDifficulty();
        }
        smorball.gameState.currentLevel++;
        if (smorball.gameState.currentLevel > smorball.gameState.gs.maxLevel && smorball.gameState.currentLevel < 8) {
            smorball.gameState.gs.maxLevel = smorball.gameState.currentLevel;
        }
        smorball.gameState.currentState = smorball.gameState.states.GAME_OVER;
        this.showResultScreen(1);
        this.saveInputTexts();
    };
    StageController.prototype.showResultScreen = function (result) {
        var _this = this;
        $("#canvasHolder input").prop("disabled", true);
        this.waves.clearAll();
        this.waves = null;
        EventBus.dispatch("stopSound", "stadiumAmbience");
        setTimeout(function () {
            EventBus.dispatch("toggleTickerStatus");
            EventBus.dispatch("setMute");
            if (result == 0) {
                $("#canvasHolder").hide();
                $("#lostContainer").show();
                $("#lostContainer .moneyMade").text(0);
                $("#resultWrapper").css("display", "table");
            }
            else if (result == 1) {
                var money = _this.score.getMoneyForLevel(_this.life);
                $("#victoryContainer .moneyMade").text(money);
                $("#victoryContainer").show();
                $("#resultWrapper").css("display", "table");
            }
            else if (result == 2) {
                EventBus.dispatch("showMap", true);
            }
            else if (result == 3) {
                var time = _this.timeConvert(_this.timeSpend);
                var highScore = smorball.gameState.gs.highScore;
                if (highScore.min <= time.min) {
                    if (highScore.sec <= time.sec) {
                        smorball.gameState.gs.highScore = time;
                        highScore = smorball.gameState.gs.highScore;
                    }
                }
                $("#minutes").text(time.min);
                $("#seconds").text(time.sec);
                $("#highMinutes").text(highScore.min);
                $("#highSeconds").text(highScore.sec);
                $("#canvasHolder").hide();
                $("#survivalEndContainer").show();
                $("#resultWrapper").css("display", "table");
            }
        }, 2000);
    };
    StageController.prototype.gameOver = function () {
        this.calculateTime();
        smorball.gameState.currentState = smorball.gameState.states.GAME_OVER;
        EventBus.dispatch("showCommentary", "Game Over");
        if (smorball.gameState.currentLevel == smorball.gameState.survivalLevel) {
            this.showResultScreen(3);
        }
        else {
            this.showResultScreen(0);
        }
    };
    StageController.prototype.resetAll = function () {
        var store = new LocalStorage();
        // store.reset();
        smorball.gameState.reset();
        smorball.myBag.reset();
        EventBus.dispatch("showMap");
    };
    StageController.prototype.addEnemy = function (enemy) {
        EventBus.dispatch("showPendingEnemies", this.waves.getPendingEnemies());
        //var laneId = enemy.getLaneId();
        //if (laneId < 3 && smorball.gameState.currentLevel != 1) {
        //	var player = this.lanes[laneId].player;
        //	var index = this.stage.getChildIndex(player);
        //	if (index > 0)
        //		this.stage.addChildAt(enemy, index);
        //	else {
        //		this.stage.addChild(enemy);
        //	}
        //} else {
        //	this.stage.addChild(enemy)
        //}
        this.actorsContainer.addChild(enemy);
        this.enemies.push(enemy);
        var lane = this.getLaneById(enemy.getLaneId()); //enemy.getLaneId();
        var start = lane.getEndPoint();
        var end = lane.getEnemyEndPoint();
        var spawnPoint = gameConfig.enemySpawnPositions[enemy.getLaneId() - 1];
        enemy.setStartPoint(spawnPoint.x, spawnPoint.y);
        enemy.setEndPoint(end.x);
        enemy.run();
        console.log("New enemy added to stage", { laneid: enemy.getLaneId() });
    };
    StageController.prototype.getLaneById = function (id) {
        for (var i = 0; i < this.lanes.length; i++) {
            var lane = this.lanes[i];
            if (lane.getLaneId() == id) {
                return lane;
            }
        }
        return null;
    };
    StageController.prototype.pushPowerup = function (powerup) {
        this.setPowerupProperties(powerup);
        this.spawning.onPowerupSpawned();
        this.stage.addChildAt(powerup, 8);
        this.powerups.push(powerup);
    };
    StageController.prototype.setPowerupProperties = function (powerup) {
        var lane = this.getLaneById(powerup.getLaneId()); //enemy.getLaneId();
        var powerupPos = lane.getPowerupPosition();
        powerup.setPosition(powerupPos.x, powerupPos.y);
        powerup.run();
    };
    StageController.prototype.showPowerup = function () {
        var powerupContainer = new createjs.Container();
        var x = 10;
        var y = 10;
        var padding = 5;
        for (var i = 0; i < smorball.myBag.myBag.length; i++) {
            var powerup = smorball.myBag.myBag[i];
            powerupContainer.addChild(powerup);
            powerup.reset();
            x = x + powerup.getWidth() + padding;
            powerup.setPosition(x, y);
        }
        powerupContainer.x = this.cbBox.x + powerupContainer.getTransformedBounds().width / 2;
        this.stadium.addChild(powerupContainer);
    };
    StageController.prototype.addToMyBag = function (powerup) {
        var index = this.powerups.indexOf(powerup);
        this.powerups.splice(index, 1);
        smorball.myBag.addToBagFromField(powerup);
        this.stage.removeChild(powerup);
    };
    StageController.prototype.unselectAllInBag = function () {
        smorball.myBag.unselectAll();
        this.activePowerup = undefined;
        this.updatePlayerOnDefault(this.default_player);
    };
    StageController.prototype.selectPowerUp = function (mypowerup) {
        this.activePowerup = mypowerup;
        var type = mypowerup.getType();
        if (type != "bullhorn")
            this.powerup_player = "player_" + type;
        this.updatePlayerOnPowerup(type);
    };
    StageController.prototype.updatePlayerOnPowerup = function (type) {
        if (type == "bullhorn") {
            type = "normal";
        }
        for (var i = 0; i < this.lanes.length; i++) {
            var lane = this.lanes[i];
            var player = lane.player;
            if (player != undefined) {
                player.powerup = type;
                player.updateSpriteSheet();
            }
        }
    };
    StageController.prototype.updatePlayerOnDefault = function (playerId) {
        for (var i = 0; i < this.lanes.length; i++) {
            var lane = this.lanes[i];
            var player = lane.player;
            if (player != undefined) {
                player.powerup = "normal";
                player.updateSpriteSheet();
            }
        }
    };
    StageController.prototype.changeLane = function (enemy) {
        var laneId = this.newLaneId(enemy.getLaneId());
        var lane = this.getLaneById(laneId);
        var endPoint = lane.getEnemyEndPoint();
        enemy.setLaneId(laneId);
        createjs.Tween.get(enemy).to({ y: endPoint.y }, 2000);
    };
    StageController.prototype.newLaneId = function (currentLaneId) {
        var laneId;
        do {
            laneId = Math.floor(Math.random() * 3) + 1;
        } while (laneId == currentLaneId);
        return laneId;
    };
    StageController.prototype.hideTimeOut = function () {
        var _this = this;
        //calculateTime(me);
        window.onmousedown = function () { return _this.prevent(); };
        $("#inputText").focus();
        smorball.gameState.currentState = smorball.gameState.states.RUN;
        $('#timeout-container').css('display', 'none');
        EventBus.dispatch('showCaptchas');
        EventBus.dispatch('toggleTickerStatus');
        EventBus.dispatch('setMute');
        //Play Stadium Ambience
        var audioList = smorball.gameState.audioList;
        for (var i = 0; i < audioList.length; i++) {
            var main = audioList[i].config.type;
            if (audioList[i].config.loop && main == smorball.gameState.soundType.EFFECTS) {
                if (audioList[i].mySound.paused) {
                    audioList[i].play();
                }
                else {
                    audioList[i].pause();
                }
            }
        }
        EventBus.dispatch('pauseWaves', false);
    };
    StageController.prototype.prevent = function (event) {
        if (event) {
            event.preventDefault();
        }
    };
    StageController.prototype.calculateTime = function () {
        this.timeSpend = createjs.Ticker.getTime(true) - this.currentTime;
        this.currentTime = createjs.Ticker.getTime(true);
    };
    StageController.prototype.timeConvert = function (milliSeconds) {
        var min = Math.floor((milliSeconds / 1000 / 60));
        var sec = Math.floor((milliSeconds / 1000) % 60);
        return { "min": min, "sec": sec };
    };
    StageController.prototype.calculateDifficulty = function () {
        var wordCount = this.captchaProcessor.getWordCount();
        var time = this.timeConvert(this.timeSpend);
        var timestr = time.min + "." + time.sec;
        var timef = parseFloat(timestr);
        var wpm = wordCount / timef;
        if (wpm <= 10) {
            smorball.gameState.gs.difficulty = 2.33;
        }
        else if (wpm <= 15) {
            smorball.gameState.gs.difficulty = 2;
        }
        else if (wpm <= 20) {
            smorball.gameState.gs.difficulty = 1.67;
        }
        else if (wpm <= 30) {
            smorball.gameState.gs.difficulty = 1.33;
        }
        else if (wpm > 30) {
            smorball.gameState.gs.difficulty = 1;
        }
    };
    StageController.prototype.saveInputTexts = function () {
        var arr = smorball.gameState.inputTextArr;
        $.ajax({
            url: 'http://tiltfactor1.dartmouth.edu:8080/api/difference',
            type: 'PUT',
            dataType: 'json',
            headers: { "x-access-token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJHYW1lIiwiaWF0IjoxNDE1MzQxNjMxMjY4LCJpc3MiOiJCSExTZXJ2ZXIifQ.bwRps5G6lAd8tGZKK7nExzhxFrZmAwud0C2RW26sdRM' },
            processData: false,
            contentType: 'application/json',
            timeout: 10000,
            data: JSON.stringify(arr),
            crossDomain: true,
            error: function (err) {
                var errorText = JSON.parse(err.responseText);
                console.log(errorText);
                smorball.gameState.inputTextArr = [];
            },
            success: function (data) {
                smorball.gameState.inputTextArr = [];
                console.log(data);
            }
        });
    };
    StageController.prototype.removeFromStage = function (object) {
        var child = this.stage.getChildIndex(object);
        this.stage.removeChildAt(child);
    };
    StageController.prototype.persist = function () {
    };
    return StageController;
})();
