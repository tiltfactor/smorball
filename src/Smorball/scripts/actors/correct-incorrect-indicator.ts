/// <reference path="../../typings/smorball/smorball.d.ts" />

class CorrectIncorrectIndicator extends createjs.Container {

	correct: createjs.Bitmap;
	incorrect: createjs.Bitmap;

	constructor() {
		super();

		this.correct = new createjs.Bitmap(smorball.resources.getResource("correct_text"));
		this.correct.regX = this.correct.getBounds().width / 2;
		this.correct.regY = this.correct.getBounds().height / 2;
		this.addChild(this.correct);

		this.incorrect = new createjs.Bitmap(smorball.resources.getResource("incorrect_text"));
		this.incorrect.regX = this.incorrect.getBounds().width / 2;
		this.incorrect.regY = this.incorrect.getBounds().height / 2;
		this.addChild(this.incorrect);

		this.visible = false;
	}

	showCorrect() {
		this.visible = true;
		this.correct.visible = true;
		this.incorrect.visible = false;
		this.animateIn();
	}

	showIncorrect() {
		this.visible = true;
		this.correct.visible = false;
		this.incorrect.visible = true;
		this.animateIn();
	}

	private animateIn() {
		createjs.Tween.removeTweens(this);
		this.scaleX = this.scaleY = 0;
		this.alpha = 1;
		createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.elasticOut)
			.wait(1000)
			.to({ alpha: 0 }, 1000)
			.call(() => this.visible = false);
	}

}

