/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../data/gameconfig.ts" />

interface LaneConfig {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
	loader: SmbLoadQueue;
}

class Lane extends createjs.Container {


	config: LaneConfig;

	laneId: number;
	leftArea: number;
	player: PlayerAthlete;

	constructor(config: LaneConfig) {
		this.config = config;
        this.laneId = config.id;
        this.leftArea = config.width / 6; //300;

		super();

        this.x = this.config.x;
        this.y = this.config.y;
        this.drawLayout();
        this.setLeftArea();
	}

	/*getPlayerPosition = function(){
        var point = {};
        point.x = 10;
        point.y = this.config.y + this.config.height/2;
        return point;
    }*/

    setPlayer(player) {
        this.player = player;
        this.player.x = 0;
        if (player.type == "football") {
            this.player.x = 20;
        }
        this.player.y = (this.config.y - this.config.height * 0.75);
        this.player.setEndPoint(this.config.x + this.config.width);
    }

    getPowerupPosition() {
		var limit = (this.config.width - this.leftArea) * 3 / 4;
        return {
			x: (Math.random() * limit) + this.leftArea + this.config.x,
			y: this.config.y + this.config.height / 2 //this.config.y + (this.config.height/7);
		};
    }

    getCaptchaX() {
        return this.leftArea / 2;
    }
    getMaxCaptchaWidth() {
        return this.leftArea;
    }

    getEnemyEndPoint() {
        return {
			x: this.leftArea + this.config.x,
			y: this.config.y + this.config.height * 0.75///2;//this.config.y + (this.config.height/7);
		};
    }

    getEndPoint() {
		return gameConfig.enemySpawnPositions[this.config.id];

  //      return {
		//	x: this.config.x + this.config.width,
		//	y: this.config.y + this.config.height * 0.75 //this.config.y + (this.config.height/7);
		//};
    }

    getHeight() {
        return this.config.height;
    }

    getLaneId() {
        return this.config.id;
    }

	private drawLayout() {
		var totalTiles = 9;
		var tileWidth = 178;
		var tileHeight = 192;
		var padding = 10;
		this.leftArea = tileWidth * 2;
		var tileImage = "grassTile";
		var w = 0;
		for (var i = 0; i < totalTiles; i++) {
			var ide = 0;
			if (this.laneId % 2 == 0) {
				ide = 3;
			} else {
				ide = 1;
			}
			if (i % 2 != 0) {
				ide++;
			}
			var bitmap = new createjs.Bitmap(this.config.loader.getResult(tileImage + ide));
			bitmap.x = w;
			bitmap.y = 0;
			w = w + tileWidth;
			this.addChild(bitmap);
		}
	}

	private setLeftArea() {
		var shape = new createjs.Shape();
		shape.graphics
			.beginFill("#ffffff")
			.drawRect(0, 0, this.leftArea, this.config.height);
		shape.alpha = 0.5;
		this.addChild(shape);
	}
}


