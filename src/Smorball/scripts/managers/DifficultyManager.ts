
class DifficultyManager {

	current: Difficulty;

	constructor() {
		this.current = smorball.config.difficulties[0];
	}

	setDifficulty(difficulty: Difficulty, persist: boolean = true) {
		console.log("Difficulty set to", difficulty.name);
		this.current = difficulty;
		if (persist)
			smorball.persistance.persist();
	}

	getDifficulty(name: string): Difficulty {
		return _.find(smorball.config.difficulties, d => d.name == name);
	}

	updateDifficulty(timeOnLevel: number) {

		this.current = _.chain(smorball.config.difficulties)
			.filter(d => timeOnLevel < d.requiredTime)
			.min(d => d.requiredTime).value();

		console.log("Level completed in " + timeOnLevel + "s, difficulty set to: ", this.current.name);
	}

	getCurrentDifficultyMultiplier() {
		if (smorball.game.levelIndex == 0) return 1;
		return this.current.multiplier;
	}
}