
enum Difficulty {
	Easy,
	Medium,
	Hard
}

class DifficultyManager {

	difficulty: Difficulty = Difficulty.Easy;

	setDifficulty(difficulty: Difficulty, persist: boolean = true) {
		console.log("Difficulty set to", Difficulty[difficulty]);
		this.difficulty = difficulty;
		if (persist)
			smorball.persistance.persist();
	}
}