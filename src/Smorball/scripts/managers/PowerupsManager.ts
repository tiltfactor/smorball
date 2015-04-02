interface PowerupQuantities {
	cleats: number;
	bullhorn: number;
	helmet: number;
}

class PowerupsManager {

	types: PowerupTypes;
	quantities: PowerupQuantities;

	powerups: Powerup[];

	constructor() {
		this.quantities = { cleats: 0, bullhorn: 0, helmet: 0 };
	}

	init() {
		this.types = smorball.resources.getResource("powerups_data");
	}

	newLevel() {
		this.powerups = [];
	}

	spawnPowerup(type: string, lane: number) {

		var powerup = new Powerup(type, lane);

		var min = smorball.config.goalLine + 300;
		var max = smorball.config.width - 300;
		var x = min + Math.random() * (max - min);
		var y = smorball.config.friendlySpawnPositions[lane].y;
		powerup.x = x;
		powerup.y = y;

		this.powerups.push(powerup);
		smorball.screens.game.actors.addChild(powerup);
		
	} 

	update(delta: number) {
		if (smorball.game.state != GameState.Playing) return;
		_.each(this.powerups, p => p.update(delta));
	}
	
}