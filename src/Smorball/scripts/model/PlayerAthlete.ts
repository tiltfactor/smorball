/// <reference path="../data/playerdata.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="spritesheet.ts" />

enum PlayerAthleteStates {
	AnimatingIn,
	ReadyToRun,
	Running,
	Dieing,
	Dead
}

class PlayerAthlete extends createjs.Container {
	
	type: string;
	laneId: number;
	typeData: PlayerTypeData;
	powerup: string;
	state: PlayerAthleteStates;
	private startX: number;

	playerSound: any;
	sprite: createjs.Sprite;
	hitPowerup: boolean;
	life: number;
	singleHit: boolean;
	hitEnemies: any[];
	speed: number;
	bounds: createjs.Rectangle;
	endPoint: number;
	toRun: any;

	

	constructor(laneId: number, type:string) {

		this.laneId = laneId;
		this.type = type;
		this.powerup = "normal";
		this.state = PlayerAthleteStates.ReadyToRun;

		this.typeData = playerData[this.type];
        this.sprite = new createjs.Sprite(this.constructSpritesheet(), "idle");
		this.sprite.framerate = 20;

		this.sprite.x = -this.typeData.offsetX;
		this.sprite.y = -this.typeData.offsetY;

        this.setEffects(this.type);
        
		super();
		
        this.addChild(this.sprite);
        this.hitPowerup = false;
        this.life = 1;
        this.singleHit = false;
        this.hitEnemies = [];
        this.speed = this.typeData.speed;
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

	animateIn() {
		this.startX = this.x;
		this.x -= 200;
		this.state = PlayerAthleteStates.AnimatingIn;
		this.sprite.gotoAndPlay("run");
	}

	update(delta: number) {
		if (this.state == PlayerAthleteStates.AnimatingIn) {
			this.x = this.x + this.speed * delta;
			if (this.x >= this.startX) 
				this.setReadyToRun();
		}
		else if (this.state == PlayerAthleteStates.Running) {
			this.x = this.x + this.speed * delta;

			// If we run past the end of the world then lets just die
			if (this.x > gameConfig.worldWidth)
				this.kill(1);
		}		
	}

	setReadyToRun() {
		this.x = this.startX;
		this.state = PlayerAthleteStates.ReadyToRun;
		this.sprite.gotoAndPlay("idle");
		smorball.levelController.capatchas.refreshCaptcha(this.laneId);
	}

	run() {
		this.sprite.gotoAndPlay("run");
	}

	addPowerups(power) {
		this.life = power.life;
		this.singleHit = power.singleHit;
	}

	confused() {
		this.sprite.gotoAndPlay("confused");
	}

	kill(enemyLife) {

		for (var i = 0; i < enemyLife; i++) {
			if (this.life != 0) {
				this.life -= 1;

			}
		}
		if (this.life != 0) {
			this.tackle();
		}
		if (this.life == 0) {
			this.sprite.gotoAndPlay("tackle");
	
			this.sprite.on("animationend",() => smorball.levelController.removeAthlete(this), this, true);

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

}

