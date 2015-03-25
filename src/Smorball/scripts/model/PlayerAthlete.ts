/// <reference path="../data/playerdata.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="spritesheet.ts" />

class PlayerAthlete extends createjs.Container {

	type: string;
	laneId: number;
	typeData: PlayerTypeData;
	powerup: string;

	playerSound: any;
	sprite: createjs.Sprite;
	hit: boolean;
	hitPowerup: boolean;
	life: number;
	singleHit: boolean;
	hitEnemies: any[];
	speed: number;
	bounds: createjs.Rectangle;
	myTick: any;
	endPoint: number;
	toRun: any;

	constructor(laneId: number, type:string) {

		this.laneId = laneId;
		this.type = type;
		this.powerup = "normal";

		this.typeData = playerData[this.type];
        this.sprite = new createjs.Sprite(this.constructSpritesheet(), "idle");

		this.sprite.x = -this.typeData.offsetX;
		this.sprite.y = -this.typeData.offsetY;

        this.setEffects(this.type);
        
		super();
		
        this.addChild(this.sprite);
        this.hit = false;
        this.hitPowerup = false;
        this.life = 1;
        this.singleHit = false;
        this.hitEnemies = [];
        this.speed = 12;
        this.bounds = this.getBounds();

		if (location.hostname == "localhost") {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("red");
			circle.graphics.drawCircle(0, 0, 10);
			this.addChild(circle);
		}
	}

	updateSpriteSheet() {
		this.sprite.spriteSheet = this.constructSpritesheet();
	}

	private constructSpritesheet(): createjs.SpriteSheet {
		var data = smorball.loader.getResult(this.type + "_" + this.powerup+"_json");
		var sprite = smorball.loader.getResult(this.type + "_" + this.powerup+"_png");
		data.images = [sprite];
		return new createjs.SpriteSheet(data);
	}
	
	setEffects(id) {
		this.playerSound = playerData[id].sound;
	}

	run() {
		var me = this;
		this.sprite.gotoAndPlay("run");
		this.myTick = () => { this.tick() };
		this.addEventListener("tick", this.myTick);
	}

	addPowerups(power) {
		this.life = power.life;
		this.singleHit = power.singleHit;
	}

	pause() {
		this.removeEventListener("tick", this.myTick);
		this.sprite.gotoAndPlay("idle");
	}

	confused() {
		this.sprite.gotoAndPlay("confused");
	}

	setSpeed(speed) {
		this.speed = speed;
		(<any>this.sprite)._animation.speed = speed;
	}

	kill(enemyLife) {

		console.log("kill?!");


		for (var i = 0; i < enemyLife; i++) {
			if (this.life != 0) {
				this.life -= 1;

			}
		}
		if (this.life != 0) {
			this.tackle();
		}
		if (this.life == 0) {
			this.hit = true;
			this.sprite.gotoAndPlay("tackle");
	
			this.removeEventListener("tick", this.myTick);

			this.sprite.on("animationend",() => smorball.stageController.removeAthlete(this), this, true);

			return 0;
		}
	}

	tackle() {
		var me = this;
		this.sprite.gotoAndPlay("tackle");
		this.toRun = () => {
			this.sprite.removeEventListener("animationend", this.toRun);
			this.sprite.gotoAndPlay("run");
		};
		this.sprite.addEventListener("animationend", this.toRun);
	}

	setEndPoint(endPointX) {
		this.endPoint = endPointX;
	}

	getHeight() {
		return (<any>this.sprite)._rectangle.height;
	}

	getWidth() {
		return (<any>this.sprite)._rectangle.width;
	}

	getLife() {
		return this.life;
	}

	setLife(life) {
		this.life = life;
	}

	private tick() {
		this.x = this.x + this.speed;

		if (this.endPoint != null && this.hit == false && this.x > this.endPoint - this.getWidth()) {
			this.hit = true;
			this.kill(1);
		}
	}

}

