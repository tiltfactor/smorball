/// <reference path="../../typings/smorball/smorball.d.ts" />

class OptionsMenu extends ScreenBase {

	background: StarBackground;

	constructor() {
		super("optionsMenu", "options_menu_html");
	}

	init() {
		super.init();

		// Create the animated star background
		this.background = new StarBackground();
		this.addChild(this.background);

		// Listen for a few things
		$("#optionsMenu button.back").click(() => this.onBackClicked())

		// Setup the music slider and listen for changes to it
		$('#musicSlider').slider({ value: smorball.audio.musicVolume * 100 })
			.on("slide",(e: any) => smorball.audio.setMusicVolume(e.value/100));

		// Setup the sound slider and listen for changes
		$('#soundSlider').slider({ value: smorball.audio.soundVolume * 100 })
			.on("slide",(e: any) => smorball.audio.setSoundVolume(e.value / 100));

		// Listen for clicks on the difficulty dropdown
		$("#difficultyDropdown a").click((e: any) => this.onDifficultyOptionClicked(e.currentTarget));

		// Set the persisted difficulty
		$("#difficultyDropdown button").text(Difficulty[smorball.difficulty.difficulty].toUpperCase());
	}

	onDifficultyOptionClicked(element: HTMLElement) {
		var difficulty = parseInt(element.dataset["difficulty"]);
		smorball.difficulty.setDifficulty(difficulty);
		$("#difficultyDropdown button").text(Difficulty[difficulty].toUpperCase());
	}

	update(delta: number) {
		this.background.update(delta);
	}

	onBackClicked() {
		smorball.screens.open(smorball.screens.main);	
	}

}