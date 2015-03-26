/// <reference path="preloader.ts" />
/// <reference path="../data/leveldata.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />

class LoaderClass extends createjs.Container {

	canvasWidth: number;
	canvasHeight: number;

	preloader: Preloader;

	constructor() {

        this.onResize();
		super();
        this.initialize();
        //this.y = 600 - this.getTransformedBounds().height;
        window.onresize = () => { this.onResize() };
        this.y = 600 - this.getTransformedBounds().height / 2;
        this.onResize();

	}

	initialize() {

		var gameLevel = this.config.currentLevel;
		var config = { "currentLevel": gameLevel, "loader": this.config.loader, "type": this.config.type };
		this.preloader = new Preloader(config);
		this.addChild(this.preloader);
		if (this.config.type == 0) {
			var sb = new createjs.Bitmap(this.config.loader.getResult("smorball_logo"));
			if (sb.image != null) {
				this.addChild(sb);
				sb.setTransform(500, 0, 1, 1);			
				this.preloader.x = 500;
				this.preloader.y = 800;
			} else {
				this.preloader.x = 500;
				this.preloader.y = 0;
			}

		}
		if (this.config.type == 1) {
			this.preloader.x = 500;
			this.preloader.y = 800;
			this.drawText(gameLevel);
			this.drawTeams(gameLevel);
		}
	}

	updateLoader(perc) {
		this.preloader.update(perc)
	}

	private drawText(gameLevel: number) {
		var team = levelsData[gameLevel].name;
		var text = new createjs.Text(team, "bold 120px Boogaloo", "#ffffff");
		text.lineWidth = 630;
		text.textAlign = "center";
		text.lineHeight = text.getMeasuredHeight() / 2 + 20;
		text.shadow = new createjs.Shadow("#000000", 3, 3, 1);
		text.x = 800;
		text.y = -50;
		this.addChild(text);
	}

	private drawTeams(gameLevel) {
		this.drawHomeTeam();
		this.drawVSText();
		this.drawEnemyTeam(gameLevel);

	}

	private drawVSText() {
		var vs = new createjs.Text("VS", "bold 140px Boogaloo", "#ffffff");
		vs.shadow = new createjs.Shadow("#000000", 3, 3, 1);
		vs.textAlign = "center";
		vs.setTransform(790, 410);
		this.addChild(vs);
	}

	private drawHomeTeam() {
		var team = new createjs.Bitmap(this.config.loader.getResult("hometeam"));
		team.setTransform(140, 210);
		this.addChild(team);
	}

	private drawEnemyTeam(gameLevel) {
		var team = new createjs.Bitmap(this.config.loader.getResult("splash" + gameLevel));
		team.setTransform(960, 210);
		this.addChild(team);
	}

	drawPlayButton() {
		var me = this;
		this.config.stage.enableMouseOver(10);
		var btnContainer = new createjs.Container();
		var btn = new createjs.Bitmap(this.config.loader.getResult("btn_bg"));
		btnContainer.x = this.preloader.x + btn.getTransformedBounds().width / 2 - 40;
		btnContainer.y = this.preloader.y;
		btnContainer.addEventListener("mousedown",(e: any) => {
			window.onresize = null;
			e.target.cursor = "pointer";
			btn.image = this.config.loader.getResult("btn_down");
			this.config.stage.removeAllChildren();
			this.config.stage.update();
			$("#loaderDiv").hide();
			EventBus.dispatch("onImagesLoad");
			EventBus.dispatch("playSound", "stadiumAmbience");
			$("#inputText").focus();
		});

		btnContainer.addEventListener("mouseout",(e: any) => {
			e.target.cursor = "pointer";
			btn.image = this.config.loader.getResult("btn_bg");
			this.config.stage.update();
		});
		btnContainer.addEventListener("mouseover",(e: any) => {
			e.target.cursor = "pointer";
			btn.image = this.config.loader.getResult("btn_over");
			this.config.stage.update();
		});
		btnContainer.addEventListener("pressup",(e: any) => {
			e.target.cursor = "pointer";
			btn.image = this.config.loader.getResult("btn_bg");
			this.config.stage.update();
		});
		var btnText = new createjs.Text("PLAY", "bold 60px Boogaloo", "#ffffff");
		btnText.textBaseline = 'middle';
		btnText.x = btn.getTransformedBounds().width / 2 - btnText.getMeasuredWidth() / 2;
		btnText.y = btn.getTransformedBounds().height / 2 - btnText.getMeasuredHeight() / 2;
		btnContainer.addChild(btn, btnText);
		this.addChild(btnContainer);
		this.removeLoader();
	}

	private onResize() {
		var canvas = this.config.stage.canvas;
		this.canvasWidth = canvas.width = window.innerHeight * 4 / 3 > window.innerWidth ? window.innerWidth : window.innerHeight * 4 / 3;
		this.canvasHeight = canvas.height = this.canvasWidth * 3 / 4 > window.innerHeight ? window.innerHeight : this.canvasWidth * 3 / 4;

		this.config.stage.scaleX = this.canvasWidth / 1600;
		this.config.stage.scaleY = this.canvasHeight / 1200;
		this.config.stage.update();

		var paddingTop = (window.innerHeight - this.canvasHeight) / 2;
		var paddingLeft = (window.innerWidth - this.canvasWidth) / 2;
		$("#loaderCanvas").css({ top: paddingTop, left: 0 });


	}

	removeLoader() {
		this.removeChild(this.preloader);
	}

	private drawSBlogo() {
		var sb = new createjs.Bitmap(this.config.loader.getResult("smorball_logo"));
		this.addChild(sb);
	}

}

