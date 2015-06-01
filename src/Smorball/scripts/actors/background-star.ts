/// <reference path="../../typings/smorball/smorball.d.ts" />


class BackgroundStar extends createjs.Bitmap {

	vel: createjs.Point;
	angularVel: number;

	width: number;
	height: number;

	constructor() {

		super(smorball.resources.getResource("background_star"));

		this.width = this.getBounds().width;
		this.height = this.getBounds().height;

		this.alpha = 0.2;
		this.x = Math.random() * smorball.config.width;
		this.y = Math.random() * smorball.config.height;
		this.regX = this.width / 2;
		this.regY = this.height / 2;

		this.vel = new createjs.Point(Math.random() * 100, Math.random() * 200 - 100);
		this.angularVel = (Math.random() > 0.5 ? -1 : 1) * Math.random() * 50;
	}

	update(delta: number) {
		this.x += this.vel.x * delta;
		this.y += this.vel.y * delta;

		if (this.x > smorball.config.width + this.width) this.x = -this.width;
		if (this.x < -this.width) this.x = smorball.config.width - this.width;
		if (this.y > smorball.config.height + this.height) this.y = -this.height;
		if (this.y < -this.height) this.y = smorball.config.height + this.height;

		this.rotation += this.angularVel * delta;
	}

}
