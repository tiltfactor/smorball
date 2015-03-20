/// <reference path="../data/playerdata.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="spritesheet.ts" />

class SpriteMan extends createjs.Container {

	config: any;
	playerTypes: string[];
	type: string;
	spriteData: SpriteSheet;
	extras: any;
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
	//myAnimationEnd: any;
	toRun: any;

	constructor(config: any) {

		this.config = config;
        this.playerTypes = ["player", "hockey", "football"];


        this.type = this.getRandomType();
        var id = this.type + "_normal";
        this.spriteData = new SpriteSheet({ "id": id, "data": PlayerData[id].data, "loader": this.config.loader, "gameState": this.config.gameState });
        this.sprite = new createjs.Sprite(this.spriteData, "idle");
        this.extras = PlayerData[id].extras;
        this.setScale(this.extras.sX, this.extras.sY);
        this.setEffects(id);
        
		super();


        this.addChild(this.sprite);
        this.hit = false;
        this.hitPowerup = false;
        this.life = 1;
        this.singleHit = false;
        this.hitEnemies = [];
        this.speed = this.config.speed || 12;
        this.bounds = this.getBounds();
	}

	private getRandomType() {
		var type = Math.floor(Math.random() * this.playerTypes.length);
		return this.playerTypes[type];
	}

	setDefaultSpriteSheet() {
		var id = this.type + "_normal";
		this.spriteData = new SpriteSheet({ "id": id, "data": PlayerData[id].data, "loader": this.config.loader });
		this.sprite.spriteSheet = this.spriteData;
		this.extras = PlayerData[id].extras;
		this.setScale(this.extras.sX, this.extras.sY);
		this.sprite.gotoAndPlay("idle");

	}

	setPowerupSpriteSheet(powerupType) {
		var id = this.type + "_" + powerupType;
		this.spriteData = new SpriteSheet({ "id": id, "data": PlayerData[id].data, "loader": this.config.loader });
		this.sprite.spriteSheet = this.spriteData;
		this.extras = PlayerData[id].extras;
		this.setScale(this.extras.sX, this.extras.sY);
		this.sprite.gotoAndPlay("idle");

	}


	setEffects(id) {
		this.config.playerSound = PlayerData[id].extras.sound;
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

	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.regX = 0;
		this.regY = this.getHeight();

	}

	setSpeed(speed) {
		this.speed = speed;
		(<any>this.sprite)._animation.speed = speed;
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
			this.hit = true;
			this.sprite.gotoAndPlay("tackle");
	
			this.removeEventListener("tick", this.myTick);
		
			this.sprite.on("animationend",() => {
				EventBus.dispatch("killme", this);				
				EventBus.addEventListener("removeFromStage", this);
			}, this, true);

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

	setScale(sx, sy) {
		this.sprite.setTransform(0, 6, sx, sy);
	}

	getLaneId() {
		return this.config.laneId;
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

