/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="spritesheet.ts" />
/// <reference path="../data/enemydata.ts" />

class Enemy extends createjs.Container {

	config: any;
	lifes: any[]
	speed: number;
	hit: boolean;
	spriteData: SpriteSheet;
	sprite: createjs.Sprite;
	extras: any;
	life: any;
	endPoint: number;
	bounds: createjs.Rectangle;
	myTick: any;
	myAnimationEnd: any;
	startX: number;
	startY: number;
	lifeRectSize: number;

	constructor(config: any) {
		this.config = config || {};
        this.lifes = [];
        this.speed = config.speed || 1;
        this.hit = false;
        
		this.spriteData = new SpriteSheet({ "id": this.config.id, "data": EnemyData[this.config.id].data, "loader": this.config.loader });
        this.sprite = new createjs.Sprite(this.spriteData, "stand");
        this.extras = EnemyData[this.config.id].extras;
        this.setScale(this.extras.sX, this.extras.sY);
        this.setEffects();

		super();

		this.addChild(this.sprite);
        this.life = this.config.life || EnemyData[this.config.id].extras.life;
        this.generateLife();
        this.setExtras();
        this.bounds = this.getBounds();
	}

	private setExtras() {
		this.extras = EnemyData[this.config.id].extras;
		this.life = this.extras.life || 1;
		this.speed = this.extras.speed || 1;
		if (this.extras.changeLane) {
			setTimeout(() => { EventBus.dispatch("changeLane") }, 2000);
		}
	}

	/*var drawBorder = function(me){
		var shape = new createjs.Shape();
		shape.graphics.beginStroke("#000").setStrokeStyle(0.1).drawRect(0,0,this.getWidth(),this.getHeight());
		this.addChild(shape);

	}*/	

	run() {
		var me = this;
		this.sprite.gotoAndPlay("run");
		this.myTick = () => { this.tick() };
		this.addEventListener("tick", this.myTick);
	}

	pause() {
		this.removeEventListener("tick", this.myTick);
		this.sprite.gotoAndPlay("stand");
	}

	die() {
		this.sprite.gotoAndPlay("die");
	}

	kill(life) {
		var me = this;
		for (i = 0; i < life; i++) {
			if (this.lifes.length != 0) {
				this.removeLife();
			}
		}

		var fileId = this.config.enemySound.hit;
		EventBus.dispatch("playSound", fileId);
		var lanesObj = this.config.lanesObj;
		for (var i = 0; i < lanesObj.length; i++) {
			if (this.config.laneId == lanesObj[i].laneId) {
				var currentLaneObj = lanesObj[i];
			}
		}
		if (this.lifes.length == 0) {
			this.hit = true;
			var fileId = this.config.enemySound.die;
			EventBus.dispatch("playSound", fileId);
			this.sprite.gotoAndPlay("die");
			this.removeEventListener("tick", this.myTick);
			this.myAnimationEnd = () => { this.removeFallingAnimation() };
			this.sprite.addEventListener("animationend", this.myAnimationEnd);
		}
		else {
			var knockBack = this.x + this.config.gameState.gs.knockBack * currentLaneObj.config.width
			this.x = this.startX < knockBack ? this.startX : knockBack;
		}
		return this.lifes.length;
	}

	setSpeed(speed) {
		this.speed = speed;
		(<any>this.sprite)._animation.speed = speed;
	}

	setStartPoint(x, y) {
		this.startX = x;
		this.startY = y;
		this.setPosition(x, y);
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.regX = 0;
		this.regY = this.getHeight();
		this.updateLifePos();
	}

	addLife(start) {
		var life = new createjs.Bitmap(this.config.loader.getResult("heart_full"));
		//life.graphics.beginFill("#123").drawRect(0,0,this.lifeRectSize,this.lifeRectSize);
		this.lifeRectSize = life.getBounds().width;
		this.addChild(life);
		this.lifes.push(life);
		if (!start) {
			this.updateLifePos();
		}
	}

	removeLife() {
		var life = this.lifes.pop();
		life.image = this.config.loader.getResult("heart_empty");
		this.updateLifePos();
	}

	getHeight() {
		return this.sprite.getBounds().height + this.lifeRectSize + 1;
	}

	getWidth() {
		return this.sprite.getBounds().width;
	}

	setScale(sx, sy) {
		this.sprite.setTransform(0, 6, sx, sy);
		this.updateLifePos();
	}

	setEffects() {
		this.config.enemySound = EnemyData[this.config.id].extras.sound;
	}

	getMaxLife() {
		return EnemyData[this.config.id].extras.life
	}

	getLife() {
		return this.lifes.length;
	}

	private generateLife() {
		for (var i = 0; i < this.life; i++) {
			this.addLife(false);
		}
		this.updateLifePos();
	}

	private updateLifePos() {

		var sx = (this.getWidth() / 2) - (this.life * (this.lifeRectSize)) / 2;
		var sy = -10;

		for (var i = 0; i < this.lifes.length; i++) {
			var life = this.lifes[i];
			life.x = sx;
			sx = sx + (this.lifeRectSize + 1);
			life.y = sy;
		}
	}

	setEndPoint(endPointX) {
		this.endPoint = endPointX;
	}

	private tick() {
		this.x = this.x - this.speed;
		if (this.endPoint != null && this.hit == false && this.x < this.endPoint) {
			this.hit = true;
			this.lifes.length = 0;
			this.kill(0);
			EventBus.dispatch("killLife");


		}
	}

	private removeFallingAnimation() {
		this.sprite.removeEventListener("animationend", this.myAnimationEnd);
		EventBus.dispatch("killme", this);
		EventBus.dispatch("resetTimer");
	}

	getWaveId() {
		return this.config.waveId;
	}

	getLaneId() {
		return this.config.laneId;
	}

	setLaneId(laneId) {
		this.config.laneId = laneId;
	}

	onKillPush() {
		return this.config.onKill;
	}


}