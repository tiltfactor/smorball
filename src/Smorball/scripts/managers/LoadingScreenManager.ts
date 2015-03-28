/// <reference path="../../typings/smorball/smorball.d.ts" />

class LoadingScreenManager extends createjs.Container {

	background: createjs.Shape;
	stars: BackgroundStar[];
	logo: createjs.Bitmap;
	loadingBarBottom: createjs.Bitmap;
	loadingBar: createjs.Bitmap;
	loadingBarTop: createjs.Bitmap;
	loadingText: createjs.Text;

	init() {
		this.visible = false;
	}

	show() {
		this.visible = true;

		// The loading screen is special as it can only be constructed after the assets have been loaded
		if (this.background != null) return;

		// Create the background
		this.background = new createjs.Shape();
		this.background.graphics.beginRadialGradientFill(["#116b99", "#053c59"], [0, 1],
			smorball.config.width / 2, smorball.config.height / 2, 0,
			smorball.config.width / 2, smorball.config.height / 2, smorball.config.width);
		this.background.graphics.drawCircle(smorball.config.width / 2, smorball.config.height / 2, smorball.config.width);
		this.addChild(this.background);

		// Add some floating stars
		this.stars = [];
		for (var i = 0; i < 40; i++) {
			var star = new BackgroundStar();
			this.addChild(star);
			this.stars.push(star);
		}

		// Add the logo
		this.logo = new createjs.Bitmap(smorball.resources.getResource("smorball_logo"));
		Utils.centre(this.logo, true, false);
		this.logo.y = 0;
		this.addChild(this.logo);

		// Add the loading bar bg
		this.loadingBarBottom = new createjs.Bitmap(smorball.resources.getResource("loading_bar_bottom"));
		Utils.centre(this.loadingBarBottom, true, false);
		this.loadingBarBottom.y = 1000;
		this.addChild(this.loadingBarBottom);

		// Add the loading bar 
		this.loadingBar = new createjs.Bitmap(smorball.resources.getResource("loading_bar"));
		this.loadingBar.x = this.loadingBarBottom.x;
		this.loadingBar.y = 1008;
		this.addChild(this.loadingBar);

		// Add the loading bar fg
		this.loadingBarTop = new createjs.Bitmap(smorball.resources.getResource("loading_bar_top"));
		Utils.centre(this.loadingBarTop, true, false);
		this.loadingBarTop.y = 1000;
		this.addChild(this.loadingBarTop);

		// Add the "loading" text;
		this.loadingText = new createjs.Text("LOADING...", "70px Boogaloo", "white");
		Utils.centre(this.loadingText, true, false);
		this.loadingText.y = 900;
		this.loadingText.shadow = new createjs.Shadow("#000000", 3, 3, 0);
		this.addChild(this.loadingText);
	}

	hide() {
		this.visible = false;
	}

	update(delta:number) {
		// Dont need to update if not visible
		if (!this.visible) return;

		// Update the stars motion
		_.each(this.stars, star => star.update(delta));

		// Set the correct loading bar value
		this.loadingBar.scaleX = smorball.resources.queue.progress * this.loadingBarBottom.getBounds().width;
	}
}