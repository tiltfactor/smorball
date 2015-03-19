/// <reference path="../../typings/tsd.d.ts" />

class SpriteSheet extends createjs.SpriteSheet {

	config: any;
	data: any;

	constructor(config: any) {
		this.config = config;
		this.data = JSON.parse(JSON.stringify(this.config.data));
        this.setImages();
		super(this.data);
	}

    private setImages()
	{
		for (var i = 0; i < this.data.images.length; i++) {
			this.data.images[i] = this.config.loader.getResult(this.data.images[i]);
		}
	}

}
