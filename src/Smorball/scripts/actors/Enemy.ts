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
	private laneChanges: number[];

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
		this.sprite.regX = this.type.offsetX;
		this.sprite.regY = this.type.offsetY;
		this.sprite.scaleX = this.sprite.scaleY = this.type.scale;
		this.addChild(this.sprite);

		// Create the health indicator
		this.addHearts();

		// Work out lane changes upfront
		this.calculateLaneChanges();

		// Draw a debug circle
		//if (smorball.config.debug) {
		//	var circle = new createjs.Shape();
		//	circle.graphics.beginFill("red");
		//	circle.graphics.drawCircle(0, 0, 10);
		//	this.addChild(circle);
		//}
	}

	private calculateLaneChanges() {
		this.laneChanges = [];
		if (!this.type.changeLane) return;

		var diff = smorball.config.width - smorball.config.goalLine;		
		var oneThirdsPos = (diff * 0.6666) + smorball.config.goalLine;
		var twoThirdsPos = (diff * 0.3333) + smorball.config.goalLine;

		oneThirdsPos += -100 + Math.random() * 200;
		twoThirdsPos += -100 + Math.random() * 200;
		this.laneChanges.push(oneThirdsPos, twoThirdsPos);
	}
	
	private addHearts() {
		// Set the hearts container
		this.heartsContainer = new createjs.Container();
		this.heartsContainer.y = -(this.sprite.getTransformedBounds().height + 50);
		this.addChild(this.heartsContainer);

		// Add a number of hearts
		for (var i = 0; i < this.type.life; i++) {
			var life = new createjs.Bitmap(smorball.resources.getResource("heart_full"));
			life.x = (life.getBounds().width + 2) * i;
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

			// If have lange changes then handle them
			if (this.laneChanges.length > 0 && this.x < this.laneChanges[0]) {
				this.laneChanges.splice(0, 1);
				this.changeLane();
			}
		} 
	}

	changeLane() {
		var l = this.lane;
		if (l == 0) l = 1;
		else if (l == 2) l = 1;
		else if (l == 1) l = Math.random() > 0.5 ? 0 : 2;
		createjs.Tween.get(this).to({ y: smorball.config.enemySpawnPositions[l].y }, 1000);
		createjs.Tween.get(this).to({}, 500).call(() => this.lane = l);
	}

	tackled(athlete: Athlete) {

		// Decrement the life
		var damage = 1 * athlete.damageMultiplier;
		if (athlete.powerup == "cleats") damage *= smorball.powerups.types.cleats.damageMultiplier;
		damage = Math.min(damage, this.lifeRemaining);
		for (var i = 0; i < damage; i++) {
			this.lifeRemaining--;
			var bm = <createjs.Bitmap>this.heartsContainer.getChildAt(this.lifeRemaining);
			bm.image = smorball.resources.getResource("heart_empty");
			if (this.lifeRemaining == 0) break;
		}

		// If we are dead then play the anmation and destroy
		if (this.lifeRemaining == 0) {

			// Let the game manager know
			smorball.game.enemyKilled(this);

			// Update the state and play an animation
			this.state = EnemyState.Dieing;
			this.sprite.gotoAndPlay("dead");

			// When the animation is done we should remove from the display list
			this.sprite.on("animationend",(e: any) => this.onDeathAnimationComplete(), this, false);

			// Play a sound
			this.playSound("die");
		}

		// Else take some damage
		else {

			// Play a sound
			this.playSound("hit");

			// Knock us back a bit (but not too far)
			var newX = this.x + smorball.config.knockback * smorball.game.knockbackMultiplier;
			if (newX > smorball.config.width) newX = smorball.config.width;
			createjs.Tween.get(this).to({ x: newX }, 200, createjs.Ease.quartOut);

			// Play an imations
			this.state = EnemyState.Damaged;
			this.sprite.gotoAndPlay("hurt");

			// When the anim is done continue to run
			this.sprite.on("animationend",(e: any) => {
				this.state = EnemyState.Alive;
				this.sprite.gotoAndPlay("run");
			}, this, false);
		}	

	}

	private onDeathAnimationComplete() {
		this.sprite.stop();
		createjs.Tween.get(this).to({ alpha: 0 }, 500).call(() => this.destroy());
	}

	private playSound(sound: string) {
		var setting: EnemyTypeAudioSetting = this.type.audio[sound];
		var variation = Math.ceil(setting.variations * Math.random());
		var id = Utils.format("smorball_{0}_{1}_{2}_sound", this.type.audio.id, sound, Utils.zeroPad(variation, 2));
		smorball.audio.playSound(id);
	}

	destroy() {
		smorball.game.enemies.splice(smorball.game.enemies.indexOf(this), 1);
		smorball.screens.game.actors.removeChild(this);
	}

}