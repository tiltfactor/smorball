

class CaptchasManager {

	captchas: Captcha[];
	captchasSucceeded: number;
	entries: CaptchaEntry[];

	private inputTextArr: any[];
	private isLocked: boolean;
	private lockedTimer: number;

	constructor() {
	}

	init() {
		

		// Catch text entry
		$("#gameScreen .entry .pass-btn").click(() => this.pass());
		$("#gameScreen .entry .submit-btn").click(() => this.testTextEntry());
		$("#gameScreen .entry input").on("keydown",(event) => {
			if (event.which == 13)
				this.testTextEntry();
		});
	}

	startNewLevel(level: Level) {
		this.captchasSucceeded = 0;
		this.updatePassButton();

		// Reset the local entries cache
		var data = smorball.resources.getResource("captcha_data");
		this.entries = data.entries.slice().reverse();

		// If this isnt the first level then shuffle up the entries a little
		if (level.index != 0)
			this.entries = <CaptchaEntry[]>_.shuffle(this.entries);

		// Make the new ones
		this.constructCaptchas(level);		
	}

	constructCaptchas(level: Level) {
		this.captchas = [];

		// Making a captcha for each lane needed
		_.each(level.lanes, lane => {

			var captcha = new Captcha(lane);
			this.captchas.push(captcha);
			smorball.screens.game.captchas.addChild(captcha);
		});
	}

	showCaptchas() {
		_.each(this.captchas, c => c.visible = true);
	}

	hideCaptchas() {
		_.each(this.captchas, c => c.visible = false);
	}

	refreshCaptcha(lane: number) {
		var captcha = _.find(this.captchas, c => c.lane == lane);
		captcha.setEntry(this.entries.pop());
	}

	update(delta: number) {
		if (this.isLocked) {
			this.lockedTimer += delta;
			if (this.lockedTimer >= smorball.config.penaltyTime)
				this.unlock();
		}
	}

	private pass() {

		// Decrement the number of passes remaining
		smorball.game.passesRemaining--;

		// Set new entries for the visible captcahs
		_.chain(this.captchas)
			.filter(c => c.entry != null)
			.each(c => c.setEntry(this.entries.pop()));

		this.updatePassButton();
	}

	updatePassButton() {
		if (smorball.game.passesRemaining == 0) {
			$("#gameScreen .entry .pass-btn")
				.prop("disabled", true)
				.text("PASS");
		}
		else {
			$("#gameScreen .entry .pass-btn")
				.text("PASS (" + smorball.game.passesRemaining + ")");
		}
	}

	private testTextEntry() {

		// Grab the text and reset it ready for the next one
		var text = <string>$("#gameScreen .entry input").val();		
		$("#gameScreen .entry input").val("");

		// Check for cheats first
		if (this.checkForCheats(text))
			return;

		// Get the visible captchas on screen 
		var visibleCapatchas = _.filter(this.captchas, c => c.entry != null);	

		// If there are no visible then lets just jump out until they are
		if (visibleCapatchas.length == 0) return;

		// Log
		console.log("Comparing text", text, _.map(this.captchas, c => c.entry));		

		// Convert them into a form that the closestWord algo needs
		var differences = _.map(visibleCapatchas, c => {
			return {
				captcha: c,
				texts: [c.entry.ocr1, c.entry.ocr2]
			}
		});

		// Slam it through the library
		var output = new closestWord(text, differences);
		console.log("Comparing inputted text against captchas", text, output);

		if (output.match) {

			// Hide the current captcha
			output.closestOcr.captcha.clear();

			// Start the athlete running
			var lane = output.closestOcr.captcha.lane;
			_.find(smorball.game.athletes, a => a.lane == lane && a.state == AthleteState.ReadyToRun)
				.run();

			// Spawn another in the same lane
			smorball.spawning.spawnAthlete(lane);
		}
		else {
			this.lock();

			// So long as we arent running the first level then lets refresh all the captchas
			if (smorball.game.levelIndex != 0) {
				_.each(visibleCapatchas, c => c.setEntry(this.entries.pop()));
			}
		}
			


		//this.captchaProcessor.compare();

		//EventBus.dispatch("playSound", "textEntry1");
		//var output = this.captchaProcessor.compare();
		//if (output.cheated) {
		//	EventBus.dispatch("showCommentary", output.message);
		//	this.showResultScreen(2);

		//} else {
		//	this.showMessage(output.message);
		//	this.removeActivePowerup();
		//	if (output.pass) {
		//		if (this.activePowerup != null) {
		//			EventBus.dispatch("playSound", "correctPowerup");
		//			smorball.myBag.selectedId = -1;
		//		}
		//		else {
		//			EventBus.dispatch("playSound", "correctSound");
		//		}
		//		if (this.activePowerup != null && this.activePowerup.getId() == "bullhorn") {
		//			this.startPlayersFromAllLanes();
		//		} else {
		//			var lane = this.getLaneById(output.laneId);
		//			this.activatePlayer(lane.player);
		//			if (output.extraDamage && lane.player != undefined && lane.player.getLife() == 1) {
		//				lane.player.setLife(smorball.gameState.gs.extraDamage);
		//			}
		//			lane.player = undefined;
		//		}
		//	} else {
		//		EventBus.dispatch("playSound", "incorrectSound");
		//		this.updatePlayerOnDefault();
		//		this.playConfusedAnimation();
		//		this.activePowerup = undefined;


		//	}
		//}
	}

	private checkForCheats(text: string) {
		if (text.toLowerCase() == "win level") {
			smorball.game.enemiesKilled = smorball.spawning.enemySpawnsThisLevel;
			smorball.game.enemyTouchdowns = Math.round(Math.random() * (smorball.config.enemyTouchdowns - 1));
			smorball.game.gameOver(true);
			return true;
		}
		else if (text.toLowerCase() == "loose level") {
			smorball.game.enemiesKilled = Math.round(Math.random() * smorball.spawning.enemySpawnsThisLevel);
			smorball.game.enemyTouchdowns = smorball.config.enemyTouchdowns;
			smorball.game.gameOver(false);
			return true;
		}
		else if (text.toLowerCase() == "win all levels") {
			smorball.game.enemiesKilled = Math.round(Math.random() * smorball.spawning.enemySpawnsThisLevel);
			smorball.game.enemyTouchdowns = smorball.config.enemyTouchdowns;

			for (var i = 0; i < smorball.game.levels.length; i++)
				smorball.user.levelWon(i);

			smorball.game.gameOver(true);

			return true;
		}

		return false;
	}

	private lock() {

		// Disable all the inputs
		$("#gameScreen .entry .submit-btn").prop("disabled", true);
		$("#gameScreen .entry input").prop("disabled", true);
		$("#gameScreen .entry .pass-btn").prop("disabled", true);
		
		// Shake them
		Utils.shake($("#gameScreen .entry input"));
		
		// Make the athletes play their confused animations
		_.each(smorball.game.athletes, a => {
			if (a.state == AthleteState.ReadyToRun)
				a.sprite.gotoAndPlay("confused");
		});

		// After some time enable them again
		this.lockedTimer = 0;
		this.isLocked = true;
	}

	private unlock() {

		$("#gameScreen .entry .submit-btn").prop("disabled", false);
		$("#gameScreen .entry input").prop("disabled", false);

		if (smorball.game.passesRemaining>0)	
			$("#gameScreen .entry .pass-btn").prop("disabled", false);

		// Focus the input again
		$("#gameScreen .entry input").focus();

		// Make the athletes return to normal
		_.each(smorball.game.athletes, a => {
			if (a.state == AthleteState.ReadyToRun)
				a.sprite.gotoAndPlay("idle");
		});

		// Not locked any more
		this.isLocked = false;
	}

	sendInputsToServer() {
		//var arr = smorball.gameState.inputTextArr;
		//$.ajax({
		//	url: 'http://tiltfactor1.dartmouth.edu:8080/api/difference',
		//	type: 'PUT',
		//	dataType: 'json',
		//	headers: { "x-access-token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJHYW1lIiwiaWF0IjoxNDE1MzQxNjMxMjY4LCJpc3MiOiJCSExTZXJ2ZXIifQ.bwRps5G6lAd8tGZKK7nExzhxFrZmAwud0C2RW26sdRM' },
		//	processData: false,
		//	contentType: 'application/json',
		//	timeout: 10000,
		//	data: JSON.stringify(arr), //this data will be in the format of a json object of user inputs and database IDs of the word they were going for (provided in the json that GET returns)
		//	crossDomain: true,
		//	error: (err) => {
		//		var errorText = JSON.parse(err.responseText);
		//		console.log(errorText);
		//		smorball.gameState.inputTextArr = [];
		//	},
		//	success: (data) => {
		//		smorball.gameState.inputTextArr = [];
		//		console.log(data);
		//	}
	}

	
}