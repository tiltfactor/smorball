/// <reference path="../../typings/smorball/smorball.d.ts" />


class GameScreen extends ScreenBase
{
	stadium: Stadium;
	bubble: CommentatorBubble;

	opponentsEl: HTMLElement;
	scoreEl: HTMLElement;
	timeoutEl: HTMLElement;
	victoryEl: HTMLElement;
	defeatEl: HTMLElement;

	actors: createjs.Container;
	captchas: createjs.Container;


	constructor() {
		super("gameScreen", "game_screen_html");
	}

	init() {
		super.init();	

		this.stadium = new Stadium();
		this.stadium.init();
		this.addChild(this.stadium);

		this.opponentsEl = $("#gameScreen .opponents").get(0);
		this.scoreEl = $("#gameScreen .score").get(0);

		this.captchas = new createjs.Container();
		this.addChild(this.captchas);

		this.actors = new createjs.Container();
		this.addChild(this.actors);

		this.bubble = new CommentatorBubble();
		this.bubble.x = 800;
		this.bubble.y = 314;
		this.addChild(this.bubble);

		this.timeoutEl = $('#gameScreen .timeout').get(0);
		this.victoryEl = $('#gameScreen .victory').get(0);
		this.defeatEl = $('#gameScreen .defeat').get(0);

		// Setup the music slider and listen for changes to it
		$('#gameScreen .timeout .music-slider').slider({ value: smorball.audio.musicVolume * 100 })
			.on("slide",(e: any) => smorball.audio.setMusicVolume(e.value / 100));

		// Setup the sound slider and listen for changes
		$('#gameScreen .timeout .sound-slider').slider({ value: smorball.audio.soundVolume * 100 })
			.on("slide",(e: any) => smorball.audio.setSoundVolume(e.value / 100));

		$("#gameScreen .menu").click(() => smorball.game.timeout());

		$('#gameScreen .timeout button.close').click(() => smorball.game.resume());
		$('#gameScreen .timeout button.quit').click(() => smorball.game.returnToMap());
		$('#gameScreen .timeout button.help').click(() => smorball.game.help());

		$('#gameScreen button.continue').click(() => smorball.game.returnToMap());
		
	}

	newGame() {
		this.timeoutEl.hidden = true;
		this.captchas.visible = true;
		this.victoryEl.hidden = true;
		this.defeatEl.hidden = true;

		this.bubble.visible = false;
		this.actors.removeAllChildren();
		this.captchas.removeAllChildren();

		this.stadium.setTeam(smorball.game.level.team);
	}
	
	showVictory(cashEarnt:number) {
		this.victoryEl.hidden = false;
		$('#gameScreen .victory .cashbar-small')
			.text(cashEarnt + "")
			.focus();
	}

	showDefeat(cashEarnt: number) {
		this.defeatEl.hidden = false;
		$('#gameScreen .defeat .cashbar-small')
			.text(cashEarnt + "")
			.focus();
	}

	update(delta: number) {
		this.opponentsEl.textContent = (smorball.spawning.enemySpawnsThisLevel - smorball.game.enemiesKilled) + "";
		this.scoreEl.textContent = smorball.game.getScore() + "";

		// Sort by depth
		this.actors.sortChildren((a, b) => a.y - b.y);
	}

}