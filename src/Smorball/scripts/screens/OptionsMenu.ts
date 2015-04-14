/// <reference path="../../typings/smorball/smorball.d.ts" />

class OptionsMenu extends ScreenBase {

	background: StarBackground;
	musicSlider: RangeSlider;
	soundSlider: RangeSlider;

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
		this.musicSlider = new RangeSlider("#musicSlider", smorball.audio.musicVolume, value => smorball.audio.setMusicVolume(value));
		this.soundSlider = new RangeSlider("#soundSlider", smorball.audio.soundVolume, value => smorball.audio.setSoundVolume(value));

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
		this.musicSlider.value = smorball.audio.musicVolume;
		this.soundSlider.value = smorball.audio.soundVolume;
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