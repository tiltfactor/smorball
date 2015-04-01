/// <reference path="../../typings/smorball/smorball.d.ts" />


class StarBackground extends createjs.Container {

	background: createjs.Shape;
	stars: BackgroundStar[];

	constructor() {
		super();

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
	}

	update(delta: number) {
		// Update the stars motion
		_.each(this.stars, star => star.update(delta));
	}

}