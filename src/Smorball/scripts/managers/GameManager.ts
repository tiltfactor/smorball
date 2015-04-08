


enum GameState {
	NotPlaying,
	Loading,
	Playing,
	Timeout,
	GameOver,
}

class GameManager extends createjs.Container {

	levels: Level[];
	enemyTypes: EnemyTypes;
	athleteTypes: AthleteTypes;

	levelIndex: number;
	level: Level;
	state: GameState = GameState.NotPlaying;

	enemiesKilled: number;
	enemyTouchdowns: number;
	passesRemaining: number;
	knockbackMultiplier: number;
	timeOnLevel: number;

	enemies: Enemy[];
	athletes: Athlete[];
	ambienceSound: createjs.AbstractSoundInstance;

	init() {
		this.levels = smorball.resources.getResource("levels_data");
		this.enemyTypes = smorball.resources.getResource("enemies_data");
		this.athleteTypes = smorball.resources.getResource("athletes_data");

		// Listen for keyboard presses
		document.onkeydown = e => this.onKeyDown(e);	
	}

	private onKeyDown(e: KeyboardEvent) {
		// Only handle keypresses if we are running
		if (this.state != GameState.Playing) return;
		// Tab
		if (e.keyCode == 9) {
			smorball.screens.game.selectNextPowerup();
			e.preventDefault();
		}
	}
	
	loadLevel(levelIndex: number) {
		console.log("starting level", levelIndex);
		
		// Set these now
		this.state = GameState.Loading;
		this.levelIndex = levelIndex;
		this.level = this.getLevel(levelIndex);
		this.enemiesKilled = 0;
		this.enemyTouchdowns = 0;
		this.passesRemaining = smorball.config.passes;

		// Load the resources needed
		smorball.resources.loadLevelResources(levelIndex);

		// Take this oppertunity to grab a new page from the API
		smorball.captchas.loadPageFromServer();

		// Show the loading screen
		smorball.screens.open(smorball.screens.loadingLevel);
	}

	play() {

		// Reset these
		this.enemies = [];
		this.athletes = [];
		this.timeOnLevel = 0;
		this.knockbackMultiplier = 1;

		// Open the correct screen
		smorball.screens.open(smorball.screens.game);
		smorball.screens.game.newLevel();
		smorball.powerups.newLevel();
		smorball.upgrades.newLevel();
		smorball.timeTrial.newLevel();

		// Start playing the crowd cheering sound
		this.ambienceSound = smorball.audio.playAudioSprite("stadium_ambience_looping_sound", { startTime: 0, duration: 28000, loop: -1 });

		// Update the spawner
		smorball.spawning.startNewLevel(this.level);
		smorball.captchas.startNewLevel(this.level);

		// Finaly change the state so we start playing
		this.state = GameState.Playing;
	}

	getLevel(indx: number) {
		return this.levels[indx];
	}

	update(delta: number) {
		if (this.state != GameState.Playing) return;
		this.timeOnLevel += delta;
		_.each(this.enemies, e => { if (e != null) e.update(delta); } );
		_.each(this.athletes, e => { if (e != null) e.update(delta); });
	}

	gameOver(win: boolean) {

		// Set these
		this.state = GameState.GameOver;
		createjs.Ticker.setPaused(true);

		// If this is a timetrail level then we need to do something special
		if (this.level.timeTrial) {

			// If we beat the best time then update it here
			if (this.timeOnLevel > smorball.user.bestSurvivalTime)
				smorball.user.bestSurvivalTime = this.timeOnLevel;

			// Show the end screen
			smorball.screens.game.showTimeTrialEnd();

			// Save
			smorball.persistance.persist();
		}

		// If we win then show the win screen
		else if (win) {

			// Stop the ambience
			smorball.audio.fadeOutAndStop(this.ambienceSound, 2000);		

			// Play a different ambient sound
			this.ambienceSound = smorball.audio.playSound("crowd_cheering_ambient_sound");

			// If this is the first level then lets adjust the difficulty
			if (this.levelIndex == 0) smorball.difficulty.updateDifficulty(this.timeOnLevel);

			// Work out how much we earnt
			var earnt = smorball.user.levelWon(this.levelIndex);
			smorball.screens.game.showVictory(earnt);
		}

		// Else show the defeat screen
		else smorball.screens.game.showDefeat(0);
	}

	enemyReachedGoaline(enemy: Enemy) {
		this.enemyTouchdowns++;

		smorball.captchas.refreshCaptcha(enemy.lane);

		// If its a time trail then only one enemy is allowed to reach the goaline
		if (this.level.timeTrial) 
			this.gameOver(false);
		
		// Else we have a certain nubmer that is allowed
		else if (this.enemyTouchdowns >= smorball.config.enemyTouchdowns)
			this.gameOver(false);
	}

	getOpponentsRemaining() {
		return smorball.spawning.enemySpawnsThisLevel - smorball.game.enemiesKilled - this.enemyTouchdowns;
	}

	getScore() {
		return (smorball.config.enemyTouchdowns - this.enemyTouchdowns) * 1000;
	}

	enemyKilled(enemy: Enemy) {
		this.enemiesKilled++;
		smorball.powerups.onEnemyKilled(enemy);
	}

	timeout() {
		this.state = GameState.Timeout;
		createjs.Ticker.setPaused(true);
		smorball.screens.game.showTimeout();	
		smorball.screens.game.captchas.visible = false;
		smorball.stage.update();
	}

	resume() {
		this.state = GameState.Playing;
		createjs.Ticker.setPaused(false);
		smorball.screens.game.timeoutEl.hidden = true;
		smorball.screens.game.captchas.visible = true;		
	}

	help() {
		createjs.Ticker.setPaused(false);
		this.ambienceSound.paused = true;
		smorball.screens.instructions.backMenu = smorball.screens.game;
		smorball.screens.open(smorball.screens.instructions);
		smorball.screens.instructions.on("back",() => {
			createjs.Ticker.setPaused(true);
			this.ambienceSound.paused = false;
			smorball.stage.update();
		}, this, true);
	}

	returnToMap() {
		createjs.Ticker.setPaused(false);
		this.state = GameState.NotPlaying;
		smorball.screens.open(smorball.screens.map);

		// Stop the ambience
		if (this.ambienceSound)
			smorball.audio.fadeOutAndStop(this.ambienceSound, 2000);	
	}

}
