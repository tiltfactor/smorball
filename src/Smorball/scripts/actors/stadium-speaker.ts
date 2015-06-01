/// <reference path="../../typings/smorball/smorball.d.ts" />


class StadiumSpeaker extends createjs.Container {

	speakerOff: createjs.Bitmap;
	speakerOn: createjs.Bitmap;

	static timeTillNextSwitch: number;
	static isAnimOn: boolean;

	constructor() {
		super();

		StadiumSpeaker.timeTillNextSwitch = 0;
		StadiumSpeaker.isAnimOn = false;

		this.speakerOff = new createjs.Bitmap(smorball.resources.getResource("speaker_off"));
		this.speakerOff.regX = 182;
		this.speakerOff.regY = 123;
		this.addChild(this.speakerOff);

		this.speakerOn = new createjs.Bitmap(smorball.resources.getResource("speaker_on"));
		this.speakerOn.regX = 182;
		this.speakerOn.regY = 123;
		this.addChild(this.speakerOn);
	}

	update(delta: number) {

		if (smorball.screens.game.bubble.isOpen) {

			StadiumSpeaker.timeTillNextSwitch -= delta / 2;
			if (StadiumSpeaker.timeTillNextSwitch <= 0) {
				StadiumSpeaker.isAnimOn = !StadiumSpeaker.isAnimOn;
				StadiumSpeaker.timeTillNextSwitch = 0.2 + Math.random() * 0.2;
			}

			this.speakerOn.visible = StadiumSpeaker.isAnimOn;
		}
		else this.speakerOn.visible = false;
		
		// Is always opposite of the on state
		this.speakerOff.visible = !this.speakerOn.visible;
	}


}