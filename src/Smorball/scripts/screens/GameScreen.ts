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
	survivalEl: HTMLElement;

	actors: createjs.Container;
	captchas: createjs.Container;

	musicSlider: RangeSlider;
	soundSlider: RangeSlider;
	
	indicator: CorrectIncorrectIndicator;

	powerupIcons: PowerupHudIcon[];

	selectedPowerup: PowerupHudIcon;

	framerate: Framerate;

	private score: number;

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

		this.bubble = new CommentatorBubble();
		this.bubble.x = 800;
		this.bubble.y = 314;
		this.addChild(this.bubble);
	
		this.actors = new createjs.Container();
		this.addChild(this.actors);

		this.captchas = new createjs.Container();
		this.addChild(this.captchas);

		this.indicator = new CorrectIncorrectIndicator();
		this.indicator.x = 800;
		this.indicator.y = 960;
		this.addChild(this.indicator);

		this.powerupIcons = [];

		var powerup = new PowerupHudIcon("helmet");
		powerup.x = 1220;
		powerup.y = 80;
		this.addChild(powerup);
		this.powerupIcons.push(powerup);

		var powerup = new PowerupHudIcon("cleats");
		powerup.x = 1360;
		powerup.y = 80;
		this.addChild(powerup);
		this.powerupIcons.push(powerup);

		var powerup = new PowerupHudIcon("bullhorn");
		powerup.x = 1500;
		powerup.y = 80;
		this.addChild(powerup);
		this.powerupIcons.push(powerup);

		this.timeoutEl = $('#gameScreen .timeout').get(0);
		this.victoryEl = $('#gameScreen .victory').get(0);
		this.defeatEl = $('#gameScreen .defeat').get(0);
		this.survivalEl = $('#gameScreen .survival').get(0);

		// Setup the music slider and listen for changes to it
		this.musicSlider = new RangeSlider("#gameScreen .timeout .music-slider", smorball.audio.musicVolume, value => smorball.audio.setMusicVolume(value));
		this.soundSlider = new RangeSlider("#gameScreen .timeout .sound-slider", smorball.audio.soundVolume, value => smorball.audio.setSoundVolume(value));
		
		$("#gameScreen .menu").click(() => smorball.game.timeout());

		$('#gameScreen .timeout button.close').click(() => smorball.game.resume());
		$('#gameScreen .timeout button.quit').click(() => smorball.game.returnToMap());
		$('#gameScreen .timeout button.help').click(() => smorball.game.help());

		$('#gameScreen button.continue').click(() => smorball.game.returnToMap());		
		

		$("#gameScreen .entry input").on("keydown",(event) => this.onKeyDown(event));			

		// When any keyboard event happens focus the input
		window.onkeydown = (event) => {
			if (smorball.game.state == GameState.Playing) {
				$("#gameScreen .entry input").focus();

				// If the key is escape then lets timeout
				if (event.keyCode == 27)
					smorball.game.timeout();
			}
		};

		// If the window looses focus then lets pause the game if we are running
		window.onblur = (event) => {
			//if (smorball.game.state == GameState.Playing)
				//smorball.game.timeout();
		}

		this.framerate = new Framerate();
		this.framerate.x = smorball.config.width - 80;
		this.framerate.y = smorball.config.height - 60;
		this.addChild(this.framerate);
	}

	private onKeyDown(event: JQueryEventObject) {
		if (event.keyCode == 8) { smorball.audio.playSound("text_entry_backspace_sound", 0.5); }
		else if (event.keyCode == 9) { }
		else { smorball.audio.playSound("text_entry_4_sound", 0.2); }
	}

	newLevel() {
		this.timeoutEl.hidden = true;
		this.captchas.visible = true;
		this.victoryEl.hidden = true;
		this.defeatEl.hidden = true;
		this.survivalEl.hidden = true;
		this.selectPowerup(null);
		this.indicator.visible = false;
		this.bubble.visible = false;
		this.bubble.isOpen = false;
		this.actors.removeAllChildren();
		this.captchas.removeAllChildren();
		this.stadium.idleAudience();
		this.stadium.setTeam(smorball.game.level.team);
		this.score = 6000;
	}

	showTimeout() {
		console.log("timeout changed!");
		smorball.screens.game.timeoutEl.hidden = false;
		this.musicSlider.value = smorball.audio.musicVolume;
		this.soundSlider.value = smorball.audio.soundVolume;
	}
	
	showVictory(cashEarnt:number) {
		this.victoryEl.hidden = false;
		$('#gameScreen .victory .cashbar-small')
			.text(cashEarnt + "")
			.focus();
	}

	showTimeTrialEnd() {
		this.survivalEl.hidden = false;
		$('#gameScreen .survival .best-time').text(Utils.formatTime(smorball.user.bestSurvivalTime)).focus();
		$('#gameScreen .survival .time-survived').text(Utils.formatTime(smorball.game.timeOnLevel)).focus();
	}

	showDefeat(cashEarnt: number) {
		this.defeatEl.hidden = false;
		$('#gameScreen .defeat .cashbar-small')
			.text(cashEarnt + "")
			.focus();
	}

	flashRed(el: HTMLElement, time: number) {
		$(el).css("color", "red");
		// Jquery .delay() doesnt seem to work so I have to do this
		createjs.Tween.get(this).to({}, time).call(() => $(el).removeAttr("style"));
	}

    update(delta: number) {

      	if (smorball.game.level.timeTrial) {
			this.opponentsEl.textContent = smorball.game.enemiesKilled + "";
			this.scoreEl.textContent = Utils.formatTime(smorball.game.timeOnLevel);
		}
		else {

			var s = smorball.game.levelScore;
			if (this.score > s) this.score = Math.max(this.score-Math.round(delta * 1000), s);

			this.opponentsEl.textContent = smorball.game.getOpponentsRemaining() + "";
			this.scoreEl.textContent = this.score + "";
		}

		// Sort by depth
		this.actors.sortChildren((a, b) => a.y - b.y);

		_.each(this.powerupIcons, i => i.update(delta));

		this.framerate.update(delta);
		this.stadium.update(delta);
	}

	selectNextPowerup() {
		// If none is currently selected, find the first visible one and select that
		if (this.selectedPowerup == null) {
			var visible = _.find(this.powerupIcons, i => i.visible);
			if (visible != null) this.selectPowerup(visible);
		}
		
		// Else iterate onto the next visible one
		else {
			var indx = this.powerupIcons.indexOf(this.selectedPowerup);
			var next: PowerupHudIcon = null;
			for (var i = indx + 1; i < this.powerupIcons.length; i++) {
				if (this.powerupIcons[i].visible) {
					next = this.powerupIcons[i];
					break;
				}
			}
			this.selectPowerup(next);
		}
	}

	selectPowerup(powerup: PowerupHudIcon) {

		this.selectedPowerup = powerup;

		// Play a sound
		if (powerup != null) smorball.audio.playSound("powerup_selection_changed_sound", 1);

		// If no powerup was passed then we should deselect all powerups
		if (powerup == null) {
			_.each(this.powerupIcons, i => i.deselect());
		}
		else {
			// If that powerup is already selected then simply deselect it
			if (powerup.isSelected) powerup.deselect();

			// Else deselect all the rest then select the one we are interested in
			else {
				_.each(this.powerupIcons, i => i.deselect());
				powerup.select();
			}
		}

		_.each(smorball.game.athletes, a => a.selectedPowerupChanged(powerup == null ? null : powerup.type));
	}

}