/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="spritesheet.ts" />
/// <reference path="../data/enemydata.ts" />

interface EnemyConfig {
	id: string;
	speed: number;
	life: number;
	enemySound: any;
	lanesObj: any;
	gameState: GameState;
	laneId: number;
	loader: SmbLoadQueue;
	waveId: number;
	onKill: any;
}

class Enemy extends createjs.Container {

	config: EnemyConfig;
	typeData: EnemyTypeData;
	lifes: createjs.Bitmap[];

	heartsContainer: createjs.Container;

	speed: number;
	hit: boolean;
	spritesheet: createjs.SpriteSheet;
	sprite: createjs.Sprite;
	life: any;
	endPoint: number;
	bounds: createjs.Rectangle;
	myTick: any;
	startX: number;
	startY: number;
	lifeRectSize: number;

	constructor(config: EnemyConfig) {
		super();


		this.config = config;
        this.lifes = [];
        this.speed = config.speed || 1;
        this.hit = false;
        this.typeData = EnemyData[this.config.id];
		this.spritesheet = new createjs.SpriteSheet(this.getSpritesheetData());
        this.sprite = new createjs.Sprite(this.spritesheet, "run");

		this.sprite.x = -this.typeData.offsetX;
		this.sprite.y = -this.typeData.offsetY;

		this.heartsContainer = new createjs.Container();
		this.heartsContainer.y = -(this.sprite.getBounds().height + 50);
		this.addChild(this.heartsContainer);

        //this.setScale(this.typeData.sX, this.typeData.sY);
        this.setEffects();

		this.addChild(this.sprite);
        this.life = this.config.life || EnemyData[this.config.id].life;
        this.generateLife();
        this.setExtras();
        this.bounds = this.getBounds();

		console.log(location.hostname);

		if (location.hostname == "localhost") {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("red");
			circle.graphics.drawCircle(0, 0, 10);
			this.addChild(circle);
		}
	}

	private getSpritesheetData(): any {
		var level = 1; // this.config.gameState.currentLevel;
		var jsonName = "enemy_json_" + this.config.id + "_" + Utils.zeroPad(level, 2);
		var pngName = "enemy_png_" + this.config.id + "_" + Utils.zeroPad(level, 2);
		var data = this.config.loader.getResult(jsonName);
		var sprite = this.config.loader.getResult(pngName);
		data.images = [sprite];
		console.log("creating enemy", this.config.id, data, sprite);
		return data;
	}

	private setExtras() {
		this.typeData = EnemyData[this.config.id];
		this.life = this.typeData.life || 1;
		this.speed = this.typeData.speed || 1;
		if (this.typeData.changeLane) {
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
		this.sprite.gotoAndPlay("run");
	}

	die() {
		this.sprite.gotoAndPlay("dead");
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
			this.sprite.gotoAndPlay("dead");
			this.removeEventListener("tick", this.myTick);
			this.sprite.on("animationend",() => smorball.stageController.removeEnemy(this), this, true);
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

	setPosition(x: number, y: number) {

		this.x = x;
		this.y = y;

		//this.regX = 0;
		//this.regY = this.getHeight();
	}

	addLife(start) {
		var life = new createjs.Bitmap(this.config.loader.getResult("heart_full"));
		this.lifeRectSize = life.getBounds().width;
		this.heartsContainer.addChild(life);
		this.lifes.push(life);
		this.heartsContainer.x = - this.heartsContainer.getBounds().width / 2;
	}

	removeLife() {
		var life = this.lifes.pop();
		life.image = this.config.loader.getResult("heart_empty");
	}

	getHeight() {
		return this.sprite.getBounds().height + this.lifeRectSize + 1;
	}

	getWidth() {
		return this.sprite.getBounds().width;
	}

	setScale(sx, sy) {
		this.sprite.setTransform(0, 6, sx, sy);
	}

	setEffects() {
		this.config.enemySound = EnemyData[this.config.id].sound;
	}

	getMaxLife() {
		return EnemyData[this.config.id].life
	}

	getLife() {
		return this.lifes.length;
	}

	private generateLife() {
		for (var i = 0; i < this.life; i++) {
			this.addLife(false);
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