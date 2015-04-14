class FloatingText extends createjs.Container {

	text: createjs.Text;
	outline: createjs.Text;

	constructor(txt:string, x:number, y:number) {

		super();

		this.x = x;
		this.y = y;

	

		this.text = new createjs.Text();
		this.text.font = "70px Boogaloo";
		this.text.text = txt;
		this.text.color = "white";
		this.text.shadow = new createjs.Shadow("black", 2, 2, 2);
		this.addChild(this.text);
		this.text.regX = this.text.getBounds().width / 2;
		this.text.regY = this.text.getBounds().height / 2;
					

		createjs.Tween.get(this).to({ y: y - 100 }, 2000);
		createjs.Tween.get(this).to({ alpha: 0 }, 2000, createjs.Ease.quintIn).call(() => this.destroy());

	}

	destroy() {
		smorball.screens.game.actors.removeChild(this);
	}

}