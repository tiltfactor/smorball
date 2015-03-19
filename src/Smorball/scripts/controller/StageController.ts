/// <reference path="../model/waves.ts" />
/// <reference path="../model/commentarybox.ts" />
/// <reference path="../data/manifest.ts" />
/// <reference path="../data/leveldata.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />

class StageController {

	config: any;
	events: any = {};
	captchaProcessor: CaptchaProcessor;
	currentIndex: number;
	default_player: string;
	powerup_player: string;
	timeSpend: number;
	score: Score;
	spawning: Spawning;
	currentTime: number;
	levelConfig: any;
	canvasWidth: number;
	canvasHeight: number;
	message: createjs.Bitmap;
	scoreText: createjs.Text;
	timeDelay: number;
	width: number;
	height: number;
	freeLeftAreaX: number;
	freeLeftAreaY: number;
	freeTopAreaX: number;
	freeTopAreaY: number;
	freeBottomAreaX: number;
	freeBottomAreaY: number;
	waves: Waves;
	stadium: createjs.Container;
	seatContainer: Blocks;
	cbBox: CommentaryBox;
	adBoard: AdBoard;
	bgContainer: createjs.Container;
	passCount: number;

	constructor(config: any) {
		this.config = config;
	}

	init() {
        this.config.stage = new createjs.Stage("myCanvas");
        this.config.stage.enableMouseOver(10);
        this.setCanvasAttributes();
        createjs.Ticker.setFPS(20);

        this.events.tick = () => this.tick();
        createjs.Ticker.addEventListener("tick", this.events.tick);
        createjs.Ticker.setPaused(true);

        this.loadEvents();
        this.currentIndex = 0;
        this.default_player = "player_normal";
        this.powerup_player = "player_helmet";

    }

    private loadEvents() {
		EventBus.addEventListener("newGame",() => this.newGame());
		EventBus.addEventListener("resumeGame",() => this.resumeGame());
		EventBus.addEventListener("pauseGame",() => this.pauseGame());
		EventBus.addEventListener("killme",(o) => this.killMe(o));
		EventBus.addEventListener("killLife",() => this.killLife());
		EventBus.addEventListener("pushEnemy",(o:any) => this.pushEnemy(o.target));
		EventBus.addEventListener("pushPowerup",(o) => this.pushPowerup(o.target));
		EventBus.addEventListener("showTimeoutScreen",() => this.showTimeoutScreen());
		EventBus.addEventListener("showMessage",(text) => this.showGameMessage(text));
		EventBus.addEventListener("compareCaptcha",() => this.compareCaptcha());
		EventBus.addEventListener("setTickerStatus",() => this.setTickerStatus());
		EventBus.addEventListener("unselectAllInBag",() => this.unselectAllInBag());
		EventBus.addEventListener("selectPowerUp",(powerup) => this.selectPowerUp(powerup.target));
		EventBus.addEventListener("changeLane",(obj) => this.changeLane(obj.target));
		EventBus.addEventListener("showCaptchas",() => this.captchaProcessor.showCaptchas());
		EventBus.addEventListener("onImagesLoad",() => this.onImagesLoad());
		EventBus.addEventListener("resetAll",() => this.resetAll());
		EventBus.addEventListener("hideTimeOut",() => this.hideTimeOut());
		EventBus.addEventListener("stopCheering",() => { console.log("MIKEC ==> stop cheering does not exit?!"); /*this.stopCheering()*/ });
		EventBus.addEventListener("removeFromStage",(o) => this.removeFromStage(o.target));
	}

	private newGame() {
		if (this.config.gameState.inputTextArr.length != 0) {
			this.saveInputTexts();
		}
		this.config.myBag.newGame();
		this.timeSpend = 0;
		this.currentTime = createjs.Ticker.getTime(true);
		$("#inputText").val("");
		this.resetGame();
		this.config.gameState.currentState = this.config.gameState.states.RUN;
		this.levelConfig = LevelData[this.config.gameState.currentLevel];

		this.spawning = new Spawning({ "gameState": this.config.gameState });
		this.captchaProcessor = new CaptchaProcessor({
			"loader": this.config.loader,
			"canvasWidth": this.canvasWidth,
			"canvasHeight": this.canvasHeight,
			"gameState": this.config.gameState
		});
		$("#loaderDiv").show();
		this.loadImages();
		$("#myCanvas").show();
		EventBus.dispatch("setMute");

		var config = { "gameState": this.config.gameState };
		this.score = new Score(config);

	}

	private loadImages() {
		var _onImagesLoad = () => {
			this.onImagesLoad()
		};
		var manifest = [];

		if (!this.config.gameState.level) {
			this.config.gameState.level = true;
			this.config.loader.loadLevelQueue(Manifest.level, this.config.gameState.currentLevel);
		} else {
			this.config.loader.loadLevelQueue(manifest, this.config.gameState.currentLevel);
		}
	}

	private onImagesLoad() {
		$("#canvasHolder input").prop("disabled", false);
		window.onmousedown = () => this.prevent();
		$("#inputText").focus();
		this.onResize();
		window.onresize = () => {
			this.onResize()
		};
		this.drawBackGround();
		this.drawLane();
		this.drawStadium();
		this.drawLogo();
		EventBus.dispatch("showCommentary", this.levelConfig.waves.message);
		EventBus.dispatch("setScore", this.config.life);

		this.initShowMessage();
		this.generateWaves();
		this.showPowerup();
		this.setCaptchaIndex();
		EventBus.dispatch("setTickerStatus");

	}

	private initShowMessage() {
		this.message = new createjs.Bitmap(null);
		this.message.x = 800;
		this.message.y = 1000;
		this.message.alpha = 0;
		this.config.stage.addChild(this.message);
	}

	private setCaptchaIndex() {
		var captchas = _.filter(this.config.stage.children, (a:any) => { if (a.name == "captchaHolder") return a });
		var length = this.config.stage.children.length;

		_.each(captchas, (a) => {
			var player = this.config.lanes[a.id - 1].player;
			if (player) {
				length = this.config.stage.getChildIndex(player);
			}
			this.config.stage.setChildIndex(a, length - 1)
		});
	}

	private showGameMessage(msg) {
		var text = msg.target;
		this.showMessage(text);
	}

	private showMessage(text) {
		this.message.image = this.config.loader.getResult(text);
		this.message.x = 800 - this.message.getBounds().width / 2;
		var index = this.config.stage.children.length - 1;
		this.config.stage.setChildIndex(this.message, index);
		createjs.Tween.get(this.message).to({ alpha: 1 }, 100).wait(500).to({ alpha: 0 }, 1000);
	}

	private setCanvasAttributes() {
		this.freeBottomAreaY = 70;
		this.freeLeftAreaX = 0;
		this.onResize();
		this.width = 1600;
		this.height = 1200;
		this.freeTopAreaY = this.height / 2;
	}

	private onResize() {
		var canvas = this.config.stage.canvas;
		this.canvasWidth = canvas.width = window.innerHeight * 4 / 3 > window.innerWidth ? window.innerWidth : window.innerHeight * 4 / 3;
		this.canvasHeight = canvas.height = this.canvasWidth * 3 / 4 > window.innerHeight ? window.innerHeight : this.canvasWidth * 3 / 4;
		this.config.stage.scaleX = this.canvasWidth / 1600;
		this.config.stage.scaleY = this.canvasHeight / 1200;
		this.config.stage.update();
		var paddingTop = (window.innerHeight - this.canvasHeight) / 2 > 0 ? (window.innerHeight - this.canvasHeight) / 2 : 0;
		$("#myCanvas").css({ top: paddingTop });
		$("#canvasHolder").css({ height: this.canvasHeight * .07 });
		$("#canvasHolder").css({ width: this.canvasWidth, left: (window.innerWidth - this.canvasWidth) / 2, top: this.canvasHeight + paddingTop - $("#canvasHolder").height(), position: 'absolute' });
	}

	private drawStadium() {
		var width = 1600;
		this.stadium = new createjs.Container();
		this.seatContainer = new Blocks({ "loader": this.config.loader, "width": width });
		var lc = this.seatContainer.drawLeftChairBlock();
		var rc = this.seatContainer.drawRightChairBlock();
		this.cbBox = new CommentaryBox({ "loader": this.config.loader, "width": width });
		this.adBoard = new AdBoard({ "loader": this.config.loader });
		this.adBoard.y = this.cbBox.getTransformedBounds().height - this.adBoard.getTransformedBounds().height / 2 - this.adBoard.getTransformedBounds().height / 6;
		this.stadium.addChild(lc, rc, this.cbBox, this.adBoard);
		this.config.stage.addChild(this.stadium);
		this.drawTimeOut();
	}

	private drawBackGround() {
		this.bgContainer = new createjs.Container();
		this.config.stage.addChild(this.bgContainer);
		var shape = new createjs.Shape();
		shape.graphics.beginBitmapFill(this.config.loader.getResult("background"))
			.drawRect(0, 0, this.width, this.height);
		this.bgContainer.addChild(shape);
	}

	private drawTimeOut() {
		var mbtn = new createjs.Bitmap(this.config.loader.getResult("menu_btn_idle"));
		mbtn.x = mbtn.getTransformedBounds().width / 4;
		mbtn.y = mbtn.getTransformedBounds().height / 4;
		mbtn.addEventListener("mousedown", (evt:any) => {
			evt.target.image = this.config.loader.getResult("menu_btn_click");
			evt.target.cursor = "pointer";
			EventBus.dispatch("showTimeoutScreen");
		});
		mbtn.addEventListener("mouseover",(evt: any) => {
			evt.target.image = this.config.loader.getResult("menu_btn_over");
			evt.target.cursor = "pointer";
			this.config.stage.update();

		});
		mbtn.addEventListener("pressup",(evt: any) => {
			evt.target.image = this.config.loader.getResult("menu_btn_idle");
			evt.target.cursor = "pointer";

		});
		mbtn.addEventListener("mouseout",(evt: any) => {
			evt.target.image = this.config.loader.getResult("menu_btn_idle");
			evt.target.cursor = "pointer";

		});
		this.stadium.addChild(mbtn);
	}

	private drawLogo() {
		var logo = new createjs.Bitmap(null);
		logo.image = this.config.loader.getResult("splash" + this.config.gameState.currentLevel);
		logo.x = 800 - logo.getTransformedBounds().width / 2;
		logo.y = 600;
		logo.alpha = 0.25;
		this.config.stage.addChildAt(logo, 6);
	}

	private showScore() {
		this.scoreText = new createjs.Text("Total Score :" + this.score.getTotalScore(), "20px Arial", "#000000");
		this.scoreText.setTransform(this.width - 300, 10, 1, 1);
		this.config.stage.addChild(this.scoreText);
	}

	private updateScore() {
		this.scoreText.text = "Total Score :" + this.score.getTotalScore();
	}

	private getTime() {
		var width = this.width - this.freeLeftAreaX - 300; //left lane area
		this.timeDelay = ((width / createjs.Ticker.getFPS() * 1) - this.levelConfig.time) * 1000;
		return this.timeDelay;
	}

	private generateWaves() {
		this.waves = new Waves({
			"waves": this.levelConfig.waves,
			"lanesObj": this.config.lanes,
			"lanes": this.levelConfig.lanes,
			"loader": this.config.loader,
			"gameState": this.config.gameState
		});
		this.waves.init();
		EventBus.dispatch("showPendingEnemies", this.waves.getPendingEnemies());
	}

	private killLife() {
		this.config.life--;
		EventBus.dispatch("setScore", this.config.life);
		if (this.config.life == 0) {
			this.gameOver();
		}
	}

	private drawLane() {
		var width = (this.width - this.freeLeftAreaX);
		var height = (this.height - this.freeTopAreaY - this.freeBottomAreaY);
		var totalLanes = 3;//this.levelConfig.lanes;
		var laneHeight = height / totalLanes;

		for (var i = 0; i < totalLanes; i++) {
			var laneId = i + 1;
			var config = {
				"x": this.freeLeftAreaX,
				"y": (laneHeight * i) + this.freeTopAreaY,
				"width": width,
				"height": laneHeight,
				"id": laneId,
				"loader": this.config.loader
			};
			var lane = new Lane(config);
			this.config.stage.addChild(lane);
			this.config.lanes.push(lane);

			if (!(this.levelConfig.lanes == 1 && (laneId == 1 || laneId == 3))) {
				var captchaHolder = this.captchaProcessor.getCaptchaPlaceHolder(lane.getMaxCaptchaWidth(), 60 + lane.getHeight(), laneId);
				captchaHolder.name = "captchaHolder";
				captchaHolder.x = lane.getCaptchaX() + 30;
				captchaHolder.y = lane.y + 90;
				this.config.stage.addChild(captchaHolder);

			}
		}
		this.resetPlayers();

		var config = {
			"x": this.freeLeftAreaX,
			"y": this.height - this.freeBottomAreaY,
			"width": width,
			"height": this.freeBottomAreaY,
			"id": 4,
			"loader": this.config.loader
		};
		var lane = new Lane(config);
		this.config.stage.addChild(lane);


	}

	private resumeGame() {
		this.captchaProcessor.showCaptchas();
		EventBus.dispatch("exitMenu");
		$("#canvasHolder").show();
		$("#myCanvas").show();
		EventBus.dispatch("setTickerStatus");
		createjs.Ticker.addEventListener("tick", this.events.tick);
	}

	private pauseGame() {
		if (!createjs.Ticker.getPaused()) {
			//this.captchaProcessor.hideCaptchas();
			EventBus.dispatch("setTickerStatus");
			EventBus.dispatch("showMenu");
		}
	}

	private showTimeoutScreen() {
		if (!createjs.Ticker.getPaused() && this.config.gameState.currentState == this.config.gameState.states.RUN) {
			this.config.gameState.currentState = this.config.gameState.states.MAIN_MENU;
			this.captchaProcessor.hideCaptchas();
			this.config.stage.update();
			EventBus.dispatch("setTickerStatus");
			EventBus.dispatch("showTimeout");
			EventBus.dispatch("setMute");
			EventBus.dispatch('pauseWaves', true);
		}
	}

	private killMe(actor) {
		var object = actor.target;
		this.config.stage.removeChild(object);
		if (object instanceof sprites.Enemy) {
			var index = this.config.enemies.indexOf(object);
			this.config.enemies.splice(index, 1);
			this.spawning.onEnemyKilled(object.getMaxLife());
			this.updateLevelStatus(object);
		} else if (object instanceof sprites.SpriteMan) {
			var index = this.config.players.indexOf(object);
			this.config.players.splice(index, 1);
		} else if (object instanceof Gem) {
			var index = this.config.gems.indexOf(object);
			this.config.gems.splice(index, 1);
		}
	}

	private resetPlayers() {
		for (var i = 0; i < this.config.lanes.length; i++) {
			var lane = this.config.lanes[i];
			if (lane.player == undefined) {
					setTimeout(this.makeTimeoutLaneFunction(lane), 1000);
			} else {
				lane.player.setDefaultSpriteSheet();
			}

		}
	}

	private makeTimeoutLaneFunction(lane) {
		return this.addPlayer(lane);
	}

	private addPlayer(lane) {
		if (!(this.config.gameState.currentLevel == 1 && (lane.getLaneId() == 1 || lane.getLaneId() == 3))) {
			var config = {
				"loader": this.config.loader,
				"laneId": lane.getLaneId(),
				"gameState": this.config.gameState
			};
			if (lane.player == undefined) {
				var player = new sprites.SpriteMan(config);
				lane.setPlayer(player);
				var laneId = lane.getLaneId();
				this.config.stage.addChild(player);
				var setPlayerIndex = () => {
					var index0 = this.config.stage.getChildIndex(this.config.lanes[0].player);
					var index1 = this.config.stage.getChildIndex(this.config.lanes[1].player);
					var index2 = this.config.stage.getChildIndex(this.config.lanes[2].player);
					if (index0 > index1 && index1 >= 0) {
						this.config.stage.swapChildren(this.config.lanes[0].player, this.config.lanes[1].player);
						setPlayerIndex();
					} else if (index1 > index2 && index2 >= 0) {
						this.config.stage.swapChildren(this.config.lanes[1].player, this.config.lanes[2].player);
						setPlayerIndex();
					}
				}
				setPlayerIndex();
				this.setCaptchaIndex();
			}
		}
	}

	private activatePlayer(player) {
		var powerup = this.config.activePowerup;
		if (powerup && player != undefined) {
			player.addPowerups(this.config.activePowerup.getPower());
			this.config.activePowerup = undefined;
		}
		if (player != undefined) {
			this.config.players.push(player);
			player.run();
		}
	}

	private resetGame() {

		this.removeAllEvents();
		this.removeAllChildren();

		this.config.players = [];
		this.config.enemies = [];
		this.config.gems = [];
		this.config.powerups = [];
		this.config.lanes = [];
		this.config.waves = [];
		this.config.activePowerup = undefined;
		this.passCount = 0;
		this.config.life = this.config.gameState.maxLife;
	}

	private removeAllChildren() {
		this.config.stage.removeAllChildren();
		this.config.stage.update();
	}

	private removeAllEvents() {

	}

	private tick() {
		if (!createjs.Ticker.getPaused()) {
			this.config.stage.update();
			this.hitTest();
		}
	}

	private hitTest() {
		if (this.config.players != undefined && this.config.players.length != 0) {
			for (var i = 0; i < this.config.players.length; i++) {
				var player = this.config.players[i];
				if (player.hit == true) continue;
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
					} else {
						var enemyLife = enemy.getLife();
						var fileId = player.config.playerSound.tackle;
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

	}

	private hitTestEnemies(player) {
		if (this.config.enemies.length != 0) {
			for (var i = 0; i < this.config.enemies.length; i++) {
				var enemy = this.config.enemies[i];
				if (enemy.hit == true || player.getLaneId() != enemy.getLaneId()) continue;
				//if(enemy.hit == true) continue;
				var hit = this.isCollision(player, enemy);
				if (hit) {
					return enemy;
				}
			}
		}
	}

	private hitTestPowerups(player) {
		if (this.config.powerups.length != 0) {
			for (var i = 0; i < this.config.powerups.length; i++) {
				var powerup = this.config.powerups[i];
				if (powerup.getLaneId() != player.getLaneId()) continue;
				var hit = this.isCollisionPowerup(player, powerup);
				if (hit) {
					return powerup;
				}
			}
		}
	}

	private isCollisionPowerup(player, object) {
		return (object.x <= player.x + player.getWidth() &&
			player.x <= object.x + object.getWidth());
	}

	private isCollision(player, object) {
		return (object.x <= player.x + player.getWidth() &&
			player.x <= object.x + object.getWidth())
	}

	private compareCaptcha() {

		EventBus.dispatch("playSound", "textEntry1");
		var output = this.captchaProcessor.compare();
		if (output.cheated) {
			EventBus.dispatch("showCommentary", output.message);
			this.showResultScreen(2);

		} else {
			this.showMessage(output.message);
			this.removeActivePowerup();
			if (output.pass) {
				if (this.config.activePowerup != null) {
					EventBus.dispatch("playSound", "correctPowerup");
					this.config.myBag.selectedId = -1;
				}
				else {
					EventBus.dispatch("playSound", "correctSound");
				}
				if (this.config.activePowerup != null && this.config.activePowerup.getId() == "bullhorn") {
					this.startPlayersFromAllLanes();
				} else {
					var lane = this.getLaneById(output.laneId);
					this.activatePlayer(lane.player);
					if (output.extraDamage && lane.player != undefined && lane.player.getLife() == 1) {
						lane.player.setLife(this.config.gameState.gs.extraDamage);
					}
					lane.player = undefined;
				}
				this.resetPlayers();
			} else {
				EventBus.dispatch("playSound", "incorrectSound");
				this.updatePlayerOnDefault();
				this.playConfusedAnimation();
				this.config.activePowerup = undefined;


			}
		}
	}

	private playConfusedAnimation() {
		for (var i = 0; i < this.config.lanes.length; i++) {
			var lane = this.config.lanes[i];
			if (lane.player) {
				lane.player.x = lane.player.x + 70;
				lane.player.sprite.addEventListener("animationend", (e) => {
					e.target.removeEventListener("animationend", e.target._listeners.animationend[0]);
					e.target.parent.x = e.target.parent.x - 70;
				});
				lane.player.confused();
			}

		}
	}

	private removeActivePowerup() {
		if (this.config.activePowerup) {
			this.config.myBag.removeFromBag(this.config.activePowerup);

		}
	}

	private startPlayersFromAllLanes() {
		for (var i = 0; i < this.config.lanes.length; i++) {
			var lane = this.config.lanes[i];
			this.activatePlayer(lane.player);
			lane.player = undefined;
		}
	}

	private setTickerStatus() {
		createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
	}

	private updateLevelStatus(object) {
		var type = "";
		if (object instanceof sprites.Enemy) type = "enemy";
		this.waves.update(object.getWaveId(), object.onKillPush(), type);
		var enemyCount = this.config.enemies.length;
		var powerupCount = this.config.powerups.length;
		if (enemyCount == 0 && powerupCount == 0) {
			this.waitForForcePush(object.getWaveId());
		}
		if (this.waves.getStatus() && enemyCount == 0) {
			EventBus.dispatch("playSound", "crowdCheering");
			this.updateLevel();
		}
	}

	private waitForForcePush(waveId) {
		setTimeout(() => {
			if (this.config.enemies.length == 0) {
				EventBus.dispatch("forcePush", waveId);
			}
		}, 2000);
	}

	private updateLevel() {

		this.score.addGameLevelPoints(this.config.life);

		if (this.config.gameState.currentLevel == 1) {
			this.calculateTime();
			this.calculateDifficulty();
		}

		this.config.gameState.currentLevel++;
		if (this.config.gameState.currentLevel > this.config.gameState.gs.maxLevel && this.config.gameState.currentLevel < 8) {
			this.config.gameState.gs.maxLevel = this.config.gameState.currentLevel;
		}
		this.config.gameState.currentState = this.config.gameState.states.GAME_OVER;
		this.showResultScreen(1);
		this.saveInputTexts();

	}

	private showResultScreen(result) {
		$("#canvasHolder input").prop("disabled", true);
		this.waves.clearAll();
		this.waves = null;
		EventBus.dispatch("stopSound", "stadiumAmbience");
		setTimeout(() => {
			EventBus.dispatch("setTickerStatus");
			EventBus.dispatch("setMute");
			if (result == 0) {
				$("#canvasHolder").hide();
				$("#lostContainer").show();
				$("#lostContainer .moneyMade").text(0);
				$("#resultWrapper").css("display", "table");
			} else if (result == 1) {
				var money = this.score.getMoneyForLevel(this.config.life);
				$("#victoryContainer .moneyMade").text(money);
				$("#victoryContainer").show();
				$("#resultWrapper").css("display", "table");
			} else if (result == 2) {
				EventBus.dispatch("showMap", true);
			} else if (result == 3) {
				var time = this.timeConvert(this.timeSpend);
				var highScore = this.config.gameState.gs.highScore;
				if (highScore.min <= time.min) {
					if (highScore.sec <= time.sec) {
						this.config.gameState.gs.highScore = time;
						highScore = this.config.gameState.gs.highScore;
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
	}

	private gameOver() {

		this.calculateTime();
		this.config.gameState.currentState = this.config.gameState.states.GAME_OVER;

		EventBus.dispatch("showCommentary", "Game Over");
		if (this.config.gameState.currentLevel == this.config.gameState.survivalLevel) {
			this.showResultScreen(3);
		} else {
			this.showResultScreen(0);
		}
	}

	private resetAll() {
		var store = new LocalStorage();
		// store.reset();
		this.config.gameState.reset();
		this.config.myBag.reset();
		EventBus.dispatch("showMap");

	}

	private pushEnemy(enemy) {
		EventBus.dispatch("showPendingEnemies", this.waves.getPendingEnemies());
		this.setEnemyProperties(enemy);
		var laneId = enemy.getLaneId();
		if (laneId < 3 && this.config.gameState.currentLevel != 1) {
			var player = this.config.lanes[laneId].player;
			var index = this.config.stage.getChildIndex(player);
			if (index > 0)
				this.config.stage.addChildAt(enemy, index);
			else {
				this.config.stage.addChild(enemy);
			}
		} else {
			this.config.stage.addChild(enemy)
		}


		this.config.enemies.push(enemy);
	}

	private setEnemyProperties(enemy) {
		var lane = this.getLaneById(enemy.getLaneId()); //enemy.getLaneId();
		var start = lane.getEndPoint();
		var end = lane.getEnemyEndPoint();
		enemy.setStartPoint(start.x, start.y);
		enemy.setEndPoint(end.x);
		enemy.run();

	}

	private getLaneById(id) {
		for (var i = 0; i < this.config.lanes.length; i++) {
			var lane = this.config.lanes[i];
			if (lane.getLaneId() == id) {
				return lane;
			}
		}
		return null;
	}

	private pushPowerup(powerup) {
		this.setPowerupProperties(powerup);
		this.spawning.onPowerupSpawned();
		this.config.stage.addChildAt(powerup, 8);
		this.config.powerups.push(powerup);
	}

	private setPowerupProperties(powerup) {
		var lane = this.getLaneById(powerup.getLaneId()); //enemy.getLaneId();
		var powerupPos = lane.getPowerupPosition();
		powerup.setPosition(powerupPos.x, powerupPos.y);
		powerup.run();

	}

	private showPowerup() {
		var powerupContainer = new createjs.Container();
		var x = 10;
		var y = 10;
		var padding = 5;
		for (var i = 0; i < this.config.myBag.myBag.length; i++) {
			var powerup = this.config.myBag.myBag[i];
			powerupContainer.addChild(powerup);
			powerup.reset();
			x = x + powerup.getWidth() + padding;
			powerup.setPosition(x, y);
		}
		powerupContainer.x = this.cbBox.x + powerupContainer.getTransformedBounds().width / 2;
		this.stadium.addChild(powerupContainer);

	}

	private addToMyBag(powerup) {
		var index = this.config.powerups.indexOf(powerup);
		this.config.powerups.splice(index, 1);
		this.config.myBag.addToBagFromField(powerup);
		this.config.stage.removeChild(powerup);
	}

	private unselectAllInBag() {
		this.config.myBag.unselectAll();
		this.config.activePowerup = undefined;
		this.updatePlayerOnDefault(this.default_player);
	}

	private selectPowerUp(mypowerup) {
		this.config.activePowerup = mypowerup;
		var type = mypowerup.getType();
		if (type != "bullhorn")
			this.powerup_player = "player_" + type;
		this.updatePlayerOnPowerup(type);
	}

	private updatePlayerOnPowerup(type) {
		if (type == "bullhorn") {
			type = "normal"
		}
		for (var i = 0; i < this.config.lanes.length; i++) {
			var lane = this.config.lanes[i];
			var player = lane.player;
			if (player != undefined) {
				player.setPowerupSpriteSheet(type);

			}
		}

	}

	private updatePlayerOnDefault(playerId?) {
		for (var i = 0; i < this.config.lanes.length; i++) {
			var lane = this.config.lanes[i];
			var player = lane.player;
			if (player != undefined) {
				player.setDefaultSpriteSheet();

			}
		}
	}

	private changeLane(enemy) {
		var laneId = this.newLaneId(enemy.getLaneId());
		var lane = this.getLaneById(laneId);
		var endPoint = lane.getEnemyEndPoint();
		enemy.setLaneId(laneId);
		createjs.Tween.get(enemy).to({ y: endPoint.y }, 2000);

	}

	private newLaneId(currentLaneId) {
		var laneId;
		do {
			laneId = Math.floor(Math.random() * 3) + 1
		} while (laneId == currentLaneId);
		return laneId;
	}

	private hideTimeOut() {
		//calculateTime(me);
		window.onmousedown = () => this.prevent();
		$("#inputText").focus();
		this.config.gameState.currentState = this.config.gameState.states.RUN;
		$('#timeout-container').css('display', 'none');
		EventBus.dispatch('showCaptchas');
		EventBus.dispatch('setTickerStatus');
		EventBus.dispatch('setMute');
		//Play Stadium Ambience
		var audioList = this.config.gameState.audioList;
		for (var i = 0; i < audioList.length; i++) {
			var main = audioList[i].config.type;
			if (audioList[i].config.loop && main == this.config.gameState.soundType.EFFECTS) {
				if (audioList[i].mySound.paused) {
					audioList[i].play();
				}
				else {
					audioList[i].pause();
				}
			}
		}
		EventBus.dispatch('pauseWaves', false);
	}

	private prevent(event?) {
		if (event) {
			event.preventDefault();
		}
	}

	private calculateTime() {
		this.timeSpend = createjs.Ticker.getTime(true) - this.currentTime;
		this.currentTime = createjs.Ticker.getTime(true);
	}

	private timeConvert(milliSeconds) {
		var min = Math.floor((milliSeconds / 1000 / 60));
		var sec = Math.floor((milliSeconds / 1000) % 60);
		return { "min": min, "sec": sec }
	}

	private calculateDifficulty() {
		var wordCount = this.captchaProcessor.getWordCount();
		var time = this.timeConvert(this.timeSpend);
		var timestr = time.min + "." + time.sec;
		var timef = parseFloat(timestr);
		var wpm = wordCount / timef;

		if (wpm <= 10) {
			this.config.gameState.gs.difficulty = 2.33;
		} else if (wpm <= 15) {
			this.config.gameState.gs.difficulty = 2;
		} else if (wpm <= 20) {
			this.config.gameState.gs.difficulty = 1.67;
		} else if (wpm <= 30) {
			this.config.gameState.gs.difficulty = 1.33;
		} else if (wpm > 30) {
			this.config.gameState.gs.difficulty = 1;
		}

	}

	private saveInputTexts() {
		var arr = this.config.gameState.inputTextArr;
		$.ajax({
			url: 'http://tiltfactor1.dartmouth.edu:8080/api/difference',
			type: 'PUT',
			dataType: 'json',
			headers: { "x-access-token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJHYW1lIiwiaWF0IjoxNDE1MzQxNjMxMjY4LCJpc3MiOiJCSExTZXJ2ZXIifQ.bwRps5G6lAd8tGZKK7nExzhxFrZmAwud0C2RW26sdRM' },
			processData: false,
			contentType: 'application/json',
			timeout: 10000,
			data: JSON.stringify(arr), //this data will be in the format of a json object of user inputs and database IDs of the word they were going for (provided in the json that GET returns)
			crossDomain: true,
			error: (err) => {
				var errorText = JSON.parse(err.responseText);
				console.log(errorText);
				this.config.gameState.inputTextArr = [];
			},
			success: (data) => {
				this.config.gameState.inputTextArr = [];
				console.log(data);
			}
		});
	}

	private removeFromStage(object) {
		var child = this.config.stage.getChildIndex(object);
		this.config.stage.removeChildAt(child);
	}

	private persist() {

	}
}
