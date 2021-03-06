﻿/// <reference path="../../typings/smorball/smorball.d.ts" />

enum AthleteState {
	Entering,
	ReadyToRun,
	Running,
	Tackling
}

class Athlete extends createjs.Container {

	lane: number;
	type: AthleteType;
    sprite: SBSprite;
	state: AthleteState = AthleteState.ReadyToRun;

	powerup: string;
	damageMultiplier: number;
	knockback: number;

	private startX: number;
	private enemiesTackled: Enemy[];

	constructor(type: AthleteType, lane: number) {
		super();

		this.lane = lane;
		this.type = type;
		this.damageMultiplier = 1;
		this.enemiesTackled = [];

		// If a powerup is already selected then make sure we have it set
		if (smorball.screens.game.selectedPowerup!=null)
			this.powerup = smorball.screens.game.selectedPowerup.type;

		// Start us off in the correct position
		var startPos = smorball.config.friendlySpawnPositions[this.lane];
		this.x = startPos.x;
		this.y = startPos.y;

        // Setup the spritesheet
        this.sprite = new SBSprite(this.getSpritesheet(), "idle");
		this.sprite.regX = this.type.offsetX;
		this.sprite.regY = this.type.offsetY;
		this.sprite.framerate = 20;
		this.sprite.scaleX = this.sprite.scaleY = this.type.scale;
		this.addChild(this.sprite);

		// Draw a debug circle
		//if (smorball.config.debug) {
		//	var circle = new createjs.Shape();
		//	circle.graphics.beginFill("red");
		//	circle.graphics.drawCircle(0, 0, 10);
		//	this.addChild(circle);
		//}

		this.animateIn();
	}

	private animateIn() {
		this.startX = this.x;
		this.x -= (200 + Math.random() * 10);
		this.state = AthleteState.Entering;
		this.sprite.gotoAndPlay("run");
	}

    private getSpritesheet(): SBSpriteSheet {
		var level = smorball.game.levelIndex;

		// The variation depends upon the selected powerup
		var variation = "normal";
		if (this.powerup == "cleats") variation = "cleats";
		else if (this.powerup == "helmet") variation = "helmet";

		// Work out the resource name for the data and the image
		var jsonName = this.type.id + "_" + variation+"_json";
		var pngName = this.type.id + "_" + variation + "_png";

		// Grab them
		var data = smorball.resources.getResource(jsonName);
		var sprite = smorball.resources.getResource(pngName);

		// BIG HACK for helmeted hockey lady to make the animation look right
		if (this.type.id == "hockey" && this.powerup == "helmet") {

			// Clone the data
			data = JSON.parse(JSON.stringify(data));
			var frames: any[] = data.frames;
			var newframes: any[] = frames.slice();

			// Rejig the frames
			newframes[41] = frames[39];
			newframes[42] = frames[38];
			newframes[43] = frames[39];
			newframes[44] = frames[36];
			newframes[45] = frames[35];
			newframes[46] = frames[34];
			newframes[47] = frames[33];
	
			// Set the new frames
			data.frames = newframes;
		}

		// Update the data with the image and return
		data.images = [sprite];
        var cjsSS = new createjs.SpriteSheet(data);

        return smorball.sprites.getSpriteSheet(this.type.id + "_" + variation, cjsSS);
	}

	update(delta: number) {

		if (this.state == AthleteState.Entering) {
			this.x = this.x + this.type.speed * delta;
			if (this.x >= this.startX)
				this.setReadyToRun();
		}
		else if (this.state == AthleteState.Running) {

			// Move the enemy along
			var speed = this.type.speed;
			if (this.powerup == "cleats") speed *= smorball.powerups.types.cleats.speedMultiplier;

            // We need to iterate this a few times as at low FPS the athletes can potentially run through the enemies and powerups etc
            for (var i = 0; i < smorball.config.physicsIterations; i++) {
                this.x += (speed * delta) / smorball.config.physicsIterations;

                // Check for collisions, if we collide then stop checking
                if (this.checkCollisions())
                    break;
            }

			// If we get to the end of the world then die
			if (this.x > smorball.config.width) 
				this.destroy();			
		}
				
	}

    private checkCollisions(): boolean {
		var myBounds = this.getTransformedBounds();

        // Look for enemies in the correct state
        var enemies = _.filter(smorball.game.enemies, e => e.state == EnemyState.Alive && e.lane == this.lane && this.enemiesTackled.indexOf(e) == -1);

        // Return true if there was one
        for (var i = 0; i < enemies.length; i++)
        {
            var e = enemies[i];
            var theirBounds = e.getTransformedBounds();
            if (myBounds.intersects(theirBounds)) {
                e.tackled(this);
                this.tackle(e);
                return true;
            }
        }

		// Check collisions with powerups
        var powerups = _.filter(smorball.powerups.views, p => p.lane == this.lane && p.state == PowerupState.NotCollected)

        // Check for collisions with powerups, dont break if we hit one as it shouldnt stop play
        for (var i = 0; i < powerups.length; i++)
        {
            var p = powerups[i];
            var theirBounds = p.getTransformedBounds();
            if (myBounds.intersects(theirBounds)) {
                p.collect();
            }
        }

        // Dont stop play
        return false;
	}

	private tackle(enemy: Enemy) {

		// Rember that we have tackeld this enemy
		this.enemiesTackled.push(enemy);

		// Play the tackle anim adn stop running
		this.state = AthleteState.Tackling;
		this.sprite.gotoAndPlay("tackle");

		// Play a sound
		smorball.audio.playSound(this.type.sound.tackle);
			
		// When the animation is done
		this.sprite.on("animationend",(e: any) => {

			// If we have the hemlet then we can get back up and continue to run
			if (this.powerup == "helmet") {
				this.state = AthleteState.Running;
				this.sprite.gotoAndPlay("run");
			}
			// Else we die
			else this.onDeathAnimationComplete();

		}, this, false);
	}

	private onDeathAnimationComplete() {
		this.sprite.stop();
		createjs.Tween.get(this).to({ alpha: 0 }, 500).call(() => this.destroy());
	}

	private setReadyToRun() {
		this.x = this.startX;
		this.state = AthleteState.ReadyToRun;
        this.sprite.gotoAndPlay("idle");

        var captcha = smorball.captchas.getCaptcha(this.lane);
        if (captcha.chunk == null)	smorball.captchas.refreshCaptcha(this.lane);
	}

	destroy() {
		smorball.game.athletes.splice(smorball.game.athletes.indexOf(this), 1);
		smorball.screens.game.actors.removeChild(this);
	}

	run() {
		this.state = AthleteState.Running;
		this.sprite.gotoAndPlay("run");
	}

	selectedPowerupChanged(powerup:string) {

		// If we arent in one of the states that cares then dont dont anything
		if (this.state != AthleteState.Entering && this.state != AthleteState.ReadyToRun) return;

        this.powerup = powerup;
        this.sprite.spriteSheet = this.getSpritesheet();
	}

}