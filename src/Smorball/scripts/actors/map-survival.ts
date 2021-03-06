﻿/// <reference path="../../typings/smorball/smorball.d.ts" />

class MapSurvival extends createjs.Container {

	lock: createjs.Bitmap;
	survival: createjs.Bitmap;

	constructor() {
		super();

		// Add the lock
		this.lock = new createjs.Bitmap(smorball.resources.getResource("map_lock"));
		this.lock.x = -64;
		this.lock.y = -131;
		this.lock.mouseEnabled = true;
		this.lock.cursor = "pointer";
		this.addChild(this.lock);

		// Add the shop
		this.survival = new createjs.Bitmap(smorball.resources.getResource("stopwatch_icon"));
		this.survival.x = -76;
		this.survival.y = -204;
		this.survival.cursor = "pointer";
		this.survival.mouseEnabled = true;
		this.addChild(this.survival);	

		this.updateLockedState();

		this.on("click", e => this.onClick(), this, false, null, true);
	}

	updateLockedState() {

		if (smorball.user.isSurvivalUnlocked()) {
			this.lock.visible = false;
			this.survival.visible = true;
		}
		else {
			this.lock.visible = true;
			this.survival.visible = false;
		}
	}

	onClick() {
		if (smorball.user.isSurvivalUnlocked()) {
			smorball.game.loadLevel(smorball.game.levels.length-1);
		}
	}
}

