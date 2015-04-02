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

		// Set the persisted difficulty
		$("#difficultyDropdown button").text(smorball.difficulty.current.name.toUpperCase());

		// Populate the difficulties
		var dropdown = $("#difficultyDropdown .dropdown-menu").empty();
		_.each(smorball.config.difficulties, d => {
			dropdown.append('<li role="presentation"><a role="menuitem" tabindex="- 1">' + d.name + '</a></li>');
		});

		// Listen for clicks on the difficulty dropdown
		$("#difficultyDropdown a").click((e: any) => this.onDifficultyOptionClicked(e.currentTarget));
	}

	show() {
		super.show();
		$('#musicSlider').slider("setValue", smorball.audio.musicVolume * 100);
		$('#soundSlider').slider("setValue", smorball.audio.soundVolume * 100);
		$("#difficultyDropdown button").text(smorball.difficulty.current.name.toUpperCase());
	}

	onDifficultyOptionClicked(element: HTMLElement) {
		var difficulty = smorball.difficulty.getDifficulty(element.textContent);
		smorball.difficulty.setDifficulty(difficulty);
		$("#difficultyDropdown button").text(difficulty.name.toUpperCase());
	}

	update(delta: number) {
		this.background.update(delta);
	}

	onBackClicked() {
		smorball.screens.open(smorball.screens.main);	
	}

}