/// <reference path="../../typings/smorball/smorball.d.ts" />

class LoadingScreen extends createjs.Container {

	background: StarBackground;
	logo: createjs.Bitmap;
	bar: LoadingBar;
	
	init() {
		
		// Create the anuimated star background
		this.background = new StarBackground();
		this.addChild(this.background);

		// Add the logo
		this.logo = new createjs.Bitmap(smorball.resources.getResource("smorball_logo"));
		Utils.centre(this.logo, true, false);
		this.logo.y = 0;
		this.addChild(this.logo);

		this.bar = new LoadingBar();
		this.bar.init();
		this.addChild(this.bar);
	}	

	update(delta:number) {
		// Dont need to update if not visible
		if (!this.visible) return;

		// Update the animated background
		this.background.update(delta);

		// Update the bar based on our load progress
		this.bar.setProgress(smorball.resources.fgQueue.progress);
	}
}