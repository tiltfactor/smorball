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
        var _this = this;
        this.activePowerup = undefined;
        // Setup the stage
        this.stage = new createjs.Stage("myCanvas");
        this.stage.enableMouseOver(10);
        this.setCanvasAttributes();
        // Setup the ticker
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", function (e) { return _this.update(e); });
        // Setup other things
        this.spawing = new LevelSpawningController();
        this.capatchas = new CaptchaController();
        this.capatchas.init();
        // Paused until the images finish loading
        createjs.Ticker.setPaused(true);
        this.loadEvents();
        this.currentIndex = 0;
        this.default_player = "player_normal";
        this.powerup_player = "player_helmet";
    }
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
        //EventBus.addEventListener("toggleTickerStatus",() => this.toggleTickerStatus());
        EventBus.addEventListener("unselectAllInBag", function () { return _this.unselectAllInBag(); });
        EventBus.addEventListener("selectPowerUp", function (powerup) { return _this.selectPowerUp(powerup.target); });
        EventBus.addEventListener("changeLane", function (obj) { return _this.changeLane(obj.target); });
        //EventBus.addEventListener("showCaptchas",() => this.captchaProcessor.showCaptchas());
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
        this.level = levelsData[smorball.gameState.currentLevel];
        this.oldSpawning = new Spawning({ "gameState": smorball.gameState });
        $("#loaderDiv").show();
        this.loadImages();
        $("#myCanvas").show();
        EventBus.dispatch("setMute");
        var config = { "gameState": smorball.gameState };
        this.score = new Score(config);
        this.spawing.startNewLevel(this.level);
        this.capatchas.startNewLevel(this.level);
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
        _.each(enemyData, function (enemy) {
            var path = Utils.format(enemy.spritesPathTemplate, Utils.zeroPad(level, 2));
            assets.push({ src: path + ".json", id: "enemy_json_" + enemy.id + "_" + Utils.zeroPad(level, 2) });
            assets.push({ src: path + ".png", id: "enemy_png_" + enemy.id + "_" + Utils.zeroPad(level, 2) });
            //console.log("enemy", enemy, path, asset);
        });
        return assets;
    };
    StageController.prototype.onImagesLoad = function () {
        var _this = this;
        window.onmousedown = function () { return _this.prevent(); };
        //$("#captchaInputContainer input").show();
        //$("#inputText").focus();
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
        this.stadium.addChild(this.capatchas.container);
        //EventBus.dispatch("showCommentary", this.levelConfig.waves.message);
        EventBus.dispatch("setScore", this.life);
        this.initShowMessage();
        this.showPowerup();
        this.spawnStartingAthletes();
        createjs.Ticker.setPaused(false);
        $("#captchaInputContainer").show();
    };
    StageController.prototype.initShowMessage = function () {
        this.message = new createjs.Bitmap(null);
        this.message.x = 800;
        this.message.y = 1000;
        this.message.alpha = 0;
        this.stage.addChild(this.message);
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
        var paddingTop = (window.innerHeight - this.canvasHeight) / 2 > 0 ? (window.innerHeight - this.canvasHeight) / 2 : 0;
        $("#myCanvas").css({ top: paddingTop });
        $("#captchaInputContainer").css({ height: this.canvasHeight * .07 });
        $("#captchaInputContainer").css({ width: this.canvasWidth, left: (window.innerWidth - this.canvasWidth) / 2, top: this.canvasHeight + paddingTop - $("#captchaInputContainer").height(), position: 'absolute' });
    };
    StageController.prototype.drawStadium = function () {
        var width = 1600;
        this.stadium = new createjs.Container();
        this.seatContainer = new Blocks({ "loader": smorball.loader, "width": width });
        var lc = this.seatContainer.drawLeftChairBlock();
        var rc = this.seatContainer.drawRightChairBlock();
        this.commentryBox = new CommentaryBox({ "loader": smorball.loader, "width": width });
        this.adBoard = new AdBoard({ "loader": smorball.loader });
        this.adBoard.y = this.commentryBox.getTransformedBounds().height - this.adBoard.getTransformedBounds().height / 2 - this.adBoard.getTransformedBounds().height / 6;
        this.stadium.addChild(lc, rc, this.commentryBox, this.adBoard);
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
        }
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
        this.capatchas.showCaptchas();
        EventBus.dispatch("exitMenu");
        $("#captchaInputContainer").show();
        $("#myCanvas").show();
        createjs.Ticker.setPaused(false);
        console.log("Game Resumed");
    };
    StageController.prototype.pauseGame = function () {
        console.log("Game Paused");
        createjs.Ticker.setPaused(true);
        EventBus.dispatch("showMenu");
    };
    StageController.prototype.showTimeoutScreen = function () {
        if (!createjs.Ticker.getPaused() && smorball.gameState.currentState == smorball.gameState.states.RUN) {
            smorball.gameState.currentState = smorball.gameState.states.MAIN_MENU;
            this.capatchas.hideCaptchas();
            this.stage.update();
            createjs.Ticker.setPaused(true);
            EventBus.dispatch("showTimeout");
            EventBus.dispatch("setMute");
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
    StageController.prototype.hitTest = function () {
        if (this.players != undefined && this.players.length != 0) {
            for (var i = 0; i < this.players.length; i++) {
                var player = this.players[i];
                if (player.state == 3 /* Dieing */)
                    continue;
                var enemy = this.hitTestEnemies(player);
                var powerup = this.hitTestPowerups(player);
                if (enemy != null && player.state != 3 /* Dieing */ && enemy.hit == false) {
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
                }
            }
        }
    };
    StageController.prototype.hitTestEnemies = function (player) {
        if (this.enemies.length != 0) {
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                if (enemy.hit == true || player.laneId != enemy.currentLane)
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
            smorball.gameState.maxLevel = smorball.gameState.currentLevel;
        }
        smorball.gameState.currentState = smorball.gameState.states.GAME_OVER;
        this.showResultScreen(1);
        this.saveInputTexts();
    };
    StageController.prototype.showResultScreen = function (result) {
        var _this = this;
        $("#captchaInputContainer input").hide();
        EventBus.dispatch("stopSound", "stadiumAmbience");
        setTimeout(function () {
            createjs.Ticker.setPaused(true);
            EventBus.dispatch("setMute");
            if (result == 0) {
                $("#captchaInputContainer").hide();
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
                $("#captchaInputContainer").hide();
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
        this.oldSpawning.onPowerupSpawned();
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
        powerupContainer.x = this.commentryBox.x + powerupContainer.getTransformedBounds().width / 2;
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
        this.capatchas.showCaptchas();
        createjs.Ticker.setPaused(false);
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
        var wordCount = this.capatchas.captchasSucceeded;
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
    StageController.prototype.removeFromStage = function (object) {
        var child = this.stage.getChildIndex(object);
        this.stage.removeChildAt(child);
    };
    StageController.prototype.persist = function () {
    };
    StageController.prototype.update = function (e) {
        // Dont update if paused!
        if (createjs.Ticker.getPaused())
            return;
        // Get the delta (in seconds) as this is all we need to pass to the children
        var delta = e.delta / 1000;
        // Update all the bits
        this.spawing.update(delta);
        _.each(this.enemies, function (e) { return e.update(delta); });
        _.each(this.players, function (p) { return p.update(delta); });
        this.capatchas.update(delta);
        // Physics
        this.hitTest();
        // Finally render
        this.stage.update(e);
    };
    StageController.prototype.getEnemiesRemaining = function () {
        return this.spawing.enemySpawnsThisLevel - this.enemiesKilled;
    };
    StageController.prototype.spawnStartingAthletes = function () {
        var _this = this;
        _.each(this.level.lanes, function (i) { return _this.spawnAthlete(i); });
    };
    StageController.prototype.spawnAthlete = function (lane) {
        var type = Utils.randomOne(_.keys(playerData));
        var player = new PlayerAthlete(lane, type);
        this.addAthlete(player);
        var spawnPos = gameConfig.friendlySpawnPositions[lane];
        player.x = spawnPos.x;
        player.y = spawnPos.y;
        player.animateIn();
    };
    StageController.prototype.addAthlete = function (athlete) {
        this.actorsContainer.addChild(athlete);
        this.players.push(athlete);
        console.log("New athlete added to stage", { lane: athlete.laneId, type: athlete.type });
    };
    StageController.prototype.removeAthlete = function (athlete) {
        this.players = _.without(this.players, athlete);
        this.actorsContainer.removeChild(athlete);
    };
    StageController.prototype.addEnemy = function (enemy) {
        this.actorsContainer.addChild(enemy);
        this.enemies.push(enemy);
        console.log("New enemy added to stage", { lane: enemy.startingLane, type: enemy.type });
    };
    StageController.prototype.removeEnemy = function (enemy) {
        this.enemies = _.without(this.enemies, enemy);
        this.enemiesKilled++;
        this.actorsContainer.removeChild(enemy);
    };
    return StageController;
})();
