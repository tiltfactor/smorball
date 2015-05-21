class Framerate extends createjs.Container {

	text: createjs.Text;

	constructor() {
		super();
		this.text = new createjs.Text("99", "50px Boogaloo", "#333333");
		this.addChild(this.text);
	}

	update(delta: number) {
		this.text.text = "" + Math.round(createjs.Ticker.getMeasuredFPS());
	}
}