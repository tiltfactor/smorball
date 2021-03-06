var UserManager = (function () {
    function UserManager() {
        this.reset();
    }
    UserManager.prototype.reset = function () {
        this.levels = [{ isUnlocked: true, score: 0 }];
        this.cash = 0;
        this.bestSurvivalTime = 0;
        this.lastLevelPlayed = -1;
        this.lastSurvivalTime = 0;
        this.hasShownShopSign = false;
    };
    UserManager.prototype.newGame = function () {
        this.reset();
        smorball.upgrades.newGame();
        smorball.persistance.persist();
        this.hasSaveGame = true;
    };
    UserManager.prototype.newLevel = function () {
        this.lastLevelPlayed = smorball.game.levelIndex;
        smorball.persistance.persist();
    };
    UserManager.prototype.hasUnlockedLevel = function (level) {
        if (this.levels == null || level >= this.levels.length)
            return false;
        else
            return this.levels[level].isUnlocked;
    };
    UserManager.prototype.levelWon = function (level) {
        var l = this.levels[level];
        var score = smorball.game.levelScore;
        var diff = Math.max(score - l.score, 0); // user cannot lose money
        l.score = Math.max(score, l.score);
        // If this is the first level then we earn nothing!
        // if (level == 0)
        //     diff = 0;
        smorball.user.cash += diff;
        if (this.levels[level + 1] == undefined)
            this.levels.push({ isUnlocked: true, score: 0 });
        smorball.persistance.persist();
        return diff;
    };
    UserManager.prototype.getHighestUnlockedLevel = function () {
        return this.levels.length - 1;
    };
    UserManager.prototype.isSurvivalUnlocked = function () {
        return this.getHighestUnlockedLevel() >= smorball.config.timeTrialUnlockLevel;
    };
    return UserManager;
})();
