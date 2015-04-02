/// <reference path="../../typings/smorball/smorball.d.ts" />


class LoadingLevelScreen extends ScreenBase
{
	background: StarBackground;
	bar: LoadingBar;
	playButtonEl: HTMLButtonElement;

	constructor() {
		super("loadingLevelScreen", "loading_level_screen_html");
	}

	init() {
		super.init();	

		// Grab these
		this.playButtonEl = <HTMLButtonElement>$("#loadingLevelScreen .play-btn").get(0);

		// Create the anuimated star background
		this.background = new StarBackground();
		this.addChild(this.background);

		// Create a loading bar
		this.bar = new LoadingBar();
		this.bar.init();
		this.addChild(this.bar);

		// Add some listeners
		$("#loadingLevelScreen .play-btn").click(() => this.onPlayClicked());
		$("#loadingLevelScreen .back").click(() => smorball.screens.open(smorball.screens.map));
	}

	show() {
		super.show();
		$("#loadingLevelScreen h1").text(smorball.game.level.name);

		// Set the correct logo
		var img = <HTMLImageElement>$("#loadingLevelScreen .team-logo").get(0);
		var i = <HTMLImageElement>smorball.resources.getResource(smorball.game.level.team.id + "_logo");
		img.src = i.src;
	}

	update(delta: number) {

		// Update the stars
		this.background.update(delta);

		// Update the bar based on our load progress
		this.bar.setProgress(smorball.resources.queue.progress);

		// If we are done loading then show the play button
		if (smorball.resources.queue.progress == 1) {
			this.bar.visible = false;
			this.playButtonEl.hidden = false;
		}
		else {
			this.bar.visible = true;
			this.playButtonEl.hidden = true;
		}
	}

	private onPlayClicked() {
		smorball.game.play();
	}

}