

class CaptchasManager {

	captchas: Captcha[];
	captchasSucceeded: number;

	localChunks: OCRChunk[];
	remoteChunks: OCRChunk[];

	confusedTimeMuliplier: number;

	private inputTextArr: any[];
	private isLocked: boolean;
	private lockedTimer: number;
	private attemptsNotSent: closestWord[];

	constructor() {
		this.localChunks = [];
		this.remoteChunks = [];
	}

	init() {
		// Catch text entry
		$("#gameScreen .entry .pass-btn").click(() => this.pass());
		$("#gameScreen .entry .submit-btn").click(() => this.testTextEntry());
		$("#gameScreen .entry input").on("keydown",(event) => {
			if (event.which == 13)
				this.testTextEntry();
		});

		this.attemptsNotSent = [];
		window.onbeforeunload = () => this.sendInputsToServer();
	}
	
	startNewLevel(level: Level) {
		this.captchasSucceeded = 0;
		this.updatePassButton();
		this.confusedTimeMuliplier = 1;
		this.attemptsNotSent = [];

		// First refresh our local chunks list
		this.localChunks = this.getLocalChunks();

		// If this isnt the first level then shuffle up the entries a little
		//if (level.index != 0)
			//this.entries = <CaptchaEntry[]>_.shuffle(this.entries);

		// Make the new ones
		this.constructCaptchas(level);		
	}

	private getLocalChunks(): OCRChunk[]{

		// Grab the local page and make a copy
		var inData = <OCRPage>smorball.resources.getResource("local_ocr_page_data");
		
		// Construct the spritesheet if we havent already
		if (inData.spritesheet == null) {
			var ssData = smorball.resources.getResource("captchas_json");
			ssData.images = [smorball.resources.getResource("captchas_jpg")];
			inData.spritesheet = new createjs.SpriteSheet(ssData);

			// Set the parent in each chunk (for easy reference later);
			_.each(inData.differences, d => d.page = inData);
		}		

		return inData.differences.slice().reverse();
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

		// Get the visible captchas on screen 
		var visibleCapatchas = _.filter(this.captchas, c => c.chunk != null && c.lane != lane);

		// Limit the captcha to a certain length
		for (var i = 0; i < 100; i++) {		
			
			// Grab the next chunk from the stack
			var nextChunk = this.getNextChunk();

			// Must ensure that the next chunk does not equal one that is already on screen
			var match = _.find(visibleCapatchas, c => this.doChunksMatch(c.chunk, nextChunk));
			if (match!=null) continue;
				
			// Ensure that the chunk isnt too wide
			captcha.setChunk(nextChunk);
			var width = captcha.getWidth();
			console.log("Captcha width", width, "Max width", smorball.config.maxCaptchaSize);
			if (width < smorball.config.maxCaptchaSize)
				break;
		}
	}

	doChunksMatch(a: OCRChunk, b: OCRChunk) {

		for (var i = 0; i < a.texts.length; i++) 
			for (var j = 0; j < b.texts.length; j++) 
				if (a.texts[i] == b.texts[j])
					return true;

		return false;
	}

	getNextChunk(): OCRChunk {

		// If its a tutorial level then we need to use a speacially prepared list
		if (smorball.game.levelIndex == 0)
			return this.localChunks.pop();
		else {

			// If there arent any chunks remaining then just chunk our local store in there 
			if (this.remoteChunks.length == 0) 
				return Utils.randomOne(this.localChunks);

			// Else lets return back one
			return Utils.randomOne(this.remoteChunks);			
		}
	}

	update(delta: number) {
		if (this.isLocked) {
			this.lockedTimer += delta;
			if (this.lockedTimer >= smorball.config.penaltyTime * this.confusedTimeMuliplier)
				this.unlock();
		}
	}

	private pass() {

		// Decrement the number of passes remaining
		smorball.game.passesRemaining--;

		// Set new entries for the visible captcahs
		_.chain(this.captchas)
			.filter(c => c.chunk != null)
			.each(c => c.setChunk(this.getNextChunk()));

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

		// Cant test if the game is not running
		if (smorball.game.state != GameState.Playing) return;

		// Grab the text and reset it ready for the next one
		var text = <string>$("#gameScreen .entry input").val();		
		$("#gameScreen .entry input").val("");

		// Check for cheats first
		if (this.checkForCheats(text))
			return;

		// Get the visible captchas on screen 
		var visibleCapatchas = _.filter(this.captchas, c => c.chunk != null);	

		// If there are no visible then lets just jump out until they are
		if (visibleCapatchas.length == 0) return;

		// Log
		console.log("Comparing text", text, _.map(this.captchas, c => c.chunk));		

		// Convert them into a form that the closestWord algo needs
		var differences = _.map(visibleCapatchas, c => c.chunk);

		// Slam it through the library
		var output = new closestWord(text, differences);
		output.text = text;
		console.log("Comparing inputted text against captchas", text, output);

		// Increment and send if neccessary
		if (!output.closestOcr.page.isLocal) {
			this.attemptsNotSent.push(output);
			if (this.attemptsNotSent.length > smorball.config.entriesBeforeServerSubmission)
				this.sendInputsToServer();
		}	

		// Handle success
		if (output.match) {

			// Which was the selected one?
			var captcha = _.find(visibleCapatchas, c => c.chunk == output.closestOcr);
			this.onCaptchaEnteredSuccessfully(text, captcha);					
		}

		// Or error
		else 
			this.onCaptchaEnterError();
	}

	onCaptchaEnteredSuccessfully(text: string, captcha: Captcha) {		

		// Hide the current captcha
		captcha.clear();

		// Show the indicator
		smorball.screens.game.indicator.showCorrect();		

		// This is needed as the Breakfast Club powerup is dependant on the length of the captcha
		var damageMultiplier = 1;
		if (text.length > 8 && smorball.upgrades.isOwned("breakfast"))
			damageMultiplier = smorball.upgrades.getUpgrade("breakfast").multiplier;

		// If we have the bullhorn powerup selected then send all athletes running
		var powerup = smorball.screens.game.selectedPowerup;
		if (powerup != null) {

			// Play a sound
			smorball.audio.playSound("word_typed_correctly_with_powerup_sound");
				
			// If its a bullhorn then send every athlete in the 
			if (powerup.type == "bullhorn") {
				_.chain(smorball.game.athletes)
					.filter(a => a.state == AthleteState.ReadyToRun)
					.each(a => this.sendAthleteInLane(a.lane, damageMultiplier));
			}
			else
				this.sendAthleteInLane(captcha.lane, damageMultiplier)

			// Decrement the powerup
			smorball.powerups.powerups[powerup.type].quantity--;

			// Deselect the powerup
			smorball.screens.game.selectPowerup(null);
		}
		else {
			// Play a sound
			smorball.audio.playSound("word_typed_correctly_sound");

			this.sendAthleteInLane(captcha.lane, damageMultiplier);
		}	
	}

	onCaptchaEnterError() {
		this.lock();

		// Play a sound
		smorball.audio.playSound("word_typed_incorrect_sound");

		// Show the indicator
		smorball.screens.game.indicator.showIncorrect();

		var visibleCapatchas = _.filter(this.captchas, c => c.chunk != null);	

		// So long as we arent running the first level then lets refresh all the captchas
		if (smorball.game.levelIndex != 0) {
			_.each(visibleCapatchas, c => this.refreshCaptcha(c.lane));
		}
	}

	private sendAthleteInLane(lane: number, damageMultiplier: number) {
		// Start the athlete running
		var athelete = _.find(smorball.game.athletes, a => a.lane == lane && a.state == AthleteState.ReadyToRun);
		athelete.damageMultiplier = damageMultiplier;
		athelete.run();

		// Spawn another in the same lane
		smorball.spawning.spawnAthlete(lane);
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
			smorball.user.cash += 99999;

			for (var i = 0; i < smorball.game.levels.length; i++)
				smorball.user.levelWon(i);

			smorball.game.gameOver(true);

			return true;
		}
		else if (text.toLowerCase() == "increase cleats") {
			smorball.powerups.powerups.cleats.quantity++;
			return true;
		}
		else if (text.toLowerCase() == "increase helmets") {
			smorball.powerups.powerups.helmet.quantity++;
			return true;
		}
		else if (text.toLowerCase() == "increase bullhorns") {
			smorball.powerups.powerups.bullhorn.quantity++;
			return true;
		}
		else if (text.toLowerCase() == "spawn powerup") {
			smorball.powerups.spawnPowerup(Utils.randomOne(_.keys(smorball.powerups.types)), Utils.randomOne(smorball.game.level.lanes));
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

		// Dont send anything if there arent enoughv to send!
		if (this.attemptsNotSent.length == 0) return;

		console.log("sending difference inputs to sever..");

		// Convert it into the format needed by the server
		var data = {
			differences:  _.map(this.attemptsNotSent, a => { return { _id: a.closestOcr._id, text: a.text } })
		}

		// Make a copy of the attempts not sent and reset the list ready for the next send
		var attempts = this.attemptsNotSent.slice();
		this.attemptsNotSent = [];

		$.ajax({
			type: 'PUT',
			dataType: 'json',
			processData: false,
			contentType: 'application/json',
			crossDomain: true,
			url: smorball.config.DifferenceAPIUrl,
			data: JSON.stringify(data),
			timeout: 10000,
			success: data => {
				console.log("data sent to DifferenceAPI success!", data);
			},
			error: (err) => {
				console.log("difference API error:", err);

				// If we get an error, add these attempts back into the list
				this.attemptsNotSent = this.attemptsNotSent.concat(attempts);
			},
			headers: { "x-access-token": smorball.config.PageAPIAccessToken }
		});
	}

	loadPageFromServer() {
		$.ajax({
			url: smorball.config.PageAPIUrl,
			success: data => this.parsePageAPIData(data),
			headers: { "x-access-token": smorball.config.PageAPIAccessToken	},
			timeout: smorball.config.PageAPITimeout
		});
	}

	private parsePageAPIData(data: OCRPage) {

		console.log("OCRPage loaded, loading image..", data);

		// This seems to be the only way I can get the CORS image to work
		var image = new Image();
		image.src = data.url;
		image.onload = () => {

			console.log("IMAGE LOADED!", image);

			var ssData = {
				frames: [],
				images: []
			};

			_.each(data.differences, d => {
				var x = d.coords[3].x-1;
				var y = d.coords[3].y-1;
				var w = d.coords[1].x - d.coords[3].x+2;
				var h = d.coords[1].y - d.coords[3].y+2;
				d.frame = ssData.frames.length;
				d.page = data;
				ssData.frames.push([x, y, w, h]);
				this.remoteChunks.push(d);
			});
			
			ssData.images = [image];
			data.spritesheet = new createjs.SpriteSheet(ssData);
		};
		
	}
	
}