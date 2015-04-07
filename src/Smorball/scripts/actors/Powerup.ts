enum PowerupState {
	NotCollected,
	Collecting
}

class Powerup extends createjs.Container {

	lane: number;
	type: string;
	icon: createjs.Bitmap;
	shadowBmp: createjs.Bitmap;
	state: PowerupState;

	vel: number;

	constructor(type: string, lane: number) {

		super();

		this.lane = lane;
		this.type = type;
		this.state = PowerupState.NotCollected;

		this.shadowBmp = new createjs.Bitmap(smorball.resources.getResource("shadow"));
		this.shadowBmp.regX = 124;
		this.shadowBmp.regY = 35;
		this.shadowBmp.alpha = 0.5;
		this.shadowBmp.scaleX = this.shadowBmp.scaleY = 0.5;
		this.addChild(this.shadowBmp);

		this.icon = new createjs.Bitmap(smorball.resources.getResource(type + "_powerup"));
		this.icon.regX = 43;
		this.icon.regY = 60;
		this.addChild(this.icon);

		this.vel = -100;

	}

	update(delta: number) {

		if (this.state == PowerupState.NotCollected) {
			var gravity = 120;
			this.vel += gravity * delta;
			this.icon.y += this.vel * delta;

			if (this.icon.y > 0) {
				this.icon.y = 0;
				this.vel = -100;
			}

			var r = -this.icon.y / 60;
			this.shadowBmp.alpha = 0.5 - r * 0.4;
			this.shadowBmp.scaleX = this.shadowBmp.scaleY = 0.5 - r * 0.1;	
		}
	}

	collect() {
		smorball.audio.playSound("powerup_activated_sound", 1);

		this.state = PowerupState.Collecting;
		smorball.powerups.powerups[this.type].quantity++;
		createjs.Tween.get(this).to({ alpha: 0 }, 500, createjs.Ease.quartOut);
		createjs.Tween.get(this.icon).to({ y: this.icon.y - 20, scaleX: 0, scaleY: 0.5 }, 500, createjs.Ease.quartOut)
			.call(() => this.destroy());
	}

	destroy() {
		smorball.powerups.views.splice(smorball.powerups.views.indexOf(this), 1);
		smorball.screens.game.actors.removeChild(this);
	}

	

}