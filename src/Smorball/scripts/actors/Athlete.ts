/// <reference path="../../typings/smorball/smorball.d.ts" />

enum AthleteState {
	Entering,
	ReadyToRun,
	Running,
	Dieing
}

class Athlete extends createjs.Container {

	lane: number;
	type: AthleteType;
	sprite: createjs.Sprite;
	state: AthleteState = AthleteState.ReadyToRun;

	private startX: number;

	constructor(type: AthleteType, lane: number) {
		super();

		this.lane = lane;
		this.type = type;

		// Start us off in the correct position
		var startPos = smorball.config.friendlySpawnPositions[this.lane];
		this.x = startPos.x;
		this.y = startPos.y;

		// Setup the spritesheet
		var ss = new createjs.SpriteSheet(this.getSpritesheetData());
        this.sprite = new createjs.Sprite(ss, "idle");
		this.sprite.framerate = 20;
		this.addChild(this.sprite);

		// Offset by the correct offset
		this.sprite.x = -this.type.offsetX;
		this.sprite.y = -this.type.offsetY;

		// Draw a debug circle
		if (smorball.config.debug) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("red");
			circle.graphics.drawCircle(0, 0, 10);
			this.addChild(circle);
		}

		this.animateIn();
	}

	private animateIn() {
		this.startX = this.x;
		this.x -= (200 + Math.random() * 10);
		this.state = AthleteState.Entering;
		this.sprite.gotoAndPlay("run");
	}

	private getSpritesheetData(): any {
		var level = smorball.game.levelIndex;
		var jsonName = this.type.id + "_normal_json";
		var pngName = this.type.id + "_normal_png";
		var data = smorball.resources.getResource(jsonName);
		var sprite = smorball.resources.getResource(pngName);
		data.images = [sprite];
		return data;
	}

	update(delta: number) {

		if (this.state == AthleteState.Entering) {
			this.x = this.x + this.type.speed * delta;
			if (this.x >= this.startX)
				this.setReadyToRun();
		}
		else if (this.state == AthleteState.Running) {

			// Move the enemy along
			this.x = this.x + this.type.speed * delta;

			// Check for collisions
			this.checkCollisions();

			// If we get to the end of the world then die
			if (this.x > smorball.config.width) 
				this.tackle();			
		}
	}

	private checkCollisions() {

		var myBounds = this.getBounds();
		myBounds.x += this.x;
		myBounds.y += this.y;

		_.chain(smorball.game.enemies)
			.filter(e => e.state == EnemyState.Alive && e.lane == this.lane)
			.each(e => {
				var theirBounds = e.getBounds();
				theirBounds.x += e.x;
				theirBounds.y += e.y;

				if (myBounds.intersects(theirBounds)) {
					e.tackled(this);
					this.tackle();
				}
		});
	}

	private tackle() {
		this.state = AthleteState.Dieing;
		this.sprite.gotoAndPlay("tackle");
		
		this.sprite.on("animationend",(e: any) => this.destroy(), this, false);
	}

	private setReadyToRun() {
		this.x = this.startX;
		this.state = AthleteState.ReadyToRun;
		this.sprite.gotoAndPlay("idle");
		smorball.captchas.refreshCaptcha(this.lane);
	}

	destroy() {
		smorball.game.athletes.splice(smorball.game.athletes.indexOf(this), 1);
		smorball.screens.game.actors.removeChild(this);
	}

	run() {
		this.state = AthleteState.Running;
		this.sprite.gotoAndPlay("run");
	}
}