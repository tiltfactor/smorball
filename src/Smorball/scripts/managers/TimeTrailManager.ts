
class TimeTrailManager {
	
	survivalData: SurvivalData;	

	powerupCurrency: number;
	enemyCurrency: number;
	nextPowerup: string;
	nextEnemy: string;

	init() {	
		this.survivalData = smorball.resources.getResource("survival_data");
	}

	newLevel() {
		this.powerupCurrency = 0;
		this.enemyCurrency = 0;
		this.nextPowerup = this.calculateNextPowerup();
		this.nextEnemy = this.calculateNextEnemy();
	}	

	update(delta: number) {	

		// If the game isnt playing then we shouldnt do anything
		if (smorball.game.state != GameState.Playing) return;

		// If this level isnt a time trail then dont do anything
		if (!smorball.game.level.timeTrial) return;
		
		// Increment the currency, this is used to spawn powerups depending on their cost
		if (this.nextPowerup!=null)
			this.powerupCurrency += delta + (smorball.game.timeOnLevel / 60) * delta;

		// If we should spawn then do so then calculate what the next one to spawn is
		if (this.shouldSpawnPowerup()) {
			this.spawnPowerup();
			this.nextPowerup = this.calculateNextPowerup();
		}
			
		// Increment the currency, this is used to spawn enemies depending on their cost
		this.enemyCurrency += delta + (smorball.game.timeOnLevel / 60) * delta;

		// If we should spawn the enemy then do so now and work out the next enemy to spawn
		if (this.shouldSpawnEnemy()) {
			this.spawnEnemy();
			this.nextEnemy = this.calculateNextEnemy();
		}	
	}

	private shouldSpawnPowerup() {

		// If the next powerup is null then we cant spawn but we should check to see what the next one should be
		if (this.nextPowerup == null) {
			this.nextPowerup = this.calculateNextPowerup();
			return false;
		}

		// If we have enough currency to spawn the powerup then do so
		if (this.powerupCurrency >= this.survivalData.powerups[this.nextPowerup].spawnCost)
			return true;
	}

	private shouldSpawnEnemy() {
		// If we have enough currency to spawn the enemy then do so now		 
		if (this.enemyCurrency >= this.survivalData.enemies[this.nextEnemy].spawnCost)
			return true;

		// OR if there are no enemies on the screen then we should spawn (will cause currency to go negative)
		if (smorball.game.enemies.length == 0)
			return true;

		// Else dont spawn the enemy
		return false;
	}

	calculateNextPowerup() {

		// Get all the powerup names
		var powerups = _.keys(this.survivalData.powerups);

		// Filter by ones that can already be spawned (based on time on level)
		var potentials = _.filter(powerups, s => smorball.game.timeOnLevel >= this.survivalData.powerups[s].startTime);

		// Randomly pick one (no weighting)
		return Utils.randomOne(potentials);
	}

	calculateNextEnemy() {

		// Get all the enemy names
		var enemies = _.keys(this.survivalData.enemies);

		// Work out which ones can be spawned at this point in the level (based on time)
		var potentials = _.filter(enemies, s => smorball.game.timeOnLevel >= this.survivalData.enemies[s].startTime);

		// Work out their weights (for below)
		var weights = _.map(potentials, s => 1/this.survivalData.enemies[s].spawnCost);

		// Randomly pick one (with weightings based on the inverse of their cost, more expensive spawn less often)		
		return Utils.weightedRandomOne(potentials, weights);
	}

	spawnEnemy() {		
		this.enemyCurrency -= this.survivalData.enemies[this.nextEnemy].spawnCost;
		smorball.spawning.spawnEnemy(this.nextEnemy, false, Utils.randomOne(smorball.game.level.lanes));
		console.log("Enemy spawned, currency: ", this.enemyCurrency);
	}
	
	spawnPowerup() {
		this.powerupCurrency -= this.survivalData.powerups[this.nextPowerup].spawnCost;
		smorball.spawning.spawnPowerup(this.nextPowerup, 1, Utils.randomOne(smorball.game.level.lanes));
		console.log("Powerup spawned, currency: ", this.powerupCurrency);
	}

}