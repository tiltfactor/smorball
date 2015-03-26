/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />


class CaptchaController {

	container: createjs.Container;
	captchas: Captcha[];
	captchasSucceeded: number;
	entries: CaptchaEntry[];	

	private inputTextArr: any[];
	private disabledTimer: number;
	private isLocked: boolean;

	constructor() {
		EventBus.addEventListener("compareCaptcha",() => this.testInput());
		this.container = new createjs.Container();
	}

	init() {
		this.entries = localCaptchaData.entries.slice().reverse();
	}
	
	startNewLevel(level: Level) {
		this.captchasSucceeded = 0;

		// First remove any old captchas
		if (this.captchas != null)
			this.container.removeAllChildren();

		// Make the new ones
		this.constructCaptchas(level);

		// Make sure these are enabled
		_.each([$("#inputText"), $("#submitButton"), $("#passButton")], e => e.prop("disabled", false));
	}

	constructCaptchas(level: Level) {
		this.captchas = [];

		// Making a captcha for each lane needed
		_.each(level.lanes, lane => {
			var captcha = new Captcha(lane);

			var pos = gameConfig.captchaPositions[lane];
			captcha.x = pos.x;
			captcha.y = pos.y;

			this.captchas.push(captcha);
			this.container.addChild(captcha);
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
			this.disabledTimer += delta;
			console.log(smorball.gameState.gs.penalty, this.disabledTimer);
			if (this.disabledTimer >= smorball.gameState.gs.penalty)
				this.unlock();			
		}
		
	}

	private testInput() {

		// Grab the input and then reset it for next time
		var input = $("#inputText").val();
		$("#inputText").val("");

		// Get the visible captchas on screen 
		var visibleCapatchas = _.filter(this.captchas, c => c.entry != null);

		// If there are no visible then lets just jump out until they are
		if (visibleCapatchas.length == 0) return;

		// Convert them into a form that the closestWord algo needs
		var differences = _.map(visibleCapatchas, c => {
			return {
				captcha: c,
				texts: [c.entry.ocr1, c.entry.ocr2]
			}
		});

		// Slam it through the library
		var output = new closestWord(input, differences);
		console.log("Comparing inputted text against captchas", input, output);

		// Sweet we have a match
		if (output.match) {
			output.closestOcr.captcha.clear();
		}
		else
			this.lock();


		

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

	private lock() {
		var elements = [$("#inputText"), $("#submitButton"), $("#passButton")];

		// Disable all the inputs
		_.each(elements, e => e.prop("disabled", true));

		// Shake them
		$("#inputText").parent().effect("shake");

		// After some time enable them again
		this.disabledTimer = 0;
		this.isLocked = true;
	}

	private unlock() {
		var elements = [$("#inputText"), $("#submitButton"), $("#passButton")];

		// Enable all the inputs
		_.each(elements, e => e.prop("disabled", false));

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
		});
	}

}
