enum EnemyState {
	Alive,
	Dieing,
	Scoring,
	Damaged
}

class Enemy extends createjs.Container {

	type: EnemyType;
	startingLane: number;
	lane: number;
	sprite: createjs.Sprite;
	state: EnemyState = EnemyState.Alive;
	heartsContainer: createjs.Container;

	lifeRemaining: number;

	constructor(type: EnemyType, startingLane: number) {
		super();

		// Store these
		this.type = type;
		this.startingLane = this.lane = startingLane;
		this.lifeRemaining = type.life;
		
		// Start us off in the correct position
		var startPos = smorball.config.enemySpawnPositions[this.startingLane];
		this.x = startPos.x;
		this.y = startPos.y;

		// Setup the spritesheet
		var ss = new createjs.SpriteSheet(this.getSpritesheetData());
        this.sprite = new createjs.Sprite(ss, "run");
		this.sprite.framerate = 20;
		this.addChild(this.sprite);

		// Offset by the correct offset
		this.sprite.x = -this.type.offsetX;
		this.sprite.y = -this.type.offsetY;

		// Create the health indicator
		this.addHearts();

		// Draw a debug circle
		if (smorball.config.debug) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("red");
			circle.graphics.drawCircle(0, 0, 10);
			this.addChild(circle);
		}
	}

	private addHearts() {
		// Set the hearts container
		this.heartsContainer = new createjs.Container();
		this.heartsContainer.y = -(this.sprite.getBounds().height + 50);
		this.addChild(this.heartsContainer);

		// Add a number of hearts
		for (var i = 0; i < this.type.life; i++) {
			var life = new createjs.Bitmap(smorball.resources.getResource("heart_full"));
			this.heartsContainer.addChild(life);
			this.heartsContainer.x = - this.heartsContainer.getBounds().width / 2;
		}
	}

	private getSpritesheetData(): any {
		var level = smorball.game.levelIndex;
		var jsonName = this.type.id + "_" + Utils.zeroPad(level, 2) + "_json";
		var pngName = this.type.id + "_" + Utils.zeroPad(level, 2) + "_png";
		var data = smorball.resources.getResource(jsonName);
		var sprite = smorball.resources.getResource(pngName);
		data.images = [sprite];
		return data;
	}

	update(delta: number) {

		if (this.state == EnemyState.Alive) {

			// Move the enemy along
			this.x = this.x - this.type.speed * delta;

			// If we get the goal line then happy days!
			if (this.x < smorball.config.goalLine) {
				this.state = EnemyState.Scoring;
				smorball.game.enemyReachedGoaline(this);
				this.sprite.gotoAndPlay("scoring");
				this.sprite.on("animationend",(e: any) => this.destroy(), this, false);
			}
		}
	}

	tackled(athlete: Athlete) {

		// Decrement the life
		this.lifeRemaining--;
		var bm = <createjs.Bitmap>this.heartsContainer.getChildAt(this.lifeRemaining);
		bm.image = smorball.resources.getResource("heart_empty");

		// If we are dead then play the anmation and destroy
		if (this.lifeRemaining == 0) {
			smorball.game.enemyKilled(this);
			this.state = EnemyState.Dieing;
			this.sprite.gotoAndPlay("dead");
			this.sprite.on("animationend",(e: any) => this.destroy(), this, false);
		}

		// Else take some damage
		else {
			this.state = EnemyState.Damaged;
			this.sprite.gotoAndPlay("hurt");
			this.sprite.on("animationend",(e: any) => {
				this.state = EnemyState.Alive;
				this.sprite.gotoAndPlay("run");
			}, this, false);
		}	

	}

	destroy() {
		smorball.game.enemies.splice(smorball.game.enemies.indexOf(this), 1);
		smorball.screens.game.actors.removeChild(this);
	}

}