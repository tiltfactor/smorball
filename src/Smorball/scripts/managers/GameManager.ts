
interface Level {
	index: number;
	name: string;
	lanes: number[];
	team: Team;
	waves: LevelWave[];
}

interface Team {
	name: string;
	id: string;
}

interface LevelWave {
	actions: WaveAction[];
}

interface WaveAction {
	type: string;
	enemy?: string;
	commentry?: string;
	time?: number;
}

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

	enemies: Enemy[];
	athletes: Athlete[];

	init() {
		this.levels = smorball.resources.getResource("levels_data");
		this.enemyTypes = smorball.resources.getResource("enemies_data");
		this.athleteTypes = smorball.resources.getResource("athletes_data");

		console.log("this.enemyTypes", this.enemyTypes);
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

		// Show the loading screen
		smorball.screens.open(smorball.screens.loadingLevel);
	}

	play() {

		// Open the correct screen
		smorball.screens.open(smorball.screens.game);
		smorball.screens.game.newGame();
		
		// Reset these
		this.enemies = [];
		this.athletes = [];

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
		_.each(this.enemies, e => e.update(delta));
		_.each(this.athletes, e => e.update(delta));
	}

	gameOver(win: boolean) {
		this.state = GameState.GameOver;
		createjs.Ticker.setPaused(true);
		if (win) {
			var earnt = smorball.user.levelWon(this.levelIndex);
			smorball.screens.game.showVictory(earnt);
		}
		else smorball.screens.game.showDefeat(0);
	}

	enemyReachedGoaline(enemy: Enemy) {
		this.enemyTouchdowns++;

		smorball.captchas.refreshCaptcha(enemy.lane);

		if (this.enemyTouchdowns >= smorball.config.enemyTouchdowns)
			this.gameOver(false);
	}

	getScore() {
		return (smorball.config.enemyTouchdowns - this.enemyTouchdowns) * 1000;
	}

	enemyKilled(enemy: Enemy) {
		this.enemiesKilled++;
	}

	timeout() {
		this.state = GameState.Timeout;
		createjs.Ticker.setPaused(true);
		smorball.screens.game.timeoutEl.hidden = false;
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
		smorball.screens.instructions.backMenu = smorball.screens.game;
		smorball.screens.open(smorball.screens.instructions);
		smorball.screens.instructions.on("back",() => {
			createjs.Ticker.setPaused(true);
			smorball.stage.update();
		}, this, true);
	}

	returnToMap() {
		createjs.Ticker.setPaused(false);
		this.state = GameState.NotPlaying;
		smorball.screens.open(smorball.screens.map);
	}

}
