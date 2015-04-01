/// <reference path="../../typings/smorball/smorball.d.ts" />


class MainMenu extends ScreenBase
{
	newGameContinue: HTMLElement;
	confirmEraseGame: HTMLElement;

	constructor() {
		super("mainMenu", "main_menu_html");
	}

	init() {
		super.init();		

		// Grab some bits from the DOM
		this.newGameContinue = document.getElementById("newGameContinue");
		this.confirmEraseGame = document.getElementById("confirmEraseGame");

		// Add listeners to the main menu buttons
		$("#mainMenuPlayBtn").click(() => this.onPlayClicked());
		$("#mainMenuOptionsBtn").click(() => this.onOptionsClicked());
		$("#mainMenuHelpBtn").click(() => this.onHelpClicked());
		$("#newGameButton").click(() => this.confirmEraseGame.hidden = false);
		$("#confirmEraseCurrentGameButton").click(() => this.newGame());
		$("#cancelEraseCurrentGameButton").click(() => this.confirmEraseGame.hidden = true);
		$("#continueGameButton").click(() => smorball.screens.open(smorball.screens.map));
	}

	show() {
		super.show();

		// These popups start off hidden
		this.newGameContinue.hidden = this.confirmEraseGame.hidden = true;
	}

	private onPlayClicked() {

		// If there is no currently active saved game, just jump straight into it
		if (!smorball.user.hasSaveGame())
			this.newGame();

		// Otherwise we have to ask the user if they want to continue or make a new game
		else this.newGameContinue.hidden = false;		
	}

	private newGame() {
		smorball.user.newGame();
		smorball.screens.open(smorball.screens.map);
	}

	private onOptionsClicked() {
		smorball.screens.open(smorball.screens.options);		
	}

	private onHelpClicked() {
		smorball.screens.instructions.backMenu = smorball.screens.main;
		smorball.screens.open(smorball.screens.instructions)
	}

	update(delta: number) {
	}

}