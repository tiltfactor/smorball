/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/smorball/smorball.d.ts" />

class Captcha extends createjs.Bitmap {

	lane: number;
	entry: CaptchaEntry;

	constructor(lane:number) {
		super(null);
		this.lane = lane;
	}

	setEntry(entry: CaptchaEntry) {
		this.entry = entry;
		this.image = smorball.loader.getResult("captcha_" + entry.image.substr(0, 3));

		// Animate in
		createjs.Tween.removeTweens(this);
		this.scaleX = this.scaleY = 0;
		createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
	}

	clear() {
		// Animate Out
		createjs.Tween.removeTweens(this);
		this.scaleX = this.scaleY = 1;
		createjs.Tween.get(this).to({ scaleX: 0, scaleY: 0 }, 250, createjs.Ease.backOut)
			.call(tween => this.image = null);
	}

}