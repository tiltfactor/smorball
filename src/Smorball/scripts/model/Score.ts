/// <reference path="../../typings/smorball/smorball.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />

class Score extends createjs.Container {

	getTotalScore() {
		var gameLevelPoints = this.config.gameState.gs.gameLevelPoints;
		var currentLevelScore = this.config.gameState.gs.gameLevelPoints[smorball.levelController.level - 1];
		if (!currentLevelScore) {
			currentLevelScore = 0;
		}
		var total = this.arraySum(gameLevelPoints) - currentLevelScore;
		var dollars = this.getMyMoney();
		return total;
	}

	getLevelScore() {
		var total = this.getTotalScore();
		var currentLevelScore = this.config.gameState.gs.gameLevelPoints[this.config.gameState.currentLevel - 1];
		var levelTotal = total - currentLevelScore;
		return levelTotal;
	}

	addGameLevelPoints(points) {
		var earnedPoint = this.config.gameState.gs.gameLevelPoints[this.config.gameState.currentLevel - 1];
		if (earnedPoint < points || earnedPoint == undefined) {
			this.config.gameState.gs.gameLevelPoints[this.config.gameState.currentLevel - 1] = points;
		}

	}

	getMyMoney() {
		var dollars = 0;
		var bonus = 0;
		var gameLevelPoints = this.config.gameState.gs.gameLevelPoints;
		var currentLevel = this.config.gameState.currentLevel - 1;
		var maxLevel = this.config.gameState.gs.maxLevel;

		for (var i = 0; i < maxLevel; i++) {
			var point = gameLevelPoints[i];
			if (point != undefined) {
				if (point == this.config.gameState.maxLife) {
					bonus++;
				}
				dollars += point;
			}
			if (i == currentLevel) continue;
		}
		dollars = dollars * 1000 + bonus * 2000 - this.config.gameState.gs.dollorSpend;
		return dollars;
	}

	getMoneyForLevel(life) {
		var points = life;//this.config.gameState.gs.gameLevelPoints[level];
		if (points == 6) {
			points = 8;
		}
		return points * 1000
	}

	private arraySum(gameLevelPoints) {
		var total = 0;
		for (var i = 0; i < gameLevelPoints.length; i++) {
			total += gameLevelPoints[i];
			}
		return total;
	}
}

