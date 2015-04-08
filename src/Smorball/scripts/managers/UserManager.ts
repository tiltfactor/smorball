
interface LevelPersistanceData {
	isUnlocked: boolean;
	score: number;
}


class UserManager {

	cash: number;
	levels: LevelPersistanceData[];
	bestSurvivalTime: number;

	constructor() {
		this.levels = [{ isUnlocked: true, score: 0 }];
		this.cash = 0;
		this.bestSurvivalTime = 0;
	}

	newGame() {
		this.levels = [{ isUnlocked: true, score: 0 }];
		this.cash = 0;
	}

	hasSaveGame() {
		return this.levels != null;
	}

	hasUnlockedLevel(level: number) {
		if (this.levels == null || level >= this.levels.length)
			return false;
		else
			return this.levels[level].isUnlocked;
	}

	levelWon(level:number) : number {

		var l = this.levels[level];
		var score = smorball.game.getScore();
		var diff = score - l.score;
		l.score = Math.max(score - l.score);

		// If this is the first level then we earn nothing!
		if (level == 0) diff = 0;
		
		smorball.user.cash += diff;

		if (this.levels[level + 1] == undefined)
			this.levels.push({ isUnlocked: true, score: 0 });

		smorball.persistance.persist();

		return diff;
	}

	getHighestUnlockedLevel(): number {
		return this.levels.length-1;
	}

	isSurvivalUnlocked(): boolean {
		return this.getHighestUnlockedLevel() >= 16;
	}
}