/// <reference path="../../typings/tsd.d.ts" />

class AdBoard extends createjs.Container {

	config: any;
	boards: any[];

	constructor(config: any) {
		super();
		this.config = config;
        this.boards = []
        this.drawAdBoards();		
	}

	private drawAdBoards() {
		var x = 0, y = 0;
		for (var i = 0; i < 3; i++) {
			var ad = new createjs.Bitmap(this.config.loader.getResult("ad"));
			ad.setTransform(x, y, 1, 1);
			x = x + ad.getTransformedBounds().width;
			this.boards.push(ad);
			this.addChild(ad);
		}
	}

}


