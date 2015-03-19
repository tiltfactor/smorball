/// <reference path="../data/leveldata.ts" />
/// <reference path="../data/mapdata.ts" />
/// <reference path="../data/loaderdata.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../data/manifest.ts" />

class GameLevelController {

	config: any;
	width: number;
	height: number;
	canvasWidth: number;
	canvasHeight: number;
	gameLevels: any[];
	map: any;

	infoText: createjs.Text;
	logo: createjs.Bitmap;
	scoreText: createjs.Text;
	infoContainer: createjs.Container;

	constructor(config: any) {
		this.config = config;
	}

	init() {
			var me = this;
			this.gameLevels = [];
			this.config.stage.enableMouseOver(10);
			this.config.stage.snapToPixelEnabled = true;
			this.loadEvents();
			this.setCanvasAttributes();
	}

	private setCanvasAttributes() {
		this.width = 1600;
		this.height = 1200;
		this.onResize();
	}

	private onResize() {
		var canvas = this.config.stage.canvas;
		this.canvasWidth = canvas.width = window.innerHeight * 4 / 3 > window.innerWidth ? window.innerWidth : window.innerHeight * 4 / 3;
		this.canvasHeight = canvas.height = this.canvasWidth * 3 / 4 > window.innerHeight ? window.innerHeight : this.canvasWidth * 3 / 4;

		this.config.stage.scaleX = this.canvasWidth / 1600;
		this.config.stage.scaleY = this.canvasHeight / 1200;
		this.config.stage.update();
		var paddingTop = (window.innerHeight - this.canvasHeight) / 2 > 0 ? (window.innerHeight - this.canvasHeight) / 2 : 0;
		$("#utilityCanvas").css({ top: paddingTop });
		$("#canvasHolder").css({ top: this.canvasHeight + paddingTop - $("#canvasHolder").height(), position: 'absolute' });
	}

	private loadEvents() {
		EventBus.addEventListener("showMap", cheat => this.showMap(cheat.target));
		EventBus.addEventListener("setLevel", level => this.setLevel(level.target));
		EventBus.addEventListener("changeLevelInfoBar",levelInfo => this.changeLevelInfoBar(levelInfo.target));
	}

	private loadImages(isCheatd) {
		var manifest = [];

		if (!this.config.gameState.map) {
			this.config.gameState.map = true;
			manifest = Manifest.levelMap;
			for (var i = 1; i <= this.config.gameState.gs.maxLevel; i++) {
				var splash = LoaderData[i];
				manifest.push({ "src": splash.image, "id": splash.id });
			}
		} else {
			if (isCheatd) {
				for (var i = 1; i <= this.config.gameState.gs.maxLevel; i++) {
					var splash = LoaderData[i];
					manifest.push({ "src": splash.image, "id": splash.id });
				}
			} else {
				if (this.config.gameState.currentLevel != this.config.gameState.gs.totalLevels) {
					var splash = LoaderData[this.config.gameState.currentLevel];
					manifest.push({ "src": splash.image, "id": splash.id });
				}
			}
		}

		this.config.loader.loadQueue(manifest,() => {
			this.showMapScreen();
		});

	}

	showMap(isCheated) {
		EventBus.dispatch("stopSound", "crowdCheering");
		EventBus.dispatch("stopSound", "stadiumAmbience");
		var me = this;
		EventBus.dispatch("hideAll");
		$("#loaderDiv").show();
		EventBus.dispatch("saveToStore");
		this.onResize();
		this.loadImages(isCheated);
	}

	private showMapScreen() {
		window.onresize = () => { this.onResize() };
		this.config.stage.removeAllChildren();
		$("#dialog-utility").show();
		this.map = new createjs.Container();
		this.config.stage.addChild(this.map);
		var levelmap = new createjs.Bitmap(this.config.loader.getResult("map_background"));
		this.map.addChild(levelmap);
		this.drawPathDots();
		this.drawMenuButton();
		this.drawLevels();
		this.drawShop();
		this.drawCashBar();
		this.drawSurvival();
		this.drawLevelInfoBar();

		if (this.config.gameState.gs.maxLevel > 1) {
			this.drawFaceBookButton();
			this.drawTwitterButton();

		}
		this.drawStatusText();


		this.config.stage.update();
	}

	private drawLevels() {
		var totLevels = this.config.gameState.totalLevels;
		for (var i = 0; i < totLevels; i++) {
			var isLocked = this.config.gameState.gs.maxLevel <= i ? true : false;
			var config = { "stadiumInfo": MapData[i], "locked": isLocked, "loader": this.config.loader, "id": i + 1 };
			var level = new Level(config);
			this.gameLevels.push(level);
			this.map.addChild(level);
		}


	}

	private drawShop() {
		var shop = new createjs.Bitmap(this.config.loader.getResult("shop_icon"));
		shop.id = this.config.gameState.gs.maxLevel;
		shop.x = 1000;
		shop.y = 780;
		if (this.config.gameState.gs.maxLevel > 1) {
			shop.addEventListener("click", () => this.showShop());
		} else {
			shop.image = this.config.loader.getResult("lock");
			shop.y = 830;
		}

		shop.addEventListener("mouseover", (evt:any) => {
			evt.target.cursor = 'pointer';
		});
		this.map.addChild(shop);


	}

	private drawStatusText() {
		var text = new createjs.Text("status", "bold 45px Boogaloo", "#000");
		var level = _.pick(LevelData[this.config.gameState.gs.maxLevel], "extras");
		if (level.extras != undefined) {
			text.text = level.extras.message;
			text.addEventListener("click", (e) => { this.map.removeChild(text) });
			text.maxWidth = 400;
			text.x = 1110;
			text.y = 750;
		} else {
			text.text = "";
		}
		this.map.addChild(text);
		createjs.Tween.get(text).to({ alpha: 0 }, 5000);
	}

	private showShop() {
		EventBus.dispatch("showShop");
	}

	private drawCashBar() {
		var score = new Score({ "gameState": this.config.gameState });
		var cashContainer = new createjs.Container();
		var cashText = new createjs.Text();
		var cashbar = new createjs.Bitmap(this.config.loader.getResult("cash_bar"));
		cashContainer.x = this.map.getBounds().width - cashbar.getTransformedBounds().width - 40;
		cashContainer.y = 20;

		cashText.text = score.getMyMoney();
		cashText.font = "bold 60px Boogaloo";
		cashText.color = "white";
		cashText.setTransform(cashbar.getTransformedBounds().width / 2 - cashText.getMeasuredWidth() / 2, cashbar.getTransformedBounds().height / 2 - cashText.getMeasuredHeight());
		cashContainer.addChild(cashbar, cashText);
		this.map.addChild(cashContainer);

	}

	private drawSurvival() {
		var survival = new createjs.Bitmap(this.config.loader.getResult("lock"));
		survival.setTransform(200, 770, 1, 1);
		if (this.config.gameState.gs.maxLevel >= this.config.gameState.totalLevels) {
			survival.image = this.config.loader.getResult("stopwatch_icon");
			survival.setTransform(200, 700, 1, 1);
			survival.addEventListener("click", () => { this.setLevel(0) });
		}
		survival.addEventListener("mouseover", (evt:any) => { evt.target.cursor = "pointer" });

		this.map.addChild(survival);
	}

	private drawLevelInfoBar() {
		this.infoContainer = new createjs.Container();
		this.map.addChild(this.infoContainer);

		var inforbar = new createjs.Bitmap(this.config.loader.getResult("level_info_bar"));
		inforbar.y = inforbar.getTransformedBounds().height;

		this.logo = new createjs.Bitmap(this.config.loader.getResult("splash1"));
		this.logo.setTransform(-40, 0, 0.5, 0.5);
		this.logo.y = inforbar.y - this.logo.getTransformedBounds().height / 3;

		this.infoText = new createjs.Text("Charlson Chargers", "50px Boogaloo", "#ffffff");

		this.infoText.x = this.logo.getTransformedBounds().width - 40;
		this.infoText.y = inforbar.getBounds().height + this.infoText.getBounds().height / 2 - 5;

		this.scoreText = new createjs.Text("0/6", "bold 75px Boogaloo", "#ffffff");

		this.scoreText.x = inforbar.x + inforbar.getTransformedBounds().width - this.scoreText.getMeasuredWidth() - 10;

		this.scoreText.y = this.infoText.y - this.scoreText.getMeasuredHeight() / 3 + 10;

		this.infoContainer.addChild(inforbar, this.logo, this.infoText, this.scoreText);
		this.infoContainer.x = 20;
		this.infoContainer.y = this.map.getBounds().height - this.infoContainer.getTransformedBounds().height - 20;
		//this.infoText.lineWidth = inforbar.getTransformedBounds().width/2;
		this.infoText.maxWidth = inforbar.getTransformedBounds().width / 2;
	}

	private drawPathDots() {
		var pointdata = PointData;
		for (var i = 0; i < pointdata.length; i++) {
			var dot = new createjs.Bitmap(this.config.loader.getResult("path_dot"));
			dot.setTransform(pointdata[i].x, pointdata[i].y, 1, 1);
			this.map.addChild(dot)
		}
	}

	private drawFaceBookButton() {
		var fbbtn = new createjs.Bitmap(this.config.loader.getResult("fb_btn_up"));
		fbbtn.y = this.map.getBounds().height - fbbtn.getTransformedBounds().height - 40;
		fbbtn.x = this.infoContainer.x + this.infoContainer.getTransformedBounds().width + 20;
		fbbtn.addEventListener("mouseover", (evt:any) => {
			evt.target.image = this.config.loader.getResult("fb_btn_over");
			evt.target.cursor = "pointer";
			this.config.stage.update();
		});

		fbbtn.addEventListener("mousedown",(evt: any) => {
			evt.target.image = this.config.loader.getResult("fb_btn_down");
			evt.target.cursor = "pointer";
			this.config.stage.update();
		});
		fbbtn.addEventListener("pressup",(evt: any) => {
			evt.target.image = this.config.loader.getResult("fb_btn_up");
			evt.target.cursor = "default";
			this.config.stage.update();
		});
		fbbtn.addEventListener("mouseout",(evt: any) => {
			evt.target.image = this.config.loader.getResult("fb_btn_up");
			evt.target.cursor = "default";
			this.config.stage.update();
		});
		this.map.addChild(fbbtn);

	}

	private drawTwitterButton() {
		var tbtn = new createjs.Bitmap(this.config.loader.getResult("t_btn_up"));
		tbtn.y = this.map.getBounds().height - tbtn.getTransformedBounds().height - 40;
		tbtn.x = this.infoContainer.x + this.infoContainer.getTransformedBounds().width + tbtn.getTransformedBounds().width + 40;
		tbtn.addEventListener("mouseover",(evt: any) => {
			evt.target.image = this.config.loader.getResult("t_btn_over");
			evt.target.cursor = "pointer";
			this.config.stage.update();
		});
		tbtn.addEventListener("mousedown",(evt: any) => {
			evt.target.image = this.config.loader.getResult("t_btn_down");
			evt.target.cursor = "pointer";
			this.config.stage.update();
		});
		tbtn.addEventListener("pressup",(evt: any) => {
			evt.target.image = this.config.loader.getResult("t_btn_up");
			evt.target.cursor = "default";
			this.config.stage.update();
		});
		tbtn.addEventListener("mouseout",(evt: any) => {
			evt.target.image = this.config.loader.getResult("t_btn_up");
			evt.target.cursor = "default";
			this.config.stage.update();
		});
		this.map.addChild(tbtn);
	}

	private drawMenuButton() {
		var mbtn = new createjs.Bitmap(this.config.loader.getResult("menu_btn_idle"));
		mbtn.x = mbtn.getTransformedBounds().width / 4;
		mbtn.y = mbtn.getTransformedBounds().height / 4;
		mbtn.addEventListener("mousedown",(evt: any) => {
			evt.target.image = this.config.loader.getResult("menu_btn_click");
			evt.target.cursor = "pointer";
			this.config.stage.update();
			this.config.stage.removeAllChildren();
			EventBus.dispatch("hideAll");
			EventBus.dispatch("showMenu");
		});
		mbtn.addEventListener("mouseover",(evt: any) => {
			evt.target.image = this.config.loader.getResult("menu_btn_over");
			evt.target.cursor = "pointer";
			this.config.stage.update();
		});
		mbtn.addEventListener("pressup",(evt: any) => {
			evt.target.image = this.config.loader.getResult("menu_btn_idle");
			evt.target.cursor = "pointer";
			this.config.stage.update();
		});
		mbtn.addEventListener("mouseout",(evt: any) => {
			evt.target.image = this.config.loader.getResult("menu_btn_idle");
			evt.target.cursor = "pointer";
			this.config.stage.update();
		});
		this.map.addChild(mbtn);
	}

	private changeLevelInfoBar(levelInfo) {
		var maxLevel = this.config.gameState.gs.maxLevel;
		this.infoText.text = levelInfo.team;
		var score = 0;
		if (this.config.gameState.gs.gameLevelPoints[levelInfo.id - 1]) {
			score = this.config.gameState.gs.gameLevelPoints[levelInfo.id - 1];
		}
		this.scoreText.text = score + "/6";

		if (this.config.loader.getResult("logo" + levelInfo.id) && levelInfo.id <= maxLevel) {
			this.logo.image = this.config.loader.getResult("logo" + levelInfo.id);
			this.logo.setTransform(-30, 50, 1.5, 1.5);
		} else {
			this.logo.image = this.config.loader.getResult("lock");
			this.logo.setTransform(0, 50, 1, 1);
		}

		this.config.stage.update();
	}

	setLevel(level) {
		this.config.gameState.currentLevel = level;
		EventBus.dispatch("hideAll");
		EventBus.dispatch("newGame");
		$("#myCanvas").show();

	}
}
