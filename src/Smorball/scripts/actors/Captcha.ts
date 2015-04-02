class Captcha extends createjs.Container {

	lane: number;
	chunk: OCRChunk;
	sprite: createjs.Sprite;

	constructor(lane: number) {

		super();

		this.lane = lane;
		
		// Create and add the spritesheet
		this.sprite = new createjs.Sprite(null);
		this.addChild(this.sprite);
		this.visible = false;

		// Position us in the right place
		var pos = smorball.config.captchaPositions[lane];
		this.x = pos.x;
		this.y = pos.y;

		// Draw a debug circle
		if (smorball.config.debug) {
			//var circle = new createjs.Shape();
			//circle.graphics.beginFill("red");
			//circle.graphics.drawCircle(0, 0, 10);
			//this.addChild(circle);

			// For debug purposes, let this be clickable
			this.mouseEnabled = true;
			this.cursor = "pointer";
			this.on("click",() => smorball.captchas.onCaptchaEnteredSuccessfully(this));
		}
	}

	setChunk(chunk: OCRChunk) {

		// Update the sprite
		this.chunk = chunk;
		this.sprite.spriteSheet = chunk.page.spritesheet;
		this.sprite.gotoAndStop(chunk.frame);
		this.sprite.regX = this.sprite.getBounds().width / 2;
		this.sprite.regY = this.sprite.getBounds().height / 2;
		this.sprite.x = this.sprite.getBounds().width / 2;
		this.visible = true;	
					
		// Animate in
		createjs.Tween.removeTweens(this.sprite);
		this.sprite.scaleX = this.sprite.scaleY = 0;
		createjs.Tween.get(this.sprite).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
	}

	clear() {
		this.chunk = null;
		// Animate Out
		createjs.Tween.removeTweens(this.sprite);
		this.scaleX = this.scaleY = 1;
		createjs.Tween.get(this.sprite).to({ scaleX: 0, scaleY: 0 }, 250, createjs.Ease.backOut)
			.call(tween => this.visible = false);
	}

}