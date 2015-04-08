﻿
class TimeTrailManager {
	
	survivalData: SurvivalData;	

	timeUntilNextEnemySpawn: number;
	timeUntilNextPowerupSpawn: number;

	init() {	
		this.survivalData = smorball.resources.getResource("survival_data");
	}

	newLevel() {
		this.timeUntilNextEnemySpawn = 0;
		this.timeUntilNextPowerupSpawn = 0;
	}	

	update(delta: number) {	

		// If the game isnt playing then we shouldnt do anything
		if (smorball.game.state != GameState.Playing) return;

		// If this level isnt a time trail then dont do anything
		if (!smorball.game.level.timeTrial) return;

		this.timeUntilNextEnemySpawn -= delta;
		this.timeUntilNextPowerupSpawn -= delta;

		if (this.timeUntilNextEnemySpawn <= 0)
			this.spawnEnemy();
				
	}

	spawnEnemy() {
		var enemies = _.keys(this.survivalData.enemies);
		var potentials = _.filter(enemies, s => smorball.game.timeOnLevel > this.survivalData.enemies[s].startTime);
		var enemy = Utils.randomOne(potentials);
		var data = this.survivalData.enemies[enemy];
		smorball.spawning.spawnEnemy(enemy, false, Utils.randomOne(smorball.game.level.lanes));

		this.timeUntilNextEnemySpawn = data.spawnCost - smorball.game.timeOnLevel / 200;
		this.timeUntilNextEnemySpawn = Math.max(this.survivalData.minimumEnemySpawnTime, this.timeUntilNextEnemySpawn);
	}
	
	spawnPowerup() {
		var powerups = _.keys(this.survivalData.powerups);
		var potentials = _.filter(powerups, s => smorball.game.timeOnLevel > this.survivalData.powerups[s].startTime);
		var powerup = Utils.randomOne(potentials);
		var data = this.survivalData.powerups[powerup];
		smorball.spawning.spawnPowerup(powerup, 1, Utils.randomOne(smorball.game.level.lanes));

		this.timeUntilNextPowerupSpawn = data.spawnCost - smorball.game.timeOnLevel / 200;
		this.timeUntilNextPowerupSpawn = Math.max(this.survivalData.minimumPowerupSpawnTime, this.timeUntilNextPowerupSpawn);
	}

}