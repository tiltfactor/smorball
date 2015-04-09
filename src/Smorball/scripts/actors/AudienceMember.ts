/// <reference path="../../typings/smorball/smorball.d.ts" />


class AudienceMember extends createjs.Container {

	type: AudienceMemberType;
	member: createjs.Sprite;

	constructor(type: AudienceMemberType) {
		super();

		this.type = type;

		var ss = this.getSpritesheet();
		this.member = new createjs.Sprite(ss, "idle");
		this.member.currentAnimationFrame = Math.floor(ss.getNumFrames("idle") * Math.random());
		this.member.regX = this.type.offsetX;
		this.member.regY = this.type.offsetY;
		this.member.scaleX = this.member.scaleY = this.type.scale;

		// Offset the sprite by the seat size/2
		this.member.x = 55;
		this.member.y = 100;
		this.addChild(this.member);
	}

	private getSpritesheet(): createjs.SpriteSheet {
		var level = smorball.game.levelIndex;
		var jsonName = this.type.id + "_json";
		var pngName = this.type.id + "_png";
		var data = smorball.resources.getResource(jsonName);
		var sprite = smorball.resources.getResource(pngName);
		data.images = [sprite];
		return new createjs.SpriteSheet(data);
	}

	cheer() {
		this.member.gotoAndPlay("cheer");
		this.member.currentAnimationFrame = Math.floor(this.member.spriteSheet.getNumFrames("cheer") * Math.random());
	}

	idle() {
		this.member.gotoAndPlay("idle");
		this.member.currentAnimationFrame = Math.floor(this.member.spriteSheet.getNumFrames("idle") * Math.random());
	}
}