/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="spritesheet.ts" />
/// <reference path="../data/enemydata.ts" />

class Enemy extends createjs.Container {

	type: string;
	typeData: EnemyTypeData;
	lifes: createjs.Bitmap[];
	startingLane: number;
	currentLane: number;

	heartsContainer: createjs.Container;

	speed: number;
	hit: boolean;
	spritesheet: createjs.SpriteSheet;
	sprite: createjs.Sprite;
	life: any;
	endPoint: number;
	bounds: createjs.Rectangle;
	startX: number;
	startY: number;
	lifeRectSize: number;

	constructor(type: string, startingLane: number) {
		super();

		// Save these
		this.type = type;
        this.typeData = enemyData[type];
		this.startingLane = this.currentLane = startingLane;

		// Start at the correct position
		var startPos = gameConfig.enemySpawnPositions[this.startingLane];
		this.x = startPos.x;
		this.y = startPos.y;



        this.lifes = [];
        this.speed = this.typeData.speed;
        this.hit = false;
		this.spritesheet = new createjs.SpriteSheet(this.getSpritesheetData());
        this.sprite = new createjs.Sprite(this.spritesheet, "run");
		this.sprite.framerate = 20;

		this.sprite.x = -this.typeData.offsetX;
		this.sprite.y = -this.typeData.offsetY;

		this.heartsContainer = new createjs.Container();
		this.heartsContainer.y = -(this.sprite.getBounds().height + 50);
		this.addChild(this.heartsContainer);

        //this.setScale(this.typeData.sX, this.typeData.sY);
        this.setEffects();

		this.addChild(this.sprite);
        this.life = this.typeData.life;
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
		var jsonName = "enemy_json_" + this.type + "_" + Utils.zeroPad(level, 2);
		var pngName = "enemy_png_" + this.type + "_" + Utils.zeroPad(level, 2);
		var data = smorball.loader.getResult(jsonName);
		var sprite = smorball.loader.getResult(pngName);
		data.images = [sprite];
		console.log("creating enemy", this.type, data, sprite);
		return data;
	}

	private setExtras() {
		this.typeData = enemyData[this.type];
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
		this.sprite.gotoAndPlay("run");
	}

	update(delta: number) {
		this.x = this.x - this.speed * delta;
		if (this.endPoint != null && this.hit == false && this.x < this.endPoint) {
			this.hit = true;
			this.lifes.length = 0;
			this.kill(0);
			EventBus.dispatch("killLife");
		}
	}

	die() {
		this.sprite.gotoAndPlay("dead");
	}

	kill(life) {
		var me = this;
		for (var i = 0; i < life; i++) {
			if (this.lifes.length != 0) {
				this.removeLife();
			}
		}

		var fileId = this.typeData.sound.hit;
		EventBus.dispatch("playSound", fileId);

		//var lanesObj = this.config.lanesObj;
		//for (var i = 0; i < lanesObj.length; i++) {
		//	if (this.startingLane == lanesObj[i].laneId) {
		//		var currentLaneObj = lanesObj[i];
		//	}
		//}
		if (this.lifes.length == 0) {
			this.hit = true;
			var fileId = this.typeData.sound.die;
			EventBus.dispatch("playSound", fileId);
			this.sprite.gotoAndPlay("dead");
			this.sprite.on("animationend",() => smorball.levelController.removeEnemy(this), this, true);
		}
		else {
			//var knockBack = this.x + smorball.gameState.gs.knockBack * currentLaneObj.config.width
			//this.x = this.startX < knockBack ? this.startX : knockBack;
		}
		return this.lifes.length;
	}

	setSpeed(speed) {
		this.speed = speed;
		(<any>this.sprite)._animation.speed = speed;
	}

	addLife(start) {
		var life = new createjs.Bitmap(smorball.loader.getResult("heart_full"));
		this.lifeRectSize = life.getBounds().width;
		this.heartsContainer.addChild(life);
		this.lifes.push(life);
		this.heartsContainer.x = - this.heartsContainer.getBounds().width / 2;
	}

	removeLife() {
		var life = this.lifes.pop();
		life.image = smorball.loader.getResult("heart_empty");
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
		//this.config.enemySound = EnemyData[this.type].sound;
	}

	getMaxLife() {
		return enemyData[this.type].life
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
}