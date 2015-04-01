/// <reference path="../../typings/smorball/smorball.d.ts" />

class MapLevel extends createjs.Container {

	stadium: createjs.Bitmap;
	base: createjs.Bitmap;
	lock: createjs.Bitmap;
	//logo: createjs.Bitmap;

	levelId: number;
	isUnlocked: boolean;

	constructor(levelId: number, pos: MapPoint) {
		super();

		this.levelId = levelId;

		// Position correctly
		this.x = pos.x;
		this.y = pos.y;

		// Add the base
		this.base = new createjs.Bitmap(smorball.resources.getResource("map_stadium_base"));
		this.base.mouseEnabled = true;
		this.addChild(this.base); 

		// Add the stadium
		this.stadium = new createjs.Bitmap(smorball.resources.getResource("map_stadium"));
		this.stadium.x = 20;
		this.stadium.y = -20;
		this.stadium.mouseEnabled = true;
		this.stadium.cursor = "pointer";
		this.addChild(this.stadium);

		// Add the lock
		this.lock = new createjs.Bitmap(smorball.resources.getResource("map_lock"));
		this.lock.x = 58;
		this.lock.y = -80;
		this.addChild(this.lock);
		
		// Add the logo
		//this.logo = new createjs.Bitmap(smorball.resources.getResource("eugene_melonballers_logo_small"));

	
		this.updateLockedState();

		this.on("click", e => this.onClick(), this, false, null, true);
	}

	updateLockedState() {

		this.isUnlocked = smorball.user.hasUnlockedLevel(this.levelId);

		if (this.isUnlocked) {
			this.lock.visible = false;
			this.stadium.visible = true;
			//this.logo.visible = true;
			//this.base.visible = false;
		}
		else {
			this.lock.visible = true;
			this.stadium.visible = false;
			//this.logo.visible = false;
			//this.base.visible = true;
		}
	}

	private onClick() {
		if (this.isUnlocked) {
			smorball.game.loadLevel(this.levelId);
		}
	}

}

