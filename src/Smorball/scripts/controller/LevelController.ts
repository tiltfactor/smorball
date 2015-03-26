/// <reference path="../model/lane.ts" />
/// <reference path="../model/mybag.ts" />
/// <reference path="../model/waves.ts" />
/// <reference path="../model/commentarybox.ts" />
/// <reference path="../data/manifest.ts" />
/// <reference path="../data/leveldata.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />

class LevelController {

	//events: any = {};

	spawing: LevelSpawningController;
	capatchas: CaptchaController;

	currentIndex: number;
	default_player: string;
	powerup_player: string;
	timeSpend: number;
	score: Score;
	oldSpawning: Spawning;
	currentTime: number;
	level: Level;
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
	stadium: createjs.Container;
	seatContainer: Blocks;
	commentryBox: CommentaryBox;
	adBoard: AdBoard;
	bgContainer: createjs.Container;
	passCount: number;

	stage: createjs.Stage;

	actorsContainer: createjs.Container;

	life: number;

	players: PlayerAthlete[];
	enemies: Enemy[];
	gems: any[];
	powerups: any[];
	lanes: Lane[];
	wavesc: any[];
	activePowerup = undefined;

	enemiesKilled: number;

	constructor() {
		
		// Setup the stage
        this.stage = new createjs.Stage("myCanvas");
        this.stage.enableMouseOver(10);
        this.setCanvasAttributes();

		// Setup the ticker
		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick",(e: createjs.TickerEvent) => this.update(e));

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

    private loadEvents() {
		EventBus.addEventListener("newGame",() => this.newGame());
		EventBus.addEventListener("resumeGame",() => this.resumeGame());
		EventBus.addEventListener("pauseGame",() => this.pauseGame());
		//EventBus.addEventListener("killme",(o) => this.killMe(o));
		EventBus.addEventListener("killLife",() => this.killLife());
		//EventBus.addEventListener("pushEnemy",(o:any) => this.pushEnemy(o.target));
		EventBus.addEventListener("pushPowerup",(o) => this.pushPowerup(o.target));
		EventBus.addEventListener("showTimeoutScreen",() => this.showTimeoutScreen());
		EventBus.addEventListener("showMessage",(text) => this.showGameMessage(text));	
		//EventBus.addEventListener("toggleTickerStatus",() => this.toggleTickerStatus());
		EventBus.addEventListener("unselectAllInBag",() => this.unselectAllInBag());
		EventBus.addEventListener("selectPowerUp",(powerup) => this.selectPowerUp(powerup.target));
		EventBus.addEventListener("changeLane",(obj) => this.changeLane(obj.target));
		//EventBus.addEventListener("showCaptchas",() => this.captchaProcessor.showCaptchas());
		EventBus.addEventListener("onImagesLoad",() => this.onImagesLoad());
		EventBus.addEventListener("resetAll",() => this.resetAll());
		EventBus.addEventListener("hideTimeOut",() => this.hideTimeOut());
		EventBus.addEventListener("stopCheering",() => { console.log("MIKEC ==> stop cheering does not exit?!"); /*this.stopCheering()*/ });
		EventBus.addEventListener("removeFromStage",(o) => this.removeFromStage(o.target));
	}

	private newGame() {
		this.capatchas.sendInputsToServer();
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
	}

	private loadImages() {		
		var manifest = [];
		if (!smorball.gameState.level) {
			smorball.gameState.level = true;

			console.log("Loading images from manifest for level", smorball.gameState.currentLevel);
			smorball.loader.loadLevelQueue(this.constructLevelManifest(smorball.gameState.currentLevel), smorball.gameState.currentLevel);
		} else {
			smorball.loader.loadLevelQueue(manifest, smorball.gameState.currentLevel);
		}
	}

	private constructLevelManifest(level: number): any {

		// HAAAAACK! Settings level to always be 1 for now so we use the same sprites
		level = 1;

		// We take the standard level elements then we need to add level specific assets such as the enemy variations
		var assets = Manifest.level.slice();

		_.each(enemyData, enemy => {
			var path = Utils.format(enemy.spritesPathTemplate, Utils.zeroPad(level, 2));
			assets.push({ src: path + ".json", id: "enemy_json_" + enemy.id + "_" + Utils.zeroPad(level, 2) });
			assets.push({ src: path + ".png", id: "enemy_png_" + enemy.id + "_" + Utils.zeroPad(level, 2) });
			//console.log("enemy", enemy, path, asset);
		});

		return assets;
	}

	private onImagesLoad() {
		window.onmousedown = () => this.prevent();


		//$("#captchaInputContainer input").show();
		//$("#inputText").focus();


		this.onResize();
		window.onresize = () => {
			this.onResize()
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
	}

	private initShowMessage() {
		this.message = new createjs.Bitmap(null);
		this.message.x = 800;
		this.message.y = 1000;
		this.message.alpha = 0;
		this.stage.addChild(this.message);
	}

	private showGameMessage(msg) {
		var text = msg.target;
		this.showMessage(text);
	}

	private showMessage(text) {
		this.message.image = smorball.loader.getResult(text);
		this.message.x = 800 - this.message.getBounds().width / 2;
		var index = this.stage.children.length - 1;
		this.stage.setChildIndex(this.message, index);
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
		var canvas = this.stage.canvas;
		this.canvasWidth = canvas.width = window.innerHeight * 4 / 3 > window.innerWidth ? window.innerWidth : window.innerHeight * 4 / 3;
		this.canvasHeight = canvas.height = this.canvasWidth * 3 / 4 > window.innerHeight ? window.innerHeight : this.canvasWidth * 3 / 4;
		this.stage.scaleX = this.canvasWidth / 1600;
		this.stage.scaleY = this.canvasHeight / 1200;
		var paddingTop = (window.innerHeight - this.canvasHeight) / 2 > 0 ? (window.innerHeight - this.canvasHeight) / 2 : 0;
		$("#myCanvas").css({ top: paddingTop });
		$("#captchaInputContainer").css({ height: this.canvasHeight * .07 });
		$("#captchaInputContainer").css({ width: this.canvasWidth, left: (window.innerWidth - this.canvasWidth) / 2, top: this.canvasHeight + paddingTop - $("#captchaInputContainer").height(), position: 'absolute' });
	}

	private drawStadium() {
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
	}

	private drawBackGround() {
		this.bgContainer = new createjs.Container();
		this.stage.addChild(this.bgContainer);
		var shape = new createjs.Shape();
		shape.graphics.beginBitmapFill(smorball.loader.getResult("background"))
			.drawRect(0, 0, this.width, this.height);
		this.bgContainer.addChild(shape);
	}

	private drawTimeOut() {
		var mbtn = new createjs.Bitmap(smorball.loader.getResult("menu_btn_idle"));
		mbtn.x = mbtn.getTransformedBounds().width / 4;
		mbtn.y = mbtn.getTransformedBounds().height / 4;
		mbtn.addEventListener("mousedown", (evt:any) => {
			evt.target.image = smorball.loader.getResult("menu_btn_click");
			evt.target.cursor = "pointer";
			EventBus.dispatch("showTimeoutScreen");
		});
		mbtn.addEventListener("mouseover",(evt: any) => {
			evt.target.image = smorball.loader.getResult("menu_btn_over");
			evt.target.cursor = "pointer";
			this.stage.update();

		});
		mbtn.addEventListener("pressup",(evt: any) => {
			evt.target.image = smorball.loader.getResult("menu_btn_idle");
			evt.target.cursor = "pointer";

		});
		mbtn.addEventListener("mouseout",(evt: any) => {
			evt.target.image = smorball.loader.getResult("menu_btn_idle");
			evt.target.cursor = "pointer";

		});
		this.stadium.addChild(mbtn);
	}

	private drawLogo() {
		var logo = new createjs.Bitmap(null);
		logo.image = smorball.loader.getResult("splash" + smorball.gameState.currentLevel);
		logo.x = 800 - logo.getTransformedBounds().width / 2;
		logo.y = 600;
		logo.alpha = 0.25;
		this.stage.addChildAt(logo, 6);
	}

	private showScore() {
		this.scoreText = new createjs.Text("Total Score :" + this.score.getTotalScore(), "20px Arial", "#000000");
		this.scoreText.setTransform(this.width - 300, 10, 1, 1);
		this.stage.addChild(this.scoreText);
	}

	private updateScore() {
		this.scoreText.text = "Total Score :" + this.score.getTotalScore();
	}

	private killLife() {
		this.life--;
		EventBus.dispatch("setScore", this.life);
		if (this.life == 0) {
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
				"loader": smorball.loader
			};
			var lane = new Lane(config);
			this.stage.addChild(lane);
			this.lanes.push(lane);

			//if (!(this.level.lanes == 1 && (laneId == 1 || laneId == 3))) {

				//var captchaHolder = this.captchaProcessor.getCaptchaPlaceHolder(lane.getMaxCaptchaWidth(), 60 + lane.getHeight(), laneId);
				//captchaHolder.name = "captchaHolder";
				//captchaHolder.x = lane.getCaptchaX() + 30;
				//captchaHolder.y = lane.y + 90;
				//this.stage.addChild(captchaHolder);

			//}
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
	}

	private resumeGame() {
		this.capatchas.showCaptchas();
		EventBus.dispatch("exitMenu");
		$("#captchaInputContainer").show();
		$("#myCanvas").show();
		createjs.Ticker.setPaused(false);
		console.log("Game Resumed");
	}

	private pauseGame() {
		console.log("Game Paused");
		createjs.Ticker.setPaused(true);
		EventBus.dispatch("showMenu");
	}

	private showTimeoutScreen() {
		if (!createjs.Ticker.getPaused() && smorball.gameState.currentState == smorball.gameState.states.RUN) {
			smorball.gameState.currentState = smorball.gameState.states.MAIN_MENU;
			this.capatchas.hideCaptchas();
			this.stage.update();
			createjs.Ticker.setPaused(true);
			EventBus.dispatch("showTimeout");
			EventBus.dispatch("setMute");
		}
	}

	private activatePlayer(player) {
		var powerup = this.activePowerup;
		if (powerup && player != undefined) {
			player.addPowerups(this.activePowerup.getPower());
			this.activePowerup = undefined;
		}
		if (player != undefined) {
			this.players.push(player);
			player.run();
		}
	}

	private resetGame() {

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
	}

	private removeAllChildren() {
		this.stage.removeAllChildren();
		this.stage.update();
	}

	private removeAllEvents() {

	}

	

	private hitTest() {
		if (this.players != undefined && this.players.length != 0) {
			for (var i = 0; i < this.players.length; i++) {
				var player = this.players[i];
				if (player.state == PlayerAthleteStates.Dieing) continue;
				var enemy = this.hitTestEnemies(player);
				var powerup = this.hitTestPowerups(player);
				if (enemy != null && player.state != PlayerAthleteStates.Dieing && enemy.hit == false) {

					if (player.singleHit) {
						var hitList = player.hitEnemies;
						if (hitList.indexOf(enemy.id) == -1) {
							player.tackle();
							player.hitEnemies.push(enemy.id);
							enemy.kill(player.getLife());
						}
					} else {
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
					//this.updateLevelStatus(powerup);
				}
			}
		}

	}

	private hitTestEnemies(player: PlayerAthlete) {
		if (this.enemies.length != 0) {
			for (var i = 0; i < this.enemies.length; i++) {
				var enemy = this.enemies[i];
				if (enemy.hit == true || player.laneId != enemy.currentLane) continue;
				//if(enemy.hit == true) continue;
				var hit = this.isCollision(player, enemy);
				if (hit) {
					return enemy;
				}
			}
		}
	}

	private hitTestPowerups(player: PlayerAthlete) {
		if (this.powerups.length != 0) {
			for (var i = 0; i < this.powerups.length; i++) {
				var powerup = this.powerups[i];
				if (powerup.getLaneId() != player.laneId) continue;
				var hit = this.isCollisionPowerup(player, powerup);
				if (hit) {
					return powerup;
				}
			}
		}
	}

	private isCollisionPowerup(player: PlayerAthlete, object) {
		return (object.x <= player.x + player.getWidth() &&
			player.x <= object.x + object.getWidth());
	}

	private isCollision(player: PlayerAthlete, object) {
		return (object.x <= player.x + player.getWidth() &&
			player.x <= object.x + object.getWidth())
	}

	

	private playConfusedAnimation() {
		for (var i = 0; i < this.lanes.length; i++) {
			var lane = this.lanes[i];
			if (lane.player) {
				lane.player.x = lane.player.x + 70;
				lane.player.sprite.addEventListener("animationend", (e:any) => {
					e.target.removeEventListener("animationend", e.target._listeners.animationend[0]);
					e.target.parent.x = e.target.parent.x - 70;
				});
				lane.player.confused();
			}

		}
	}

	private removeActivePowerup() {
		if (this.activePowerup) {
			smorball.myBag.removeFromBag(this.activePowerup);

		}
	}

	private startPlayersFromAllLanes() {
		for (var i = 0; i < this.lanes.length; i++) {
			var lane = this.lanes[i];
			this.activatePlayer(lane.player);
			lane.player = undefined;
		}
	}

	

	private waitForForcePush(waveId) {
		setTimeout(() => {
			if (this.enemies.length == 0) {
				EventBus.dispatch("forcePush", waveId);
			}
		}, 2000);
	}

	private updateLevel() {

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

	}

	showResultScreen(result) {
		$("#captchaInputContainer input").hide();
		
		EventBus.dispatch("stopSound", "stadiumAmbience");
		setTimeout(() => {
			createjs.Ticker.setPaused(true);
			EventBus.dispatch("setMute");
			if (result == 0) {
				$("#captchaInputContainer").hide();
				$("#lostContainer").show();
				$("#lostContainer .moneyMade").text(0);
				$("#resultWrapper").css("display", "table");
			} else if (result == 1) {
				var money = this.score.getMoneyForLevel(this.life);
				$("#victoryContainer .moneyMade").text(money);
				$("#victoryContainer").show();
				$("#resultWrapper").css("display", "table");
			} else if (result == 2) {
				EventBus.dispatch("showMap", true);
			} else if (result == 3) {
				var time = this.timeConvert(this.timeSpend);
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
	}

	private gameOver() {

		this.calculateTime();
		smorball.gameState.currentState = smorball.gameState.states.GAME_OVER;

		EventBus.dispatch("showCommentary", "Game Over");
		if (smorball.gameState.currentLevel == smorball.gameState.survivalLevel) {
			this.showResultScreen(3);
		} else {
			this.showResultScreen(0);
		}
	}

	private resetAll() {
		var store = new LocalStorage();
		// store.reset();
		smorball.gameState.reset();
		smorball.myBag.reset();
		EventBus.dispatch("showMap");

	}

	

	private getLaneById(id) {
		for (var i = 0; i < this.lanes.length; i++) {
			var lane = this.lanes[i];
			if (lane.getLaneId() == id) {
				return lane;
			}
		}
		return null;
	}

	private pushPowerup(powerup) {
		this.setPowerupProperties(powerup);
		this.oldSpawning.onPowerupSpawned();
		this.stage.addChildAt(powerup, 8);
		this.powerups.push(powerup);
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
		for (var i = 0; i < smorball.myBag.myBag.length; i++) {
			var powerup = smorball.myBag.myBag[i];
			powerupContainer.addChild(powerup);
			powerup.reset();
			x = x + powerup.getWidth() + padding;
			powerup.setPosition(x, y);
		}
		powerupContainer.x = this.commentryBox.x + powerupContainer.getTransformedBounds().width / 2;
		this.stadium.addChild(powerupContainer);

	}

	private addToMyBag(powerup) {
		var index = this.powerups.indexOf(powerup);
		this.powerups.splice(index, 1);
		smorball.myBag.addToBagFromField(powerup);
		this.stage.removeChild(powerup);
	}

	private unselectAllInBag() {
		smorball.myBag.unselectAll();
		this.activePowerup = undefined;
		this.updatePlayerOnDefault(this.default_player);
	}

	private selectPowerUp(mypowerup) {
		this.activePowerup = mypowerup;
		var type = mypowerup.getType();
		if (type != "bullhorn")
			this.powerup_player = "player_" + type;
		this.updatePlayerOnPowerup(type);
	}

	private updatePlayerOnPowerup(type) {
		if (type == "bullhorn") {
			type = "normal"
		}
		for (var i = 0; i < this.lanes.length; i++) {
			var lane = this.lanes[i];
			var player = lane.player;
			if (player != undefined) {
				player.powerup = type;
				player.updateSpriteSheet();

			}
		}

	}

	private updatePlayerOnDefault(playerId?) {
		for (var i = 0; i < this.lanes.length; i++) {
			var lane = this.lanes[i];
			var player = lane.player;
			if (player != undefined) {
				player.powerup = "normal";
				player.updateSpriteSheet();

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
		this.capatchas.showCaptchas();
		createjs.Ticker.setPaused(false);
		window.onmousedown = () => this.prevent();
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
		var wordCount = this.capatchas.captchasSucceeded;
		var time = this.timeConvert(this.timeSpend);
		var timestr = time.min + "." + time.sec;
		var timef = parseFloat(timestr);
		var wpm = wordCount / timef;

		if (wpm <= 10) {
			smorball.gameState.gs.difficulty = 2.33;
		} else if (wpm <= 15) {
			smorball.gameState.gs.difficulty = 2;
		} else if (wpm <= 20) {
			smorball.gameState.gs.difficulty = 1.67;
		} else if (wpm <= 30) {
			smorball.gameState.gs.difficulty = 1.33;
		} else if (wpm > 30) {
			smorball.gameState.gs.difficulty = 1;
		}

	}



	private removeFromStage(object) {
		var child = this.stage.getChildIndex(object);
		this.stage.removeChildAt(child);
	}

	private persist() {

	}










	private update(e: createjs.TickerEvent) {
		// Dont update if paused!
		if (createjs.Ticker.getPaused()) return;

		// Get the delta (in seconds) as this is all we need to pass to the children
		var delta = e.delta / 1000;
		
		// Update all the bits
		this.spawing.update(delta);
		_.each(this.enemies, e => e.update(delta));
		_.each(this.players, p => p.update(delta));
		this.capatchas.update(delta);

		// Physics
		this.hitTest();

		// Finally render
		this.stage.update(e);
	}

	getEnemiesRemaining(): number {
		return this.spawing.enemySpawnsThisLevel - this.enemiesKilled; 
	}

	private spawnStartingAthletes() {
		_.each(this.level.lanes, i => this.spawnAthlete(i));
	}

	spawnAthlete(lane: number) {
		var type = Utils.randomOne(_.keys(playerData));

		var player = new PlayerAthlete(lane, type);
		this.addAthlete(player);

		var spawnPos = gameConfig.friendlySpawnPositions[lane];
		player.x = spawnPos.x;
		player.y = spawnPos.y;

		player.animateIn();
	}

	addAthlete(athlete: PlayerAthlete) {
		this.actorsContainer.addChild(athlete);
		this.players.push(athlete);
		console.log("New athlete added to stage", { lane: athlete.laneId, type: athlete.type });
	}

	removeAthlete(athlete: PlayerAthlete) {
		this.players = _.without(this.players, athlete);
		this.actorsContainer.removeChild(athlete);
	}

	addEnemy(enemy: Enemy) {
		this.actorsContainer.addChild(enemy);
		this.enemies.push(enemy);
		console.log("New enemy added to stage", { lane: enemy.startingLane, type: enemy.type });
	}

	removeEnemy(enemy: Enemy) {
		this.enemies = _.without(this.enemies, enemy);
		this.enemiesKilled++;
		this.actorsContainer.removeChild(enemy);
	}

}
